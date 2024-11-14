import { NextResponse } from 'next/server';
import { prisma } from '@/prisma'; // Adjust the path to your prisma instance

// Named export for the POST method
export async function POST(req: Request) {
    try {
        const { userId, fileUrl } = await req.json();

        if (!userId || !fileUrl) {
            return NextResponse.json({ error: 'Missing userId or fileUrl' }, { status: 400 });
        }

        // Save the file URL and userId to the Prisma database
        const newFile = await prisma.files.create({
            data: {
                userId,
                url: fileUrl,
            },
        });

        return NextResponse.json(newFile, { status: 201 });
    } catch (error) {
        console.error('Error saving file to DB:', error);
        return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
    }
}
