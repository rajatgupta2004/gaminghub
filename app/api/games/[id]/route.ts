import prisma from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First check if game exists
    const game = await prisma.game.findUnique({
      where: { id: params.id },
      include: {
        timeSlots: {
          where: {
            isBooked: true
          },
          take: 1 // We only need to know if there are any booked slots
        }
      }
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    // Check if game has any booked time slots
    if (game.timeSlots.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete game with active bookings',
          details: 'This game has time slots with active bookings'
        },
        { status: 400 }
      )
    }

    // Delete in transaction to ensure data consistency
    await prisma.$transaction([
      // First delete all associated time slots
      prisma.timeSlot.deleteMany({
        where: { gameId: params.id }
      }),
      // Then delete the game
      prisma.game.delete({
        where: { id: params.id }
      })
    ])
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting game:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete game',
        ...(error instanceof Error && { details: error.message })
      },
      { status: 500 }
    )
  }
}



export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, price, duration, isActive } = await request.json();
    
    // Validate input
    if (!name || !description || price === undefined || duration === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedGame = await prisma.game.update({
      where: { id: params.id },
      data: { name, description, price, duration, isActive }
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    );
  }
}


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const Game = await prisma.game.findUnique({
      where: { id: params.id },
      select:{
        name:true,
        description:true,
        price: true,
        duration:true,
        isActive:true,
        image:true,
      }
    });

    return NextResponse.json(Game);
  } catch (error) {
    console.error('Error getting game:', error);
    return NextResponse.json(
      { error: 'Failed to get game' },
      { status: 500 }
    );
  }
}


