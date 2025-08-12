
import prisma from "@/app/lib/prisma"

export async function getUserBookings(userId: string) {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    orderBy: { bookedAt: 'desc' }
  })
  return bookings
}

export async function getBookingStats(userId: string) {
  const bookings = await prisma.booking.findMany({
    where: {
      userId,
      status: 'confirmed'
    }
  })

  const totalSpent = bookings.reduce((sum, b) => sum + b.price, 0)

  const upcomingBookings = bookings.filter(b =>
    new Date(`${b.date}T${b.startTime}`) > new Date()
  ).length

  return {
    confirmedBookings: bookings,
    totalSpent,
    upcomingBookings
  }
}



interface BookingPayload {
  gameId: string
  gameName: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  date: string
  startTime: string
  endTime: string
  price: number
  status: string
}



export async function bookSlot(slotId: string, bookingData: BookingPayload) {
  try {
    // 1. Check if slot is available
    const existingSlot = await prisma.timeSlot.findUnique({
      where: { id: slotId },
    })

    if (!existingSlot || existingSlot.isBooked) {
      return { success: false, message: 'Slot not available' }
    }

    // 2. Mark slot as booked and assign player info
    await prisma.timeSlot.update({
      where: { id: slotId },
      data: {
        isBooked: true,
        bookedBy: bookingData.userId,
        playerName: bookingData.userName,
        playerEmail: bookingData.userEmail,
        playerPhone: bookingData.userPhone,
      },
    })

    // 3. Create new booking
    const booking = await prisma.booking.create({
      data: {
        gameId: bookingData.gameId,
        gameName: bookingData.gameName,       // required
        userId: bookingData.userId,
        userName: bookingData.userName,       // required
        userEmail: bookingData.userEmail,     // required
        date: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        price: bookingData.price,
        status: 'confirmed',
      },
    })

    return { success: true, booking }
  } catch (error) {
    console.error('Error booking slot:', error)
    return { success: false, message: 'Error booking slot' }
  }
}




export async function getAvailableSlotsForGame(
  gameId: string
){
  const now = new Date()
  const timeSlots = await prisma.timeSlot.findMany({
    where:{gameId:gameId}
  });
  return timeSlots.filter(slot => {
    if (slot.gameId !== gameId) return false
    if (slot.isBooked) return false
    const slotDateTime = new Date(`${slot.date}T${slot.startTime}`)
    return slotDateTime > now
  })
}

export async function getTimeslots(
  gameId: string
){
   const timeSlots = await prisma.timeSlot.findMany({
    where:{gameId:gameId}
  });
  return timeSlots;
}

