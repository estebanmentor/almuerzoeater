
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronRight, Contact, Mail, CreditCard, Ticket, PlusCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { getPaymentMethods, getAvailableDiscounts } from "@/services/restaurantService";
import type { PaymentMethod, Discount } from "@/models/restaurant";


const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12.06 0C5.43 0 0 5.42 0 12.04c0 2.12.55 4.14 1.58 5.92L0 24l6.22-1.54a11.96 11.96 0 0 0 5.84 1.55h.01c6.63 0 12.05-5.42 12.05-12.05S18.68 0 12.06 0zm6.51 17.58c-.37.42-.84.67-1.42.75-.58.08-1.16.1-3.61-.89-2.45-.99-4.22-2.7-6-4.91-.7-1.09-1.02-2.22-1.02-3.37s.35-2.21 1.02-3.29c.32-.47.72-.73 1.18-.81.47-.07.93-.07 1.34.02.43.08.64.12.87.5.23.37.76 1.83.82 1.96.06.13.1.28.01.44-.09.16-.16.24-.31.41-.16.16-.32.35-.46.48-.15.13-.29.28-.42.45-.13.17-.27.35-.12.64.15.29.68 1.2 1.48 1.95.95.9 1.86 1.24 2.19 1.39.33.15.52.12.7-.08.18-.2.37-.47.52-.66.15-.19.29-.35.49-.35h.01c.21 0 .54.21.62.41.08.2.12.48.12.78-.01.3-.01.62-.03.73z"/>
    </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.17 7.153l-2.73 12.793c-.22.992-1.33.805-1.782-.243l-2.433-5.53-5.53-2.433c-1.047-.452-.855-1.562.243-1.782L17.413 6.82c.935-.18 1.48.375.957 1.333z"/>
    </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.784.305-1.455.718-2.126 1.387C1.333 2.705.92 3.376.612 4.14c-.3.765-.5 1.635-.558 2.913-.06 1.28-.072 1.687-.072 4.947s.015 3.667.072 4.947c.06 1.278.258 2.148.558 2.913.308.765.72 1.436 1.387 2.106.67.67 1.342 1.078 2.106 1.387.765.3 1.635.5 2.913.558 1.28.058 1.687.072 4.947.072s3.667-.015 4.947-.072c1.278-.06 2.148-.258 2.913-.558.765-.308 1.436-.718 2.106-1.387.67-.67 1.078-1.342 1.387-2.106.3-.765-.5-1.635.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.278-.258-2.148-.558-2.913-.308-.765-.72-1.436-1.387-2.106-.67-.67-1.342-1.078-2.106-1.387-.765-.3-1.635-.5-2.913-.558C15.667.015 15.26 0 12 0zm0 2.16c3.203 0 3.585.012 4.85.07 1.17.055 1.805.248 2.17.415.53.25.925.592 1.317 1.317.39.39.785.733 1.317 1.317.168.365.36.998.415 2.17.058 1.265.07 1.646.07 4.85s-.012 3.585-.07 4.85c-.055 1.17-.248 1.805-.415 2.17-.25.53-.592.925-1.317 1.317-.39.39-.785.733-1.317-1.317-.365-.168-.998.36-2.17.415-1.265.058-1.646.07-4.85.07s-3.585-.012-4.85-.07c-1.17-.055-1.805-.248-2.17-.415-.53-.25-.925-.592-1.317-1.317-.39-.39-.785.733-1.317-1.317-.168-.365-.36-.998-.415-2.17-.058-1.265-.07-1.646-.07-4.85s.012-3.585.07-4.85c.055-1.17.248-1.805.415-2.17.25-.53.592.925 1.317-1.317.39-.39.785.733 1.317-1.317.365-.168.998.36 2.17.415 1.265-.058 1.646.07 4.85.07zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
    </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29h-3.128v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h5.694c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z"/>
    </svg>
);


