import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { z } from "zod";

const userSchema = z.object({
    userId: z.string(),
})
export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const data = userSchema.parse({ userId });


        const user = await prisma.user.findFirst({
            where: {
                id: data.userId
            },
        })

        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }


        return NextResponse.json(
            {
                user
            },
            {
                status: 200
            }
        )
    } catch (e) {
        return NextResponse.json(
            {
                message: "An error occurred " + e
            },
            {
                status: 500
            }
        )
    }
}