'use client'

import React, { useState, useActionState, useEffect, useRef } from 'react'
import { Pencil, Trash, Check, FolderKanban } from 'lucide-react'
import * as Icons from 'lucide-react'
import { AssetCategory, ActionResult, PREDEFINED_COLORS, PREDEFINED_ICONS } from '@/lib/types/assets'
import { createAssetCategory, updateAssetCategory, deleteAssetCategory } from '@/app/actions/assets'
import RippleButton from '@/components/ui/RippleButton'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

const INITIAL_STATE: ActionResult = { error: null, success: false, message: null }

interface CategoryClientProps {
  categories: AssetCategory[]
}

export default function CategoryClient({ categories }: CategoryClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null)
  
  // Form states
  const [categoryName, setCategoryName] = useState('')
  const [categoryColor, setCategoryColor] = useState(PREDEFINED_COLORS[0].hex)
  const [categoryIcon, setCategoryIcon] = useState(PREDEFINED_ICONS[0])

  // Delete modal state
  const [categoryToDelete, setCategoryToDelete] = useState<AssetCategory | null>(null)

  const formRef = useRef<HTMLFormElement>(null)

  // Action states
  const [createState, createAction, createPending] = useActionState(createAssetCategory, INITIAL_STATE)
  const [updateState, updateAction, updatePending] = useActionState(updateAssetCategory, INITIAL_STATE)
  const [deleteState, deleteAction, deletePending] = useActionState(deleteAssetCategory, INITIAL_STATE)

  // Reset category form on success
  useEffect(() => {
    if (createState.success || updateState.success) {
      resetForm()
    }
  }, [createState.success, updateState.success])

  useEffect(() => {
    if (deleteState.success) {
      setCategoryToDelete(null)
    }
  }, [deleteState.success])

  function resetForm() {
    setIsEditing(false)
    setSelectedCategory(null)
    setCategoryName('')
    setCategoryColor(PREDEFINED_COLORS[0].hex)
    setCategoryIcon(PREDEFINED_ICONS[0])
    formRef.current?.reset()
  }

  function startEdit(cat: AssetCategory) {
    setSelectedCategory(cat)
    setIsEditing(true)
    setCategoryName(cat.name)
    setCategoryColor(cat.color)
    setCategoryIcon(cat.icon)
  }

  const isPending = createPending || updatePending
  const currentError = isEditing ? updateState.error : createState.error

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return
    const formData = new FormData()
    formData.append('id', categoryToDelete.id)
    await deleteAction(formData)
  }

  return (
    <div className="categories-page animate-fade-in-up">
      {/* Page Header */}
      <div className="assets-page__header mb-8">
        <div className="assets-page__title-wrap">
          <FolderKanban className="assets-page__title-icon" size={28} />
          <h1 className="assets-page__title">Danh mục của tôi</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-5">
          <form
            ref={formRef}
            action={isEditing ? updateAction : createAction}
            className="flex flex-col gap-5 border border-glass-border bg-glass-bg backdrop-blur-md p-6 rounded-2xl shadow-card-shadow"
          >
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {isEditing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </h3>

            {isEditing && selectedCategory && (
              <input type="hidden" name="id" value={selectedCategory.id} />
            )}

            {/* Name */}
            <div className="form-field">
              <label className="form-label text-xs uppercase tracking-wider text-slate-500 font-bold" htmlFor="category-name">
                Tên danh mục <span className="required text-rose-500">*</span>
              </label>
              <input
                id="category-name"
                name="name"
                type="text"
                className="form-input text-sm p-3 border border-glass-border bg-background/50 rounded-xl"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="VD: Vàng miếng, Crypto, Chứng khoán..."
                required
                maxLength={100}
                disabled={isPending}
              />
            </div>

            {/* Colors */}
            <div className="form-field">
              <label className="form-label text-xs uppercase tracking-wider text-slate-500 font-bold">
                Màu sắc chủ đạo <span className="required text-rose-500">*</span>
              </label>
              <input type="hidden" name="color" value={categoryColor} />
              <div className="flex flex-wrap gap-2.5 mt-1">
                {PREDEFINED_COLORS.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-850 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shrink-0"
                    style={{ backgroundColor: col.hex }}
                    onClick={() => setCategoryColor(col.hex)}
                    title={col.name}
                    disabled={isPending}
                  >
                    {categoryColor === col.hex && <Check size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Icons */}
            <div className="form-field">
              <label className="form-label text-xs uppercase tracking-wider text-slate-500 font-bold">
                Biểu tượng <span className="required text-rose-500">*</span>
              </label>
              <input type="hidden" name="icon" value={categoryIcon} />
              <div className="grid grid-cols-6 gap-2 border border-glass-border p-3 rounded-xl bg-background/50 max-h-[140px] overflow-y-auto scrollbar-custom mt-1">
                {PREDEFINED_ICONS.map((iconName) => {
                  const IconComp = (Icons as unknown as Record<string, React.ComponentType<React.ComponentProps<typeof Icons.Wallet>>>)[iconName] || Icons.HelpCircle
                  const isSelected = categoryIcon === iconName
                  return (
                    <button
                      key={iconName}
                      type="button"
                      className={`p-2.5 rounded-lg flex items-center justify-center cursor-pointer border transition-all ${
                        isSelected
                          ? 'border-violet-500 bg-violet-500/10 text-violet-500'
                          : 'border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setCategoryIcon(iconName)}
                      title={iconName}
                      disabled={isPending}
                    >
                      <IconComp size={18} />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Error Message */}
            {currentError && <p className="form-error text-xs text-rose-500 font-semibold">{currentError}</p>}

            {/* Actions */}
            <div className="flex justify-end gap-2.5 pt-3">
              {isEditing && (
                <RippleButton
                  type="button"
                  className="btn btn--ghost min-h-[2.5rem] px-4 py-2 text-sm font-semibold rounded-xl border border-glass-border text-slate-600 dark:text-slate-300 dark:hover:bg-slate-850 hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={resetForm}
                  disabled={isPending}
                >
                  Hủy
                </RippleButton>
              )}
              <RippleButton
                type="submit"
                className="btn btn--primary min-h-[2.5rem] px-5 py-2.5 text-sm font-bold text-white bg-linear-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-600/15 hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                disabled={isPending}
              >
                {isPending ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Tạo danh mục'}
              </RippleButton>
            </div>
          </form>
        </div>

        {/* Right Column: Table List */}
        <div className="lg:col-span-7">
          <div className="border border-glass-border bg-glass-bg backdrop-blur-md rounded-2xl shadow-card-shadow overflow-hidden">
            <div className="p-5 border-b border-glass-border">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                Danh sách danh mục ({categories.length})
              </h3>
            </div>

            {categories.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-400 italic">Chưa có danh mục nào được tạo.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-glass-border dark:bg-slate-900/10 bg-slate-50/20 text-xs uppercase tracking-wider text-slate-400 font-bold">
                      <th className="p-4 pl-6">Danh mục</th>
                      <th className="p-4">Màu sắc</th>
                      <th className="p-4 pr-6 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => {
                      const IconComponent = (Icons as unknown as Record<string, React.ComponentType<React.ComponentProps<typeof Icons.Wallet>>>)[cat.icon] || Icons.Wallet
                      return (
                        <tr
                          key={cat.id}
                          className="border-b border-glass-border/60 hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors"
                        >
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${cat.color}15` }}
                              >
                                <IconComponent size={16} style={{ color: cat.color }} />
                              </div>
                              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {cat.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-glass-border shrink-0"
                                style={{ backgroundColor: cat.color }}
                              />
                              <code className="text-xs text-slate-400">{cat.color.toUpperCase()}</code>
                            </div>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => startEdit(cat)}
                                className="p-2 text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 hover:bg-glass-bg border border-transparent hover:border-glass-border rounded-lg transition-colors cursor-pointer"
                                title="Sửa"
                              >
                                <Pencil size={15} />
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => setCategoryToDelete(cat)}
                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-glass-bg border border-transparent hover:border-glass-border rounded-lg transition-colors cursor-pointer"
                                title="Xóa danh mục"
                              >
                                <Trash size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={categoryToDelete !== null}
        title="Xóa danh mục tài sản"
        message={
          categoryToDelete
            ? `Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete.name}"? Tất cả tài khoản tài sản thuộc danh mục này cũng sẽ bị xóa vĩnh viễn và không thể khôi phục.`
            : ''
        }
        confirmText="Xóa danh mục"
        cancelText="Hủy"
        isPending={deletePending}
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onClose={() => setCategoryToDelete(null)}
      />
    </div>
  )
}
