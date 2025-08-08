
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/eater/dashboard", icon: Home, label: "Inicio" },
  { href: "/eater/discover", icon: Search, label: "Buscar" },
  { href: "/eater/favorites", icon: Heart, label: "Favoritos" },
  { href: "/eater/settings", icon: Settings, label: "Ajustes" },
];

export function AppBottomNav() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 sm:hidden flex justify-around items-center h-16 bg-card border-t">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center justify-center h-full w-full rounded-none",
            pathname === item.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-xs">{item.label}</span>
        </Link>
      ))}
    </footer>
  );
}
