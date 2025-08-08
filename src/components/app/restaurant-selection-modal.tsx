
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Check } from "lucide-react";
import type { Restaurant } from "@/models/restaurant";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface RestaurantSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedRestaurant: Restaurant) => void;
  restaurants: Restaurant[];
}

export function RestaurantSelectionModal({ isOpen, onClose, onConfirm, restaurants }: RestaurantSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleConfirm = () => {
    if (selectedRestaurant) {
      onConfirm(selectedRestaurant);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl h-[70vh] flex flex-col p-0">
            <DialogHeader className="p-6 pb-4">
                <DialogTitle>Seleccionar Restaurante</DialogTitle>
                <DialogDescription>Elige el lugar para tu almuerzo.</DialogDescription>
            </DialogHeader>

            <div className="px-6 pb-4">
                 <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o tipo de cocina..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            
            <ScrollArea className="flex-grow min-h-0 px-6">
                <div className="space-y-2 pr-2">
                    {filteredRestaurants.map(restaurant => (
                        <div
                            key={restaurant.id}
                            onClick={() => setSelectedRestaurant(restaurant)}
                            className={cn(
                                "flex items-center gap-4 p-3 border rounded-lg cursor-pointer transition-colors",
                                selectedRestaurant?.id === restaurant.id 
                                    ? "bg-primary/10 border-primary" 
                                    : "hover:bg-muted/50"
                            )}
                        >
                            <Image 
                                src={restaurant.imageUrl}
                                alt={restaurant.name}
                                width={64}
                                height={64}
                                className="h-16 w-16 rounded-md object-cover"
                            />
                            <div className="flex-grow">
                                <h3 className="font-semibold">{restaurant.name}</h3>
                                <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                            </div>
                        </div>
                    ))}
                    {filteredRestaurants.length === 0 && (
                        <div className="text-center py-16 text-muted-foreground">
                            <p>No se encontraron restaurantes.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
            
            <DialogFooter className="p-6 border-t mt-4">
                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                <Button onClick={handleConfirm} disabled={!selectedRestaurant}>
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar Selección
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
