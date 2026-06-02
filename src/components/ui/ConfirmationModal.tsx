'use client'

import React, { useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import RippleButton from './RippleButton'

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isPending?: boolean
  onConfirm: () => void | Promise<void>
  onClose: () => void
  isDanger?: boolean
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  isPending = false,
  onConfirm,
  onClose,
  isDanger = false,
}: ConfirmationModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Escape key listener for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="modal-overlay z-[100] flex items-center justify-center animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal modal--sm max-w-md w-full mx-4 border border-glass-border bg-glass-bg backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-5 border-b border-glass-border">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDanger ? 'bg-rose-500/10 text-rose-500' : 'bg-violet-500/10 text-violet-500'}`}>
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-6">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg border border-transparent hover:border-glass-border transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 p-4 border-t border-glass-border dark:bg-slate-900/10 bg-slate-50/20">
          <RippleButton
            type="button"
            onClick={onClose}
            className="btn btn--ghost min-h-[2.5rem] px-4 py-2 text-sm font-semibold rounded-xl border border-glass-border text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            disabled={isPending}
          >
            {cancelText}
          </RippleButton>
          <RippleButton
            type="button"
            onClick={onConfirm}
            className={`btn min-h-[2.5rem] px-4 py-2 text-sm font-bold text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/10'
                : 'bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-600/10'
            }`}
            disabled={isPending}
          >
            {isPending ? 'Đang xử lý...' : confirmText}
          </RippleButton>
        </div>
      </div>
    </div>
  )
}
