// @see https://v0.dev/t/CKlzCInhMPM
"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import React, { FormEvent } from "react"
import { useFormState } from "react-dom"
import { registerClinic } from "./actions"



export default function RegisterClinic() {

    const [state, formAction] = useFormState(registerClinic, { message: "" })

    if (state?.message != "") {
        return (
            <div>
                <h1 className="text-center md:text-4xl text-xl font-bold text-primary mt-20">{state?.message}</h1>
            </div>
        )
    }
    return (
        <>
            <div className="flex min-h-screen w-full flex-col">
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:p-7">
                    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                        <Card className="w-full">
                            <form className="" action={formAction}>
                                <CardHeader>
                                    <CardTitle>Register your Clinic</CardTitle>
                                    <CardDescription>Fill out the form to Register your clinic</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="name">Clinic Name</Label>
                                            <Input id="name" type="text" placeholder="Enter clinic name" name="name" />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="address">Address</Label>
                                            <Textarea id="address" className="min-h-[75px]" placeholder="Enter your address" name="address" />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Write a brief description about your clinic"
                                                className="min-h-[100px]"
                                                name="description"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex items-center justify-end gap-3">
                                    <Button className="font-semibold" type="submit">Register</Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </main>
                </div>
            </div>
        </>
    )
}