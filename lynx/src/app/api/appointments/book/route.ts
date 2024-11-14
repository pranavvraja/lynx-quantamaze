import { CloudRainWindIcon } from "lucide-react";
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const BookAppointmentSchema = z.object({
    appointment_date: z.string(),
    clinicId: z.string(),
    userId: z.string()
})


export async function POST(req: NextRequest, res: NextResponse) {

    const data = BookAppointmentSchema.parse(await req.json())
    console.log(data)

    const date = new Date(data.appointment_date)
    date.setHours(0, 0, 0, 0);

    const number = await prisma.appointment.count({
        where: {
            clinicId: data.clinicId,
            userId: data.userId,
            appointmentDate: date
        }
    })
    try {

        const posted = await prisma.appointment.create({
            data: {
                appointmentDate: date,
                clinicId: data.clinicId,
                userId: data.userId,
                appointmentNumber: number + 1
            }
        })
    } catch (e) {
        console.log(e)
        return NextResponse.json({
            message: "Error booking appointment"
        })
    }

    return NextResponse.json({
        message: "Appointment booked and your appointment number is " + (number + 1),
        number: number + 1,
        date: data.appointment_date
    })



}