'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

interface Props {
  user: User
}

export function UserMenu({ user }: Props) {
  const [open, setOpen] = useState(false)
  const avatarUrl: string = user.user_metadata?.avatar_url ?? ''
  const email = user.email ?? ''
  const name: string = user.user_metadata?.full_name ?? user.user_metadata?.name ?? email

  async function handleSignOut() {
    const supabase = createBrowserSupabaseClient()
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="User menu"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name} className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl z-50">
          <div className="px-4 py-3 border-b border-zinc-800">
            <p className="text-sm font-medium text-zinc-100 truncate">{name}</p>
            <p className="text-xs text-zinc-500 truncate">{email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2.5 text-left text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-b-xl transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
