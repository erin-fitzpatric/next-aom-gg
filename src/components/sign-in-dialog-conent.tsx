// components/SignInDialog.tsx

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

interface SignInDialogProps {
  triggerButton: ReactNode; // Accept a ReactNode to allow for custom buttons
}

export function SignInDialog({ triggerButton }: SignInDialogProps) {
  function handleSignIn(e: React.MouseEvent<HTMLButtonElement>) {
    signIn(e.currentTarget.value);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[300px]"
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
        <div className="flex w-full flex-col items-center gap-2">
          <Button
            variant="secondary"
            type="submit"
            className="w-full max-w-xs mx-auto flex items-center justify-center"
            value={"steam"}
            onClick={handleSignIn}
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
            onClick={handleSignIn}
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
  );
}
