import { prisma } from "@/prisma"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import BookingForm from "./booking-form"
import Navbar from "@/components/navbar/navbar"
import { auth } from "@/auth"
import YourBookings from "./your-bookings"

export default async function ClinicInfoPage({ params }: { params: { id: string } }) {
    const session = await auth()

    if (!session) {
        return (
            <div>
                <h1>Please Login to view this page</h1>
            </div>
        )
    }

    const userId = session.user.id
    const clinicId = params.id

    try {
        const clinic = await prisma.clinic.findUnique({
            where: {
                id: clinicId
            }
        })

        if (!clinic) {
            return (
                <div>
                    <h1>Clinic not found</h1>
                </div>
            )
        }
        return (
            <>
                <div className="flex min-h-screen w-full flex-col">
                    <div className="flex flex-col sm:gap-4  sm:p-10">
                        <main className="container grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-3">
                            <div className="w-full">
                                <article className="max-w-5xl mx-auto ">
                                    <div className="space-y-2 my-6">
                                        <h1 className="text-4xl  text-primary font-extrabold tracking-tight lg:text-5xl my-2">
                                            {clinic.name}
                                        </h1>
                                        <div className="flex items-center h-full">
                                            <MapPin size={21} className="inline-block mr-2 " />
                                            <p className="text-foreground">
                                                {clinic.address}
                                            </p>
                                        </div>
                                    </div>
                                    <p>
                                        {clinic.description}
                                    </p>

                                </article>
                                <div className="md:flex  justify-between max-w-5xl  mx-auto mt-5 max-h-min">
                                    <YourBookings clinicId={clinicId} userId={session.user.id} />
                                    <BookingForm clinicId={clinic.id} userId={session.user.id} />
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </>
        )
    } catch (e) {
        return (
            <div>
                <h1>Something went wrong</h1>
            </div>
        )
    }
}