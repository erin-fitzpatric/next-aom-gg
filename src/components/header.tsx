import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
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
  href: string;
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
    href: "/stats/gods",
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
        <NavigationMenuList>
          {navigation.map((v) => (
            <NavigationItem key={v.label} item={v} />
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="shrink">Auth</div>
    </header>
  );
}

function NavigationItem({ item }: { item: NavigationItem }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className="bg-transparent gap-2"
        showChevron={!!item.subNavigation}
      >
        {item.icon && <item.icon size={16} />}
        {item.label}
      </NavigationMenuTrigger>
      {item.subNavigation && item.subNavigation.length > 0 && (
        <NavigationMenuContent className="p-4 flex gap-4 flex-col">
          {item.subNavigation.map((v) => (
            <NavigationMenuLink
              href={v.href}
              key={v.label}
              className="gap-2 flex flex-row items-center"
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
