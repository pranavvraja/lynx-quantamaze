import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/auth"
import { Key } from "react"
import { prisma } from "@/prisma"
import { boolean } from "zod"
import { notFound } from "next/navigation"
import DocUpload from "@/components/docuploadthing/docupload"

export default async function Profile({ params }: { params: { id: string } }) {
    const session = await auth();
    const patientId = params.id;


    let isAdmin = false;
    // Find if the logged-in user is an admin in the clinic where the patient has taken an appointment
    const appointment = await prisma.appointment.findFirst({
        where: {
            userId: patientId,
        },
        select: {
            clinic: {
                select: {
                    admins: {
                        select: {
                            id: true,
                        }
                    }
                }
            }
        }
    });

    if (!appointment) {
        // No appointment found for the patient
        notFound();
    }


    // Return true if the logged-in user is an admin of the clinic where the patient has an appointment



    if (!session) {
        return (
            <div className="flex justify-center items-center h-52">
                <h1 className="text-primary font-bold text-3xl">Not authenticated</h1>
            </div>
        )
    }

    const userResponse = await fetch(process.env.URL + `/api/user?userId=${patientId}`);
    const files = await fetch(`http://localhost:3000/api/upload?userId=${patientId}`)
    const allfiles = await files.json();
    const userData = await userResponse.json()

    const today = new Date();
    today.setHours(0, 0, 0, 0);



    return (
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">
            <div className="grid-cols md:grid-cols-[300px_1fr] gap-8">

                <h1 className="font-bold text-2xl" >Reports of {userData.user.name}</h1>
                <div>
                    <DocUpload patientId={patientId} />
                </div>
                <div className="p-4 bg-white rounded-lg shadow-lg">
                    {allfiles.length > 0 ? (
                        <div className="space-y-4">
                            {allfiles.map((file: any) => (
                                <div key={file.id} className="p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <p className="text-gray-700 font-medium">
                                        {file.name}
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {file.url}
                                        </a>
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No files found.</p>
                    )}
                </div>

            </div>
        </div>
    )
}