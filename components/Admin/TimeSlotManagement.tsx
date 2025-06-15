'use client'

import React, { useEffect, useState } from 'react'
import { Clock, Calendar, Plus, Trash2, X, Check, Loader2 } from 'lucide-react'
import { Game } from '@/types'
import { TimeSlot } from '@/app/generated/prisma'

const TimeSlotManagement: React.FC = () => {
  const [games, setGames] = useState<Game[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedGame, setSelectedGame] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [timeSlotInputs, setTimeSlotInputs] = useState([{ startTime: '09:00', endTime: '10:00' }])

  const [isGenerating, setIsGenerating] = useState(false)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [gamesRes, timeSlotsRes] = await Promise.all([
          fetch('/api/games'),
          fetch('/api/timeslots/all')
        ])

        if (!gamesRes.ok || !timeSlotsRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const [gamesData, timeSlotsData] = await Promise.all([
          gamesRes.json(),
          timeSlotsRes.json()
        ])

        setGames(gamesData)
        setTimeSlots(timeSlotsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])


  const handleAddTimeSlot = () => {
    setTimeSlotInputs([...timeSlotInputs, { startTime: '09:00', endTime: '10:00' }])
  }

  const handleRemoveTimeSlot = (index: number) => {
    setTimeSlotInputs(timeSlotInputs.filter((_, i) => i !== index))
  }
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleTimeSlotChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const updated = timeSlotInputs.map((slot, i) =>
      i === index ? { ...slot, [field]: value } : slot
    )
    setTimeSlotInputs(updated)
  }

  const handleGenerateSlots = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGame) return;
    setIsGenerating(true)


    try {
      const response = await fetch('/api/timeslots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: selectedGame,
          date: selectedDate,
          slots: timeSlotInputs
        })
      })

      if (!response.ok) throw new Error('Failed to generate time slots')

      const newSlots = await response.json()
      setTimeSlots([...timeSlots, ...newSlots]);
      setTimeSlotInputs([{ startTime: '09:00', endTime: '10:00' }]);
      setNotification({
        type: 'success',
        message: 'Time slots created successfully!'
      })
    } catch (err) {
      console.error('Error generating slots:', err)
       setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to generate time slots'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getGameSlots = (gameId: string, date: string) => {
    return timeSlots.filter(slot => slot.gameId === gameId && slot.date === date)
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
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
    <div className="space-y-8 relative">
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

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Time Slot Management</h2>
        <p className="text-gray-600">Generate and manage time slots for your games</p>
      </div>

      {/* Generate Time Slots Form */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Time Slots</h3>


        <form onSubmit={handleGenerateSlots} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Game
              </label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a game...</option>
                {games.filter(game => game.isActive).map(game => (
                  <option key={game.id} value={game.id}>{game.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Time Slots
              </label>
              <button
                type="button"
                onClick={handleAddTimeSlot}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Slot</span>
              </button>
            </div>

            <div className="space-y-3">
              {timeSlotInputs.map((slot, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="flex-1">
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {timeSlotInputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTimeSlot(index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Slots...</span>
              </>
            ) : (
              <span>Generate Time Slots</span>
            )}
          </button>
        </form>
      </div>

      {/* Existing Time Slots */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Time Slots</h3>

        {games.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No games available. Add games first to create time slots.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {games.filter(game => game.isActive).map(game => {
              const today = new Date().toISOString().split('T')[0]
              const upcomingDates = Array.from(new Set(
                timeSlots
                  .filter(slot => slot.gameId === game.id && slot.date >= today)
                  .map(slot => slot.date)
              )).sort()

              return (
                <div key={game.id} className="bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">{game.name}</h4>

                    {upcomingDates.length === 0 ? (
                      <p className="text-gray-500 italic">No upcoming time slots</p>
                    ) : (
                      <div className="space-y-4">
                        {upcomingDates.map(date => {
                          const slots = getGameSlots(game.id, date)
                          return (
                            <div key={date}>
                              <h5 className="font-medium text-gray-700 mb-2">
                                {formatDate(date)}
                              </h5>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                {slots.map(slot => (
                                  <div
                                    key={slot.id}
                                    className={`px-3 py-2 rounded-lg text-sm text-center border-2 ${slot.isBooked
                                      ? 'bg-red-50 border-red-200 text-red-700'
                                      : 'bg-green-50 border-green-200 text-green-700'
                                      }`}
                                  >
                                    <div className="font-medium">
                                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                    </div>
                                    <div className="text-xs mt-1">
                                      {slot.isBooked ? 'Booked' : 'Available'}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TimeSlotManagement