import { SignIn } from "@/components/sign-in";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/utils/utils";
import {
  Axe,
  BarChart4,
  BookOpen,
  Film,
  LucideIcon,
  Map,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type NavigationItem = {
  label: string;
  href?: string;
  icon?: LucideIcon;
  subNavigation?: NavigationItem[];
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
        label: "Matchups",
        href: "/stats/matchups",
        icon: Axe,
      },
      {
        label: "Maps",
        href: "/stats/maps",
        icon: Map,
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
    <header className="w-full bg-white/5 p-4 grid grid-cols-[auto_1fr_auto] items-center gap-x-4 text-sm text-white">
      <Link
        href={"/"}
        className="cursor-pointer hover:underline hover:text-primary"
      >
        <Image
          src="/aom-gg-logo.png"
          width={124}
          height={124}
          alt="AoM.gg"
          priority
        />
      </Link>
      <NavigationMenu className="items-center justify-start w-full">
        <NavigationMenuList className="gap-2">
          {navigation.map((v) => (
            <NavigationItem key={v.label} item={v} />
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div>
        <SignIn />
      </div>
    </header>
  );
}

function NavigationItem({ item }: { item: NavigationItem }) {
  const hasSubnav = item.subNavigation && item.subNavigation.length > 0;
  const Trigger = hasSubnav ? NavigationMenuTrigger : NavigationMenuLink;
  return (
    <NavigationMenuItem>
      <Trigger
        className={cn(
          "bg-transparent flex flex-row items-center gap-2",
          !hasSubnav && "hover:underline focus:underline"
        )}
        showChevron={!!item.subNavigation}
        href={item.href}
      >
        {item.icon && <item.icon size={16} />}
        {item.label}
      </Trigger>
      {item.subNavigation && item.subNavigation.length > 0 && (
        <NavigationMenuContent className="p-4 flex gap-4 flex-col">
          {item.subNavigation.map((v) => (
            <NavigationMenuLink
              href={v.href}
              key={v.label}
              className="gap-2 flex flex-row items-center hover:underline focus:underline"
            >
              {v.icon && <v.icon size={16} />}
              {v.label}
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      )}
    </NavigationMenuItem>
  );
}
