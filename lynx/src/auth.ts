import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import { Role } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name: string
            email: string
            role: Role
        }
    }

    interface User {
        role: Role
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Google({
        profile(profile) {
            return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
                role: profile.role || Role.USER,
            }
        }
    })],
    callbacks: {
        session({ session, user }) {
            //check prisma docs
            session.user.role = user.role
            return session
        }
    }
})