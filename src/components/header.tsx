import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import Link from "next/link";
import Countdown from "./countdown";

export default function Header() {
  // Get the client's timezone offset in minutes
  const timezoneOffset = new Date().getTimezoneOffset();

  return (
    <header className="flex justify-between items-center p-4">
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
      {/* <div className="ml-auto flex text-gold">
        <Countdown targetDate={new Date("2024-08-27T00:00:00")} title={'AoM Retold Launch Date'} />
      </div> */}
    </header>
  );
}