export default function SettingsPage() {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        setLoading(true);
        const [payments, discountsData] = await Promise.all([
            getPaymentMethods(),
            getAvailableDiscounts(),
        ]);
        
        setPaymentMethods(payments);
        setDiscounts(discountsData);
        setLoading(false);
    }
    loadData();
  }, []);

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prefix = '+56 9 ';
    let value = e.target.value.replace(/[^0-9]/g, '');
    
    // Ensure prefix is always present
    if (e.target.value.startsWith(prefix)) {
        value = value.substring(2); // remove 56 from the start if it was pasted
    }
    
    setWhatsappNumber(prefix + value);
  };

  const handleTelegramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prefix = '@';
    let value = e.target.value;
    
    if (!value.startsWith(prefix)) {
      value = prefix;
    }
    
    value = prefix + value.substring(1).replace(/[^a-zA-Z0-9_]/g, '');

    setTelegramUsername(value);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Configuración"
        description="Gestiona tu cuenta, tus preferencias y notificaciones."
      />
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>
              Esta información se mostrará públicamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://storage.googleapis.com/almuerzopublico.firebasestorage.app/avatars/user_avatar.png" data-ai-hint="user avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Button variant="outline">Cambiar Foto</Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" defaultValue="Invitado" />
            </div>
          </CardContent>
        </Card>

        {/* Payments and Discounts Section */}
        <Card>
            <CardHeader>
                <CardTitle>Pagos y Descuentos</CardTitle>
                <CardDescription>
                    Gestiona tus métodos de pago y visualiza tus descuentos disponibles.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary"/> Métodos de Pago</h3>
                    <div className="space-y-2">
                        {paymentMethods.map(payment => (
                             <div key={payment.id} className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <p className="font-medium">{payment.label}</p>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </Button>
                            </div>
                        ))}
                    </div>
                     <Button variant="outline" className="mt-4 w-full">
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Añadir Método de Pago
                    </Button>
                </div>

                <Separator />
                
                <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Ticket className="h-5 w-5 text-primary"/> Mis Descuentos</h3>
                     <div className="space-y-2">
                        {discounts.map(discount => (
                             <div key={discount.sponsor} className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <p className="font-medium">{discount.sponsor}</p>
                                    <p className="text-sm text-muted-foreground">{discount.description}</p>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>


        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>
              Elige cómo quieres que te notifiquemos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="event-invites" className="text-base font-medium">Invitaciones a eventos</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe una notificación cuando alguien te invite a almorzar.
                </p>
              </div>
              <Switch id="event-invites" defaultChecked />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="daily-menus" className="text-base font-medium">Menús diarios</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe el menú del día de tus restaurantes suscritos.
                </p>
              </div>
              <Switch id="daily-menus" defaultChecked />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="promotions" className="text-base font-medium">Nuevas promociones</Label>
                <p className="text-sm text-muted-foreground">
                  Entérate de las últimas ofertas y descuentos.
                </p>
              </div>
              <Switch id="promotions" />
            </div>
          </CardContent>
        </Card>

        {/* Contact Book Section */}
        <Card>
          <CardHeader>
            <CardTitle>Libreta de Contactos</CardTitle>
            <CardDescription>
              Conecta tus aplicaciones para invitar amigos fácilmente.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Accordion type="multiple" className="w-full space-y-2">
                <AccordionItem value="phone-contacts" className="rounded-lg border px-4">
                    <div className="flex items-center py-4">
                        <AccordionTrigger className="p-0 hover:no-underline flex-1">
                            <div className="flex items-center gap-4">
                                <Contact className="h-6 w-6 text-primary" />
                                <span className="font-semibold text-base">Libreta de Contactos</span>
                            </div>
                        </AccordionTrigger>
                        <Switch />
                    </div>
                   <AccordionContent className="pb-4">
                        <div className="space-y-2 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Otorga permisos para acceder a tu libreta de contactos y así poder encontrar a tus amigos en la aplicación.
                            </p>
                             <Button>Conectar con Contactos</Button>
                        </div>
                   </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="whatsapp" className="rounded-lg border px-4">
                    <div className="flex items-center py-4">
                        <AccordionTrigger className="p-0 hover:no-underline flex-1">
                            <div className="flex items-center gap-4">
                                <WhatsAppIcon className="h-6 w-6 text-green-500 fill-current" />
                                <span className="font-semibold text-base">WhatsApp</span>
                            </div>
                        </AccordionTrigger>
                        <Switch />
                    </div>
                   <AccordionContent className="pb-4">
                        <div className="space-y-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Conecta tu cuenta de WhatsApp para enviar invitaciones directamente a través de la aplicación.
                            </p>
                             <div className="space-y-2">
                                <Label htmlFor="whatsapp-number">Tu número de WhatsApp</Label>
                                <Input 
                                  id="whatsapp-number" 
                                  placeholder="+56 9 1234 5678" 
                                  value={whatsappNumber}
                                  onChange={handleWhatsAppChange}
                                />
                             </div>
                             <Button>Guardar</Button>
                        </div>
                   </AccordionContent>
                </AccordionItem>
                <AccordionItem value="telegram" className="rounded-lg border px-4">
                    <div className="flex items-center py-4">
                        <AccordionTrigger className="p-0 hover:no-underline flex-1">
                            <div className="flex items-center gap-4">
                                <TelegramIcon className="h-6 w-6 text-blue-500 fill-current" />
                                <span className="font-semibold text-base">Telegram</span>
                            </div>
                        </AccordionTrigger>
                        <Switch />
                    </div>
                   <AccordionContent className="pb-4">
                        <div className="space-y-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Conecta tu cuenta de Telegram para enviar invitaciones.
                            </p>
                             <div className="space-y-2">
                                <Label htmlFor="telegram-username">Tu usuario de Telegram</Label>
                                <Input 
                                  id="telegram-username" 
                                  placeholder="@tu_usuario" 
                                  value={telegramUsername}
                                  onChange={handleTelegramChange}
                                />
                             </div>
                             <Button>Guardar</Button>
                        </div>
                   </AccordionContent>
                </AccordionItem>
                <AccordionItem value="instagram" className="rounded-lg border px-4">
                    <div className="flex items-center py-4">
                        <AccordionTrigger className="p-0 hover:no-underline flex-1">
                            <div className="flex items-center gap-4">
                                <InstagramIcon className="h-6 w-6 text-pink-600 fill-current" />
                                <span className="font-semibold text-base">Instagram</span>
                            </div>
                        </AccordionTrigger>
                        <Switch />
                    </div>
                   <AccordionContent className="pb-4">
                        <div className="space-y-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Conecta tu cuenta de Instagram para invitar a tus seguidores.
                            </p>
                             <Button>Conectar con Instagram</Button>
                        </div>
                   </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="facebook" className="rounded-lg border px-4">
                    <div className="flex items-center py-4">
                        <AccordionTrigger className="p-0 hover:no-underline flex-1">
                            <div className="flex items-center gap-4">
                                <FacebookIcon className="h-6 w-6 text-blue-800 fill-current" />
                                <span className="font-semibold text-base">Facebook</span>
                            </div>
                        </AccordionTrigger>
                        <Switch />
                    </div>
                   <AccordionContent className="pb-4">
                        <div className="space-y-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Conecta tu cuenta de Facebook para invitar a tus amigos.
                            </p>
                             <Button>Conectar con Facebook</Button>
                        </div>
                   </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="email" className="rounded-lg border px-4">
                    <div className="flex items-center py-4">
                        <AccordionTrigger className="p-0 hover:no-underline flex-1">
                            <div className="flex items-center gap-4">
                                <Mail className="h-6 w-6 text-primary" />
                                <span className="font-semibold text-base">Direcciones de Correo</span>
                            </div>
                        </AccordionTrigger>
                        <Switch defaultChecked />
                    </div>
                   <AccordionContent className="pb-4">
                        <div className="space-y-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Las invitaciones por correo electrónico están activadas por defecto. Los invitados recibirán un correo con los detalles del evento.
                            </p>
                        </div>
                   </AccordionContent>
                </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
