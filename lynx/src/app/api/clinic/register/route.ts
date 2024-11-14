import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { z } from "zod";

const RegisterClinicSchema = z.object({
    name: z.string(),
    address: z.string(),
    description: z.string(),
    ownerId: z.string()
})

export async function POST(req: NextRequest, res: NextResponse) {


    try {
        const data = RegisterClinicSchema.parse(await req.json());

        // const user = await prisma.user.findFirst({
        //     where: {
        //         id: data.ownerId
        //     },
        //     cacheStrategy: { swr: 60, ttl: 60 } as never
        // })

        const user = await prisma.user.findFirst({
            where: {
                id: data.ownerId
            },
        })

        if (!user) {
            return NextResponse.json(
                {
                    message: "Please Login in to register your clinic"
                },
                {
                    status: 404
                }
            )
        }
        await prisma.clinic.create({
            data: {
                name: data.name,
                address: data.address,
                ownerId: data.ownerId,
                description: data.description
            }
        });

        return NextResponse.json(
            {
                message: "Clinic Registered Successfully"
            },
            {
                status: 201
            }
        )
    } catch (error) {
        return NextResponse.json(
            {
                message: "Error Registering Clinic"
            },
            {
                status: 500
            }
        )
    }

}