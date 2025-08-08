
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { PageHeader } from "@/components/app/page-header";
import { RestaurantCard } from "@/components/app/restaurant-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List, Map, Search, LayoutGrid, SlidersHorizontal } from "lucide-react";
import type { Restaurant } from "@/models/restaurant";
import { RestaurantModal } from "@/components/app/restaurant-modal";
import { FilterSidebar } from "@/components/app/filter-sidebar";
import { getNearbyRestaurants } from "@/services/restaurantService";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ViewMode = "grid" | "list" | "map";

function DiscoverPageContent() {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if the user is coming from the organize flow
  const fromOrganize = searchParams.get('from') === 'organize';

  useEffect(() => {
    async function loadRestaurants() {
      setLoading(true);
      const data = await getNearbyRestaurants();
      setRestaurants(data);
      setLoading(false);
    }
    loadRestaurants();
  }, [searchParams]);

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="flex flex-col h-full">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 flex-1 flex flex-col gap-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex-grow" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (restaurants.length === 0) {
        return (
            <Card className="text-center py-16">
                <CardContent>
                    <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-xl font-semibold mt-4">No se encontraron restaurantes cerca</h3>
                    <p className="text-muted-foreground mt-2">
                        ¡Intenta ampliar tu rango de búsqueda en los filtros!
                    </p>
                </CardContent>
            </Card>
        );
    }

    switch (viewMode) {
      case "grid":
        return (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="h-full">
                <RestaurantCard
                  restaurant={restaurant}
                  onClick={() => handleSelectRestaurant(restaurant)}
                />
              </div>
            ))}
          </div>
        );
      case "list":
        return (
          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} onClick={() => handleSelectRestaurant(restaurant)} className="cursor-pointer border p-4 rounded-lg hover:bg-muted">
                <h3 className="font-bold text-lg">{restaurant.name}</h3>
                <p className="text-muted-foreground">{restaurant.address}</p>
                <p>{restaurant.cuisine} - {restaurant.distance} km</p>
              </div>
            ))}
          </div>
        );
      case "map":
        return (
          <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">La vista de mapa estará disponible próximamente.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={fromOrganize ? "Selecciona un Restaurante" : "Descubre Nuevos Restaurantes"}
        description={fromOrganize ? "Elige dónde quieres organizar tu almuerzo." : "Encuentra tu próximo lugar favorito para almorzar."}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Busca por nombre, tipo de cocina..." className="pl-10 text-base" />
        </div>
        <div className="flex items-center gap-1 rounded-md bg-muted p-1">
            <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('grid')} aria-label="Vista de cuadrícula" className="h-8 w-8">
            <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('list')} aria-label="Vista de lista" className="h-8 w-8">
            <List className="h-5 w-5" />
            </Button>
            <Button variant={viewMode === 'map' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('map')} aria-label="Vista de mapa" className="h-8 w-8">
            <Map className="h-5 w-5" />
            </Button>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Recomendado para ti
        </h2>
        {renderContent()}
      </div>
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button 
            size="lg" 
            className="rounded-full shadow-lg" 
            onClick={() => setIsFilterOpen(true)}
        >
            <SlidersHorizontal className="mr-2 h-5 w-5" />
            Filtros
        </Button>
      </div>

      <FilterSidebar 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      {selectedRestaurant && (
        <RestaurantModal
          restaurant={selectedRestaurant}
          isOpen={!!selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          fromOrganize={fromOrganize}
        />
      )}
    </div>
  );
}


export default function DiscoverPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <DiscoverPageContent />
        </Suspense>
    );
}
