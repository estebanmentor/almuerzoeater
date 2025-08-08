
"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, ShoppingBag, Trash2, Check, Clock } from "lucide-react";
import { getTakeawayRestaurantsWithMenus } from "@/services/restaurantService";
import type { Restaurant, MenuItem } from "@/models/restaurant";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShoppingCart } from "@/components/app/shopping-cart";
import { useToast } from "@/hooks/use-toast";
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
import { Skeleton } from "@/components/ui/skeleton";

export interface CartItem extends MenuItem {
    quantity: number;
}

function TakeAwayPageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [restaurantsWithTakeawayMenu, setRestaurantsWithTakeawayMenu] = useState<Restaurant[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartRestaurant, setCartRestaurant] = useState<Restaurant | null>(null);
  
  const [isClearCartAlertOpen, setIsClearCartAlertOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<{item: MenuItem, restaurant: Restaurant} | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRestaurants() {
      setLoading(true);
      const data = await getTakeawayRestaurantsWithMenus();
      setRestaurantsWithTakeawayMenu(data);
      if (data.length > 0) {
        setOpenAccordion([`item-${data[0].id}`]);
      }
      setLoading(false);
    }
    loadRestaurants();
  }, []);

  const handleAddToCart = useCallback((item: MenuItem, restaurant: Restaurant) => {
    if (cartRestaurant && cartRestaurant.id !== restaurant.id) {
        setPendingItem({ item, restaurant }); // Store the item the user wants to add
        setIsClearCartAlertOpen(true); // Open the confirmation dialog
        return;
    }

    setCartRestaurant(restaurant);
    setCart(prevCart => {
        const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            return prevCart.map(cartItem => 
                cartItem.id === item.id 
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
        } else {
            return [...prevCart, { ...item, quantity: 1 }];
        }
    });
    toast({
        title: "¡Añadido al carro!",
        description: `Se ha añadido "${item.name}" a tu pedido.`,
    })
  }, [cartRestaurant, toast]);
  
  useEffect(() => {
    const itemId = searchParams.get('itemId');
    const restaurantName = searchParams.get('restaurant');

    if (itemId && restaurantName && restaurantsWithTakeawayMenu.length > 0) {
       const restaurant = restaurantsWithTakeawayMenu.find(r => r.name === restaurantName);
       const item = restaurant?.menu.find(m => m.id === itemId);

       if (restaurant && item) {
         handleAddToCart(item, restaurant);
         setOpenAccordion([`item-${restaurant.id}`]);
       }
    }
  }, [searchParams, restaurantsWithTakeawayMenu, handleAddToCart]);

  const confirmAddToCart = () => {
    if (pendingItem) {
        const { item, restaurant } = pendingItem;
        setCart([]); // Clear the cart
        setCartRestaurant(restaurant); // Set the new restaurant
        setCart([{ ...item, quantity: 1 }]); // Add the new item
        setOpenAccordion([`item-${restaurant.id}`]);
        toast({
            title: "¡Nuevo Pedido Iniciado!",
            description: `Se ha añadido "${item.name}" a tu pedido de ${restaurant.name}.`,
        });
    }
    setPendingItem(null);
    setIsClearCartAlertOpen(false);
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prevCart => {
        const newCart = prevCart.filter(item => item.id !== itemId);
        if (newCart.length === 0) {
            setCartRestaurant(null); // Clear restaurant if cart is empty
        }
        return newCart;
    });
  };
  
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
     if (quantity <= 0) {
        handleRemoveFromCart(itemId);
    } else {
        setCart(prevCart => prevCart.map(item => 
            item.id === itemId ? { ...item, quantity } : item
        ));
    }
  };
  
  const handleClearCart = () => {
      setCart([]);
      setCartRestaurant(null);
      setIsClearCartAlertOpen(false);
      toast({
          title: "Carro Vacío",
          description: "Se han eliminado todos los productos de tu carro.",
      });
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
        toast({
            variant: "destructive",
            title: "Carro Vacío",
            description: "Añade algo a tu carro antes de pagar.",
        });
        return;
    }
    toast({
        title: "¡Pedido Realizado!",
        description: "Tu pedido ha sido enviado al restaurante. ¡Gracias por tu compra!",
    });
    setCart([]);
    setCartRestaurant(null);
  }

  const isItemInCart = (itemId: string) => cart.some(item => item.id === itemId);


  return (
    <>
        <div className="relative">
            <div className="flex flex-col lg:flex-row gap-8 pt-8">
                <div className="lg:order-2 lg:w-1/3 lg:sticky lg:top-20 self-start">
                    <ShoppingCart
                        items={cart}
                        restaurant={cartRestaurant}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveFromCart}
                        onCheckout={handleCheckout}
                        onClearCart={handleClearCart}
                    />
                </div>
                <div className="lg:order-1 lg:w-2/3 space-y-8">
                    <PageHeader
                        title="Pedir para Llevar"
                        description="Disfruta de un almuerzo delicioso y rápido. Elige tus platos y agrégalos a tu pedido."
                    />
                    <div className="space-y-4">
                        {loading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        ) : restaurantsWithTakeawayMenu.length > 0 ? (
                        <Accordion 
                            type="multiple" 
                            defaultValue={openAccordion}
                            value={openAccordion}
                            onValueChange={setOpenAccordion}
                            className="w-full space-y-4"
                        >
                            {restaurantsWithTakeawayMenu.map((restaurant) => (
                            <AccordionItem key={restaurant.id} value={`item-${restaurant.id}`} className="border rounded-lg bg-card overflow-hidden">
                                <AccordionTrigger className="p-4 hover:no-underline text-2xl font-bold tracking-tight font-headline flex-1 text-left data-[state=closed]:rounded-lg data-[state=open]:bg-muted/50">
                                    <div className="flex justify-between items-center w-full">
                                        <span className="truncate">{restaurant.name}</span>
                                        {restaurant.takeawayTimeMinutes && (
                                            <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground ml-4">
                                                <Clock className="h-4 w-4" />
                                                <span>{restaurant.takeawayTimeMinutes} min</span>
                                            </div>
                                        )}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-0">
                                <div className="divide-y border-t">
                                    {restaurant.menu.map(item => {
                                      const inCart = isItemInCart(item.id);
                                      return (
                                        <div key={`${restaurant.id}-${item.id}`} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            {item.imageUrl && (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.name}
                                                width={100}
                                                height={100}
                                                className="w-24 h-24 object-cover rounded-md shrink-0"
                                                data-ai-hint={item.imageHint || ''}
                                            />
                                            )}
                                            <div className="flex-grow">
                                            <h3 className="text-lg font-semibold">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                            </div>
                                            <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto">
                                            <p className="font-bold text-lg">
                                                ${(item.salePrice || item.regularPrice).toLocaleString('es-CL')}
                                            </p>
                                            <Button variant="outline" className="w-full sm:w-auto max-w-[750px]" onClick={() => handleAddToCart(item, restaurant)} disabled={inCart}>
                                                {inCart ? (
                                                    <Check className="mr-2 h-5 w-5" />
                                                ) : (
                                                    <PlusCircle className="mr-2 h-5 w-5" />
                                                )}
                                                {inCart ? "Añadido" : "Agregar"}
                                            </Button>
                                            </div>
                                        </div>
                                      );
                                    })}
                                </div>
                                </AccordionContent>
                            </AccordionItem>
                            ))}
                        </Accordion>
                        ) : (
                        <Card>
                            <CardContent className="p-8 text-center text-muted-foreground">
                            <p>¡Uch! Parece que por ahora no hay restaurantes con menú para llevar.</p>
                            </CardContent>
                        </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <AlertDialog open={isClearCartAlertOpen} onOpenChange={setIsClearCartAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Iniciar un nuevo pedido?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ya tienes un pedido en curso con {cartRestaurant?.name}. Solo puedes pedir de un restaurante a la vez. ¿Quieres vaciar tu carro actual y empezar uno nuevo con {pendingItem?.restaurant.name}?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setPendingItem(null)}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmAddToCart} className="bg-destructive hover:bg-destructive/90 max-w-[750px]">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Sí, vaciar carro y añadir
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}

export default function TakeAwayPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <TakeAwayPageContent />
        </Suspense>
    )
}
