import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: params.userId,
        status: 'confirmed'
      }
    })

    const totalSpent = bookings.reduce((sum, b) => sum + b.price, 0)

    const upcomingBookings = bookings.filter(b =>
      new Date(`${b.date}T${b.startTime}`) > new Date()
    ).length

    return NextResponse.json({
      confirmedBookings: bookings,
      totalSpent,
      upcomingBookings
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    )
  }
}