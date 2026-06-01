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
  const description = (formData.get('description') as string)?.trim() || null

  // Validation
  if (!name) {
    return { error: 'Tên tài sản không được để trống.', success: false, message: null }
  }
  if (!categoryId) {
    return { error: 'Vui lòng chọn danh mục tài sản.', success: false, message: null }
  }
  const quantity = parseFloat(quantityRaw)
  if (isNaN(quantity) || quantity < 0) {
    return { error: 'Số lượng phải là số không âm.', success: false, message: null }
  }
  const unitPrice = parseFloat(unitPriceRaw)
  if (isNaN(unitPrice) || unitPrice < 0) {
    return { error: 'Đơn giá phải là số không âm.', success: false, message: null }
  }

  const { data, error } = await supabase
    .from('asset_accounts')
    .insert({
      user_id: user.id,
      category_id: categoryId,
      name,
      quantity,
      unit_price: unitPrice,
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

  const updates: Record<string, unknown> = {}

  const name = (formData.get('name') as string)?.trim()
  if (name) updates.name = name

  const categoryId = (formData.get('category_id') as string)?.trim()
  if (categoryId) updates.category_id = categoryId

  const quantityRaw = formData.get('quantity') as string
  if (quantityRaw !== null && quantityRaw !== '') {
    const quantity = parseFloat(quantityRaw)
    if (isNaN(quantity) || quantity < 0) {
      return { error: 'Số lượng phải là số không âm.', success: false, message: null }
    }
    updates.quantity = quantity
  }

  const unitPriceRaw = formData.get('unit_price') as string
  if (unitPriceRaw !== null && unitPriceRaw !== '') {
    const unitPrice = parseFloat(unitPriceRaw)
    if (isNaN(unitPrice) || unitPrice < 0) {
      return { error: 'Đơn giá phải là số không âm.', success: false, message: null }
    }
    updates.unit_price = unitPrice
  }

  const description = formData.get('description') as string
  if (description !== null) updates.description = description.trim() || null

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

