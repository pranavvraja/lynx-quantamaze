import SignIn from "../auth/sign-in";
import SignOut from "../auth/sign-out";
import { auth } from "@/auth";
import { ModeToggle } from "../theme-toggle";

export default async function Navbar() {
    const session = await auth();
    return (
        <div className="w-full flex justify-center items-center">
            <div className="bg-background container flex justify-between items-center px-5 md:my-5 my-4">
                <a href="/" className="font-bold text-2xl md:text-3xl">
                    Clini<span className="text-primary">Q</span>
                </a>
                <div className="flex md:gap-5 gap-2 items-center">
                    <ModeToggle />
                    {session ? (
                        <div className="flex md:gap-3 gap-2 items-center">
                            <a
                                href="/profile"
                                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
                            >
                                Profile
                            </a>
                            <a
                                href="/clinics"
                                className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-secondary-dark"
                            >
                                Book Appointment
                            </a>
                            <SignOut />
                        </div>
                    ) : (
                        <SignIn />
                    )}
                </div>
            </div>
        </div>
    );
}
