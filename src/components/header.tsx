import { ModeToggle } from "./ui/mode-toggle";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <div className="flex items-center space-x-4">
        <Image
          src="/aom-retold-logo.png"
          width={50}
          height={50}
          alt="Medusa logo"
        />
        <h1 className="text-3xl text-primary">AoM.gg</h1>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="text-3xl space-x-4 ">
            <Link href={"/"} className="cursor-pointer hover:underline hover:text-primary">Home</Link>
            <Link href={"/recs"} className="cursor-pointer hover:underline hover:text-primary">Recs</Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <ModeToggle />
      </div>
    </header>
  );
}
