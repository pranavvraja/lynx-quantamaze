import { CloudRainWindIcon } from "lucide-react";
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { Gender } from "@prisma/client";

const BookAppointmentSchema = z.object({
    name: z.string(),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    age: z.number().int().min(0).max(150),
    gender: z.enum(["male", "female", "other"]),
    appointment_date: z.string(),
    clinicId: z.string(),
    userId: z.string()
})


export async function POST(req: NextRequest, res: NextResponse) {

    const data = BookAppointmentSchema.parse(await req.json())
    console.log(data)

    const gender = data.gender === 'male' ? Gender.Male : (data.gender === 'female' ? Gender.Female : Gender.Other)
    const date = new Date(data.appointment_date)
    date.setHours(0, 0, 0, 0);

    const number = await prisma.appointment.count({
        where: {
            clinicId: data.clinicId,
            appointmentDate: date
        }
    })
    try {

        const posted = await prisma.appointment.create({
            data: {
                patientName: data.name,
                phone: data.phone,
                patientAge: data.age,
                patientGender: gender,
                appointmentDate: date,
                clinicId: data.clinicId,
                bookedByUserId: data.userId,
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