import { ModeToggle } from "./ui/mode-toggle";
import Image from "next/image";

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
        <h1 className="text-3xl text-primary">AoM Stats</h1>
      </div>
      <ModeToggle />
    </header>
  );
}
