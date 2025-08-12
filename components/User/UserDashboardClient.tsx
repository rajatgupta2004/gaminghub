'use client'
import  { useEffect, useState } from 'react'
import GameCard from './GameCard'
import BookingModal from './BookingModal'
import UserBookings from './UserBookings'
import UserProfile from './UserProfile'
import MobileHeader from '@/components/Layout/MobileHeader'
import BottomNavigation from '@/components/Layout/BottomNavigation'
import { Game } from '@/types'
import { Search, X } from 'lucide-react'
function UserDashboardClient() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [activeTab, setActiveTab] = useState('games')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeGames, setActiveGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
   useEffect(() => {
    const fetchActiveGames = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/games/active')
        if (!response.ok) {
          throw new Error('Failed to fetch games')
        }
        const data = await response.json()
        setActiveGames(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load games')
      } finally {
        setLoading(false)
      }
    }

    fetchActiveGames()
  }, [])

   if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
        <MobileHeader title="Loading..." showNotifications={true} />
        <main className="px-4 py-6 space-y-6">
          <div className="relative">
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
        </main>
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          userRole="user" 
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
        <MobileHeader title="Error" showNotifications={true} />
        <main className="px-4 py-6">
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
        </main>
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          userRole="user" 
        />
      </div>
    )
  }
  const filteredGames = activeGames.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'games': return 'Available Games'
      case 'bookings': return 'My Bookings'
      case 'profile': return 'My Profile'
      default: return 'SportsPlex'
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'games':
        return (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            {/* Games Grid */}
            {filteredGames.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No games found' : 'No games available'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Try searching with different keywords.'
                    : 'Check back later for available games.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onBook={() => setSelectedGame(game)}
                  />
                ))}
              </div>
            )}
          </div>
        )
      case 'bookings':
        return <UserBookings />
      case 'profile':
        return <UserProfile />
      default:
        return null
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
        userRole="user" 
      />
      {/* Booking Modal */}
      {selectedGame && (
        <BookingModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  )
}

export default UserDashboardClient