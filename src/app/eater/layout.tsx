
"use client";

import type { PropsWithChildren } from "react";
import { AppHeader } from "@/components/app/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppBottomNav } from "@/components/app/bottom-nav";
import { useEffect } from "react";
import { analytics } from "@/lib/firebase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

export default function AppLayout({ children }: PropsWithChildren) {
  useEffect(() => {
    // This is just to ensure the firebase module is loaded and analytics is initialized.
    analytics;
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-20 pb-20 sm:pb-6 bg-background">
            <div className="mx-auto w-full max-w-[750px]">
              {children}
            </div>
          </main>
           <div className="fixed bottom-20 right-4 z-50 sm:bottom-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/eater/migrate" title="Migrar Base de Datos">
                  <Database className="h-4 w-4" />
                   <span className="sr-only">Migrar Base de Datos</span>
                </Link>
              </Button>
            </div>
          <AppBottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
