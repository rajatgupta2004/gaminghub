'use client'

import React, { useState } from 'react'
import AdminOverview from './AdminOverview'
import GameManagement from './GameManagement'
import TimeSlotManagement from './TimeSlotManagement'
import BookingsOverview from './BookingsOverview'
import MobileHeader from '@/components/Layout/MobileHeader'
import BottomNavigation from '@/components/Layout/BottomNavigation'

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Dashboard'
      case 'games': return 'Game Management'
      case 'slots': return 'Time Slots'
      case 'bookings': return 'Bookings'
      default: return 'Admin Panel'
    }
  }
  
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />
      case 'games':
        return <GameManagement />
      case 'slots':
        return <TimeSlotManagement />
      case 'bookings':
        return <BookingsOverview />
      default:
        return <AdminOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      <MobileHeader title={getHeaderTitle()} showNotifications={true} />
      
      <main className="px-4 py-6">
        {renderContent()}
      </main>

      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        userRole="admin" 
      />
    </div>
  )
}

export default AdminDashboard