
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Restaurant } from "@/models/restaurant";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface CheckInCardProps {
  eventId: string;
  restaurant: Restaurant;
  dateTime: string;
  organizerName: string;
  eventTitle: string;
}

export function CheckInCard({
  eventId,
  restaurant,
  dateTime,
  organizerName,
  eventTitle,
}: CheckInCardProps) {
  const { toast } = useToast();

  const handleVirtualCheckIn = () => {
    // Simulación de geolocalización
    const isNearby = Math.random() > 0.3; // 70% de probabilidad de estar cerca

    if (isNearby) {
      toast({
        title: "¡Check-in Virtual Exitoso!",
        description: `Se ha confirmado tu llegada a ${restaurant.name}. ¡Que disfrutes tu almuerzo!`,
      });
      // Lógica para actualizar el estado de la reserva
    } else {
      toast({
        variant: "destructive",
        title: "No estás lo suficientemente cerca",
        description: `Para hacer el check-in virtual, debes estar a menos de 50 metros del restaurante. Acércate e inténtalo de nuevo, o haz el check-in con el anfitrión.`,
      });
    }
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle>Tu Próximo Evento</CardTitle>
        <CardDescription>
          Aquí tienes los detalles de la reserva que acabas de organizar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-xl font-bold text-primary">{eventTitle}</h3>
        <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> <strong>{restaurant.name}</strong> - {restaurant.address}</p>
            <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> {format(new Date(dateTime), "eeee, dd 'de' MMMM", { locale: es })}</p>
            <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> {format(new Date(dateTime), "HH:mm' hrs.'")}</p>
            <p className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> Organizado por: <strong>{organizerName}</strong></p>
        </div>
        {restaurant.noShowPolicyMinutes && (
            <Alert>
                <AlertTriangle className="h-4 w-4"/>
                <AlertTitle>¡Recuerda hacer Check-in!</AlertTitle>
                <AlertDescription>
                    Tienes hasta <strong>{restaurant.noShowPolicyMinutes} minutos</strong> después de la hora de tu reserva para confirmar tu llegada. Puedes hacerlo virtualmente desde esta pantalla o presencialmente con el anfitrión del restaurante.
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleVirtualCheckIn} className="w-full">Hacer Check-in Virtual</Button>
      </CardFooter>
    </Card>
  );
}
