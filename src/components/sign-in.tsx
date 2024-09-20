"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { SignInDialog } from "./sign-in-dialog-conent";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component

export function SignIn() {
  const { data: session, status } = useSession(); // get the client session status
  const userImage = session?.user?.image || undefined;
  const userName = session?.user?.name || undefined;

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center">
        <Skeleton className="w-8 h-8 rounded-full" />{" "}
        {/* Adjust the Skeleton as needed */}
      </div>
    );
  }

  return (
    <>
      {userName && userImage ? (
        <div className="relative flex flex-col items-center">
          <Image
            src={userImage}
            width={32}
            height={32}
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
