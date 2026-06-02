'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ActionResult } from '@/lib/types/assets'

// Helper to update asset account balance
async function adjustAccountBalance(
  supabase: any,
  accountId: string,
  userId: string,
  amount: number, // positive to add, negative to subtract
  currency: string = 'VND'
) {
  // Fetch account first
  const { data: account, error: fetchError } = await supabase
    .from('asset_accounts')
    .select('quantity, currency')
    .eq('id', accountId)
    .eq('user_id', userId)
    .single()

  if (fetchError || !account) {
    throw new Error(`Tài khoản nguồn không tồn tại hoặc không hợp lệ: ${accountId}`)
  }

  // Calculate new quantity (balance)
  let balanceChange = amount
  if (currency === 'USD' && account.currency === 'VND') {
    balanceChange = amount * 25000
  } else if (currency === 'VND' && account.currency === 'USD') {
    balanceChange = amount / 25000
  }

  const newQty = Number(account.quantity) + balanceChange

  const { error: updateError } = await supabase
    .from('asset_accounts')
    .update({ quantity: newQty })
    .eq('id', accountId)
    .eq('user_id', userId)

  if (updateError) {
    throw new Error(`Lỗi cập nhật số dư tài khoản: ${updateError.message}`)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Create Transaction
// ─────────────────────────────────────────────────────────────────────────────
export async function createTransaction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Bạn cần đăng nhập để thực hiện thao tác này.', success: false, message: null }
  }

  const accountId = (formData.get('account_id') as string)?.trim()
  const categoryId = (formData.get('category_id') as string)?.trim() || null
  const type = (formData.get('type') as string)?.trim() // 'income' | 'expense'
  const amountRaw = formData.get('amount') as string
  const dateStr = (formData.get('transaction_date') as string)?.trim() || new Date().toISOString().split('T')[0]
  const description = (formData.get('description') as string)?.trim() || null

  // Validations
  if (!accountId) {
    return { error: 'Vui lòng chọn ví/nguồn tiền thanh toán.', success: false, message: null }
  }
  if (type !== 'income' && type !== 'expense') {
    return { error: 'Loại giao dịch không hợp lệ.', success: false, message: null }
  }
  const amount = parseFloat(amountRaw)
  if (isNaN(amount) || amount <= 0) {
    return { error: 'Số tiền giao dịch phải là số lớn hơn 0.', success: false, message: null }
  }
  if (!dateStr || isNaN(Date.parse(dateStr))) {
    return { error: 'Ngày giao dịch không hợp lệ.', success: false, message: null }
  }

  try {
    // 1. Fetch wallet currency
    const { data: wallet, error: walletErr } = await supabase
      .from('asset_accounts')
      .select('currency')
      .eq('id', accountId)
      .single()
    if (walletErr || !wallet) {
      return { error: 'Ví/Nguồn tiền thanh toán không tồn tại.', success: false, message: null }
    }

    // 2. Insert transaction
    const { data: tx, error: txErr } = await supabase
      .from('asset_transactions')
      .insert({
        user_id: user.id,
        account_id: accountId,
        source_account_id: null,
        type,
        category_id: categoryId,
        amount,
        quantity: 1,
        price_per_unit: amount,
        currency: wallet.currency,
        transaction_date: dateStr,
        description,
      })
      .select('id')
      .single()

    if (txErr) {
      return { error: `Không thể tạo giao dịch: ${txErr.message}`, success: false, message: null }
    }

    // 3. Adjust wallet balance
    // Expense: deduct (-amount), Income: add (+amount)
    const adjustment = type === 'expense' ? -amount : amount
    await adjustAccountBalance(supabase, accountId, user.id, adjustment, wallet.currency)

    revalidatePath('/dashboard/spending')
    revalidatePath('/dashboard/transactions')
    revalidatePath('/dashboard/assets')
    revalidatePath('/dashboard')

    return {
      error: null,
      success: true,
      message: 'Giao dịch đã được lưu thành công!',
      data: { id: tx.id },
    }
  } catch (err: any) {
    return { error: err.message || 'Lỗi không xác định khi lưu giao dịch.', success: false, message: null }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete Transaction
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteTransaction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Bạn cần đăng nhập để thực hiện thao tác này.', success: false, message: null }
  }

  const id = (formData.get('id') as string)?.trim()
  if (!id) {
    return { error: 'ID giao dịch không hợp lệ.', success: false, message: null }
  }

  try {
    // 1. Fetch transaction details to revert balance
    const { data: tx, error: txErr } = await supabase
      .from('asset_transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (txErr || !tx) {
      return { error: 'Giao dịch không tồn tại hoặc bạn không có quyền xóa.', success: false, message: null }
    }

    // 2. Delete transaction from DB
    const { error: delErr } = await supabase
      .from('asset_transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (delErr) {
      return { error: `Lỗi xóa giao dịch: ${delErr.message}`, success: false, message: null }
    }

    // 3. Revert balance updates based on transaction type
    if (tx.type === 'expense') {
      // Revert expense: add back the cost
      await adjustAccountBalance(supabase, tx.account_id, user.id, Number(tx.amount), tx.currency)
    } else if (tx.type === 'income') {
      // Revert income: subtract the money
      await adjustAccountBalance(supabase, tx.account_id, user.id, -Number(tx.amount), tx.currency)
    } else if (tx.type === 'buy') {
      // Revert buy: delete/reduce asset quantity, add back to funding wallet (source)
      // Deduct from target asset account
      const { data: asset, error: assetErr } = await supabase
        .from('asset_accounts')
        .select('quantity, name')
        .eq('id', tx.account_id)
        .single()
      
      if (!assetErr && asset) {
        const newAssetQty = Number(asset.quantity) - Number(tx.quantity)
        await supabase
          .from('asset_accounts')
          .update({ quantity: newAssetQty >= 0 ? newAssetQty : 0 })
          .eq('id', tx.account_id)
      }

      // Revert deduction from source wallet
      if (tx.source_account_id) {
        await adjustAccountBalance(supabase, tx.source_account_id, user.id, Number(tx.amount), tx.currency)
      }
    } else if (tx.type === 'sell') {
      // Revert sell: add back asset quantity, subtract from destination wallet
      // Add back to target asset account
      const { data: asset, error: assetErr } = await supabase
        .from('asset_accounts')
        .select('quantity')
        .eq('id', tx.account_id)
        .single()

      if (!assetErr && asset) {
        const newAssetQty = Number(asset.quantity) + Number(tx.quantity)
        await supabase
          .from('asset_accounts')
          .update({ quantity: newAssetQty })
          .eq('id', tx.account_id)
      }

      // Deduct from destination wallet
      if (tx.source_account_id) {
        await adjustAccountBalance(supabase, tx.source_account_id, user.id, -Number(tx.amount), tx.currency)
      }
    }

    revalidatePath('/dashboard/spending')
    revalidatePath('/dashboard/transactions')
    revalidatePath('/dashboard/assets')
    revalidatePath('/dashboard')

    return { error: null, success: true, message: 'Giao dịch đã được xóa thành công!' }
  } catch (err: any) {
    return { error: err.message || 'Lỗi xảy ra khi xóa giao dịch.', success: false, message: null }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Update Transaction
// ─────────────────────────────────────────────────────────────────────────────
export async function updateTransaction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Bạn cần đăng nhập để thực hiện thao tác này.', success: false, message: null }
  }

  const id = (formData.get('id') as string)?.trim()
  if (!id) {
    return { error: 'ID giao dịch không hợp lệ.', success: false, message: null }
  }

  const accountId = (formData.get('account_id') as string)?.trim()
  const categoryId = (formData.get('category_id') as string)?.trim() || null
  const type = (formData.get('type') as string)?.trim() // 'income' | 'expense'
  const amountRaw = formData.get('amount') as string
  const dateStr = (formData.get('transaction_date') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || null

  // Validations
  if (type !== 'income' && type !== 'expense') {
    return { error: 'Loại giao dịch không hợp lệ.', success: false, message: null }
  }
  const amount = parseFloat(amountRaw)
  if (isNaN(amount) || amount <= 0) {
    return { error: 'Số tiền giao dịch phải là số lớn hơn 0.', success: false, message: null }
  }
  if (!dateStr || isNaN(Date.parse(dateStr))) {
    return { error: 'Ngày giao dịch không hợp lệ.', success: false, message: null }
  }

  try {
    // 1. Fetch old transaction details
    const { data: oldTx, error: oldTxErr } = await supabase
      .from('asset_transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (oldTxErr || !oldTx) {
      return { error: 'Giao dịch không tồn tại.', success: false, message: null }
    }

    // 2. Fetch new wallet currency
    const { data: wallet, error: walletErr } = await supabase
      .from('asset_accounts')
      .select('currency')
      .eq('id', accountId)
      .single()

    if (walletErr || !wallet) {
      return { error: 'Ví/Nguồn tiền thanh toán không hợp lệ.', success: false, message: null }
    }

    // 3. Revert old balance adjustment
    const oldAdjustment = oldTx.type === 'expense' ? Number(oldTx.amount) : -Number(oldTx.amount)
    await adjustAccountBalance(supabase, oldTx.account_id, user.id, oldAdjustment, oldTx.currency)

    // 4. Apply new balance adjustment
    const newAdjustment = type === 'expense' ? -amount : amount
    await adjustAccountBalance(supabase, accountId, user.id, newAdjustment, wallet.currency)

    // 5. Update transaction details
    const { error: updateErr } = await supabase
      .from('asset_transactions')
      .update({
        account_id: accountId,
        category_id: categoryId,
        type,
        amount,
        price_per_unit: amount,
        currency: wallet.currency,
        transaction_date: dateStr,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (updateErr) {
      // Attempt to re-apply old balance on error
      await adjustAccountBalance(supabase, accountId, user.id, -newAdjustment, wallet.currency)
      await adjustAccountBalance(supabase, oldTx.account_id, user.id, -oldAdjustment, oldTx.currency)
      return { error: `Lỗi cập nhật giao dịch: ${updateErr.message}`, success: false, message: null }
    }

    revalidatePath('/dashboard/spending')
    revalidatePath('/dashboard/transactions')
    revalidatePath('/dashboard/assets')
    revalidatePath('/dashboard')

    return { error: null, success: true, message: 'Giao dịch đã được cập nhật thành công!' }
  } catch (err: any) {
    return { error: err.message || 'Lỗi xảy ra khi cập nhật giao dịch.', success: false, message: null }
  }
}
