
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/app/page-header";
import { getFavoriteRestaurants } from "@/services/restaurantService";
import type { Restaurant } from "@/models/restaurant";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Heart, Newspaper, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function FavoritesPage() {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
  const [restaurantToUnfavorite, setRestaurantToUnfavorite] = useState<Restaurant | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
        const favorites = await getFavoriteRestaurants();
        setFavoriteRestaurants(favorites);
    }
    loadData();
  }, []);

  const handleRequestUnfavorite = (restaurant: Restaurant) => {
    setRestaurantToUnfavorite(restaurant);
  };
  
  const handleConfirmUnfavorite = () => {
      if (!restaurantToUnfavorite) return;

      setFavoriteRestaurants(prevFavorites =>
          prevFavorites.filter(r => r.id !== restaurantToUnfavorite.id)
      );
       toast({
        title: "Eliminado de Favoritos",
        description: `"${restaurantToUnfavorite.name}" ya no está en tus favoritos.`,
      });
      setRestaurantToUnfavorite(null);
  }

  const handleToggleSubscription = (restaurantId: string) => {
    setFavoriteRestaurants(prevFavorites =>
        prevFavorites.map(r => 
            r.id === restaurantId 
            ? { ...r, isSubscribedToDailyMenu: !r.isSubscribedToDailyMenu } 
            : r
        )
    );
    // In a real app, this would be an API call to update the subscription status.
    const restaurant = favoriteRestaurants.find(r => r.id === restaurantId);
    if (restaurant) {
        toast({
            title: `Suscripción ${!restaurant.isSubscribedToDailyMenu ? 'activada' : 'desactivada'}`,
            description: `Recibirás (o no) las actualizaciones del menú de "${restaurant.name}".`
        });
    }
  };

  return (
    <>
      <div className="space-y-8">
        <PageHeader
          title="Tus Favoritos"
          description="Gestiona tus lugares favoritos y suscríbete a sus menús diarios."
        />
        
        <div className="border rounded-lg">
            <div className="p-4">
                <h2 className="flex items-center text-left text-lg font-semibold"><Heart className="mr-3 h-6 w-6 text-primary"/>Restaurantes Favoritos</h2>
            </div>
            <Separator />
            <div className="p-4 pt-0">
              {favoriteRestaurants.length > 0 ? (
                  <div className="divide-y">
                    {favoriteRestaurants.map((restaurant) => (
                      <div key={restaurant.id} className="py-4 space-y-4">
                          <div className="flex justify-between items-start w-full">
                              <div className="flex-1 space-y-1">
                                  <h3 className="font-semibold text-lg text-left">{restaurant.name}</h3>
                                  <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                                  <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => handleRequestUnfavorite(restaurant)} className="max-w-[750px]">
                                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                                  <span className="sr-only">Eliminar de Favoritos</span>
                              </Button>
                          </div>
                          <div className="flex justify-between items-center w-full bg-muted/50 p-3 rounded-lg">
                            <Label htmlFor={`sub-switch-${restaurant.id}`} className="font-medium text-sm cursor-pointer flex items-center gap-2">
                                <Newspaper className="h-4 w-4"/>
                                Suscribirse al menú diario
                            </Label>
                            <Switch
                                id={`sub-switch-${restaurant.id}`}
                                checked={restaurant.isSubscribedToDailyMenu}
                                onCheckedChange={() => handleToggleSubscription(restaurant.id)}
                            />
                          </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 flex flex-col items-center justify-center text-center gap-4">
                      <p className="text-lg text-muted-foreground">Aún no tienes ningún restaurante favorito.</p>
                      <p className="text-sm text-muted-foreground">¡Explora y encuentra tus próximos lugares preferidos!</p>
                      <Button asChild className="max-w-[750px]">
                          <Link href="/eater/discover">
                              <Search className="mr-2 h-4 w-4" />
                              Descubrir Restaurantes
                          </Link>
                      </Button>
                  </div>
                )}
            </div>
        </div>
      </div>
      <AlertDialog open={!!restaurantToUnfavorite} onOpenChange={(isOpen) => !isOpen && setRestaurantToUnfavorite(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Quitar de Favoritos?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción eliminará &quot;{restaurantToUnfavorite?.name}&quot; de tu lista de restaurantes favoritos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUnfavorite} className="bg-destructive hover:bg-destructive/90 max-w-[750px]">
                <Trash2 className="mr-2 h-4 w-4" />
                Quitar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
