import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { SignInDialog } from "./sign-in-dialog-conent";

export function SignIn() {
  const { data: session } = useSession(); // get the client session
  const userImage = session?.user?.image || undefined;
  const userName = session?.user?.name || undefined;

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
        <SignInDialog
          triggerButton={
            <Button
              variant="ghost"
              className="font-semibold text-primary border-2 border-primary rounded-md py-1 hover:bg-secondary hover:text-white"
            >
              Sign In
            </Button>
          }
        />
      )}
    </>
  );
}
