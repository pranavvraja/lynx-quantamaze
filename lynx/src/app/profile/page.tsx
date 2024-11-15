// @see https://v0.dev/t/B1XetrPpwrM
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/auth"
import { Key } from "react"

export default async function Profile() {
    const session = await auth();


    if (!session) {
        return (
            <div className="flex justify-center items-center h-52">
                <h1 className="text-primary font-bold text-3xl">Not authenticated</h1>
            </div>
        )
    }

    const userResponse = await fetch(process.env.URL + `/api/user?userId=${session.user.id}`);
    const appointmentResponse = await fetch(process.env.URL + `/api/appointments/user/${session.user.id}`);
    const files = await fetch(`http://localhost:3000/api/upload?userId=${session.user.id}`)
    const allfiles = await files.json();
    const data = await userResponse.json()
    const appointments = await appointmentResponse.json()

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingAppointments = appointments.filter((appointment: {
        id: Key | null | undefined,
        appointmentDate: string,
        appointmentNumber: Key | null | undefined,
        patientName: string | undefined,
    }) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate >= today;
    });

    const pastAppointments = appointments.filter((appointment: {
        id: Key | null | undefined,
        appointmentDate: string,
        appointmentNumber: Key | null | undefined,
        patientName: string | undefined,
    }) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate < today;
    });






    return (
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">

            <div className="grid-cols md:grid-cols-[300px_1fr] gap-8">
                <div className=" p-6  max-h-min">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={data.user.image} alt="@shadcn" />
                            <AvatarFallback>{data.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <div className="font-semibold">{data.user.name}</div>
                            <div className="text-sm text-muted-foreground">{session.user.email}</div>
                        </div>
                    </div>
                    <Separator className="my-6" />
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

                <div className="rounded-lg p-6 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Your Appointments</h2>
                    {
                        upcomingAppointments.map((appointment: {
                            id: Key | null | undefined,
                            appointmentDate: string,
                            appointmentNumber: Key | null | undefined,
                            patientName: string | undefined,
                            patientAge: number | undefined,
                            patientGender: string | undefined,
                            clinic: {
                                name: string | undefined,
                                address: string | undefined,
                            }
                        }) => (
                            <div key={appointment.id} className="flex justify-between m-2 p-4 rounded-lg border shadow-md">
                                <div className="w-full">
                                    <h3 className="text-lg font-bold">{new Date(appointment.appointmentDate).toLocaleDateString('en-GB')}</h3>
                                    <p className="font-bold text-md">Appointment Number :  {appointment.appointmentNumber}</p>
                                    <div className="md:flex mt-2">
                                        <div className="md:mr-20">
                                            <p>Patient Name : {appointment.patientName}</p>
                                            <p>Age: {appointment.patientAge}</p>
                                            <p>Gender: {appointment.patientGender}</p>
                                        </div>
                                        <div className="md:mt-0 mt-3">
                                            <p>Cinic name : {appointment.clinic.name}</p>
                                            <p>Address : {appointment.clinic.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    <h2 className="text-2xl font-bold my-6">Past Appointments</h2>
                    {
                        pastAppointments.map((appointment: {
                            id: Key | null | undefined,
                            appointmentDate: string,
                            appointmentNumber: Key | null | undefined,
                            patientName: string | undefined,
                        }) => (
                            <div key={appointment.id} className="flex justify-between m-2 p-4 rounded-lg border shadow-md">
                                <div className="text-muted-foreground">
                                    <h3 className="text-lg font-bold">{new Date(appointment.appointmentDate).toLocaleDateString('en-GB')}</h3>
                                    <p className="font-bold text-md">Appointment Number :  {appointment.appointmentNumber}</p>
                                    <p>Patient Name : {appointment.patientName}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}