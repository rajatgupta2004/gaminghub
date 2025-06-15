import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET() {
  try {
    const activeGames = await prisma.game.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(activeGames)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch active games' },
      { status: 500 }
    )
  }
}