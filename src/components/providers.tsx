'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

// --- THEME CONTEXT ---
type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark') // Default to premium dark mode

  useEffect(() => {
    // Read from localStorage on mount
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Fallback to media query if nothing saved
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// --- LANGUAGE / LOCALIZATION CONTEXT ---
type Locale = 'vi' | 'en'

const translations = {
  vi: {
    // Auth Shared
    appName: 'Personal Finance',
    tagline: 'Quản lý thu chi cá nhân thông minh',
    email: 'Địa chỉ Email',
    password: 'Mật khẩu',
    forgotPassword: 'Quên mật khẩu?',
    loadingAuth: 'Đang xác thực...',
    loadingReg: 'Đang đăng ký...',
    
    // Login Page
    loginTitle: 'Đăng nhập',
    loginSubtitle: 'Nhập tài khoản của bạn để truy cập hệ thống quản lý thu chi',
    loginButton: 'Đăng nhập',
    noAccount: 'Chưa có tài khoản?',
    signUpFree: 'Đăng ký miễn phí',

    // Register Page
    registerTitle: 'Đăng ký tài khoản',
    registerSubtitle: 'Tạo tài khoản mới để bắt đầu thiết lập tài chính thông minh',
    fullName: 'Họ và Tên',
    fullNamePlaceholder: 'Nguyễn Văn A',
    registerButton: 'Đăng ký tài khoản',
    hasAccount: 'Đã có tài khoản?',
    signInNow: 'Đăng nhập ngay',
    regSuccess: 'Đăng ký thành công!',
    regSuccessDesc: 'Tài khoản của bạn đã được khởi tạo thành công.',
    
    // Dashboard
    welcome: 'Chào mừng trở lại',
    overview: 'Dưới đây là tổng quan tài chính cá nhân của bạn ngày hôm nay.',
    totalBalance: 'Tổng số dư',
    monthlyIncome: 'Thu nhập tháng này',
    monthlyExpense: 'Chi tiêu tháng này',
    lastUpdated: 'Cập nhật gần nhất: vừa xong',
    transactionCount: '{{count}} giao dịch',
    noTransactions: 'Chưa có dữ liệu giao dịch',
    dashboardEmptyStateDesc: 'Tài khoản của bạn đã được kết nối an toàn với Supabase Auth. Hãy bắt đầu quản lý danh mục và tạo giao dịch đầu tiên.',
    addTransaction: 'Thêm giao dịch mới',
    manageCategories: 'Quản lý danh mục',
    signOut: 'Đăng xuất',
  },
  en: {
    // Auth Shared
    appName: 'Personal Finance',
    tagline: 'Smart personal finance management',
    email: 'Email Address',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    loadingAuth: 'Authenticating...',
    loadingReg: 'Creating account...',
    
    // Login Page
    loginTitle: 'Sign In',
    loginSubtitle: 'Enter your credentials to access your finance dashboard',
    loginButton: 'Sign In',
    noAccount: "Don't have an account?",
    signUpFree: 'Register for free',

    // Register Page
    registerTitle: 'Create Account',
    registerSubtitle: 'Create a new account to start smart financial planning',
    fullName: 'Full Name',
    fullNamePlaceholder: 'John Doe',
    registerButton: 'Create Account',
    hasAccount: 'Already have an account?',
    signInNow: 'Sign in now',
    regSuccess: 'Registered Successfully!',
    regSuccessDesc: 'Your account has been created successfully.',
    
    // Dashboard
    welcome: 'Welcome back',
    overview: 'Here is your personal finance overview for today.',
    totalBalance: 'Total Balance',
    monthlyIncome: 'Monthly Income',
    monthlyExpense: 'Monthly Expenses',
    lastUpdated: 'Last updated: just now',
    transactionCount: '{{count}} transactions',
    noTransactions: 'No transactions yet',
    dashboardEmptyStateDesc: 'Your account is securely connected to Supabase Auth. Start managing categories and make your first transaction.',
    addTransaction: 'Add New Transaction',
    manageCategories: 'Manage Categories',
    signOut: 'Sign Out',
  },
}

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: keyof typeof translations['vi'], replace?: { count?: number }) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('vi')

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale | null
    if (savedLocale) {
      setLocaleState(savedLocale)
    } else {
      const browserLang = navigator.language.startsWith('en') ? 'en' : 'vi'
      setLocaleState(browserLang)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  const t = (key: keyof typeof translations['vi'], replace?: { count?: number }): string => {
    const text = translations[locale][key] || translations['vi'][key] || ''
    if (replace && replace.count !== undefined) {
      return text.replace('{{count}}', replace.count.toString())
    }
    return text
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// --- MASTER PROVIDER CONTAINER ---
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  )
}
