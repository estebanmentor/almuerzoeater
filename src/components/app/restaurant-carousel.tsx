
"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { RestaurantCard } from "@/components/app/restaurant-card";
import type { Restaurant } from "@/models/restaurant";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { RestaurantModal } from "./restaurant-modal";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface RestaurantCarouselProps {
  title: string;
  restaurants: Restaurant[];
  loading: boolean;
  viewAllHref?: string;
}

export function RestaurantCarousel({ title, restaurants, loading, viewAllHref = "/eater/discover" }: RestaurantCarouselProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const router = useRouter();
  
  if (loading) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight font-headline">{title}</h2>
            <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </div>
    );
  }

  if (restaurants.length === 0) {
    return null; // Don't render the carousel if there are no restaurants
  }

  return (
    <>
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight font-headline">{title}</h2>
            <Button asChild variant="link">
                <Link href={viewAllHref} className="flex items-center gap-1">
                    Ver Todos
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </Button>
        </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {restaurants.map((restaurant) => (
            <CarouselItem key={restaurant.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <div className="p-1 h-full">
                <RestaurantCard
                  restaurant={restaurant}
                  onClick={() => setSelectedRestaurant(restaurant)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:flex" />
        <CarouselNext className="hidden lg:flex" />
      </Carousel>
    </div>
     {selectedRestaurant && (
        <RestaurantModal
          restaurant={selectedRestaurant}
          isOpen={!!selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}
    </>
  );
}

