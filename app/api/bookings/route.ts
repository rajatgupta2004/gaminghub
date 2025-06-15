import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server'
import { bookSlot, getUserBookings } from '@/actions/bookingController'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const bookings = await getUserBookings(userId)
    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}


export async function POST(request: Request) {
  try {
    const { slotId, bookingData } = await request.json();
    const booking = await bookSlot(slotId,bookingData);
    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Error booking slot:', error);
    return NextResponse.json(
      { success: false, message: 'Error booking slot' },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    // Update booking status to cancelled
    const updatedBooking = await prisma.booking.update({
      where: { id: params.bookingId },
      data: { status: 'cancelled' }
    })

    // Also update the associated time slot to mark it as available
    await prisma.timeSlot.updateMany({
      where: {
        gameId: updatedBooking.gameId,
        date: updatedBooking.date,
        startTime: updatedBooking.startTime,
        endTime: updatedBooking.endTime
      },
      data: { isBooked: false }
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}