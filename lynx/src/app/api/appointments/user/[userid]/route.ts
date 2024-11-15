import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { z } from "zod";

const userIdSchema = z.object({
    userId: z.string(),
});

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        //const { userId } = userIdSchema.parse({ userId: params.userId });

        const appointments = await prisma.appointment.findMany({
            where: {
                userId: params.userId,
            },
            include: {
                clinic: true,
            },
        });

        //console.log(appointments);

        if (!appointments) {
            return NextResponse.json(
                {
                    message: "No appointments found for this user.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(appointments, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            {
                message: "An error occurred: " + e,
            },
            { status: 500 }
        );
    }
}
