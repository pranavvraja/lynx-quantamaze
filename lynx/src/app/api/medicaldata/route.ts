import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/prisma';

export async function GET(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({
            message: 'userId is required'
        }, {
            status: 400
        });
    }

    const formattedMedicalData = await prisma.medicalData.findUnique({
        where: {
            userId: userId,
        },

    })
    console.log(formattedMedicalData)

    return NextResponse.json({
        medicalData: formattedMedicalData
    })
}