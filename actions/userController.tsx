import prisma from '@/app/lib/prisma'

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true, image: true },
  })
  return user
}

export async function updateUserProfile(userId: string, data: { name: string, phone?: string }) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
  })
  return updatedUser
}
