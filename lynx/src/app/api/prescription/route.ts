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

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');

    try {
        const prescription = await prisma.prescription.findMany({
            where: { patientId: patientId || undefined },
        });

        if (!prescription || prescription.length === 0) {
            return NextResponse.json(
                { message: "No prescription found for this user." },
                { status: 404 }
            );
        }
        console.log('Prescription:', prescription);
        return NextResponse.json(prescription, { status: 200 });
    } catch (error) {
        console.error('Error fetching prescription: ', error);
        return NextResponse.json({ error: 'Failed to fetch prescription' }, { status: 500 });
    }
}