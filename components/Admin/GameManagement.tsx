'use client'

import React, { useEffect, useState } from 'react'
import { Game } from '@/types'
import { Plus, Edit, Trash2, Save, X, Gamepad2, DollarSign, Clock } from 'lucide-react'

const GameManagement: React.FC = () => {
  // const { games, addGame, updateGame, deleteGame } = useApp()
    const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddingGame, setIsAddingGame] = useState(false)
  const [editingGame, setEditingGame] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 60,
    isActive: true
  })

    useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/games')
        if (!response.ok) throw new Error('Failed to fetch games')
        const data = await response.json()
        setGames(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load games')
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [])



    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingGame) {
        const response = await fetch(`/api/games/${editingGame}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })
        
        if (!response.ok) throw new Error('Failed to update game')
        
        const updatedGame = await response.json()
        setGames(games.map(game => game.id === editingGame ? updatedGame : game))
        setEditingGame(null)
      } else {
        const response = await fetch('/api/games', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })
        
        if (!response.ok) throw new Error('Failed to add game')
        
        const newGame = await response.json()
        setGames([...games, newGame])
        setIsAddingGame(false)
      }
      
      setFormData({
        name: '',
        description: '',
        price: 0,
        duration: 60,
        isActive: true
      })
    } catch (err) {
      console.error('Error saving game:', err)
      alert('Failed to save game. Please try again.')
    }
  }

const handleEdit = async (game: Game) => {
  try {
    // Set the game to edit in state
    setEditingGame(game.id);
    setFormData({
      name: game.name,
      description: game.description,
      price: game.price,
      duration: game.duration,
      isActive: game.isActive
    });
    
    // Optional: Fetch fresh data from the server to ensure we're editing current data
    const response = await fetch(`/api/games/${game.id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch game data');
    }
    
    const freshGameData = await response.json();
    setFormData({
      name: freshGameData.name,
      description: freshGameData.description,
      price: freshGameData.price,
      duration: freshGameData.duration,
      isActive: freshGameData.isActive
    });
    
  } catch (err) {
    console.error('Error preparing game for edit:', err);
    alert(err instanceof Error ? err.message : 'Failed to load game for editing');
    setEditingGame(null);
  }
};

  const handleCancel = () => {
    setIsAddingGame(false)
    setEditingGame(null)
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: 60,
      isActive: true
    })
  }

const handleDelete = async (gameId: string, gameName: string) => {
  if (window.confirm(`Are you sure you want to delete "${gameName}"?`)) {
    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete game')
      }
      
      setGames(games.filter(game => game.id !== gameId))
      alert(`"${gameName}" has been deleted successfully!`)
    } catch (err) {
      console.error('Error deleting game:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete game. Please try again.')
    }
  }
}

    if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading games</h3>
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Game Management</h2>
        <button
          onClick={() => setIsAddingGame(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Add Game</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAddingGame || editingGame) && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingGame ? 'Edit Game' : 'Add New Game'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Cricket, Tennis, Soccer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Session ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describe the game facilities and features..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    required
                    min="15"
                    step="15"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive.toString()}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>{editingGame ? 'Update' : 'Save'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 hover:shadow-lg ${
              game.isActive ? 'border-green-200 hover:border-green-300' : 'border-red-200 hover:border-red-300'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    game.isActive 
                      ? 'bg-gradient-to-r from-green-400 to-blue-500' 
                      : 'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}>
                    <Gamepad2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{game.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      game.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {game.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(game)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(game.id, game.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{game.description}</p>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">${game.price}</p>
                    <p className="text-xs text-gray-500">per session</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{game.duration}min</p>
                    <p className="text-xs text-gray-500">duration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-12">
          <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No games added yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first game to the system.</p>
          <button
            onClick={() => setIsAddingGame(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Game</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default GameManagement