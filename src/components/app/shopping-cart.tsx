
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Trash2, CreditCard, Calendar, Clock } from "lucide-react";
import type { CartItem } from "@/app/eater/take-away/page";
import type { Restaurant } from "@/models/restaurant";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from 'date-fns';

interface ShoppingCartProps {
    items: CartItem[];
    restaurant: Restaurant | null;
    onUpdateQuantity: (itemId: string, quantity: number) => void;
    onRemoveItem: (itemId: string) => void;
    onCheckout: () => void;
    onClearCart: () => void;
}

type DeliveryOption = "now" | "schedule";

export function ShoppingCart({ items, restaurant, onUpdateQuantity, onRemoveItem, onCheckout, onClearCart }: ShoppingCartProps) {
    const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("now");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [deliveryTime, setDeliveryTime] = useState("");

    const subtotal = items.reduce((acc, item) => acc + (item.salePrice || item.regularPrice) * item.quantity, 0);
    const serviceFee = subtotal * 0.05; // 5% service fee
    const total = subtotal + serviceFee;

    useEffect(() => {
        if (deliveryOption === "now" && restaurant) {
            const now = new Date();
            const estimatedTime = new Date(now.getTime() + (restaurant.takeawayTimeMinutes || 20) * 60000);
            setDeliveryTime(format(estimatedTime, 'HH:mm'));
        }

        const today = new Date();
        const minScheduledTime = new Date(today.getTime() + ((restaurant?.takeawayTimeMinutes || 20) + 5) * 60000);
        
        if (!scheduledDate) {
            setScheduledDate(format(minScheduledTime, 'yyyy-MM-dd'));
        }
         if (!scheduledTime) {
            setScheduledTime(format(minScheduledTime, 'HH:mm'));
        }
    }, [deliveryOption, restaurant, items, scheduledDate, scheduledTime]);
    
     const minScheduleDate = format(new Date(), 'yyyy-MM-dd');
     const maxScheduleDate = format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');


    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-6 w-6"/>
                    Tu Pedido {restaurant ? `en ${restaurant.name}` : ''}
                </CardTitle>
                <CardDescription>
                    Revisa tu pedido antes de pagar.
                </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-0 flex-1">
                <ScrollArea className="h-[250px]">
                    <div className="p-4 space-y-4">
                        {items.length === 0 ? (
                            <div className="text-center text-muted-foreground py-16">
                                <p>Tu carro de compras está vacío.</p>
                            </div>
                        ) : (
                            items.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            ${(item.salePrice || item.regularPrice).toLocaleString('es-CL')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                                            className="w-16 h-8 text-center"
                                        />
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground max-w-[750px]" onClick={() => onRemoveItem(item.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            {items.length > 0 && (
                <>
                    <Separator />
                    <CardContent className="p-4 space-y-4">
                        <RadioGroup value={deliveryOption} onValueChange={(value) => setDeliveryOption(value as DeliveryOption)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="now" id="delivery-now" />
                                <Label htmlFor="delivery-now">
                                    Pedir Ahora
                                    <span className="block text-xs text-muted-foreground">
                                        Tiempo de entrega estimado: {deliveryTime} hrs
                                    </span>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="schedule" id="delivery-schedule" />
                                <Label htmlFor="delivery-schedule">Programar Pedido</Label>
                            </div>
                        </RadioGroup>
                         {deliveryOption === "schedule" && (
                            <div className="grid grid-cols-2 gap-4 pl-6 animate-in fade-in">
                                <div className="space-y-1">
                                    <Label htmlFor="schedule-date" className="text-xs">Fecha</Label>
                                    <Input
                                        id="schedule-date"
                                        type="date"
                                        value={scheduledDate}
                                        min={minScheduleDate}
                                        max={maxScheduleDate}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                                 <div className="space-y-1">
                                    <Label htmlFor="schedule-time" className="text-xs">Hora</Label>
                                    <Input
                                        id="schedule-time"
                                        type="time"
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <Separator />
                    <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <p className="text-muted-foreground">Subtotal</p>
                            <p className="font-medium">${subtotal.toLocaleString('es-CL')}</p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p className="text-muted-foreground">Tarifa de servicio</p>
                            <p className="font-medium">${serviceFee.toLocaleString('es-CL')}</p>
                        </div>
                         <Separator />
                         <div className="flex justify-between font-bold text-lg">
                            <p>Total</p>
                            <p>${total.toLocaleString('es-CL')}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                         <Button className="w-full max-w-[750px]" onClick={onCheckout}>
                            {deliveryOption === 'now' ? <CreditCard className="mr-2 h-4 w-4"/> : <Calendar className="mr-2 h-4 w-4" />}
                            {deliveryOption === 'now' ? 'Pagar Ahora' : 'Programar y Pagar'}
                        </Button>
                        <Button variant="ghost" className="w-full text-destructive max-w-[750px]" onClick={onClearCart}>
                            Vaciar Carro
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
    )
}
