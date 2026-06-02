'use client'

import { useState, useActionState, useEffect, useRef } from 'react'
import { Plus, X, FolderKanban, Pencil, Trash, Check, Receipt, Coins, Landmark } from 'lucide-react'
import * as Icons from 'lucide-react'
import { AssetAccount, AssetCategory, ActionResult, PREDEFINED_COLORS, PREDEFINED_ICONS } from '@/lib/types/assets'
import { createTransaction, updateTransaction, deleteTransaction } from '@/app/actions/transactions'
import { createAssetCategory, updateAssetCategory, deleteAssetCategory } from '@/app/actions/assets'
import DatePicker from '@/components/ui/DatePicker'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import { useLanguage } from '@/components/providers'

const INITIAL_STATE: ActionResult = { error: null, success: false, message: null }
const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })

type ModalMode = 'create' | 'edit' | 'delete' | 'categories' | null

interface SpendingClientProps {
  walletAccounts: AssetAccount[]
  spendingCategories: AssetCategory[]
  initialTransactions: any[]
}

export default function SpendingClient({
  walletAccounts,
  spendingCategories,
  initialTransactions,
}: SpendingClientProps) {
  const { t } = useLanguage()
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedTx, setSelectedTx] = useState<any | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null)

  // Category management states
  const [isEditingCategory, setIsEditingCategory] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [categoryColor, setCategoryColor] = useState(PREDEFINED_COLORS[0].hex)
  const [categoryIcon, setCategoryIcon] = useState(PREDEFINED_ICONS[0])

  // Form fields
  const [txType, setTxType] = useState<'income' | 'expense'>('expense')
  const [selectedWalletId, setSelectedWalletId] = useState('')
  const [selectedCatId, setSelectedCatId] = useState('')
  const [txAmount, setTxAmount] = useState('')
  const [txDate, setTxDate] = useState('')
  const [txDesc, setTxDesc] = useState('')

  // Toast notifications
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

  // Action states
  const [createState, createAction, createPending] = useActionState(createTransaction, INITIAL_STATE)
  const [updateState, updateAction, updatePending] = useActionState(updateTransaction, INITIAL_STATE)
  const [deleteState, deleteAction, deletePending] = useActionState(deleteTransaction, INITIAL_STATE)

  const [catCreateState, catCreateAction, catCreatePending] = useActionState(createAssetCategory, INITIAL_STATE)
  const [catUpdateState, catUpdateAction, catUpdatePending] = useActionState(updateAssetCategory, INITIAL_STATE)
  const [catDeleteState, catDeleteAction, catDeletePending] = useActionState(deleteAssetCategory, INITIAL_STATE)

  const getTodayString = () => new Date().toISOString().split('T')[0]

  // Reset forms and close modal on success
  useEffect(() => {
    if (createState.success || updateState.success || deleteState.success) {
      if (createState.success) setToastMessage(createState.message || 'Lưu thành công!')
      if (updateState.success) setToastMessage(updateState.message || 'Cập nhật thành công!')
      if (deleteState.success) setToastMessage(deleteState.message || 'Xóa thành công!')
      setToastType('success')
      closeModal()
    } else if (createState.error || updateState.error || deleteState.error) {
      setToastType('error')
      setToastMessage(createState.error || updateState.error || deleteState.error || 'Có lỗi xảy ra!')
    }
  }, [createState.success, updateState.success, deleteState.success, createState.error, updateState.error, deleteState.error])

  useEffect(() => {
    if (catCreateState.success || catUpdateState.success || catDeleteState.success) {
      setToastType('success')
      setToastMessage(catCreateState.message || catUpdateState.message || catDeleteState.message || 'Lưu danh mục thành công!')
      resetCategoryForm()
    } else if (catCreateState.error || catUpdateState.error || catDeleteState.error) {
      setToastType('error')
      setToastMessage(catCreateState.error || catUpdateState.error || catDeleteState.error || 'Lỗi danh mục!')
    }
  }, [catCreateState.success, catUpdateState.success, catDeleteState.success, catCreateState.error, catUpdateState.error, catDeleteState.error])

  function openCreate() {
    setSelectedTx(null)
    setTxType('expense')
    setSelectedWalletId(walletAccounts[0]?.id || '')
    setSelectedCatId(spendingCategories[0]?.id || '')
    setTxAmount('')
    setTxDate(getTodayString())
    setTxDesc('')
    setModalMode('create')
  }

  function openEdit(tx: any) {
    setSelectedTx(tx)
    setTxType(tx.type)
    setSelectedWalletId(tx.account_id)
    setSelectedCatId(tx.category_id || '')
    setTxAmount(String(tx.amount))
    setTxDate(tx.transaction_date ? tx.transaction_date.split('T')[0] : getTodayString())
    setTxDesc(tx.description || '')
    setModalMode('edit')
  }

  function openDelete(tx: any) {
    setSelectedTx(tx)
    setModalMode('delete')
  }

  function openCategories() {
    setModalMode('categories')
    resetCategoryForm()
  }

  function closeModal() {
    setModalMode(null)
    setSelectedTx(null)
    setTxAmount('')
    setTxDesc('')
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

  const isPending = createPending || updatePending || deletePending

  // Calculate monthly stats
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const monthlyExpenseTotal = initialTransactions
    .filter(tx => tx.type === 'expense' && new Date(tx.transaction_date).getMonth() === currentMonth && new Date(tx.transaction_date).getFullYear() === currentYear)
    .reduce((sum, tx) => sum + tx.amount, 0)

  const monthlyIncomeTotal = initialTransactions
    .filter(tx => tx.type === 'income' && new Date(tx.transaction_date).getMonth() === currentMonth && new Date(tx.transaction_date).getFullYear() === currentYear)
    .reduce((sum, tx) => sum + tx.amount, 0)

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

      {/* ── Page Header ── */}
      <div className="assets-page__header">
        <div className="assets-page__title-wrap">
          <Receipt className="assets-page__title-icon" size={28} />
          <h1 className="assets-page__title">Chi tiêu & Hóa đơn</h1>
        </div>
        <div className="flex gap-2">
          <button className="btn btn--ghost cursor-pointer" onClick={openCategories} id="manage-spending-cats-btn">
            Quản lý danh mục chi
          </button>
          <button 
            className="btn btn--primary cursor-pointer" 
            onClick={openCreate} 
            disabled={walletAccounts.length === 0 || spendingCategories.length === 0}
            id="add-spending-btn"
          >
            <Plus size={18} />
            Nhập hóa đơn / Giao dịch
          </button>
        </div>
      </div>

      {/* ── Monthly Overview Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="border border-glass-border bg-glass-bg backdrop-blur-md rounded-2xl p-5 shadow-card-shadow">
          <span className="text-xs text-slate-400 font-bold block mb-1">CHI TIÊU THÁNG NÀY</span>
          <span className="text-2xl font-bold text-rose-500">{VND.format(monthlyExpenseTotal)}</span>
        </div>
        <div className="border border-glass-border bg-glass-bg backdrop-blur-md rounded-2xl p-5 shadow-card-shadow">
          <span className="text-xs text-slate-400 font-bold block mb-1">THU NHẬP THÁNG NÀY</span>
          <span className="text-2xl font-bold text-emerald-500">{VND.format(monthlyIncomeTotal)}</span>
        </div>
        <div className="border border-glass-border bg-glass-bg backdrop-blur-md rounded-2xl p-5 shadow-card-shadow">
          <span className="text-xs text-slate-400 font-bold block mb-1">TỔNG NGUỒN TIỀN/VÍ KHẢ DỤNG</span>
          <span className="text-2xl font-bold text-violet-500">
            {VND.format(walletAccounts.reduce((sum, a) => sum + a.total_value, 0))}
          </span>
        </div>
      </div>

      {/* ── Transactions List ── */}
      {walletAccounts.length === 0 ? (
        <div className="assets-empty">
          <div className="assets-empty__icon">💳</div>
          <h2 className="assets-empty__title">Chưa có ví hoặc nguồn tiền nào</h2>
          <p className="assets-empty__desc">
            Vui lòng thêm ít nhất một tài khoản Tiền mặt hoặc Ngân hàng trong mục "Tài sản & Số dư" trước khi bắt đầu nhập hóa đơn chi tiêu.
          </p>
        </div>
      ) : spendingCategories.length === 0 ? (
        <div className="assets-empty">
          <div className="assets-empty__icon">📁</div>
          <h2 className="assets-empty__title">Chưa có danh mục chi tiêu nào</h2>
          <p className="assets-empty__desc">
            Hãy tạo các danh mục chi tiêu như Điện, Nước, Ăn uống, Lương... để phân loại hóa đơn của bạn.
          </p>
          <button className="btn btn--primary" onClick={openCategories}>
            Tạo danh mục chi tiêu ngay
          </button>
        </div>
      ) : initialTransactions.length === 0 ? (
        <div className="assets-empty">
          <div className="assets-empty__icon">📝</div>
          <h2 className="assets-empty__title">Chưa có hóa đơn/giao dịch nào</h2>
          <p className="assets-empty__desc">
            Bắt đầu quản lý thu chi bằng cách ghi chép giao dịch hóa đơn đầu tiên của bạn.
          </p>
          <button className="btn btn--primary" onClick={openCreate}>
            <Plus size={18} />
            Nhập giao dịch đầu tiên
          </button>
        </div>
      ) : (
        <div className="border border-glass-border bg-glass-bg backdrop-blur-md rounded-2xl shadow-card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-glass-border dark:bg-slate-900/10 bg-slate-50/20 text-xs uppercase tracking-wider text-slate-400 font-bold">
                  <th className="p-4 pl-6">Ngày</th>
                  <th className="p-4">Danh mục</th>
                  <th className="p-4">Nguồn tiền/Ví</th>
                  <th className="p-4">Mô tả / Ghi chú</th>
                  <th className="p-4 text-right pr-6">Số tiền</th>
                  <th className="p-4 text-right pr-6">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {initialTransactions.map((tx) => {
                  const category = tx.category
                  const categoryColor = category?.color || '#94a3b8'
                  const categoryName = category?.name || 'Không phân loại'
                  const IconComp = (Icons as any)[category?.icon || 'HelpCircle'] || Icons.HelpCircle

                  return (
                    <tr
                      key={tx.id}
                      className="border-b border-glass-border/60 hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors"
                    >
                      <td className="p-4 pl-6 text-sm text-slate-600 dark:text-slate-400">
                        {tx.transaction_date ? new Date(tx.transaction_date).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${categoryColor}15` }}
                          >
                            <IconComp size={12} style={{ color: categoryColor }} />
                          </span>
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {categoryName}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-700 dark:text-slate-300 font-medium">
                        {tx.account?.name || 'Unknown Wallet'}
                      </td>
                      <td className="p-4 text-sm text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                        {tx.description || '-'}
                      </td>
                      <td className="p-4 text-right pr-6 text-sm font-bold">
                        {tx.type === 'expense' ? (
                          <span className="text-rose-500">-{VND.format(tx.amount)}</span>
                        ) : (
                          <span className="text-emerald-500">+{VND.format(tx.amount)}</span>
                        )}
                      </td>
                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(tx)}
                            className="p-2 text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 hover:bg-glass-bg border border-transparent hover:border-glass-border rounded-lg transition-colors cursor-pointer"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDelete(tx)}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-glass-bg border border-transparent hover:border-glass-border rounded-lg transition-colors cursor-pointer"
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

      {/* ── Modal: Create / Edit Transaction ── */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">
                {modalMode === 'create' ? 'Nhập hóa đơn & Giao dịch mới' : 'Chỉnh sửa giao dịch'}
              </h2>
              <button className="modal__close" onClick={closeModal} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>

            <form
              key={selectedTx?.id ?? 'new-tx'}
              ref={formRef}
              action={modalMode === 'create' ? createAction : updateAction}
              className="modal__form"
            >
              {modalMode === 'edit' && selectedTx && (
                <input type="hidden" name="id" value={selectedTx.id} />
              )}

              {/* Transaction Type Toggle */}
              <div className="form-field">
                <label className="form-label">Loại giao dịch <span className="required">*</span></label>
                <input type="hidden" name="type" value={txType} />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`py-2 px-4 rounded-xl border text-sm font-bold text-center transition-all cursor-pointer ${
                      txType === 'expense'
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/35'
                        : 'border-glass-border text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                    }`}
                    onClick={() => setTxType('expense')}
                  >
                    Chi tiêu (Hóa đơn)
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 rounded-xl border text-sm font-bold text-center transition-all cursor-pointer ${
                      txType === 'income'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/35'
                        : 'border-glass-border text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                    }`}
                    onClick={() => setTxType('income')}
                  >
                    Thu nhập
                  </button>
                </div>
              </div>

              {/* Wallet/Source account Selection */}
              <div className="form-field">
                <label className="form-label" htmlFor="tx-wallet">
                  Nguồn tiền / Ví <span className="required">*</span>
                </label>
                <select
                  id="tx-wallet"
                  name="account_id"
                  className="form-select"
                  value={selectedWalletId}
                  onChange={(e) => setSelectedWalletId(e.target.value)}
                  required
                >
                  <option value="" disabled>-- Chọn ví / tài khoản nguồn --</option>
                  {walletAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.currency === 'USD' ? '$' : '₫'}{Number(acc.quantity).toLocaleString('vi-VN')} {acc.currency})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category selection */}
              <div className="form-field">
                <label className="form-label" htmlFor="tx-category">
                  Danh mục chi tiêu <span className="required">*</span>
                </label>
                <select
                  id="tx-category"
                  name="category_id"
                  className="form-select"
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                  required
                >
                  <option value="" disabled>-- Chọn danh mục --</option>
                  {spendingCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount input */}
              <div className="form-field">
                <label className="form-label" htmlFor="tx-amount">
                  Số tiền <span className="required">*</span>
                </label>
                <div className="relative">
                  <input
                    id="tx-amount"
                    name="amount"
                    type="number"
                    className="form-input pr-12"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    step="any"
                    min="0.01"
                    placeholder="0"
                    required
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                    {walletAccounts.find((w) => w.id === selectedWalletId)?.currency || 'VND'}
                  </div>
                </div>
              </div>

              {/* Transaction Date */}
              <div className="form-field">
                <label className="form-label" htmlFor="tx-date">
                  Ngày giao dịch <span className="required">*</span>
                </label>
                <DatePicker
                  id="tx-date"
                  name="transaction_date"
                  selectedDate={txDate}
                  onChange={setTxDate}
                />
              </div>

              {/* Notes Description */}
              <div className="form-field">
                <label className="form-label" htmlFor="tx-desc">
                  Mô tả / Ghi chú <span className="optional">(tùy chọn)</span>
                </label>
                <textarea
                  id="tx-desc"
                  name="description"
                  className="form-textarea"
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  placeholder="Hóa đơn tiền điện tháng 6, Lương dự án..."
                  rows={2}
                  maxLength={500}
                />
              </div>

              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={closeModal}>
                  Hủy
                </button>
                <button type="submit" className="btn btn--primary" disabled={isPending}>
                  {isPending ? 'Đang lưu...' : modalMode === 'create' ? 'Lưu giao dịch' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalMode === 'delete' && selectedTx !== null}
        title="Xóa giao dịch"
        message={
          selectedTx
            ? `Bạn có chắc chắn muốn xóa giao dịch này? Số dư tài khoản nguồn "${selectedTx.account?.name || 'Ví'}" sẽ được hoàn trả lại tương ứng.`
            : ''
        }
        confirmText="Xóa giao dịch"
        cancelText="Hủy"
        isPending={deletePending}
        isDanger={true}
        onConfirm={async () => {
          if (!selectedTx) return
          const formData = new FormData()
          formData.append('id', selectedTx.id)
          await deleteAction(formData)
        }}
        onClose={closeModal}
      />

      {/* ── Modal: Manage Spending Categories ── */}
      {modalMode === 'categories' && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Quản lý danh mục chi tiêu</h2>
              <button className="modal__close" onClick={closeModal} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>

            <div className="modal__body flex flex-col gap-6" style={{ paddingBottom: '2rem' }}>
              
              {/* Category creation / editing form */}
              <form
                ref={categoryFormRef}
                action={isEditingCategory ? catUpdateAction : catCreateAction}
                className="flex flex-col gap-4 border dark:border-slate-800 border-slate-200 p-4 rounded-xl dark:bg-slate-900/30 bg-slate-50/50"
              >
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isEditingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục chi tiêu mới'}
                </h3>

                <input type="hidden" name="type" value="spending" />
                {isEditingCategory && selectedCategory && (
                  <input type="hidden" name="id" value={selectedCategory.id} />
                )}

                <div className="form-field">
                  <label className="form-label text-xs">Tên danh mục chi tiêu</label>
                  <input
                    name="name"
                    type="text"
                    className="form-input text-sm"
                    style={{ minHeight: '2.25rem', padding: '0.5rem' }}
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="VD: Điện & Nước, Ăn uống, Giải trí..."
                    required
                  />
                </div>

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

                <div className="form-field">
                  <label className="form-label text-xs">Biểu tượng</label>
                  <input type="hidden" name="icon" value={categoryIcon} />
                  <div className="grid grid-cols-6 gap-2 border dark:border-slate-800 border-slate-200/80 p-2.5 rounded-lg bg-background max-h-[120px] overflow-y-auto scrollbar-custom">
                    {PREDEFINED_ICONS.map((iconName) => {
                      const IconComp = (Icons as any)[iconName] || Icons.HelpCircle
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

                <div className="flex justify-end gap-2 mt-2">
                  {isEditingCategory && (
                    <button type="button" className="btn btn--ghost text-xs py-1.5 px-3" onClick={resetCategoryForm}>
                      Hủy sửa
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn btn--primary text-xs py-1.5 px-4"
                    disabled={catCreatePending || catUpdatePending}
                  >
                    {catCreatePending || catUpdatePending ? 'Đang lưu...' : isEditingCategory ? 'Lưu cập nhật' : 'Tạo danh mục'}
                  </button>
                </div>
              </form>

              {/* List of spending categories */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Danh mục chi tiêu hiện tại</h3>
                {spendingCategories.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Chưa có danh mục nào. Hãy tạo ở trên.</p>
                ) : (
                  <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto pr-1">
                    {spendingCategories.map((cat) => {
                      const IconComp = (Icons as any)[cat.icon] || Icons.HelpCircle
                      return (
                        <div
                          key={cat.id}
                          className="flex items-center justify-between p-2 rounded-lg border dark:border-slate-800/80 border-slate-200/60 dark:bg-slate-900/10 bg-slate-50/30"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${cat.color}15` }}
                            >
                              <IconComp size={11} style={{ color: cat.color }} />
                            </span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{cat.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              className="p-1 text-slate-400 hover:text-violet-500 rounded-md cursor-pointer"
                              onClick={() => startEditCategory(cat)}
                            >
                              <Pencil size={11} />
                            </button>
                            <button
                              type="button"
                              className="p-1 text-slate-400 hover:text-rose-500 rounded-md cursor-pointer"
                              disabled={catDeletePending}
                              onClick={async () => {
                                const fd = new FormData()
                                fd.append('id', cat.id)
                                await catDeleteAction(fd)
                              }}
                            >
                              <Trash size={11} />
                            </button>
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
