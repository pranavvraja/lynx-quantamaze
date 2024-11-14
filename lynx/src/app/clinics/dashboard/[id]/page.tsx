import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Gender } from "@prisma/client";

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
            appointmentDate: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        },
        orderBy: {
            appointmentDate: 'asc'
        },
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
                        <h2 className="font-bold text-2xl">Date : {today}</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ap. No</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Age</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    appointments.map((appointment: {
                                        id: string;
                                        patientName: string;
                                        phone: string;
                                        patientAge: number;
                                        patientGender: Gender;
                                        appointmentDate: Date;
                                        appointmentNumber: number;
                                        clinicId: string;
                                        bookedByUserId: string;
                                        status: string;
                                        createdAt: Date;
                                        updatedAt: Date;

                                    }) => (
                                        <TableRow key={appointment.id}>
                                            <TableCell>{appointment.appointmentNumber}</TableCell>
                                            <TableCell className="font-medium">{appointment.patientName}</TableCell>
                                            <TableCell>{appointment.phone}</TableCell>
                                            <TableCell>{appointment.patientAge}</TableCell>
                                            <TableCell>{appointment.patientGender}</TableCell>
                                            <TableCell>
                                                <Badge variant="default">{appointment.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoveHorizontalIcon className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
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

