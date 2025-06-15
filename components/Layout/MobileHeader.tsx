'use client'

import React, { useState, useRef, useEffect } from 'react'
import { LogOut, User, Shield, Bell } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

interface MobileHeaderProps {
  title: string
  showNotifications?: boolean
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ title, showNotifications = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const session = useSession()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!session.data?.user) return <div>unauthorized...</div>
  const user = session.data.user

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div className="bg-white shadow-sm border-b border-gray-100 px-4 py-3 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
            {user && (
              <p className="text-xs text-gray-500">Welcome, {user.name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {showNotifications && (
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Bell className="w-5 h-5" />
            </button>
          )}
          
          <div 
            className="relative"
            ref={dropdownRef}
          >
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                {user.image ? (
                  <img 
                    src={user.image} 
                    alt={user.name || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-medium">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <span className='hover:text-red-600 text-left flex items-center space-x-2'>
                  <LogOut className="w-4 h-4 " />
                  <span>Logout</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileHeader