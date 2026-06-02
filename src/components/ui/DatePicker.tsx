'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

interface DatePickerProps {
  selectedDate: string // Format: YYYY-MM-DD
  onChange: (date: string) => void
  name?: string
  id?: string
  className?: string
}

export default function DatePicker({
  selectedDate,
  onChange,
  name,
  id,
  className = '',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Current year/month shown in the calendar dropdown
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth()) // 0-indexed (0 = January)

  // Sync year/month with selectedDate when selectedDate changes externally
  useEffect(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-')
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10)
        const m = parseInt(parts[1], 10) - 1
        if (!isNaN(y) && !isNaN(m)) {
          setCurrentYear(y)
          setCurrentMonth(m)
        }
      }
    }
  }, [selectedDate])

  // Close calendar dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Get total days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get weekday of first day in month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  // Helper to format Date back to YYYY-MM-DD in local time
  const formatDateString = (year: number, month: number, day: number) => {
    const y = year
    const m = String(month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // Handle day click
  const handleDayClick = (day: number) => {
    const formatted = formatDateString(currentYear, currentMonth, day)
    onChange(formatted)
    setIsOpen(false)
  }

  // Navigate to previous month
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((prev) => prev - 1)
    } else {
      setCurrentMonth((prev) => prev - 1)
    }
  }

  // Navigate to next month
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((prev) => prev + 1)
    } else {
      setCurrentMonth((prev) => prev + 1)
    }
  }

  // Set today
  const handleSetToday = () => {
    const today = new Date()
    const formatted = formatDateString(today.getFullYear(), today.getMonth(), today.getDate())
    onChange(formatted)
    setIsOpen(false)
  }

  // Weekday labels in Vietnamese
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ]

  // Render days array
  const dayElements = []
  // Empty slots for days of prev month
  for (let i = 0; i < firstDay; i++) {
    dayElements.push(<div key={`empty-${i}`} className="w-8 h-8" />)
  }
  // Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDateString(currentYear, currentMonth, day)
    const isSelected = selectedDate === dateStr
    const today = new Date()
    const isToday = formatDateString(today.getFullYear(), today.getMonth(), today.getDate()) === dateStr

    dayElements.push(
      <button
        key={`day-${day}`}
        type="button"
        onClick={() => handleDayClick(day)}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer hover:scale-110 active:scale-95 ${
          isSelected
            ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-500/20'
            : isToday
              ? 'border border-violet-500 text-violet-500 font-semibold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        {day}
      </button>
    )
  }

  // Pretty display for trigger button (DD/MM/YYYY)
  const displayValue = () => {
    if (!selectedDate) return 'Chọn ngày'
    const parts = selectedDate.split('-')
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`
    }
    return selectedDate
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Hidden input to automatically integrate with standard HTML form action submissions */}
      <input type="hidden" name={name} id={id} value={selectedDate} />

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between form-input cursor-pointer hover:border-violet-500/50 transition-colors"
        style={{ minHeight: '2.75rem', padding: '0.625rem 0.875rem', textAlign: 'left' }}
      >
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {displayValue()}
        </span>
        <Calendar size={16} className="text-slate-400 dark:text-slate-500" />
      </button>

      {/* Glassmorphic Dropdown */}
      {isOpen && (
        <div
          className="absolute z-50 mt-2 left-0 w-[280px] p-4 rounded-2xl border border-white/20 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl transition-all duration-200 origin-top-left animate-fade-in-up"
          style={{
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Header controls */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {weekdays.map((w, idx) => (
              <span
                key={w}
                className={`text-[10px] font-bold ${
                  idx === 0 ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {w}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center mb-3">
            {dayElements}
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex justify-between items-center">
            <button
              type="button"
              onClick={handleSetToday}
              className="text-xs font-semibold text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors cursor-pointer"
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
