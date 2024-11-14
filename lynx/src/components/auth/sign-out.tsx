import { signOut } from "@/auth"
import { Button } from "../ui/button"

export default function SignOut() {
    return (
        <form
            action={async () => {
                "use server"
                await signOut()
            }}
        >
            <Button type="submit" className="font-semibold " variant="destructive">Sign Out</Button>
        </form>
    )
}