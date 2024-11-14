import Navbar from "@/components/navbar/navbar"
import { prisma } from "@/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { auth } from "@/auth"

export default async function ClinicsPage() {
    const session = await auth();

    const clinics = await prisma.clinic.findMany(
    )

    const isLogged = session !== null;

    return (
        <>
            <div>
                <h1 className="text-center md:text-4xl text-xl font-bold text-primary mb-5 ">Clinics</h1>{
                    clinics.map((clinic) => (
                        <div key={clinic.id} className="flex justify-center">
                            <div className="w-1/2 p-4 my-1 border rounded-sm grid gap-2">
                                <h2 className="md:text-2xl textr-xl font-bold text-primary">{clinic.name}</h2>
                                <p className="">{clinic.address}</p>
                                <div className="flex justify-end items-center">
                                    {
                                        isLogged ?
                                            <Button asChild variant="secondary" >
                                                <Link href={`/clinics/${clinic.id}`}>
                                                    More
                                                </Link>
                                            </Button> :
                                            <div className="">Sign in to view more</div>
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}