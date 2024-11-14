import { Button } from "@/components/ui/button";
import { prisma } from "@/prisma";
import { Info } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


export const dynamic = 'force-dynamic'
export default async function YourBookings({ clinicId, userId }: { clinicId: string, userId: string }) {

    const appointments = await prisma.appointment.findMany({
        where: {
            clinicId: clinicId,
            userId: userId,
            appointmentDate: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        }
    })


    return (
        <div className="md:w-1/2 rounded-lg shadow-lg p-4 m-2 border ">
            <h2 className="text-lg font-bold my-3">Your Appointments</h2>
            <p className="text-sm my-3">Here are all your bookings</p>
            <div className="grid gap-5 overflow-y-scroll max-h-96 my-auto">
                {
                    appointments.map(appointment => (
                        <div key={appointment.id} className="flex justify-between m-2 p-4 rounded-lg border shadow-md">
                            <div>
                                <h3 className="text-lg font-bold">{new Date(appointment.appointmentDate).toLocaleDateString('en-GB')}</h3>
                                <p className="font-bold text-md">Appointment Number :  {appointment.appointmentNumber}</p>
                            </div>
                            <div className="h-full flex items-end">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="p-1"><Info height={20} /></Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className="text-x;">Appointment Info</DialogTitle>
                                            <DialogDescription>
                                                <ul className="text-foreground text-lg m-5">
                                                    <div className="flex justify-center">
                                                        <dt>Appointment Date :</dt>
                                                        <dd> {new Date(appointment.appointmentDate).toLocaleDateString('en-GB')}</dd>
                                                    </div>
                                                    <div className="flex justify-center">
                                                        <dt>Appointment Number : </dt>
                                                        <dd> {appointment.appointmentNumber}</dd>
                                                    </div>
                                                    <div className="flex justify-center">
                                                        <dt>Patient Name : </dt>
                                                    </div>
                                                    <div className="flex justify-center">
                                                        <dt>Gender : </dt>
                                                    </div>
                                                </ul>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>

                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}