import prisma from "@/app/lib/prisma"

export async function getActiveGames() {
  const games = await prisma.game.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  })
  return games
}

export async function getGames() {
  const games = await prisma.game.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return games
}