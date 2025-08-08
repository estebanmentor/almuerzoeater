
"use client";

import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Heart,
  Search,
  Users,
  ShoppingBag,
  Share2,
  Paperclip,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { RestaurantCarousel } from "@/components/app/restaurant-carousel";
import { getFeaturedRestaurants, getSuperOfferRestaurants, getHiddenGemRestaurants, getNewRestaurants } from "@/services/restaurantService";
import type { Restaurant } from "@/models/restaurant";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


export default function DashboardPage() {
    const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
    const [superOfferRestaurants, setSuperOfferRestaurants] = useState<Restaurant[]>([]);
    const [hiddenGemRestaurants, setHiddenGemRestaurants] = useState<Restaurant[]>([]);
    const [newRestaurants, setNewRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchByAddress, setSearchByAddress] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const [featured, offers, gems, newOnes] = await Promise.all([
                    getFeaturedRestaurants(),
                    getSuperOfferRestaurants(),
                    getHiddenGemRestaurants(),
                    getNewRestaurants()
                ]);
                setFeaturedRestaurants(featured);
                setSuperOfferRestaurants(offers);
                setHiddenGemRestaurants(gems);
                setNewRestaurants(newOnes);
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

  return (
    <div className="flex flex-col gap-8 pt-8">
      <PageHeader
        title="¿No sabes donde almorzar?"
      />

       <Card>
        <CardContent className="p-4 space-y-4">
            <div className="flex items-center space-x-2">
                <Switch
                    id="location-switch"
                    checked={searchByAddress}
                    onCheckedChange={setSearchByAddress}
                />
                <Label htmlFor="location-switch" className="text-base font-medium text-muted-foreground cursor-pointer">
                {searchByAddress ? "Danos una dirección cercana a donde quieres ir" : "¿Usamos tu ubicación actual?"}
                </Label>
            </div>
            {searchByAddress && (
                <div className="space-y-3 animate-in fade-in">
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Ingresa una dirección, calle o comuna..." className="pl-10 text-base" />
                    </div>
                    <Button asChild className="w-full max-w-[750px]">
                        <Link href="/eater/discover">
                             <Search className="mr-2 h-4 w-4" />
                            Buscar Restaurantes Cercanos
                        </Link>
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>

      <div className="w-full space-y-8">
        <Button asChild size="lg" className="h-auto items-start p-4 w-full max-w-[750px]">
            <Link href="/eater/organize" className="flex items-start gap-4 text-left">
                <Users className="h-8 w-8 mt-1 text-primary-foreground" />
                <div className="flex flex-col items-start">
                    <span className="font-semibold text-xl">Organiza un almuerzo</span>
                    <span className="font-normal text-base text-primary-foreground/80">porque es 0/10 almorzar solo</span>
                </div>
            </Link>
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Button asChild size="lg" variant="outline" className="h-auto items-start p-4 max-w-[750px]">
            <Link href="/eater/assistant" className="flex items-start gap-4 text-left">
              <Sparkles className="h-6 w-6 mt-1 text-primary" />
              <div className="flex flex-col items-start">
                <span className="font-semibold text-base">¿No tienes claro qué almorzar?</span>
                <span className="font-normal text-sm text-muted-foreground">OlivIA te ayudará a elegir</span>
              </div>
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-auto items-start p-4 max-w-[750px]">
            <Link href="/eater/take-away" className="flex items-start gap-4 text-left">
              <ShoppingBag className="h-6 w-6 mt-1 text-primary" />
              <div className="flex flex-col items-start">
                <span className="font-semibold text-base">¿Vamos a buscar tu almuerzo?</span>
                <span className="font-normal text-sm text-muted-foreground">acá puedes elegir y pagar almuerzos para llevar</span>
              </div>
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-auto items-start p-4 max-w-[750px]">
            <Link href="/eater/discover" className="flex items-start gap-4 text-left">
              <Search className="h-6 w-6 mt-1 text-primary" />
              <div className="flex flex-col items-start">
                <span className="font-semibold text-base">¿Quieres ver que hay de almuerzo cerca?</span>
                <span className="font-normal text-sm text-muted-foreground">revisa el listado completo de lo que hay cerca</span>
              </div>
            </Link>
          </Button>
           <Button asChild size="lg" variant="outline" className="h-auto items-start p-4 max-w-[750px]">
            <Link href="/eater/favorites" className="flex items-start gap-4 text-left">
              <Heart className="h-6 w-6 mt-1 text-primary" />
              <div className="flex flex-col items-start">
                <span className="font-semibold text-base">Ya eres de la casa</span>
                <span className="font-normal text-sm text-muted-foreground">revisa que hay en tus restaurantes favoritos</span>
              </div>
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="w-full space-y-4 pt-8">
         <h3 className="text-xl font-bold text-center text-muted-foreground">¡Ayúdanos a crecer!</h3>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Button asChild size="lg" variant="outline" className="h-auto items-start p-4 max-w-[750px]">
                <Link href="#" className="flex items-start gap-4 text-left">
                <Share2 className="h-6 w-6 mt-1 text-primary" />
                <div className="flex flex-col items-start">
                    <span className="font-semibold text-base">Cuéntale a tus amigos de almuerzo.cl</span>
                    <span className="font-normal text-sm text-muted-foreground">y así será más fácil organizarse</span>
                </div>
                </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto items-start p-4 max-w-[750px]">
                <Link href="/eater/suggest-restaurant" className="flex items-start gap-4 text-left">
                <Paperclip className="h-6 w-6 mt-1 text-primary" />
                <div className="flex flex-col items-start">
                    <span className="font-semibold text-base">¿Encontraste un boliche o una oferta que no tenemos?</span>
                    <span className="font-normal text-sm text-muted-foreground">avísanos para incorporarlo</span>
                </div>
                </Link>
            </Button>
         </div>
      </div>

      <div className="space-y-8 pt-8">
        <RestaurantCarousel title="Restaurantes Destacados" restaurants={featuredRestaurants} loading={loading} />
        <RestaurantCarousel title="Súper Descuentos" restaurants={superOfferRestaurants} loading={loading} />
        <RestaurantCarousel title="Joyas Ocultas por Descubrir" restaurants={hiddenGemRestaurants} loading={loading} />
        <RestaurantCarousel title="¡Lo Nuevo en tu Zona!" restaurants={newRestaurants} loading={loading} />
      </div>

    </div>
  );
}
