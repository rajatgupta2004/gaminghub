import { NextResponse } from 'next/server';
import { getAvailableSlotsForGame } from '@/actions/bookingController';

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
    const availableSlots =await getAvailableSlotsForGame(gameId);
    return NextResponse.json(availableSlots);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
}