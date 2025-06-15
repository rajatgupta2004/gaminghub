'use client'

import React from 'react'
import { Gamepad2, Calendar, User, Settings, Home, Clock, BarChart3 } from 'lucide-react'

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userRole: 'admin' | 'user'
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange, userRole }) => {
  const userTabs = [
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'slots', label: 'Slots', icon: Clock },
    { id: 'bookings', label: 'Bookings', icon: Calendar }
  ]

  const tabs = userRole === 'admin' ? adminTabs : userTabs

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
              activeTab === tab.id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className={`w-5 h-5 mb-1 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'}`} />
            <span className={`text-xs font-medium truncate ${
              activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default BottomNavigation