'use client'
import { signIn, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { Gamepad2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600 mb-8">Sign in to manage your game bookings</p>
            
            <button
              onClick={() => signIn('google')}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FcGoogle className="w-6 h-6" />
              <span className="text-sm font-medium">Continue with Google</span>
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our Terms and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Return null while redirecting
  return null
}