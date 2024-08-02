import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import socialAuth from "@/server/controllers/auth-controller";
import Image from "next/image";

export function SignIn() {
  function handleSignIn(e: any) {
    if (!e.target.value) return; // handle closing the dialog
    console.log(e.target.value);
    alert('firding')
    socialAuth(e?.target?.value);
  }
  
  return (
    // TODO - fix closing the login dialog.
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="font-semibold text-primary border-2 border-primary rounded-md py-1 hover:bg-secondary hover:text-white"
        >
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[275px]"
        onClick={handleSignIn}
        aria-describedby="sign-in-modal"
      >
        <DialogHeader>
          <DialogTitle id="sign-in-modal" className="mx-auto text-pr">
            Sign In
          </DialogTitle>
        </DialogHeader>
        <div className="flex w-full">
          <div className="mx-auto gap-1">
            <Button
              variant="secondary"
              type="submit"
              className="mx-auto"
              value={"twitch"}
            >
              <Image
                src="/login/twitch.png"
                width={20}
                height={20}
                alt="Twitch"
                className="mr-2"
              />
              Sign in with Twitch
            </Button>
          </div>
        </div>
        <div className="flex w-full">
          <div className="mx-auto gap-1">
            <Button
              variant="secondary"
              type="submit"
              className="mx-auto"
              value={"discord"}
            >
              <Image
                src="/login/discord.png"
                width={20}
                height={20}
                alt="Discord"
                className="mr-2"
              />
              Sign in with Discord
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
