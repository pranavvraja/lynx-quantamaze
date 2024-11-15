import { NextResponse, NextRequest } from 'next/server';
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


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');  // Extract userId from query string

    try {
        const files = await prisma.files.findMany({
            where: { userId: userId || undefined },
        });

        if (!files || files.length === 0) {
            return NextResponse.json(
                { message: "No files found for this user." },
                { status: 404 }
            );
        }

        return NextResponse.json(files, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { message: `An error occurred: ${e}` },
            { status: 500 }
        );
    }
}

