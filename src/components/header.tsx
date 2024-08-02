'use client';
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SignIn } from "./sign-in";

const Countdown = dynamic(() => import("./countdown"), { ssr: false });

export default function Header() {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center p-4">
      <div className="flex items-center space-x-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="text-3xl space-x-4 flex">
              <Link
                href={"/"}
                className="cursor-pointer hover:underline hover:text-primary"
              >
                <Image
                  src="/aom-gg-logo.png"
                  width={175}
                  height={175}
                  alt="AoM.gg"
                />
              </Link>
              <Link
                href={"/recs"}
                className="cursor-pointer hover:underline hover:text-primary text-center text-2xl font-medium leading-tight"
              >
                <p>Recorded</p>
                <p>Games</p>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {/* Launch Countdown */}
      <div className="flex justify-end sm:justify-end w-full sm:w-auto mt-4 sm:mt-0 sm:pr-6">
        <Countdown
          targetDate={"2024-08-27T04:00:00Z"}
          title={"AoM Retold Launch Date"}
        />
      </div>
      {/* auth */}
      <div>
        <SignIn />
      </div>
    </header>
  );
}
