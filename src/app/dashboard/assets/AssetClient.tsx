'use client'

import { useState, useActionState, useEffect, useRef } from 'react'
import { Plus, X, FolderKanban, Pencil, Trash, Check } from 'lucide-react'
import * as Icons from 'lucide-react'
import { 
  AssetAccount, 
  AssetCategory, 
  ActionResult, 
  PREDEFINED_COLORS, 
  PREDEFINED_ICONS 
} from '@/lib/types/assets'
import {
  createAssetAccount,
  updateAssetAccount,
  deleteAssetAccount,
  createAssetCategory,
  updateAssetCategory,
  deleteAssetCategory,
} from '@/app/actions/assets'
import AssetCard from '@/components/ui/AssetCard'

const INITIAL_STATE: ActionResult = { error: null, success: false, message: null }
const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })

type ModalMode = 'create' | 'edit' | 'delete' | 'categories' | null

interface AssetClientProps {
  accounts: AssetAccount[]
  categories: AssetCategory[]
}

export default function AssetClient({ accounts, categories }: AssetClientProps) {
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedAccount, setSelectedAccount] = useState<AssetAccount | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null)
  
  // Category editor states
  const [isEditingCategory, setIsEditingCategory] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [categoryColor, setCategoryColor] = useState(PREDEFINED_COLORS[0].hex)
  const [categoryIcon, setCategoryIcon] = useState(PREDEFINED_ICONS[0])

  // Form fields for live preview
  const [previewQty, setPreviewQty] = useState('')
  const [previewPrice, setPreviewPrice] = useState('')

  const formRef = useRef<HTMLFormElement>(null)
  const categoryFormRef = useRef<HTMLFormElement>(null)

  // Action States
  const [createState, createAction, createPending] = useActionState(createAssetAccount, INITIAL_STATE)
  const [updateState, updateAction, updatePending] = useActionState(updateAssetAccount, INITIAL_STATE)
  const [deleteState, deleteAction, deletePending] = useActionState(deleteAssetAccount, INITIAL_STATE)

  const [catCreateState, catCreateAction, catCreatePending] = useActionState(createAssetCategory, INITIAL_STATE)
  const [catUpdateState, catUpdateAction, catUpdatePending] = useActionState(updateAssetCategory, INITIAL_STATE)
  const [catDeleteState, catDeleteAction, catDeletePending] = useActionState(deleteAssetCategory, INITIAL_STATE)

  // Reset forms and close modal on success
  useEffect(() => {
    if (createState.success || updateState.success || deleteState.success) {
      closeModal()
    }
  }, [createState.success, updateState.success, deleteState.success])

  useEffect(() => {
    if (catCreateState.success || catUpdateState.success || catDeleteState.success) {
      resetCategoryForm()
    }
  }, [catCreateState.success, catUpdateState.success, catDeleteState.success])

  function openCreate() {
    setSelectedAccount(null)
    setPreviewQty('')
    setPreviewPrice('')
    setModalMode('create')
  }

  function openEdit(account: AssetAccount) {
    setSelectedAccount(account)
    setPreviewQty(String(account.quantity))
    setPreviewPrice(String(account.unit_price))
    setModalMode('edit')
  }

  function openDelete(account: AssetAccount) {
    setSelectedAccount(account)
    setModalMode('delete')
  }

  function openCategories() {
    setModalMode('categories')
    resetCategoryForm()
  }

  function closeModal() {
    setModalMode(null)
    setSelectedAccount(null)
    setPreviewQty('')
    setPreviewPrice('')
    formRef.current?.reset()
  }

  function resetCategoryForm() {
    setIsEditingCategory(false)
    setSelectedCategory(null)
    setCategoryName('')
    setCategoryColor(PREDEFINED_COLORS[0].hex)
    setCategoryIcon(PREDEFINED_ICONS[0])
    categoryFormRef.current?.reset()
  }

  function startEditCategory(cat: AssetCategory) {
    setSelectedCategory(cat)
    setIsEditingCategory(true)
    setCategoryName(cat.name)
    setCategoryColor(cat.color)
    setCategoryIcon(cat.icon)
  }

  const liveTotal =
    parseFloat(previewQty) > 0 && parseFloat(previewPrice) >= 0
      ? parseFloat(previewQty) * parseFloat(previewPrice)
      : null

  const isPending = createPending || updatePending || deletePending
  const currentError =
    modalMode === 'create'
      ? createState.error
      : modalMode === 'edit'
        ? updateState.error
        : deleteState.error

  return (
    <div className="assets-page">
      {/* ── Page header ── */}
      <div className="assets-page__header">
        <div className="assets-page__title-wrap">
          <FolderKanban className="assets-page__title-icon" size={28} />
          <h1 className="assets-page__title">Tài sản của tôi</h1>
        </div>
        <div className="flex gap-2">
          <button className="btn btn--ghost" onClick={openCategories} id="manage-cats-btn">
            Quản lý danh mục
          </button>
          <button 
            className="btn btn--primary" 
            onClick={openCreate} 
            disabled={categories.length === 0}
            id="add-asset-btn"
          >
            <Plus size={18} />
            Thêm tài sản
          </button>
        </div>
      </div>

      {/* ── Asset grid / List ── */}
      {categories.length === 0 ? (
        <div className="assets-empty">
          <div className="assets-empty__icon">📁</div>
          <h2 className="assets-empty__title">Chưa có danh mục nào</h2>
          <p className="assets-empty__desc">
            Vui lòng thêm ít nhất một danh mục tài sản trước khi bắt đầu tạo các tài khoản tài sản.
          </p>
          <button className="btn btn--primary" onClick={openCategories}>
            Thêm danh mục ngay
          </button>
        </div>
      ) : accounts.length === 0 ? (
        <div className="assets-empty">
          <div className="assets-empty__icon">💼</div>
          <h2 className="assets-empty__title">Chưa có tài sản nào</h2>
          <p className="assets-empty__desc">
            Bắt đầu theo dõi tài sản của bạn bằng cách thêm tài sản đầu tiên dưới danh mục đã tạo.
          </p>
          <button className="btn btn--primary" onClick={openCreate}>
            <Plus size={18} />
            Thêm tài sản đầu tiên
          </button>
        </div>
      ) : (
        <div className="assets-grid">
          {accounts.map((account) => (
            <AssetCard
              key={account.id}
              account={account}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      {/* ── Modal: Create / Edit Account ── */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">
                {modalMode === 'create' ? 'Thêm tài sản mới' : 'Chỉnh sửa tài sản'}
              </h2>
              <button className="modal__close" onClick={closeModal} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>

            <form
              key={selectedAccount?.id ?? 'new'}
              ref={formRef}
              action={modalMode === 'create' ? createAction : updateAction}
              className="modal__form"
            >
              {modalMode === 'edit' && selectedAccount && (
                <input type="hidden" name="id" value={selectedAccount.id} />
              )}

              {/* Name */}
              <div className="form-field">
                <label className="form-label" htmlFor="asset-name">
                  Tên tài sản <span className="required">*</span>
                </label>
                <input
                  id="asset-name"
                  name="name"
                  type="text"
                  className="form-input"
                  defaultValue={selectedAccount?.name ?? ''}
                  placeholder="VD: SJC Gold, Bitcoin, FPT Stock..."
                  required
                  maxLength={100}
                />
              </div>

              {/* Category Dropdown */}
              <div className="form-field">
                <label className="form-label" htmlFor="asset-category">
                  Danh mục tài sản <span className="required">*</span>
                </label>
                <select 
                  id="asset-category" 
                  name="category_id" 
                  className="form-select" 
                  defaultValue={selectedAccount?.category_id ?? categories[0]?.id}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="form-field">
                <label className="form-label" htmlFor="asset-quantity">
                  Số lượng <span className="required">*</span>
                </label>
                <input
                  id="asset-quantity"
                  name="quantity"
                  type="number"
                  className="form-input"
                  value={previewQty}
                  onChange={(e) => setPreviewQty(e.target.value)}
                  step="any"
                  min="0"
                  placeholder="0"
                  required
                />
              </div>

              {/* Unit price */}
              <div className="form-field">
                <label className="form-label" htmlFor="asset-unit-price">
                  Đơn giá (VND) <span className="required">*</span>
                </label>
                <input
                  id="asset-unit-price"
                  name="unit_price"
                  type="number"
                  className="form-input"
                  value={previewPrice}
                  onChange={(e) => setPreviewPrice(e.target.value)}
                  step="any"
                  min="0"
                  placeholder="0"
                  required
                />
              </div>

              {/* Live total preview */}
              {liveTotal !== null && (
                <div className="form-preview">
                  <span className="form-preview__label">Tổng giá trị ước tính</span>
                  <span className="form-preview__value">{VND.format(liveTotal)}</span>
                </div>
              )}

              {/* Description */}
              <div className="form-field">
                <label className="form-label" htmlFor="asset-description">
                  Ghi chú <span className="optional">(tùy chọn)</span>
                </label>
                <textarea
                  id="asset-description"
                  name="description"
                  className="form-textarea"
                  defaultValue={selectedAccount?.description ?? ''}
                  placeholder="Ghi chú thêm về tài sản này..."
                  rows={2}
                  maxLength={500}
                />
              </div>

              {/* Error */}
              {currentError && <p className="form-error">{currentError}</p>}

              {/* Actions */}
              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={closeModal}>
                  Hủy
                </button>
                <button type="submit" className="btn btn--primary" disabled={isPending}>
                  {isPending ? 'Đang lưu...' : modalMode === 'create' ? 'Thêm tài sản' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Delete Account Confirmation ── */}
      {modalMode === 'delete' && selectedAccount && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Xóa tài sản</h2>
              <button className="modal__close" onClick={closeModal} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>
            <div className="modal__body">
              <p className="modal__confirm-text">
                Bạn có chắc muốn xóa tài sản{' '}
                <strong>&ldquo;{selectedAccount.name}&rdquo;</strong>? Hành động này không thể hoàn tác.
              </p>
            </div>
            <form action={deleteAction}>
              <input type="hidden" name="id" value={selectedAccount.id} />
              {deleteState.error && <p className="form-error">{deleteState.error}</p>}
              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={closeModal}>
                  Hủy
                </button>
                <button type="submit" className="btn btn--danger" disabled={deletePending}>
                  {deletePending ? 'Đang xóa...' : 'Xóa tài sản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Manage Categories ── */}
      {modalMode === 'categories' && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Quản lý danh mục tài sản</h2>
              <button className="modal__close" onClick={closeModal} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>

            <div className="modal__body flex flex-col gap-6" style={{ paddingBottom: '2rem' }}>
              
              {/* Category Creation / Edit form */}
              <form 
                ref={categoryFormRef}
                action={isEditingCategory ? catUpdateAction : catCreateAction} 
                className="flex flex-col gap-4 border dark:border-slate-800 border-slate-200 p-4 rounded-xl dark:bg-slate-900/30 bg-slate-50/50"
              >
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isEditingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                </h3>

                {isEditingCategory && selectedCategory && (
                  <input type="hidden" name="id" value={selectedCategory.id} />
                )}

                {/* Name */}
                <div className="form-field">
                  <label className="form-label text-xs">Tên danh mục</label>
                  <input
                    name="name"
                    type="text"
                    className="form-input text-sm"
                    style={{ minHeight: '2.25rem', padding: '0.5rem' }}
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="VD: Vàng miếng, Crypto, Chứng khoán..."
                    required
                  />
                </div>

                {/* Predefined color swatches */}
                <div className="form-field">
                  <label className="form-label text-xs">Màu sắc chủ đạo</label>
                  <input type="hidden" name="color" value={categoryColor} />
                  <div className="flex flex-wrap gap-2">
                    {PREDEFINED_COLORS.map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
                        style={{ backgroundColor: col.hex }}
                        onClick={() => setCategoryColor(col.hex)}
                        title={col.name}
                      >
                        {categoryColor === col.hex && <Check size={12} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Predefined Lucide Icon grid */}
                <div className="form-field">
                  <label className="form-label text-xs">Biểu tượng</label>
                  <input type="hidden" name="icon" value={categoryIcon} />
                  <div className="grid grid-cols-6 gap-2 border dark:border-slate-800 border-slate-200/80 p-2.5 rounded-lg bg-background max-h-[120px] overflow-y-auto scrollbar-custom">
                    {PREDEFINED_ICONS.map((iconName) => {
                      const IconComp = (Icons as unknown as Record<string, React.ComponentType<React.ComponentProps<typeof Icons.Wallet>>>)[iconName] || Icons.HelpCircle
                      const isSelected = categoryIcon === iconName
                      return (
                        <button
                          key={iconName}
                          type="button"
                          className={`p-2 rounded-md flex items-center justify-center cursor-pointer border transition-colors ${
                            isSelected 
                              ? 'border-violet-500 bg-violet-500/10 text-violet-500' 
                              : 'border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          onClick={() => setCategoryIcon(iconName)}
                          title={iconName}
                        >
                          <IconComp size={16} />
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Actions & Errors */}
                {(catCreateState.error || catUpdateState.error) && (
                  <p className="form-error text-xs">{catCreateState.error || catUpdateState.error}</p>
                )}
                
                <div className="flex justify-end gap-2 pt-2">
                  {isEditingCategory && (
                    <button type="button" className="btn btn--ghost" style={{ minHeight: '2.25rem', padding: '0.25rem 0.75rem' }} onClick={resetCategoryForm}>
                      Hủy
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className="btn btn--primary" 
                    style={{ minHeight: '2.25rem', padding: '0.25rem 1rem' }}
                    disabled={catCreatePending || catUpdatePending}
                  >
                    {catCreatePending || catUpdatePending ? 'Đang lưu...' : isEditingCategory ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>

              {/* Category List */}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Danh mục hiện có</h3>
                {categories.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Chưa có danh mục nào.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-custom">
                    {categories.map((cat) => {
                      const IconComponent = (Icons as unknown as Record<string, React.ComponentType<React.ComponentProps<typeof Icons.Wallet>>>)[cat.icon] || Icons.Wallet
                      return (
                        <div 
                          key={cat.id} 
                          className="flex items-center justify-between border dark:border-slate-800 border-slate-200 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/30"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                              <IconComponent size={14} style={{ color: cat.color }} />
                            </div>
                            <span className="text-sm font-semibold">{cat.name}</span>
                          </div>
                          
                          <div className="flex gap-1.5">
                            <button 
                              type="button" 
                              onClick={() => startEditCategory(cat)}
                              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                              title="Sửa"
                            >
                              <Pencil size={14} />
                            </button>
                            
                            <form action={catDeleteAction}>
                              <input type="hidden" name="id" value={cat.id} />
                              <button 
                                type="submit" 
                                className="p-1.5 text-slate-400 hover:text-red-500"
                                title="Xóa danh mục (xóa tất cả tài sản đi kèm)"
                                disabled={catDeletePending}
                              >
                                <Trash size={14} />
                              </button>
                            </form>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
