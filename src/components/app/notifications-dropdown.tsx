
"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import type { Notification } from "@/models/notification";

interface NotificationsDropdownProps {
    notifications: Notification[];
}

export function NotificationsDropdown({ notifications }: NotificationsDropdownProps) {
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">{unreadCount}</Badge>
                    )}
                    <span className="sr-only">Ver notificaciones</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-96">
                    {notifications.length === 0 ? (
                        <p className="text-sm text-muted-foreground p-4 text-center">No tienes notificaciones nuevas.</p>
                    ) : (
                        notifications.map(notification => (
                            <DropdownMenuItem key={notification.id} className={cn("flex flex-col items-start gap-1 whitespace-normal", !notification.read && "font-bold")}>
                                <p>{notification.title}</p>
                                <p className="text-xs text-muted-foreground font-normal">{notification.description}</p>
                                <p className="text-xs text-muted-foreground font-normal">{notification.time}</p>
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem>
                    <Check className="mr-2 h-4 w-4" />
                    <span>Marcar todas como leídas</span>
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
