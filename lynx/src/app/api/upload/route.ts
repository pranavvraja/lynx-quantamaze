import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/prisma'; // Adjust the path to your prisma instance

// Named export for the POST method
export async function POST(req: Request) {
    const defaultMedicalReport = {
        hemogram: {
            hemoglobin: {
                value: null,
                unit: "g/dL",
                lastUpdated: null,
            },
            whiteBloodCells: {
                value: null,
                unit: "cells/mcL",
                lastUpdated: null,
            },
            redBloodCells: {
                value: null,
                unit: "cells/mcL",
                lastUpdated: null,
            },
            platelets: {
                value: null,
                unit: "cells/mcL",
                lastUpdated: null,
            },
            meanCorpuscularVolume: {
                value: null,
                unit: "fL",
                lastUpdated: null,
            },
            meanCorpuscularHemoglobin: {
                value: null,
                unit: "pg",
                lastUpdated: null,
            }
        },
        lipidProfile: {
            totalCholesterol: {
                value: null,
                unit: "mg/dL",
                lastUpdated: null,
            },
            hdl: {
                value: null,
                unit: "mg/dL",
                lastUpdated: null,
            },
            ldl: {
                value: null,
                unit: "mg/dL",
                lastUpdated: null,
            },
            triglycerides: {
                value: null,
                unit: "mg/dL",
                lastUpdated: null,
            },
            nonHdlCholesterol: {
                value: null,
                unit: "mg/dL",
                lastUpdated: null,
            }
        },
        // Add other panels similarly
    };
    try {
        const { userId, fileUrl, fileName } = await req.json();

        if (!userId || !fileUrl) {
            return NextResponse.json({ error: 'Missing userId or fileUrl' }, { status: 400 });
        }

        // Save the file URL and userId to the Prisma database
        const newFile = await prisma.files.create({
            data: {
                userId,
                url: fileUrl,
                name: fileName
            },
        });

        //send the url link to the model along with the json

        const currentJson = await prisma.medicalData.findMany({
            where: { userId: userId || undefined },
            select: {
                data: true
            }
        });

        // Assuming currentJson is an array, you might need to extract the first element:
        const formattedData = currentJson[0]?.data || defaultMedicalReport; // Or format this data as needed

        // Then, use the formattedData in your POST request:
        const extract = await fetch("https://1db8-36-255-14-9.ngrok-free.app/process-pdf", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pdf_url: fileUrl, data: formattedData })
        });

        console.log('Extract:', extract);
        const extracted = await extract.json();

        console.log(extracted);

        // const parsedExtracted = JSON.parse(extracted);

        //console.log(parsedExtracted);
        const parsedExtracted = JSON.parse(extracted[0]);

        const uploadeddata = await prisma.medicalData.upsert({
            where: {
                userId: userId
            },
            update: {
                data: parsedExtracted,
                summary: extracted[1]
            }, create: {
                userId: userId,
                data: parsedExtracted,
                summary: extracted[1]
            }
        })


        // get the update json
        //store the json 



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

