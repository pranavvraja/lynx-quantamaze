'use server'

import { auth } from "@/auth"

export async function registerClinic(previousState: any, formData: FormData) {
    const session = await auth();
    if (!session) {
        return { message: "Please Login in to register your clinic" }
    }

    if (!formData.get("name") || !formData.get("address") || !formData.get("description")) {
        return { message: "Please fill out all fields" }
    }

    const data = {
        name: formData.get("name"),
        address: formData.get("address"),
        description: formData.get("description"),
        ownerId: session.user.id
    }

    console.log(data)
    try {
        const res = await fetch('http://localhost:3000/api/clinic/register', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (res.ok) {
            return { message: "Done" }
        }
    } catch (e) {
        console.log(e)
        return { message: "Error Registering Clinic" }
    }
}