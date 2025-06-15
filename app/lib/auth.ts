import GoogleProvider from "next-auth/providers/google"
import { NextAuthOptions } from "next-auth"
import { Session } from "next-auth"
import prisma from "./prisma"

type GoogleUser = {
  name?: string | null
  email?: string | null
  image?: string | null
}

export const authOptions: NextAuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
      }),
    ],
    
    callbacks: {
        async signIn({ user }: { user: GoogleUser }) {
          try {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
              where: { email: user.email! },
            });
    
            // If not, create user in database
            if (!existingUser) {
              await prisma.user.create({
                data: {
                  name: user.name ?? "No Name",
                  email: user.email!,
                  image: user.image,
                  phone: null, // default null, you can update this later
                  role: 'user'
                },
              });
            }
          } catch(e) {
            console.error("Error in signIn callback:", e);
          }
          return true;
        },
    
        async session({ session, token }: { session: Session; token: any }) {
          // Add user ID and role to session
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user?.email ?? "" },
            select: {
              id: true,
              phone: true,
              role: true,
              name:true,
            }
          });
          
          if (dbUser) {
            session.user.id = dbUser.id;
            session.user.name = dbUser.name;
            session.user.phone = dbUser.phone;
            session.user.role = dbUser.role;
          }
          return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}