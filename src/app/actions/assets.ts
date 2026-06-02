'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ActionResult, PREDEFINED_COLORS, PREDEFINED_ICONS } from '@/lib/types/assets'

// ─────────────────────────────────────────────────────────────────────────────
// Category Actions
// ─────────────────────────────────────────────────────────────────────────────

export async function createAssetCategory(
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

  const name = (formData.get('name') as string)?.trim()
  const color = (formData.get('color') as string)?.trim()
  const icon = (formData.get('icon') as string)?.trim()

  // Validation
  if (!name) {
    return { error: 'Tên danh mục không được để trống.', success: false, message: null }
  }
  if (!color || !PREDEFINED_COLORS.some((c) => c.hex === color)) {
    return { error: 'Màu sắc không hợp lệ.', success: false, message: null }
  }
  if (!icon || !PREDEFINED_ICONS.includes(icon)) {
    return { error: 'Biểu tượng không hợp lệ.', success: false, message: null }
  }

  const { data, error } = await supabase
    .from('asset_categories')
    .insert({
      user_id: user.id,
      name,
      color,
      icon,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      return { error: 'Danh mục này đã tồn tại.', success: false, message: null }
    }
    return { error: error.message, success: false, message: null }
  }

  revalidatePath('/dashboard/assets')
  revalidatePath('/dashboard/categories')
  revalidatePath('/dashboard')
  return {
    error: null,
    success: true,
    message: 'Danh mục đã được tạo thành công!',
    data: { id: data.id },
  }
}

export async function updateAssetCategory(
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
    return { error: 'ID danh mục không hợp lệ.', success: false, message: null }
  }

  const name = (formData.get('name') as string)?.trim()
  const color = (formData.get('color') as string)?.trim()
  const icon = (formData.get('icon') as string)?.trim()

  const updates: Record<string, unknown> = {}

  if (name) updates.name = name
  if (color) {
    if (!PREDEFINED_COLORS.some((c) => c.hex === color)) {
      return { error: 'Màu sắc không hợp lệ.', success: false, message: null }
    }
    updates.color = color
  }
  if (icon) {
    if (!PREDEFINED_ICONS.includes(icon)) {
      return { error: 'Biểu tượng không hợp lệ.', success: false, message: null }
    }
    updates.icon = icon
  }

  if (Object.keys(updates).length === 0) {
    return { error: 'Không có dữ liệu nào để cập nhật.', success: false, message: null }
  }

  const { error } = await supabase
    .from('asset_categories')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message, success: false, message: null }
  }

  revalidatePath('/dashboard/assets')
  revalidatePath('/dashboard/categories')
  revalidatePath('/dashboard')
  return { error: null, success: true, message: 'Danh mục đã được cập nhật!' }
}

export async function deleteAssetCategory(
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
    return { error: 'ID danh mục không hợp lệ.', success: false, message: null }
  }

  const { error } = await supabase
    .from('asset_categories')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message, success: false, message: null }
  }

  revalidatePath('/dashboard/assets')
  revalidatePath('/dashboard/categories')
  revalidatePath('/dashboard')
  return { error: null, success: true, message: 'Danh mục đã được xóa thành công!' }
}

// ─────────────────────────────────────────────────────────────────────────────
// Account Actions
// ─────────────────────────────────────────────────────────────────────────────

export async function createAssetAccount(
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

  const name = (formData.get('name') as string)?.trim()
  const categoryId = (formData.get('category_id') as string)?.trim()
  const quantityRaw = formData.get('quantity') as string
  const unitPriceRaw = formData.get('unit_price') as string
  const currency = (formData.get('currency') as string)?.trim() || 'VND'
  const purchaseDate = (formData.get('purchase_date') as string)?.trim() || new Date().toISOString().split('T')[0]
  const description = (formData.get('description') as string)?.trim() || null

  if (!categoryId) {
    return { error: 'Vui lòng chọn danh mục tài sản.', success: false, message: null }
  }

  // Fetch category to get name for defaulting and check type
  const { data: categoryData, error: categoryError } = await supabase
    .from('asset_categories')
    .select('name')
    .eq('id', categoryId)
    .single()

  if (categoryError || !categoryData) {
    return { error: 'Danh mục tài sản không tồn tại.', success: false, message: null }
  }

  const finalName = name || categoryData.name
  const isCashCategory = /tiền mặt|ngân hàng|cash|bank|ví/i.test(categoryData.name)

  let quantity = parseFloat(quantityRaw)
  if (isNaN(quantity) || quantity < 0) {
    return { error: isCashCategory ? 'Số dư phải là số không âm.' : 'Số lượng phải là số không âm.', success: false, message: null }
  }

  let unitPrice = 1
  if (!isCashCategory) {
    unitPrice = parseFloat(unitPriceRaw)
    if (isNaN(unitPrice) || unitPrice < 0) {
      return { error: 'Đơn giá phải là số không âm.', success: false, message: null }
    }
  }

  if (currency !== 'VND' && currency !== 'USD') {
    return { error: 'Tiền tệ không hợp lệ.', success: false, message: null }
  }

  if (!purchaseDate || isNaN(Date.parse(purchaseDate))) {
    return { error: 'Ngày mua không hợp lệ.', success: false, message: null }
  }

  const { data, error } = await supabase
    .from('asset_accounts')
    .insert({
      user_id: user.id,
      category_id: categoryId,
      name: finalName,
      quantity,
      unit_price: unitPrice,
      currency,
      purchase_date: purchaseDate,
      description,
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message, success: false, message: null }
  }

  revalidatePath('/dashboard/assets')
  revalidatePath('/dashboard')
  return {
    error: null,
    success: true,
    message: 'Tài sản đã được thêm thành công!',
    data: { id: data.id },
  }
}

