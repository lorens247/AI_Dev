"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/auth/user-menu"
import { useAuth } from "@/contexts/auth-context"

export function Navigation() {
  const { user, loading, signOut } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    setIsUserMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PollApp
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/polls" 
              className="nav-link text-base font-medium"
            >
              📊 Browse Polls
            </Link>
            {user && (
              <Link 
                href="/polls/create" 
                className="nav-link text-base font-medium"
              >
                ✨ Create Poll
              </Link>
            )}
            <Link 
              href="/about" 
              className="nav-link text-base font-medium"
            >
              ℹ️ About
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            ) : user ? (
              <UserMenu 
                user={{
                  id: user.id,
                  name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                  email: user.email || ''
                }} 
                onLogout={handleLogout}
              />
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild className="btn-ghost">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild className="btn-primary">
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
