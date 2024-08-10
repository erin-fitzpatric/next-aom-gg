import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function SignIn() {
  const { data: session } = useSession(); // get the client session
  const userImage = session?.user?.image || undefined;
  const userName = session?.user?.name || undefined;

  function handleSignIn(e: any) {
    if (!e.target.value) return; // handle closing the dialog, this feels like a hack
    signIn(e.target.value);
  }

  // TODO - fix loading so that it doesn't render the signed out component before session loads
  return (
    <>
      {userName && userImage ? (
        <div className="relative flex flex-col items-center">
          <Image
            src={userImage}
            width={64}
            height={64}
            alt="User"
            className="mx-auto cursor-pointer filter transition-transform duration-300 ease-in-out"
          />
          <div
            onClick={() => signOut()}
            className="absolute cursor-pointer inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out"
          >
            <span className="text-secondary-foreground text-lg font-semibold">
              Log out
            </span>
          </div>
        </div>
      ) : (
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
            className="sm:max-w-[300px]"
            onClick={handleSignIn}
            aria-describedby="sign-in-modal"
          >
            <DialogHeader>
              <DialogTitle id="sign-in-modal" className="mx-auto text-pr text-gold font-bold">
                Sign In
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="mx-auto text-center">
              Sign in to AoM.gg to rate, upload, and download games.
            </DialogDescription>
            {/* <div className="flex w-full">
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
            </div> */}
            <div className="flex w-full flex-col items-center gap-2">
              <Button
                variant="secondary"
                type="submit"
                className="w-full max-w-xs mx-auto flex items-center justify-center"
                value={"steam"}
              >
                <Image
                  src="/login/steam.svg"
                  width={35}
                  height={35}
                  alt="Steam"
                  className="mr-2 ml-2"
                />
                Sign in with Steam
              </Button>
              <Button
                variant="secondary"
                type="submit"
                className="w-full max-w-xs mx-auto flex items-center justify-center"
                value={"xbox"}
              >
                <Image
                  src="/login/xbox.png"
                  width={40}
                  height={40}
                  alt="Microsoft"
                  className="mr-2"
                />
                Sign in with Xbox
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
