'use client'

import React, { useState } from 'react'

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

export default function RippleButton({
  children,
  className = '',
  onClick,
  disabled,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return

    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    
    // Calculate ripple size as diameter based on max dimension to cover entire button
    const size = Math.max(rect.width, rect.height)
    
    // Get mouse coordinates relative to button
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
    }

    setRipples((prev) => [...prev, newRipple])

    // Cleanup after animation completes (600ms)
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 600)

    if (onClick) {
      onClick(event)
    }
  }

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={createRipple}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Translucent ripple spans - inherits button text color for perfect contrast */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-current/20 animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
      <span className="relative z-10 flex items-center justify-center gap-2 w-full">
        {children}
      </span>
    </button>
  )
}
