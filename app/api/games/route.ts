import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET() {
  try {
    const games = await prisma.game.findMany()
    return NextResponse.json(games)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}


export async function POST(request: Request) {
  try {
    const { name, description, price, duration, isActive } = await request.json()
    
    const game = await prisma.game.create({
      data: {
        name,
        description,
        price,
        duration,
        isActive
      }
    })
    
    return NextResponse.json(game)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    )
  }
}


export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, price, duration, isActive } = await request.json()
    
    const game = await prisma.game.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        duration,
        isActive
      }
    })
    
    return NextResponse.json(game)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    )
  }
}



