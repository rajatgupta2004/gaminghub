'use client'

import React, { useEffect, useState } from 'react'
import { Game, TimeSlot } from '@/types'
import { Gamepad2, Clock, DollarSign, Calendar, MapPin, X } from 'lucide-react'

interface GameCardProps {
  game: Game
  onBook: () => void
}

const GameCard: React.FC<GameCardProps> = ({ game, onBook }) => {

  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [nextAvailableSlot, setNextAvailableSlot] = useState<TimeSlot | null>(null)


  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/available-slots?gameId=${game.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch available slots')
        }
        const slots = await response.json()
        setAvailableSlots(slots)

        // Find the next available slot
        const today = new Date().toISOString().split('T')[0]
        const upcomingSlots = slots.filter(
          (slot: TimeSlot) => slot.date >= today && !slot.isBooked
        )

        setNextAvailableSlot(upcomingSlots.length > 0 ? upcomingSlots[0] : null)
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Failed to load slots')
        console.error("Error fetching slots:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAvailableSlots()
  }, [game.id])

  const today = new Date().toISOString().split('T')[0]

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

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
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }


    if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6">
          {/* Game Header Skeleton */}
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>

          {/* Next Available Slot Skeleton */}
          <div className="h-16 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>

          {/* Button Skeleton */}
          <div className="h-14 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{game.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{game.description}</p>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl p-3 mb-4 border border-red-100">
            <div className="flex items-center space-x-2 text-red-700">
              <X className="w-4 h-4" />
              <div>
                <p className="text-sm font-medium">Error loading slots</p>
                <p className="text-xs">{error}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }


  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{game.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{game.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 rounded-xl p-3 border border-green-100">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-lg font-bold text-green-600">${game.price}</p>
                <p className="text-xs text-green-700">per session</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-lg font-bold text-blue-600">{game.duration}min</p>
                <p className="text-xs text-blue-700">duration</p>
              </div>
            </div>
          </div>
        </div>

        {nextAvailableSlot ? (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 mb-4 border border-green-100">
            <div className="flex items-center space-x-2 text-green-700">
              <Calendar className="w-4 h-4" />
              <div>
                <p className="text-sm font-medium">Next Available</p>
                <p className="text-xs">
                  {formatDate(nextAvailableSlot.date)} at {formatTime(nextAvailableSlot.startTime)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3 mb-4 border border-yellow-100">
            <div className="flex items-center space-x-2 text-yellow-700">
              <Calendar className="w-4 h-4" />
              <div>
                <p className="text-sm font-medium">No slots available</p>
                <p className="text-xs">Check back later</p>
              </div>
            </div>
          </div>
        )}

        {availableSlots.length > 0 ? (
          <button
            onClick={onBook}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
          >
            Book Now ({availableSlots.length} slots available)
          </button>
        ) : (
          <button
            disabled
            className="w-full py-4 px-6 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed font-medium text-lg"
          >
            No Slots Available
          </button>
        )}
      </div>
    </div>
  )
}

export default GameCard