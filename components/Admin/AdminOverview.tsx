'use client'

import React, { useEffect, useState } from 'react'
import { Gamepad2, Calendar, DollarSign, Users, TrendingUp, Clock, X } from 'lucide-react'
import { Booking, Game, TimeSlot } from '@/types'

const AdminOverview: React.FC = () => {
   const [games, setGames] = useState<Game[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch all data in parallel
        const [gamesRes, bookingsRes, timeSlotsRes] = await Promise.all([
          fetch('/api/games'),
          fetch('/api/bookings/all'),
          fetch('/api/timeslots/all')
        ])

        if (!gamesRes.ok || !bookingsRes.ok || !timeSlotsRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const [gamesData, bookingsData, timeSlotsData] = await Promise.all([
          gamesRes.json(),
          bookingsRes.json(),
          timeSlotsRes.json()
        ])

        setGames(gamesData)
        setBookings(bookingsData)
        setTimeSlots(timeSlotsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])





  const activeGames = games.filter(g => g.isActive).length
  const totalBookings = bookings.filter(b => b.status === 'confirmed').length
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, booking) => sum + booking.price, 0)
  
  const today = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter(b => 
    b.status === 'confirmed' && b.date === today
  ).length

  const upcomingSlots = timeSlots.filter(slot => 
    slot.date >= today && !slot.isBooked
  ).length

  const recentBookings = bookings
    .filter(b => b.status === 'confirmed')
    .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime())
    .slice(0, 5)

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }



    if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading data</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{activeGames}</p>
              <p className="text-xs text-blue-700">Active Games</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">${totalRevenue}</p>
              <p className="text-xs text-green-700">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{totalBookings}</p>
              <p className="text-xs text-purple-700">Total Bookings</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{todayBookings}</p>
              <p className="text-xs text-orange-700">Today's Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Slots */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Available Slots</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-3xl font-bold text-blue-600">{upcomingSlots}</p>
          <p className="text-sm text-gray-600">Slots ready for booking</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
        </div>
        
        {recentBookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No recent bookings</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{booking.userName}</p>
                  <p className="text-sm text-gray-600">{booking.gameName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(booking.date)} at {formatTime(booking.startTime)}
                  </p>
                  <p className="text-sm text-green-600 font-bold">${booking.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOverview