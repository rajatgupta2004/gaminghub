// export const dynamic = 'force-dynamic'

import prisma from '@/app/lib/prisma'
import { NextResponse } from 'next/server'
export async function GET() {
    try {
        const timeSlots = await prisma.timeSlot.findMany()
        return NextResponse.json(timeSlots)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch time slots' },
            { status: 500 }
        )
    }
}