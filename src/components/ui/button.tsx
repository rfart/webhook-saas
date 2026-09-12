'use client'

import { ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

type Variant = 'primary' | 'ghost' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 active:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
  icon: 'inline-flex items-center justify-center rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 active:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button className={twMerge(clsx(variants[variant], className))} {...props}>
      {children}
    </button>
  )
}
