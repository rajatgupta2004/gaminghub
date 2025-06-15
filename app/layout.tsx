import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Provider from './provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SportsPlex - Sports Field Booking',
  description: 'Book your favorite sports fields with ease. Cricket, Tennis, Soccer and more!',
  keywords: 'sports, booking, cricket, tennis, soccer, field booking',
  authors: [{ name: 'SportsPlex Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}