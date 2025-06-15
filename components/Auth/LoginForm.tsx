// 'use client'

// import React, { useState } from 'react'
// // import { useAuth } from '@/contexts/AuthContext'
// import { Mail, Lock, User, Phone, AlertCircle, Loader2 } from 'lucide-react'

// const LoginForm: React.FC = () => {
//   // const { login, register, isLoading } = useAuth()
//   const [isLoginMode, setIsLoginMode] = useState(true)
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phone: ''
//   })
//   const [error, setError] = useState('')
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     try {
//       let success = false
      
//       if (isLoginMode) {
//         success = await login(formData.email, formData.password)
//         if (!success) {
//           setError('Invalid email or password')
//         }
//       } else {
//         success = await register(formData.name, formData.email, formData.password, formData.phone)
//         if (!success) {
//           setError('Email already exists')
//         }
//       }
//     } catch (err) {
//       setError('An error occurred. Please try again.')
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
//             <User className="w-6 h-6 text-white" />
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900">
//             {isLoginMode ? 'Welcome back' : 'Create account'}
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             {isLoginMode ? 'Sign in to your account' : 'Join SportsPlex today'}
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {!isLoginMode && (
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     required={!isLoginMode}
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
//                     placeholder="Enter your full name"
//                   />
//                 </div>
//               </div>
//             )}

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   required
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
//                   placeholder="Enter your email"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   required
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
//                   placeholder="Enter your password"
//                 />
//               </div>
//             </div>

//             {!isLoginMode && (
//               <div>
//                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number (Optional)
//                 </label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     id="phone"
//                     name="phone"
//                     type="tel"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
//                     placeholder="Enter your phone number"
//                   />
//                 </div>
//               </div>
//             )}

//             {error && (
//               <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
//                 <AlertCircle className="w-5 h-5" />
//                 <span className="text-sm">{error}</span>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//             >
//               {isLoading ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//               ) : (
//                 isLoginMode ? 'Sign In' : 'Create Account'
//               )}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <button
//               onClick={() => {
//                 setIsLoginMode(!isLoginMode)
//                 setError('')
//                 setFormData({ name: '', email: '', password: '', phone: '' })
//               }}
//               className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//             >
//               {isLoginMode ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
//             </button>
//           </div>

//           {isLoginMode && (
//             <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//               <p className="text-sm text-gray-600 font-medium mb-2">Demo Credentials:</p>
//               <p className="text-xs text-gray-500">Admin: admin@sports.com / admin123</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LoginForm