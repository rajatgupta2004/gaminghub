'use client'
import React, { useEffect, useState } from 'react'
import { User, Mail, Phone, Calendar, DollarSign, Trophy, LogOut, Edit3, Save, X, Loader2, Check } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { Booking } from '@/types'
interface BookingStats {
  confirmedBookings: Booking[]
  totalSpent: number
  upcomingBookings: number
}

const UserProfile: React.FC = () => {
  const session = useSession();
  if (!session.data?.user) {
    return <div>not authorized</div>
  }
  const user = session.data.user;
  const [stats, setStats] = useState<BookingStats>({
    confirmedBookings: [],
    totalSpent: 0,
    upcomingBookings: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    phone: ''
  })
  const [isSaving, setIsSaving] = useState(false);
  //  const [isGenerating, setIsGenerating] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    if (session.data?.user) {
      setEditData({
        name: session.data.user.name || '',
        phone: session.data.user.phone || ''
      })

      // Fetch booking stats
      const fetchStats = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/users/${session.data.user.id}/stats`)
          if (!response.ok) throw new Error('Failed to fetch stats')
          const data = await response.json()

          setStats({
            confirmedBookings: data.confirmedBookings,
            totalSpent: data.totalSpent,
            upcomingBookings: data.upcomingBookings
          })
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to load profile data')
          console.error("Error fetching stats:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchStats()
    }
  }, [session.data?.user])


  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Profile Card Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>

        {/* Logout Button Skeleton */}
        <div className="h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Profile Card (still shows basic info even with stats error) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* ... existing profile card UI ... */}
        </div>

        {/* Error Message */}
        <div className="text-center py-6 bg-red-50 rounded-2xl border border-red-200">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading stats</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors duration-200 border border-red-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    )
  }



  const handleSave = async () => {
    try {
      setIsEditing(true); // Set editing state to show loading

      const response = await fetch(`/api/users/${session.data?.user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editData.name,
          phone: editData.phone
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();

      // Update session data if needed (you might need to implement this in your auth provider)
      // For NextAuth.js, you might need to trigger a session update:
      await session.update({
        ...session.data,
        user: {
          ...session.data?.user,
          name: updatedUser.name,
          phone: updatedUser.phone
        }
      });

      // Show success feedback
      setNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);

      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update profile'
      });

      // Revert to original values
      setEditData({
        name: session.data?.user?.name || '',
        phone: session.data?.user?.phone || ''
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      phone: user?.phone || ''
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6 relative">
      {/* Profile Card */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-down ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 capitalize">{user.role} Account</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{user.name}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">{user.email}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{user.phone || 'Not provided'}</span>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.upcomingBookings}</p>
              <p className="text-xs text-green-700">Upcoming</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">${stats.totalSpent}</p>
              <p className="text-xs text-blue-700">Total Spent</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Trophy className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{stats.confirmedBookings.length}</p>
            <p className="text-xs text-purple-700">Total Bookings</p>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => signOut()}
        className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors duration-200 border border-red-200"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Sign Out</span>
      </button>
    </div>
  )
}

export default UserProfile