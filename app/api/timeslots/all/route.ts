import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET() {
    try {
        const timeSlots = await prisma.timeSlot.findMany({
            orderBy: { date: 'asc' }
        })
        return NextResponse.json(timeSlots)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch time slots' },
            { status: 500 }
        )
    }
}