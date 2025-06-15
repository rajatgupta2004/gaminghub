// File: /app/api/users/[id]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { name, phone } = await request.json()
    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }
    if (phone && typeof phone !== 'string') {
      return NextResponse.json(
        { error: 'Phone number must be a string' },
        { status: 400 }
      )
    }
    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: {
        name: name.trim(),
        phone: phone?.trim() || null 
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true
      }
    })
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}