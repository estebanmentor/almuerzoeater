
"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getAllCuisines, getPaymentMethods } from "@/services/restaurantService";
import type { PaymentMethod } from "@/models/restaurant";
import { Skeleton } from "../ui/skeleton";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const [cuisineOptions, setCuisineOptions] = useState<string[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      async function loadFilters() {
        setLoading(true);
        const [cuisines, payments] = await Promise.all([
          getAllCuisines(),
          getPaymentMethods()
        ]);
        setCuisineOptions(cuisines);
        setPaymentOptions(payments);
        setLoading(false);
      }
      loadFilters();
    }
  }, [isOpen]);

  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-28" />
      </div>
    ));
  };


  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl">Filtros y Orden</SheetTitle>
          <SheetDescription>
            Refina tu búsqueda para encontrar el almuerzo perfecto.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <ScrollArea className="flex-1 -mx-6 px-6">
          <Accordion type="multiple" defaultValue={["sort", "name", "attributes"]} className="w-full">
            <AccordionItem value="sort">
              <AccordionTrigger className="text-base font-semibold">Ordenar Por</AccordionTrigger>
              <AccordionContent className="space-y-4">
                 {/* TODO: Add sorting options here */}
                 <p className="text-sm text-muted-foreground">Las opciones para ordenar estarán disponibles pronto.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="name">
              <AccordionTrigger className="text-base font-semibold">Nombre y Menú</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search-name">Nombre del Restaurante</Label>
                  <Input id="search-name" placeholder="Ej: Pizzería Del Fuego" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search-menu">Contenido del Menú</Label>
                  <Input id="search-menu" placeholder="Ej: Lasaña" />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="location">
              <AccordionTrigger className="text-base font-semibold">Ubicación</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Distancia Máxima (km)</Label>
                  <Slider defaultValue={[10]} max={20} step={1} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="search-address">Dirección</Label>
                  <Input id="search-address" placeholder="Ej: Av. Providencia" />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="attributes">
              <AccordionTrigger className="text-base font-semibold">Atributos del Restaurante</AccordionTrigger>
              <AccordionContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Nivel de Precio</Label>
                  <Slider defaultValue={[4]} max={4} step={1} />
                </div>
                 <div className="space-y-2">
                  <Label>Calificación de Google (mínima)</Label>
                  <Slider defaultValue={[3]} max={5} step={0.5} />
                </div>
                <div className="space-y-2">
                  <Label>Calificación de Almuerzo Social (mínima)</Label>
                  <Slider defaultValue={[3]} max={5} step={0.5} />
                </div>
                 <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch id="is-new-filter" />
                        <Label htmlFor="is-new-filter">Recién Agregados</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="is-hidden-gem-filter" />
                        <Label htmlFor="is-hidden-gem-filter">Joyas Ocultas</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Switch id="is-sponsored-filter" />
                        <Label htmlFor="is-sponsored-filter">Patrocinados</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Switch id="is-featured-filter" />
                        <Label htmlFor="is-featured-filter">Destacados</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Switch id="has-super-offer-filter" />
                        <Label htmlFor="has-super-offer-filter">Con Súper Ofertas</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Switch id="has-discounts-filter" />
                        <Label htmlFor="has-discounts-filter">Con Descuentos</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Switch id="has-events-filter" />
                        <Label htmlFor="has-events-filter">Con Eventos Especiales</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Switch id="is-favorite-filter" />
                        <Label htmlFor="is-favorite-filter">Solo Mis Favoritos</Label>
                    </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cuisine">
              <AccordionTrigger className="text-base font-semibold">Tipo de Cocina</AccordionTrigger>
              <AccordionContent className="space-y-2">
                {loading ? renderSkeletons(5) : cuisineOptions.map(cuisine => (
                  <div key={cuisine} className="flex items-center space-x-2">
                    <Checkbox id={`cuisine-${cuisine}`} />
                    <Label htmlFor={`cuisine-${cuisine}`} className="font-normal">{cuisine}</Label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="payment">
              <AccordionTrigger className="text-base font-semibold">Métodos de Pago</AccordionTrigger>
              <AccordionContent className="space-y-2">
                {loading ? renderSkeletons(4) : paymentOptions.map(method => (
                  <div key={method.id} className="flex items-center space-x-2">
                    <Checkbox id={`payment-${method.id}`} />
                    <Label htmlFor={`payment-${method.id}`} className="font-normal">{method.label}</Label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </ScrollArea>
        <Separator />
        <SheetFooter className="flex-row sm:justify-between pt-4">
          <Button variant="outline" onClick={onClose} className="sm:flex-grow">
            Limpiar Filtros
          </Button>
          <Button onClick={onClose} className="sm:flex-grow">
            Aplicar Filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
