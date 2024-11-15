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

    const appointmentResponse = await fetch(process.env.URL + `/api/appointments/user/${patientId}`);
    const appointments = await appointmentResponse.json()
    const medicalData = await fetch(process.env.URL + `/api/medicaldata?userId=${patientId}`);

    const jsonMedicalData = await medicalData.json();
    const formattedMedicalData = jsonMedicalData.medicalData.data;
    const summary = jsonMedicalData.medicalData.summary;

    const presc = await fetch(process.env.URL + `/api/prescription?patientId=${patientId}`);
    const prescriptions = await presc.json();


    const today = new Date();
    today.setHours(0, 0, 0, 0);



    return (
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">
            <div className="grid-cols md:grid-cols-[300px_1fr] gap-8">

                <h1 className="font-bold text-2xl" >Reports of {userData.user.name}</h1>
                <div>
                    <DocUpload patientId={patientId} />
                </div>
                <div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="pt-6 text-3xl font-bold text-gray-800 mb-6">Medical Report</h2>
                        {Object.entries(formattedMedicalData).map(([section, tests]) => (
                            <div key={section} className="mb-8">
                                <h3 className="text-2xl font-semibold text-blue-600 capitalize mb-4">
                                    {section.replace(/([A-Z])/g, " $1")}
                                </h3>
                                <ul className="list-none space-y-3 text-black">
                                    {Object.entries(tests as { [key: string]: any }).map(([test, details]) => (
                                        <li
                                            key={test}
                                            className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
                                        >
                                            <span className="font-bold capitalize">
                                                {test.replace(/([A-Z])/g, " $1")}
                                            </span>
                                            <div className="text-right">
                                                <p className="text-gray-800">
                                                    {details.value || <span className="text-gray-400">—</span>}{" "}
                                                    {details.unit || ""}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {details.lastUpdated || <span className="text-gray-400">—</span>}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <h2 className="pt-6 text-3xl font-bold text-white mb-6">Medical Documents</h2>
                <div className="mt-10 p-4 bg-white rounded-lg shadow-lg">
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

                <Separator className="my-6" />
                <h2 className="text-2xl font-bold mb-6">Patient's  Prescription</h2>
                <div className="p-4 bg-white rounded-lg shadow-lg">
                    <ul className="list-none space-y-4">
                        {prescriptions.map((prescription: any) => (
                            <li key={prescription.id} className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-gray-800">
                                    <span className="font-semibold">Prescription URL: </span>
                                    <a
                                        href={prescription.prescriptionUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        Open Prescription
                                    </a>
                                </p>
                                <p className="text-gray-800">
                                    <span className="font-semibold">Summary: </span>
                                    {prescription.summary || <span className="text-gray-400">No summary provided</span>}
                                </p>
                                <p className="text-gray-800">
                                    <span className="font-semibold">Created At: </span>
                                    {new Date(prescription.createdAt).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    )
}