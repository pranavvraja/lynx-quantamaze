import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link";

export default async function ClinicDashboardPage({ params }: { params: { id: string } }) {

    const session = await auth();
    const clinicId = params.id;

    if (!session) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-2xl font-bold">Not authenticated</h1>
            </div>
        )
    }

    const clinic = await prisma.clinic.findUnique({
        where: {
            id: clinicId,
            OR: [
                {
                    ownerId: session.user.id
                },
                {
                    admins: {
                        some: {
                            id: session.user.id
                        }
                    }
                }
            ]
        },
    });

    if (!clinic) {
        return (

            <div className="flex justify-center items-center h-96">
                <h1 className="text-2xl font-bold">Not Your Clinic</h1>
            </div>
        )
    }


    const appointments = await prisma.appointment.findMany({
        where: {
            clinicId: clinicId,
            // appointmentDate: {
            //     gte: new Date(new Date().setHours(0, 0, 0, 0))
            // }
        },
        orderBy: {
            appointmentDate: 'asc'
        },
        include: {
            User: true
        }
    })

    const today = new Date().toLocaleDateString('en-GB');


    return (
        <>
            <div className="md:hidden w-full flex justify-center items-center h-screen text-2xl font-bold">
                Device width is too small for this page.
            </div>
            <div className="md:flex min-h-screen w-full flex-col mt-10  hidden">
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:p-10">
                    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                        <h2 className="font-bold text-2xl">Patients Lists</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Booked A</TableHead>
                                    <TableHead>Reports</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appointments.map((appointment) => (
                                    <TableRow key={appointment.User?.id}>
                                        <TableCell>{appointment.User?.name}</TableCell>
                                        <TableCell>{appointment.appointmentDate.toLocaleDateString()}</TableCell>
                                        <TableCell>{appointment.User?.email}</TableCell>
                                        <TableCell>{appointment.createdAt.toLocaleDateString()}</TableCell>
                                        <TableCell><Link href={`/reports/${appointment.User?.id}`}>Here</Link></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </main>
                </div>
            </div>
        </>
    )
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
        </svg>
    )
}





function MoveHorizontalIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="18 8 22 12 18 16" />
            <polyline points="6 8 2 12 6 16" />
            <line x1="2" x2="22" y1="12" y2="12" />
        </svg>
    )
}

