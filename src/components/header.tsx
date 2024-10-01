import { SignIn } from "@/components/sign-in";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/utils/utils";
import { DiscordLogoIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  Axe,
  BarChart4,
  BookOpen,
  Film,
  Flame,
  LucideIcon,
  Map,
  Twitch,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type NavigationItem = {
  label: string;
  href?: string;
  icon?: LucideIcon | any;
  subNavigation?: NavigationItem[];
  disabled?: boolean;
  className?: string;
  customRender?: React.ReactNode;
};

const navigation: NavigationItem[] = [
  {
    label: "Recorded Games",
    href: "/recs",
    icon: Film,
  },
  {
    label: "Statistics",
    icon: BarChart4,
    subNavigation: [
      {
        label: "Gods",
        href: "/stats/gods",
        icon: Zap,
      },
      {
        label: "Heat Maps",
        href: "/stats/heat-maps",
        icon: Flame,
      },
      {
        label: "Matchups",
        href: "/stats/matchups",
        icon: Axe,
      },
      {
        label: "Maps",
        href: "/stats/maps",
        icon: Map,
        disabled: true,
      },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    icon: BookOpen,
  },
];

export default function Header() {
  return (
    <header className="w-full p-4 grid grid-cols-2 md:grid-cols-[auto_1fr_auto] items-center gap-x-4 text-xl text-white">
      {/* Logo */}
      <Link
        href={"/"}
        className="cursor-pointer hover:underline hover:text-primary"
      >
        <Image
          src="/aom-gg-logo.png"
          width={172}
          height={172}
          alt="AoM.gg"
          priority
        />
      </Link>

      {/* Desktop Navigation Menu */}
      <NavigationMenu className="items-center justify-start w-full hidden lg:flex font-semibold">
        <NavigationMenuList className="gap-2">
          {navigation.map((v) => (
            <NavigationItem key={v.label} item={v} />
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Container for SignIn and Social Links */}
      <div className="hidden lg:flex items-center space-x-4">
        {/* Social Links (hidden on mobile) */}
        <div className="flex items-center space-x-2">
          <Link href="https://ko-fi.com/fitzbro">
            <Image
              src="/kofi_button_blue.png"
              width={200}
              height={200}
              alt="Ko-fi"
              priority
              className="hover:scale-110"
            />
          </Link>
          <Link href="https://discord.gg/Um8MZju4CK">
            <DiscordLogoIcon className="w-10 h-10 text-blue-600 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-blue-800" />
          </Link>
          <Link href="https://www.twitch.tv/fitzbro/videos?filter=archives&sort=time">
            <Twitch className="w-10 h-10 text-purple-500 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-purple-700" />
          </Link>
        </div>

        {/* SignIn Component */}
        <SignIn />
      </div>

      {/* Mobile Hamburger Menu (shown on mobile) */}
      <div className="block lg:hidden self-center place-self-end">
        <Sheet>
          <SheetTrigger asChild>
            <HamburgerMenuIcon className="w-8 h-8" />
          </SheetTrigger>
          <SheetContent className="w-fit gap-4 flex flex-col items-start justify-start">
            <SignIn />
            <Separator />

            {/* Mobile Navigation Menu */}
            <NavigationMenu className="w-full">
              <NavigationMenuList className="gap-2 flex-col space-x-0 items-start">
                {navigation.map((v) => (
                  <NavigationItem key={v.label} item={v} />
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Social Links (only shown inside hamburger menu) */}
            <div className="flex items-center space-x-2 mt-4">
              <Link href="https://ko-fi.com/fitzbro">
                <Image
                  src="/kofi_button_blue.png"
                  width={184}
                  height={184}
                  alt="Ko-fi"
                  priority
                  className="hover:scale-110"
                />
              </Link>
              <Link href="https://discord.gg/Um8MZju4CK">
                <DiscordLogoIcon className="w-10 h-10 text-blue-600 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-blue-800" />
              </Link>
              <Link href="https://www.twitch.tv/fitzbro/videos?filter=archives&sort=time">
                <Twitch className="w-10 h-10 text-purple-500 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-purple-700" />
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function NavigationItem({ item }: { item: NavigationItem }) {
  const hasSubnav = item.subNavigation && item.subNavigation.length > 0; // Check if subNavigation exists and has items
  const Trigger = hasSubnav ? NavigationMenuTrigger : NavigationMenuLink;

  return (
    <NavigationMenuItem>
      <Trigger
        className={cn(
          "bg-transparent flex flex-row items-center gap-2 text-xl",
          hasSubnav ? "pr-2 md:px-4 md:py-2" : "hover:underline focus:underline"
        )}
        href={item.href}
      >
        {item.customRender
          ? item.customRender
          : item.icon && <item.icon size={24} className={item.className} />}
        {item.label && item.label}
      </Trigger>

      {hasSubnav && item.subNavigation && (
        <NavigationMenuContent className="p-4 flex gap-4 flex-col transition duration-150"> {/* Adjusted duration here */}
          {item.subNavigation.map((v) => (
            <NavigationMenuLink
              href={!v.disabled ? v.href : undefined}
              key={v.label}
              className={cn(
                "gap-2 flex flex-row items-center text-xl",
                v.disabled
                  ? "text-gray-400 cursor-default"
                  : "hover:underline focus:underline"
              )}
              aria-disabled={v.disabled}
            >
              {v.icon && <v.icon size={24} />}
              {v.label}
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      )}
    </NavigationMenuItem>
  );
}



