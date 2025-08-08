
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Restaurant } from "@/models/restaurant";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Star, MapPin, Tag, Utensils, CreditCard, Calendar, Gift, Heart, Users, Share2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface RestaurantModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  fromOrganize?: boolean;
}

export function RestaurantModal({ restaurant, isOpen, onClose, fromOrganize = false }: RestaurantModalProps) {
  const [isFavorite, setIsFavorite] = useState(restaurant?.isFavorite || false);
  const router = useRouter();
  
  if (!restaurant) return null;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Aquí normalmente llamarías a una API para actualizar los favoritos del usuario
  };
  
  const handleSelectForOrganize = () => {
    if (!restaurant) return;
    router.push(`/eater/organize?restaurant=${encodeURIComponent(restaurant.name)}`);
  };

  const renderPriceLevel = (level: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className={cn('text-lg', i < level ? 'text-primary' : 'text-muted-foreground/50')}>$</span>
        ))}
      </div>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative h-64 w-full">
              <Image
                src={restaurant.imageUrl}
                alt={`Imagen de ${restaurant.name}`}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-t-lg"
                data-ai-hint={`${restaurant.cuisine} food`}
              />
              <Button 
                variant="secondary" 
                size="icon" 
                className="absolute top-4 right-4 rounded-full h-10 w-10 bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={toggleFavorite}
              >
                  <Heart className={cn("h-5 w-5", isFavorite ? "text-red-500 fill-red-500" : "text-gray-500")} />
                  <span className="sr-only">Añadir a favoritos</span>
              </Button>
          </div>
          <div className="p-6">
            <DialogHeader className="text-left mb-4">
              <div className="flex justify-between items-start gap-4">
                  <div className="flex-grow">
                      <DialogTitle className="text-3xl font-headline text-primary">{restaurant.name}</DialogTitle>
                      <DialogDescription className="text-lg">{restaurant.cuisine}</DialogDescription>
                  </div>
                   <div className="flex gap-2 shrink-0">
                    <Button asChild size="lg">
                        <Link href={`/eater/organize?restaurant=${encodeURIComponent(restaurant.name)}`}>
                            <Users className="mr-2 h-5 w-5" />
                            Organizar Almuerzo
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline">
                        <Share2 className="mr-2 h-5 w-5" />
                        Compartir
                    </Button>
                  </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                  {restaurant.isNew && <Badge>Nuevo</Badge>}
                  {restaurant.isSponsored && <Badge variant="secondary" className="bg-primary/20 text-primary">Patrocinado</Badge>}
                  {restaurant.isHiddenGem && <Badge variant="secondary" className="bg-green-200 text-green-800">Joya Oculta</Badge>}
                  {restaurant.isFeatured && <Badge variant="secondary" className="bg-purple-200 text-purple-800">Destacado</Badge>}
                  {restaurant.hasSuperOffer && <Badge variant="destructive">Súper Oferta</Badge>}
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">
              {/* Columna Izquierda - Info Principal */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                  <div>
                    <h3 className="font-semibold">Dirección</h3>
                    <p className="text-muted-foreground">{restaurant.address} ({restaurant.distance} km)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                  <div>
                    <h3 className="font-semibold">Calificaciones</h3>
                    <p className="text-muted-foreground">Google: {restaurant.rating.google} ({restaurant.rating.userCount} opiniones)</p>
                    {restaurant.almuerzoRating && <p className="text-muted-foreground">Almuerzo Social: {restaurant.almuerzoRating}</p>}
                  </div>
                </div>
                <div className="flex items-start">
                  <Tag className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                  <div>
                    <h3 className="font-semibold">Nivel de Precio</h3>
                    {renderPriceLevel(restaurant.priceLevel)}
                  </div>
                </div>
                {restaurant.paymentMethods && restaurant.paymentMethods.length > 0 && (
                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                    <div>
                      <h3 className="font-semibold">Métodos de Pago</h3>
                      <p className="text-muted-foreground">{restaurant.paymentMethods.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Columna Central - Eventos y Descuentos */}
              <div className="lg:col-span-1 space-y-4">
                 {restaurant.event && (
                  <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                      <div>
                          <h3 className="font-semibold">Evento Especial: {restaurant.event.title}</h3>
                          <p className="text-muted-foreground">{restaurant.event.description}</p>
                      </div>
                  </div>
                 )}
                 {restaurant.discounts && restaurant.discounts.length > 0 && restaurant.discounts.map((discount, index) => (
                   <div className="flex items-start" key={index}>
                      <Gift className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                      <div>
                          <h3 className="font-semibold">Descuento de {discount.sponsor}</h3>
                          <p className="text-muted-foreground">
                              {discount.amount}{discount.type} de descuento en {discount.appliesTo}.
                              Válido de {format(new Date(discount.validFrom), 'P', { locale: es })} a {format(new Date(discount.validTo), 'P', { locale: es })} los {discount.daysOfWeek.join(', ')}.
                          </p>
                      </div>
                  </div>
                 ))}
                 {(!restaurant.event && (!restaurant.discounts || restaurant.discounts.length === 0)) && <div className="text-muted-foreground text-center pt-4 lg:pt-0">No hay eventos ni descuentos especiales por el momento.</div>}
              </div>

              {/* Columna Derecha - Menu */}
              <div className="lg:col-span-1">
                 <h3 className="text-lg font-headline font-semibold mb-2 flex items-center"><Utensils className="h-5 w-5 mr-2 text-primary"/> Menú</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {restaurant.menu && restaurant.menu.length > 0 ? restaurant.menu.map((item) => (
                      <div key={item.id} className="p-3 bg-muted/50 rounded-lg flex gap-4">
                        {item.imageUrl && (
                          <div className="w-16 h-16 relative shrink-0">
                            <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: 'cover' }} className="rounded-md" data-ai-hint={item.imageHint || ''}/>
                          </div>
                        )}
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h4 className="font-semibold">{item.name}</h4>
                            <div className="text-right">
                               <p className={`font-bold ${item.salePrice ? 'text-destructive' : 'text-foreground'}`}>
                                {item.salePrice ? `$${item.salePrice.toLocaleString('es-CL')}` : `$${item.regularPrice.toLocaleString('es-CL')}`}
                               </p>
                               {item.salePrice && <p className="text-xs line-through text-muted-foreground">${item.regularPrice.toLocaleString('es-CL')}</p>}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                           {item.rating && <div className="flex items-center text-xs mt-1 text-yellow-600"><Star className="h-3 w-3 mr-1 fill-current" /> {item.rating} de 5</div>}
                        </div>
                      </div>
                    )) : <p className="text-muted-foreground">El menú no está disponible por el momento.</p>}
                  </div>
              </div>
            </div>
          </div>
           {fromOrganize && (
            <DialogFooter className="p-6 pt-0">
              <Button size="lg" className="w-full" onClick={handleSelectForOrganize}>
                <CheckCircle className="mr-2 h-5 w-5"/>
                Seleccionar para Almuerzo
              </Button>
            </DialogFooter>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
