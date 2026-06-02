'use client'

import { useState, useActionState, useEffect, useRef } from 'react'
import { Plus, X, FolderKanban, Pencil, Trash, Check, RotateCw } from 'lucide-react'
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
  syncAssetPrices,
} from '@/app/actions/assets'
import DatePicker from '@/components/ui/DatePicker'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import { useLanguage } from '@/components/providers'

const INITIAL_STATE: ActionResult = { error: null, success: false, message: null }
const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })

type ModalMode = 'create' | 'edit' | 'delete' | 'categories' | null

interface AssetClientProps {
  accounts: AssetAccount[]
  categories: AssetCategory[]
}

export default function AssetClient({ accounts, categories }: AssetClientProps) {
  const { t } = useLanguage()
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedAccount, setSelectedAccount] = useState<AssetAccount | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null)

  const walletAccounts = accounts.filter((acc) => {
    const catName = acc.category?.name || ''
    return /tiền mặt|ngân hàng|cash|bank|ví/i.test(catName)
  })
  
  // Category editor states
  const [isEditingCategory, setIsEditingCategory] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [categoryColor, setCategoryColor] = useState(PREDEFINED_COLORS[0].hex)
  const [categoryIcon, setCategoryIcon] = useState(PREDEFINED_ICONS[0])

  // Form fields for live preview and conditional inputs
  const [previewQty, setPreviewQty] = useState('')
  const [previewPurchasePrice, setPreviewPurchasePrice] = useState('')
  const [previewPrice, setPreviewPrice] = useState('')
  const [previewTicker, setPreviewTicker] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState('VND')
  const [purchaseDate, setPurchaseDate] = useState('')
  
  // Sync state
  const [isSyncing, setIsSyncing] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const formRef = useRef<HTMLFormElement>(null)
  const categoryFormRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  async function handleSyncPrices() {
    setIsSyncing(true)
    try {
      const res = await syncAssetPrices()
      if (res.success) {
        setToastType('success')
        setToastMessage(res.message || 'Đã đồng bộ giá thành công!')
      } else {
        setToastType('error')
        setToastMessage(res.error || 'Có lỗi xảy ra khi đồng bộ giá.')
      }
    } catch (err) {
      console.error(err)
      setToastType('error')
      setToastMessage('Lỗi kết nối khi đồng bộ giá.')
    } finally {
      setIsSyncing(false)
    }
  }

  // Action States
  const [createState, createAction, createPending] = useActionState(createAssetAccount, INITIAL_STATE)
  const [updateState, updateAction, updatePending] = useActionState(updateAssetAccount, INITIAL_STATE)
  const [deleteState, deleteAction, deletePending] = useActionState(deleteAssetAccount, INITIAL_STATE)

  const [catCreateState, catCreateAction, catCreatePending] = useActionState(createAssetCategory, INITIAL_STATE)
  const [catUpdateState, catUpdateAction, catUpdatePending] = useActionState(updateAssetCategory, INITIAL_STATE)
  const [catDeleteState, catDeleteAction, catDeletePending] = useActionState(deleteAssetCategory, INITIAL_STATE)

  const getTodayString = () => new Date().toISOString().split('T')[0]

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
    setPreviewPurchasePrice('')
    setPreviewPrice('')
    setPreviewTicker('')
    setSelectedCategoryId(categories[0]?.id || '')
    setSelectedCurrency('VND')
    setPurchaseDate(getTodayString())
    setModalMode('create')
  }

  function openEdit(account: AssetAccount) {
    setSelectedAccount(account)
    setPreviewQty(String(account.quantity))
    setPreviewPurchasePrice(String(account.purchase_unit_price ?? account.unit_price))
    setPreviewPrice(String(account.unit_price))
    setPreviewTicker(account.ticker || '')
    setSelectedCategoryId(account.category_id)
    setSelectedCurrency(account.currency)
    setPurchaseDate(account.purchase_date ? account.purchase_date.split('T')[0] : getTodayString())
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
    setPreviewPurchasePrice('')
    setPreviewPrice('')
    setPreviewTicker('')
    setSelectedCategoryId('')
    setSelectedCurrency('VND')
    setPurchaseDate('')
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

  const activeCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0]
  const isCashCategory = activeCategory ? /tiền mặt|ngân hàng|cash|bank|ví/i.test(activeCategory.name) : false

  const liveTotal =
    parseFloat(previewQty) > 0
      ? (isCashCategory
          ? parseFloat(previewQty)
          : parseFloat(previewPurchasePrice) >= 0
            ? parseFloat(previewQty) * parseFloat(previewPurchasePrice)
            : null)
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
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 ${
          toastType === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
        }`}>
          <div className="flex items-center gap-2">
            {toastType === 'success' ? <Check size={16} /> : <X size={16} />}
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ── Page header ── */}
      <div className="assets-page__header">
        <div className="assets-page__title-wrap">
          <FolderKanban className="assets-page__title-icon" size={28} />
          <h1 className="assets-page__title">{t('navAssets')}</h1>
        </div>
        <div className="flex gap-2">
          <button 
            className="btn btn--ghost flex items-center gap-1.5 cursor-pointer" 
            onClick={handleSyncPrices}
            disabled={isSyncing || accounts.length === 0}
            id="sync-prices-btn"
          >
            <RotateCw size={15} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ giá'}
          </button>
          <button className="btn btn--ghost cursor-pointer" onClick={openCategories} id="manage-cats-btn">
            Quản lý danh mục
          </button>
          <button 
            className="btn btn--primary cursor-pointer" 
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
        <div className="border border-glass-border bg-glass-bg backdrop-blur-md rounded-2xl shadow-card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-glass-border dark:bg-slate-900/10 bg-slate-50/20 text-xs uppercase tracking-wider text-slate-400 font-bold">
                  <th className="p-4 pl-6">Tài sản</th>
                  <th className="p-4">Danh mục</th>
                  <th className="p-4 hidden sm:table-cell">Ngày sở hữu</th>
                  <th className="p-4 text-right hidden md:table-cell">Số lượng</th>
                  <th className="p-4 text-right hidden lg:table-cell">Giá mua</th>
                  <th className="p-4 text-right hidden lg:table-cell">Giá hiện tại</th>
                  <th className="p-4 text-right hidden sm:table-cell">Lời / Lỗ</th>
                  <th className="p-4 text-right pr-6">Tổng giá trị</th>
                  <th className="p-4 text-right pr-6">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => {
                  const category = account.category
                  const categoryColor = category?.color || '#94a3b8'
                  const categoryName = category?.name || 'Chưa phân loại'
                  const isCash = categoryName ? /tiền mặt|ngân hàng|cash|bank|ví/i.test(categoryName) : false
                  const IconComp = (Icons as unknown as Record<string, React.ComponentType<React.ComponentProps<typeof Icons.Wallet>>>)[category?.icon || 'Wallet'] || Icons.Wallet

                  const purchasePrice = account.purchase_unit_price || account.unit_price
                  const diff = account.unit_price - purchasePrice
                  const profitOrLoss = diff * account.quantity
                  const percent = purchasePrice > 0 ? (diff / purchasePrice) * 100 : 0

                  return (
                    <tr
                      key={account.id}
                      className="border-b border-glass-border/60 hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors"
                    >
                      {/* Name & Icon */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${categoryColor}15` }}
                          >
                            <IconComp size={16} style={{ color: categoryColor }} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block truncate">
                              {account.name} {account.ticker ? `(${account.ticker})` : ''}
                            </span>
                            {account.description && (
                              <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate max-w-[150px]">
                                {account.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="p-4">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block"
                          style={{ color: categoryColor, background: `${categoryColor}10` }}
                        >
                          {categoryName}
                        </span>
                      </td>

                      {/* Purchase Date */}
                      <td className="p-4 text-xs text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                        {account.purchase_date ? new Date(account.purchase_date).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>

                      {/* Quantity */}
                      <td className="p-4 text-xs text-right text-slate-800 dark:text-slate-200 hidden md:table-cell">
                        {isCash ? (
                          <span>-</span>
                        ) : (
                          <span>
                            {account.quantity.toLocaleString('vi-VN', { maximumFractionDigits: 8 })}
                          </span>
                        )}
                      </td>

                      {/* Purchase Price */}
                      <td className="p-4 text-xs text-right text-slate-800 dark:text-slate-200 hidden lg:table-cell">
                        {isCash ? (
                          <span>-</span>
                        ) : (
                          <span>
                            {account.currency === 'USD'
                              ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(purchasePrice)
                              : VND.format(purchasePrice)}
                          </span>
                        )}
                      </td>

                      {/* Current Price */}
                      <td className="p-4 text-xs text-right text-slate-800 dark:text-slate-200 hidden lg:table-cell">
                        {isCash ? (
                          <span>-</span>
                        ) : (
                          <span>
                            {account.currency === 'USD'
                              ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(account.unit_price)
                              : VND.format(account.unit_price)}
                          </span>
                        )}
                      </td>

                      {/* Profit / Loss */}
                      <td className="p-4 text-xs text-right hidden sm:table-cell">
                        {isCash ? (
                          <span className="text-slate-400 dark:text-slate-500">-</span>
                        ) : (
                          <div className="flex flex-col items-end justify-center">
                            {profitOrLoss > 0 ? (
                              <>
                                <span className="font-semibold text-emerald-500">
                                  +{account.currency === 'USD'
                                    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(profitOrLoss)
                                    : VND.format(profitOrLoss)}
                                  {` (+${percent.toFixed(2)}%)`}
                                </span>
                                {account.currency === 'USD' && (
                                  <span className="text-[10px] text-emerald-500/80">
                                    ≈ +{VND.format(profitOrLoss * 25000)}
                                  </span>
                                )}
                              </>
                            ) : profitOrLoss < 0 ? (
                              <>
                                <span className="font-semibold text-rose-500">
                                  {account.currency === 'USD'
                                    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(profitOrLoss)
                                    : VND.format(profitOrLoss)}
                                  {` (${percent.toFixed(2)}%)`}
                                </span>
                                {account.currency === 'USD' && (
                                  <span className="text-[10px] text-rose-500/80">
                                    ≈ {VND.format(profitOrLoss * 25000)}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500">
                                {account.currency === 'USD' ? '$0.00' : '0 ₫'} (0.00%)
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Total Value */}
                      <td className="p-4 text-right pr-6">
                        {account.currency === 'USD' ? (
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(account.quantity * account.unit_price)}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              ≈ {VND.format(account.total_value)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            {VND.format(account.total_value)}
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(account)}
                            className="p-2 text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 hover:bg-glass-bg border border-transparent hover:border-glass-border rounded-lg transition-colors cursor-pointer"
                            title="Sửa"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDelete(account)}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-glass-bg border border-transparent hover:border-glass-border rounded-lg transition-colors cursor-pointer"
                            title="Xóa"
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
                  Tên tài sản <span className="optional">(tùy chọn, mặc định lấy tên danh mục)</span>
                </label>
                <input
                  id="asset-name"
                  name="name"
                  type="text"
                  className="form-input"
                  defaultValue={selectedAccount?.name ?? ''}
                  placeholder="VD: SJC Gold, Bitcoin, FPT Stock..."
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
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Currency Selector */}
              <div className="form-field">
                <label className="form-label" htmlFor="asset-currency">
                  Tiền tệ <span className="required">*</span>
                </label>
                <select
                  id="asset-currency"
                  name="currency"
                  className="form-select"
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  required
                >
                  <option value="VND">VND (đ)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              {/* Purchase Date */}
              <div className="form-field">
                <label className="form-label" htmlFor="asset-purchase-date">
                  Ngày mua / Ngày sở hữu <span className="required">*</span>
                </label>
                <DatePicker
                  id="asset-purchase-date"
                  name="purchase_date"
                  selectedDate={purchaseDate}
                  onChange={setPurchaseDate}
                />
              </div>

              {/* Dynamic inputs: Cash Category vs Investment Category */}
              {isCashCategory ? (
                <>
                  <input type="hidden" name="unit_price" value="1" />
                  <input type="hidden" name="purchase_unit_price" value="1" />
                  <div className="form-field">
                    <label className="form-label" htmlFor="asset-balance">
                      Số dư / Giá trị <span className="required">*</span>
                    </label>
                    <input
                      id="asset-balance"
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
                </>
              ) : (
                <>
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

                  {/* Purchase Unit price */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="asset-purchase-unit-price">
                      Đơn giá mua ({selectedCurrency}) <span className="required">*</span>
                    </label>
                    <input
                      id="asset-purchase-unit-price"
                      name="purchase_unit_price"
                      type="number"
                      className="form-input"
                      value={previewPurchasePrice}
                      onChange={(e) => setPreviewPurchasePrice(e.target.value)}
                      step="any"
                      min="0"
                      placeholder="0"
                      required
                    />
                  </div>

                  {/* Ticker Symbol */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="asset-ticker">
                      Mã tài sản / Ticker <span className="optional">(tùy chọn để tự động đồng bộ giá, ví dụ: BTC, HPG, SJC)</span>
                    </label>
                    <input
                      id="asset-ticker"
                      name="ticker"
                      type="text"
                      className="form-input"
                      value={previewTicker}
                      onChange={(e) => setPreviewTicker(e.target.value)}
                      placeholder="BTC, HPG, SJC..."
                    />
                  </div>

                  {/* Payment Source selection */}
                  {modalMode === 'create' && walletAccounts.length > 0 && (
                    <div className="form-field">
                      <label className="form-label" htmlFor="asset-source-wallet">
                        Nguồn thanh toán <span className="optional">(tùy chọn, tự động trừ số dư ví này)</span>
                      </label>
                      <select id="asset-source-wallet" name="source_account_id" className="form-select">
                        <option value="">-- Không trừ ví (tạo độc lập) --</option>
                        {walletAccounts.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name} (Số dư: {w.currency === 'USD' ? '$' : '₫'}{Number(w.quantity).toLocaleString('vi-VN')} {w.currency})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {/* Live total preview */}
              {liveTotal !== null && (
                <div className="form-preview">
                  <span className="form-preview__label">Tổng giá trị ước tính (VND)</span>
                  <span className="form-preview__value font-bold text-slate-800 dark:text-slate-100">
                    {selectedCurrency === 'USD' ? (
                      <>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(liveTotal)}
                        <span className="text-xs text-slate-400 block mt-0.5 font-normal">
                          ≈ {VND.format(liveTotal * 25000)} (Tỷ giá cố định 25.000đ)
                        </span>
                      </>
                    ) : (
                      VND.format(liveTotal)
                    )}
                  </span>
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

      <ConfirmationModal
        isOpen={modalMode === 'delete' && selectedAccount !== null}
        title="Xóa tài sản"
        message={
          selectedAccount
            ? `Bạn có chắc chắn muốn xóa tài sản "${selectedAccount.name}"? Hành động này không thể hoàn tác.`
            : ''
        }
        confirmText="Xóa tài sản"
        cancelText="Hủy"
        isPending={deletePending}
        isDanger={true}
        onConfirm={async () => {
          if (!selectedAccount) return
          const formData = new FormData()
          formData.append('id', selectedAccount.id)
          await deleteAction(formData)
        }}
        onClose={closeModal}
      />

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
