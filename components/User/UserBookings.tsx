'use client'
import React, { useEffect, useState } from 'react'
import { Calendar, Clock, DollarSign, MapPin, X, CheckCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Booking } from '@/types'

const UserBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const session = useSession();
    if (!session.data?.user) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unauthorized</h3>
        <p className="text-gray-600">Please sign in to view your bookings</p>
      </div>
    )
  }

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session.data?.user) return

      try {
        setLoading(true)
        const response = await fetch(`/api/bookings?userId=${session.data.user.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch bookings')
        }
        const data = await response.json()
        setBookings(data)
      } catch (err) {
        console.error('Error fetching bookings:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [session.data?.user])

  const upcomingBookings = bookings.filter(booking =>
    booking.status === 'confirmed' &&
    new Date(`${booking.date}T${booking.startTime}`) > new Date()
  )
  const pastBookings = bookings.filter(booking =>
    booking.status === 'confirmed' &&
    new Date(`${booking.date}T${booking.startTime}`) <= new Date()
  )
  const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled')

  const handleCancelBooking = (bookingId: string, gameName: string) => {
    if (window.confirm(`Are you sure you want to cancel your ${gameName} booking?`)) {
      // cancelBooking(bookingId)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const BookingCard = ({ booking, showCancel = false }: { booking: any; showCancel?: boolean }) => (
    <div className={`bg-white rounded-2xl shadow-sm border-2 p-6 transition-all duration-200 hover:shadow-lg ${booking.status === 'confirmed'
      ? 'border-green-200 hover:border-green-300'
      : 'border-red-200 hover:border-red-300'
      }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{booking.gameName}</h3>
          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
            }`}>
            {booking.status === 'confirmed' ? (
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Confirmed</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <X className="w-3 h-3" />
                <span>Cancelled</span>
              </div>
            )}
          </span>
        </div>

        {showCancel && booking.status === 'confirmed' && (
          <button
            onClick={() => handleCancelBooking(booking.id, booking.gameName)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Cancel booking"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
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
  )



  if (loading) {
    return (
      <div className="space-y-8">
        {/* Upcoming Bookings Skeleton */}
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Past Bookings Skeleton */}
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
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
    )
  }


  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
        <p className="text-gray-600">Your bookings will appear here once you make a reservation.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Bookings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingBookings
              .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime())
              .map((booking) => (
                <BookingCard key={booking.id} booking={booking} showCancel={true} />
              ))}
          </div>
        </div>
      )}

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Past Bookings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pastBookings
              .sort((a, b) => new Date(`${b.date}T${b.startTime}`).getTime() - new Date(`${a.date}T${a.startTime}`).getTime())
              .map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
          </div>
        </div>
      )}

      {/* Cancelled Bookings */}
      {cancelledBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cancelled Bookings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cancelledBookings
              .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime())
              .map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserBookings