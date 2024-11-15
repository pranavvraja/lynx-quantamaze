import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/prisma';

export async function POST(req: Request) {
    try {
        const { patientId, fileUrl } = await req.json();

        const response = await fetch("https://2ea4-36-255-14-9.ngrok-free.app/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ image_url: fileUrl }),
        });
        const data = await response.json();
        console.log("Data: ", data);
        const summary = data.response;

        console.log("Summary: ", summary);

        const uploadeddata = await prisma.prescription.create({
            data: {
                patientId: patientId,
                prescriptionUrl: fileUrl,
                summary: summary
            }
        })

        return NextResponse.json({ status: 201 });

    } catch (error) { console.error('Error saving file to DB: ', error); }
}