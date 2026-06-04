'use client'

import React from 'react'

interface FormattedAmountInputProps {
  id?: string
  name: string
  currency: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  disabled?: boolean
}

export function cleanAmount(val: string, currency: string): string {
  if (!val) return ''
  if (currency === 'VND') {
    return val.replace(/\D/g, '')
  } else {
    // Allow digits and single decimal point
    const temp = val.replace(/[^\d.]/g, '')
    const parts = temp.split('.')
    const integerPart = parts[0]
    const decimalPart = parts.slice(1).join('')
    return parts.length > 1 ? `${integerPart}.${decimalPart}` : integerPart
  }
}

export function formatAmount(cleanVal: string, currency: string): string {
  if (!cleanVal) return ''
  if (currency === 'VND') {
    return cleanVal.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  } else {
    const parts = cleanVal.split('.')
    const integerPart = parts[0]
    const decimalPart = parts[1]
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.length > 1 ? `${formattedInteger}.${decimalPart}` : formattedInteger
  }
}

export default function FormattedAmountInput({
  id,
  name,
  currency,
  value,
  onChange,
  placeholder = '0',
  required = false,
  className = '',
  disabled = false,
}: FormattedAmountInputProps) {
  const displayVal = formatAmount(value, currency)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const { selectionStart, selectionEnd, value: currentVal } = input
    if (selectionStart === null || selectionEnd === null) return

    const separator = currency === 'VND' ? '.' : ','

    if (e.key === 'Backspace') {
      if (selectionStart === selectionEnd && selectionStart > 0) {
        if (currentVal[selectionStart - 1] === separator) {
          // Adjust cursor position to delete the digit preceding the separator instead of the separator itself
          input.setSelectionRange(selectionStart - 1, selectionStart - 1)
        }
      }
    } else if (e.key === 'Delete') {
      if (selectionStart === selectionEnd && selectionStart < currentVal.length) {
        if (currentVal[selectionStart] === separator) {
          // Adjust cursor position to delete the digit succeeding the separator instead of the separator itself
          input.setSelectionRange(selectionStart + 1, selectionStart + 1)
        }
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const typedVal = input.value
    const selectionStart = input.selectionStart ?? 0

    const separator = currency === 'VND' ? '.' : ','
    let dataCharsBeforeCursor = 0
    for (let i = 0; i < selectionStart; i++) {
      if (typedVal[i] !== separator) {
        dataCharsBeforeCursor++
      }
    }

    const clean = cleanAmount(typedVal, currency)
    const formatted = formatAmount(clean, currency)

    onChange(clean)

    // Schedule selection restore after React update
    setTimeout(() => {
      let newCursorPos = 0
      let dataCharsCount = 0
      while (newCursorPos < formatted.length && dataCharsCount < dataCharsBeforeCursor) {
        if (formatted[newCursorPos] !== separator) {
          dataCharsCount++
        }
        newCursorPos++
      }
      input.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <input
        id={id}
        type="text"
        className={className}
        value={displayVal}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </>
  )
}
