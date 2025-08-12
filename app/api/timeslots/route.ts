import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'



export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('gameId');

  if (!gameId) {
    return NextResponse.json(
      { error: 'Game ID is required' },
      { status: 400 }
    );
  }

  try {
    const timeSlots = await prisma.timeSlot.findMany({
      where: { gameId }
    });
    return NextResponse.json(timeSlots);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch time slots' },
      { status: 500 }
    );
  }
}



export async function POST(request: Request) {
  try {
    const { gameId, date, slots } = await request.json()
    
    // First validate the slots don't overlap
    const existingSlots = await prisma.timeSlot.findMany({
      where: { gameId, date }
    })

    const newSlots = await prisma.$transaction(
      slots.map((slot: { startTime: string; endTime: string }) => 
        prisma.timeSlot.create({
          data: {
            gameId,
            date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: false
          }
        }))
    )
    return NextResponse.json(newSlots)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create time slots' },
      { status: 500 }
    )
  }
}
