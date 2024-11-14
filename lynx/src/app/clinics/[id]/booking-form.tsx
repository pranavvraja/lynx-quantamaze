//https://www.youtube.com/watch?v=oGq9o2BxlaI 
"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format, set } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
    name: z.string().min(1, { message: "Enter your name" }),
    appointment_date: z.date().refine((date) => {
        const now = new Date();
        const maxDate = new Date(now);
        maxDate.setDate(now.getDate() + 30);
        return date <= maxDate;
    }, {
        message: "Appointment date cannot be more than 30 days in the future.",
    })
})

export default function BookingForm({ clinicId, user }: { clinicId: string, user: any }) {
    const [submitButton, setSubmitButton] = useState<boolean | undefined>(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name,
        }

    })

    const handleSubmitx = (formdata: z.infer<typeof formSchema>) => {
        setSubmitButton(true)
        // const data = {
        //     ...formdata,
        //     clinicId,
        //     userId
        // }
        // console.log(data)


        const data = {
            ...formdata,
            clinicId: clinicId,
            userId: user.id,
        }

        fetch("/api/appointments/book", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            (res) => res.json().then((data) => {
                if (res.ok) {
                    toast({
                        title: `Your appointment number is ${data.number} on ${data.date}`,
                    })
                } else {
                    toast({
                        title: "Error",
                        description: data.message,
                    })
                }
            })
        )

        // fetch("/api/appointments/book", {
        //     method: "POST",
        //     body: JSON.stringify(data),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }).then(
        //     (res) => res.json().then((data) => {
        //         if (res.ok) {
        //             form.reset({ name: "", phone: "", age: 0, gender: "other" })
        //             const date = new Date(data.date).toDateString()
        //             toast({
        //                 title: `Your appointment number is ${data.number} on ${date}`,
        //             })
        //         } else {
        //             toast({
        //                 title: "Error",
        //                 description: data.message,
        //             })
        //         }
        //     })
        // ).catch(err => console.log(err))

        setSubmitButton(false)
    }

    return (


        <div className="md:w-1/2 rounded-lg shadow-lg p-4 m-2 border">
            <h2 className="text-lg font-bold my-3">Book an appointment </h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitx)} className="grid gap-5">
                    <FormField control={form.control} name="name" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled placeholder={user.name} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }} />
                    <FormField
                        control={form.control}
                        name="appointment_date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Appoitment Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date(new Date().setHours(0, 0, 0, 0))
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={submitButton} type="submit">Book</Button>
                </form>
            </Form>
        </div>
    )
}