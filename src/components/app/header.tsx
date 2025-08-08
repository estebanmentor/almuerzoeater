
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Logo } from "./logo";
import { NotificationsDropdown } from "./notifications-dropdown";
import { getNotifications } from "@/services/restaurantService";
import type { Notification } from "@/models/notification";

export function AppHeader() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function loadData() {
        const fetchedNotifications = await getNotifications();
        setNotifications(fetchedNotifications);
    }
    loadData();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-4">
       <div className="flex items-center gap-2">
        <Link href="/eater/dashboard" aria-label="Home">
          <Button variant="ghost" size="icon">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex justify-center">
         <Link href="/eater/dashboard" className="flex items-center gap-2 font-bold text-lg text-primary">
            <Logo className="w-6 h-6" />
            <span className="hidden sm:inline">almuerzo.cl</span>
          </Link>
      </div>
        
      <div className="flex items-center gap-2">
        <NotificationsDropdown notifications={notifications} />
      </div>
    </header>
  );
}
