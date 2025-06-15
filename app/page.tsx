// 'use client'

// import { AuthProvider } from '@/contexts/AuthContext'
// import { AppProvider } from '@/contexts/AppContext'
// import { useAuth } from '@/contexts/AuthContext'
// import LoginForm from '@/components/Auth/LoginForm'
// import AdminDashboard from '@/components/Admin/AdminDashboard'
// import UserDashboard from '@/components/User/UserDashboard'
// import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from './lib/auth';
import UserDashboard from '@/components/User/UserDashboard';
import AdminDashboard from '@/components/Admin/AdminDashboard';

// const AppContent = () => {
//   const { user, isLoading } = useAuth()

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     )
//   }
//   if (!user) {
//     return <LoginForm />
//   }

//   return user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />
// }

export default async function Home() {
   const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  // return <div>hiii</div>
  if(session.user.role === 'user'){
    return <UserDashboard/>
  }else if (session.user.role === 'admin'){
    return <AdminDashboard/>
  }
  
}