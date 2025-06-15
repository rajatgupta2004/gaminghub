'use client'
import React, { useEffect, useState } from 'react'
import { Game } from '@/types'
import { X, Calendar, Clock, DollarSign, User, Mail, Phone, CheckCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface BookingModalProps {
  game: Game
  onClose: () => void
}

const BookingModal: React.FC<BookingModalProps> = ({ game, onClose }) => {


  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [groupedSlots, setGroupedSlots] = useState<Record<string, any[]>>({});
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const session = useSession();
  const user = session.data?.user;

   useEffect(() => {
    if (session.data?.user) {
      setCustomerInfo({
        name: session.data.user.name || '',
        email: session.data.user.email || '',
        phone: session.data.user.phone || ''
      })
    }
  }, [session.data?.user])

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);

        // Fetch timeslots
        const timeSlotsRes = await fetch(`/api/timeslots?gameId=${game.id}`);
        const timeSlotsData = await timeSlotsRes.json();
        setTimeSlots(timeSlotsData);

        // Fetch available slots
        const availableSlotsRes = await fetch(`/api/available-slots?gameId=${game.id}`);
        const availableSlotsData = await availableSlotsRes.json();
        setAvailableSlots(availableSlotsData);
        // Group slots
        const grouped = availableSlotsData.reduce((groups: Record<string, any[]>, slot: any) => {
          const date = slot.date;
          if (!groups[date]) groups[date] = [];
          groups[date].push(slot);
          return groups;
        }, {});

        setGroupedSlots(grouped);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load slots');
        console.error("Error fetching slots:", err);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [game.id]);



  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  // const timeSlots = await getTimeslots(game.id);
  // const availableSlots =await getAvailableSlotsForGame(game.id);


  const formatDate = (date: string) => {
    const dateObj = new Date(date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date === today.toISOString().split('T')[0]) {
      return 'Today'
    } else if (date === tomorrow.toISOString().split('T')[0]) {
      return 'Tomorrow'
    } else {
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      })
    }
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleBooking = async () => {
    if (!selectedSlot || !user) return;
    setIsBooking(true);
    
    const slot = timeSlots.find(s => s.id === selectedSlot);
    if (!slot) return;

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: selectedSlot,
          bookingData: {
            gameId: game.id,
            gameName: game.name,
            userId: user.id,
            userName: customerInfo.name,
            userEmail: customerInfo.email,
            userPhone: customerInfo.phone,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            price: game.price,
            status: 'confirmed'
          }
        })
      });

      if (response.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      console.error("Booking error:", error);
      // Add error handling UI here if needed
    } finally {
      setIsBooking(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600 mb-4">
            Your {game.name} session has been successfully booked.
          </p>
          <p className="text-sm text-gray-500">Closing automatically...</p>
        </div>
      </div>
    )
  }
   if (loadingSlots) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Game Info Skeleton */}
            <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>

            {/* Customer Info Skeleton */}
            <div className="space-y-4">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>

            {/* Time Slots Skeleton */}
            <div className="space-y-4">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="h-14 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Book {game.name}</h2>
                <p className="text-gray-600">{game.description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center space-x-2 text-red-700">
                <X className="w-5 h-5" />
                <div>
                  <p className="font-medium">Error loading time slots</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

   if (!session.data?.user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unauthorized</h3>
          <p className="text-gray-600 mb-4">Please sign in to book a session</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Book {game.name}</h2>
              <p className="text-gray-600">{game.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Game Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-lg font-bold text-green-600">${game.price}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-bold text-blue-600">{game.duration} min</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Time Slot Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time Slot</h3>

            {Object.keys(groupedSlots).length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No available slots for this game.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedSlots).map(([date, slots]) => (
                  <div key={date}>
                    <h4 className="font-medium text-gray-900 mb-2">{formatDate(date)}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.id)}
                          className={`p-3 text-center rounded-xl border-2 transition-all duration-200 ${selectedSlot === slot.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <div className="text-sm font-medium">
                            {formatTime(slot.startTime)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatTime(slot.endTime)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking Button */}
          <div className="pt-6 border-t border-gray-100">
            <button
              onClick={handleBooking}
              disabled={!selectedSlot || !customerInfo.name || !customerInfo.email || isBooking}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
            >
              {isBooking ? 'Booking...' : `Book Now - $${game.price}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingModal