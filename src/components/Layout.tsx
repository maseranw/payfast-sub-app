import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { LogOut, User, CreditCard, Home, Moon, Sun, Mail, UserCircle } from 'lucide-react'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, userProfile, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Subscribe', href: '/subscribe', icon: CreditCard },
    { name: 'Profile', href: '/profile', icon: UserCircle },
    { name: 'Contact', href: '/contact', icon: Mail },
  ]

  const isActive = (href: string) => {
    return location.pathname === href
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {user && (
        <header className="bg-white/95 dark:bg-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-100 dark:border-neutral-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center">
                <Link
                  to="/dashboard"
                  className="text-xl font-black uppercase tracking-tight text-neutral-950 dark:text-white transition-transform duration-150 hover:scale-105 active:scale-95 inline-block"
                >
                  Sub<span className="text-blue-600 dark:text-blue-400">App</span>
                </Link>
              </div>

              <nav className="hidden sm:flex items-center gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-150 hover:scale-105 active:scale-95 ${
                        isActive(item.href)
                          ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={2} />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-150 hover:scale-105 active:scale-95"
                  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? <Sun className="w-5 h-5" strokeWidth={2} /> : <Moon className="w-5 h-5" strokeWidth={2} />}
                </button>
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-150 hover:scale-105 active:scale-95"
                >
                  <User className="w-4 h-4 text-neutral-500 dark:text-neutral-400" strokeWidth={2} />
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {userProfile?.first_name} {userProfile?.last_name}
                  </span>
                </Link>
                <Link to="/profile" className="sm:hidden flex items-center gap-2 active:scale-95 transition-transform duration-150">
                  <User className="w-5 h-5 text-neutral-500 dark:text-neutral-400" strokeWidth={2} />
                  <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {userProfile?.first_name}
                  </span>
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-150 hover:scale-105 active:scale-95"
                >
                  <LogOut className="w-4 h-4" strokeWidth={2} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>

            <div className="sm:hidden border-t border-neutral-100 dark:border-neutral-900 py-3">
              <nav className="flex gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-150 active:scale-95 flex-1 ${
                        isActive(item.href)
                          ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={2} />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default Layout
