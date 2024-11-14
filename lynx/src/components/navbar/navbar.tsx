import SignIn from "../auth/sign-in"
import SignOut from "../auth/sign-out"
import { auth } from "@/auth"
import { ModeToggle } from "../theme-toggle";

export default async function Navbar() {
    const session = await auth();
    return (
        <div className="w-full flex justify-center items-center">
            <div className="bg-background container flex justify-between items-center px-5 md:my-5 my-4">
                <a href="/" className="font-bold text-2xl md:text-3xl">Clini<span className="text-primary">Q</span></a>
                <div className="flex md:gap-5 gap-2">
                    <ModeToggle />
                    {
                        session ? (
                            <div>
                                <SignOut />
                            </div>
                        ) : (
                            <SignIn />
                        )
                    }
                </div>
            </div>
        </div>
    )
}