export async function updateAssetAccount(
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
    return { error: 'ID tài sản không hợp lệ.', success: false, message: null }
  }

  // Fetch the existing account to get category details
  const { data: existingAccount, error: fetchError } = await supabase
    .from('asset_accounts')
    .select('category_id, name')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !existingAccount) {
    return { error: 'Tài sản không tồn tại.', success: false, message: null }
  }

  const categoryId = (formData.get('category_id') as string)?.trim()
  const activeCategoryId = categoryId || existingAccount.category_id

  // Fetch category details
  const { data: categoryData, error: categoryError } = await supabase
    .from('asset_categories')
    .select('name')
    .eq('id', activeCategoryId)
    .single()

  if (categoryError || !categoryData) {
    return { error: 'Danh mục tài sản không tồn tại.', success: false, message: null }
  }

  const isCashCategory = /tiền mặt|ngân hàng|cash|bank|ví/i.test(categoryData.name)
  const name = (formData.get('name') as string)?.trim()
  const finalName = name !== undefined ? (name || categoryData.name) : undefined

  const updates: Record<string, unknown> = {}
  if (finalName !== undefined) updates.name = finalName
  if (categoryId) updates.category_id = categoryId

  const quantityRaw = formData.get('quantity') as string
  const unitPriceRaw = formData.get('unit_price') as string
  const currency = (formData.get('currency') as string)?.trim()
  const purchaseDate = (formData.get('purchase_date') as string)?.trim()
  const description = formData.get('description') as string

  if (isCashCategory) {
    updates.unit_price = 1
    if (quantityRaw !== null && quantityRaw !== '') {
      const quantity = parseFloat(quantityRaw)
      if (isNaN(quantity) || quantity < 0) {
        return { error: 'Số dư phải là số không âm.', success: false, message: null }
      }
      updates.quantity = quantity
    }
  } else {
    if (quantityRaw !== null && quantityRaw !== '') {
      const quantity = parseFloat(quantityRaw)
      if (isNaN(quantity) || quantity < 0) {
        return { error: 'Số lượng phải là số không âm.', success: false, message: null }
      }
      updates.quantity = quantity
    }
    if (unitPriceRaw !== null && unitPriceRaw !== '') {
      const unitPrice = parseFloat(unitPriceRaw)
      if (isNaN(unitPrice) || unitPrice < 0) {
        return { error: 'Đơn giá phải là số không âm.', success: false, message: null }
      }
      updates.unit_price = unitPrice
    }
  }

  if (currency) {
    if (currency !== 'VND' && currency !== 'USD') {
      return { error: 'Tiền tệ không hợp lệ.', success: false, message: null }
    }
    updates.currency = currency
  }

  if (purchaseDate) {
    if (isNaN(Date.parse(purchaseDate))) {
      return { error: 'Ngày mua không hợp lệ.', success: false, message: null }
    }
    updates.purchase_date = purchaseDate
  }

  if (description !== null && description !== undefined) {
    updates.description = description.trim() || null
  }

  if (Object.keys(updates).length === 0) {
    return { error: 'Không có dữ liệu nào để cập nhật.', success: false, message: null }
  }

  const { error } = await supabase
    .from('asset_accounts')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message, success: false, message: null }
  }

  revalidatePath('/dashboard/assets')
  revalidatePath('/dashboard')
  return { error: null, success: true, message: 'Tài sản đã được cập nhật thành công!' }
}

export async function deleteAssetAccount(
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
    return { error: 'ID tài sản không hợp lệ.', success: false, message: null }
  }

  const { error } = await supabase
    .from('asset_accounts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message, success: false, message: null }
  }

  revalidatePath('/dashboard/assets')
  revalidatePath('/dashboard')
  return { error: null, success: true, message: 'Tài sản đã được xóa thành công!' }
}

