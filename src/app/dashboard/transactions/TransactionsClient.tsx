'use client'

import { useState, useActionState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ArrowLeftRight, ChevronLeft, ChevronRight, Calendar, ArrowUpRight, ArrowDownLeft, Trash2, Check, X } from 'lucide-react'
import * as Icons from 'lucide-react'
import { AssetTransaction, ActionResult } from '@/lib/types/assets'
import { deleteTransaction } from '@/app/actions/transactions'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

const INITIAL_STATE: ActionResult = { error: null, success: false, message: null }
const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })

interface TransactionsClientProps {
  transactions: AssetTransaction[]
  totalCount: number
  currentPage: number
  limit: number
}

export default function TransactionsClient({
  transactions,
  totalCount,
  currentPage,
  limit,
}: TransactionsClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [selectedTx, setSelectedTx] = useState<AssetTransaction | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const [deleteState, deleteAction, deletePending] = useActionState(deleteTransaction, INITIAL_STATE)

  useEffect(() => {
    if (deleteState.success) {
      setToastType('success')
      setToastMessage(deleteState.message || 'Xóa giao dịch thành công!')
      closeDeleteModal()
    } else if (deleteState.error) {
      setToastType('error')
      setToastMessage(deleteState.error)
    }
  }, [deleteState.success, deleteState.error])

  const totalPages = Math.max(1, Math.ceil(totalCount / limit))

  function navigateToPage(page: number) {
    if (page < 1 || page > totalPages) return
    router.push(`${pathname}?page=${page}`)
  }

  function openDelete(tx: AssetTransaction) {
    setSelectedTx(tx)
    setShowDeleteModal(true)
  }

  function closeDeleteModal() {
    setSelectedTx(null)
    setShowDeleteModal(false)
  }

  // Helper to format transaction type labels and styles
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'income':
        return { label: 'Thu nhập', bg: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' }
      case 'expense':
        return { label: 'Chi tiêu', bg: 'bg-rose-500/10 text-rose-500 border border-rose-500/20' }
      case 'buy':
        return { label: 'Mua tài sản', bg: 'bg-amber-500/10 text-amber-500 border border-amber-500/20' }
      case 'sell':
        return { label: 'Bán tài sản', bg: 'bg-blue-500/10 text-blue-500 border border-blue-500/20' }
      default:
        return { label: 'Giao dịch', bg: 'bg-slate-500/10 text-slate-500 border border-slate-500/20' }
    }
  }

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
          <ArrowLeftRight className="assets-page__title-icon" size={28} />
          <h1 className="assets-page__title">Lịch sử giao dịch</h1>
        </div>
        <div className="text-xs text-slate-400 font-semibold border border-glass-border bg-glass-bg px-3 py-1.5 rounded-full">
          Tổng cộng: {totalCount} giao dịch
        </div>
      </div>

      {/* ── Transactions Table ── */}
      {transactions.length === 0 ? (
        <div className="assets-empty">
          <div className="assets-empty__icon">📊</div>
          <h2 className="assets-empty__title">Chưa có lịch sử giao dịch nào</h2>
          <p className="assets-empty__desc">
            Các hoạt động mua bán tài sản hoặc hóa đơn thu chi của bạn sẽ xuất hiện tại đây.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="border border-glass-border bg-glass-bg backdrop-blur-md rounded-2xl shadow-card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-glass-border dark:bg-slate-900/10 bg-slate-50/20 text-xs uppercase tracking-wider text-slate-400 font-bold">
                    <th className="p-4 pl-6">Thời gian</th>
                    <th className="p-4">Phân loại</th>
                    <th className="p-4">Danh mục</th>
                    <th className="p-4">Ví/Nguồn</th>
                    <th className="p-4">Tài sản đích</th>
                    <th className="p-4">Mô tả / Ghi chú</th>
                    <th className="p-4 text-right pr-6">Giá trị / Số lượng</th>
                    <th className="p-4 text-right pr-6">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const badge = getTypeBadge(tx.type)
                    const category = tx.category
                    const categoryColor = category?.color || '#94a3b8'
                    const IconComp = (Icons as any)[category?.icon || 'HelpCircle'] || Icons.HelpCircle

                    const isUSD = tx.currency === 'USD'
                    const amountFormatted = isUSD
                      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)
                      : VND.format(tx.amount)

                    return (
                      <tr
                        key={tx.id}
                        className="border-b border-glass-border/60 hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors"
                      >
                        {/* Time */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Calendar size={13} />
                            <span>{new Date(tx.transaction_date).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </td>

                        {/* Transaction Type */}
                        <td className="p-4">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="p-4">
                          {category ? (
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${categoryColor}15` }}
                              >
                                <IconComp size={10} style={{ color: categoryColor }} />
                              </span>
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                {category.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500">-</span>
                          )}
                        </td>

                        {/* Wallet/Source Account */}
                        <td className="p-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {tx.type === 'buy' || tx.type === 'sell'
                            ? (tx.source_account?.name || 'Ví/Nguồn tiền')
                            : (tx.account?.name || 'Ví/Nguồn tiền')}
                        </td>

                        {/* Destination Account */}
                        <td className="p-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {tx.type === 'buy' || tx.type === 'sell'
                            ? (tx.account?.name || 'Tài sản')
                            : '-'}
                        </td>

                        {/* Description */}
                        <td className="p-4 text-xs text-slate-500 dark:text-slate-400 max-w-[150px] truncate">
                          {tx.description || '-'}
                        </td>

                        {/* Value / Quantity */}
                        <td className="p-4 text-right pr-6">
                          <div className="flex flex-col items-end">
                            <span className={`text-sm font-bold ${
                              tx.type === 'expense' || tx.type === 'sell'
                                ? 'text-rose-500'
                                : 'text-emerald-500'
                            }`}>
                              {tx.type === 'expense' || tx.type === 'sell' ? '-' : '+'}
                              {amountFormatted}
                            </span>
                            {tx.quantity > 1 && tx.type !== 'income' && tx.type !== 'expense' && (
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                Qty: {tx.quantity.toLocaleString('vi-VN', { maximumFractionDigits: 8 })} @ {isUSD ? '$' : '₫'}{tx.price_per_unit.toLocaleString('vi-VN')}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right pr-6">
                          <button
                            type="button"
                            onClick={() => openDelete(tx)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-glass-bg border border-transparent hover:border-glass-border rounded-lg transition-colors cursor-pointer"
                            title="Xóa giao dịch"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Pagination Controls ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <span className="text-xs text-slate-400 font-semibold">
                Trang {currentPage} / {totalPages} (Hiển thị {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, totalCount)} trong {totalCount})
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigateToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-glass-border bg-glass-bg dark:text-slate-400 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pNum = index + 1
                  const isCurrent = pNum === currentPage
                  return (
                    <button
                      key={pNum}
                      onClick={() => navigateToPage(pNum)}
                      className={`w-9 h-9 rounded-lg border text-xs font-bold flex items-center justify-center cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-violet-500 border-violet-500 text-white shadow-lg shadow-violet-500/20'
                          : 'border-glass-border bg-glass-bg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      {pNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => navigateToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-glass-border bg-glass-bg dark:text-slate-400 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal && selectedTx !== null}
        title="Xóa giao dịch"
        message={
          selectedTx
            ? `Bạn có chắc chắn muốn xóa giao dịch này? Số dư ví hoặc số lượng tài sản liên quan sẽ được tự động hoàn trả/điều chỉnh tương ứng.`
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
        onClose={closeDeleteModal}
      />
    </div>
  )
}
