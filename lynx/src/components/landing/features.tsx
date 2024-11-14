const features = [
    {
        title: "Easy Appointment Booking",
        description: "Patients can quickly book appointments with their preferred clinic, with just a few clicks."
    },
    {
        title: "Track Appointment Status",
        description: "Get real-time updates on the status of your appointment, including confirmation and cancellation details."
    },
    {
        title: "Clinic Self-Registration",
        description: "Clinics can easily register themselves on the platform, enabling them to manage appointments and patient "
    },
];
export default function Features() {
    return <>
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container space-y-12 px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Unlock the Clini<span className="text-primary">Q</span> Advantage</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex, neque.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
                    {
                        features.map((features, index) => {
                            return (
                                <div className="grid gap-1 " key={index}>
                                    <h3 className="text-lg font-bold text-center">{features.title}</h3>
                                    <p className="text-sm text-muted-foreground text-center">
                                        {features.description}
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    </>
}