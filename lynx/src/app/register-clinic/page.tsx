// @see https://v0.dev/t/CKlzCInhMPM
import Navbar from "@/components/navbar/navbar"
import dynamic from "next/dynamic"
import { auth } from "@/auth"
// import RegisterClinic from "./register-form"
import { prisma } from "@/prisma"
const Form = dynamic(() => import('./register-form'), {
    ssr: false,
    loading: () => <p>Loading...</p>
},)

export default async function Component() {
    const session = await auth();




    return (
        <>
            {/* <RegisterClinic /> */}
            {session ? <Form /> : <h1>Sign in to register your clinic</h1>}
        </>
    )
}

