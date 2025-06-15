import prisma from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First verify the booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: params.id }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { 
          error: 'Booking already cancelled',
          booking // Return the existing booking
        },
        { status: 400 }
      )
    }

    // Use transaction to ensure both operations succeed or fail together
    const [updatedBooking] = await prisma.$transaction([
      // Update booking status
      prisma.booking.update({
        where: { id: params.id },
        data: { status: 'cancelled' }
      }),
      // Update associated time slot
      prisma.timeSlot.updateMany({
        where: {
          gameId: booking.gameId,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          isBooked: true // Only update if it's still marked as booked
        },
        data: { isBooked: false }
      })
    ])

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { 
        error: 'Failed to cancel booking',
        ...(error instanceof Error && { details: error.message })
      },
      { status: 500 }
    )
  }
}