'use client'

import React, { useEffect, useState } from 'react'
import { Calendar, User, Phone, Mail, DollarSign, Clock, Filter, X } from 'lucide-react'
import { Booking, Game } from '@/types'

const BookingsOverview: React.FC = () => {
  // const { bookings, games, cancelBooking } = useApp()

    const [bookings, setBookings] = useState<Booking[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'cancelled'>('all')
  const [filterGame, setFilterGame] = useState<string>('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch bookings and games in parallel
        const [bookingsRes, gamesRes] = await Promise.all([
          fetch('/api/bookings/all'),
          fetch('/api/games')
        ])

        if (!bookingsRes.ok || !gamesRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const [bookingsData, gamesData] = await Promise.all([
          bookingsRes.json(),
          gamesRes.json()
        ])

        setBookings(bookingsData)
        setGames(gamesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
          <div className="h-12 w-48 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-5 w-24 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>

        {/* Bookings Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border-2 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-6 w-40 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="space-y-3">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="flex items-center space-x-3">
                    <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3">
                  <div className="h-6 w-20 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading bookings</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }


  const filteredBookings = bookings.filter(booking => {
    const statusMatch = filterStatus === 'all' || booking.status === filterStatus
    const gameMatch = filterGame === 'all' || booking.gameId === filterGame
    return statusMatch && gameMatch
  })

 const handleCancelBooking = async (bookingId: string, userName: string) => {
  if (window.confirm(`Are you sure you want to cancel ${userName}'s booking?`)) {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.error || 'Failed to cancel booking'
        
        // Handle specific error cases
        if (response.status === 404) {
          // Booking not found - remove from local state
          setBookings(prev => prev.filter(b => b.id !== bookingId))
        }
        
        throw new Error(errorMessage)
      }

      const updatedBooking = await response.json()
      
      // Update local state with the returned booking data
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId ? updatedBooking : booking
        )
      )
      
      alert(`Booking for ${userName} has been cancelled successfully!`)
    } catch (err) {
      console.error('Error cancelling booking:', err)
      alert(err instanceof Error ? err.message : 'Failed to cancel booking. Please try again.')
    }
  }
}
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, booking) => sum + booking.price, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bookings Overview</h2>
          <p className="text-gray-600">Manage all customer bookings</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-xl">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-gray-700">Total Revenue:</span>
          <span className="text-lg font-bold text-green-600">${totalRevenue.toFixed(2)}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Game</label>
            <select
              value={filterGame}
              onChange={(e) => setFilterGame(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Games</option>
              {games.map(game => (
                <option key={game.id} value={game.id}>{game.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {bookings.length === 0 
              ? "No bookings have been made yet." 
              : "No bookings match your current filters."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBookings
            .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime())
            .map((booking) => (
              <div
                key={booking.id}
                className={`bg-white rounded-2xl shadow-sm border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                  booking.status === 'confirmed'
                    ? 'border-green-200 hover:border-green-300'
                    : 'border-red-200 hover:border-red-300'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{booking.gameName}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id, booking.userName)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Cancel booking"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{booking.userName}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{booking.userEmail}</span>
                  </div>
                  
                  {booking.userPhone && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{booking.userPhone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(booking.date)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-lg font-bold text-green-600">${booking.price}</span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Booked: {new Date(booking.bookedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default BookingsOverview