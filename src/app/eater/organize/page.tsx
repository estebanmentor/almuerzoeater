
"use client";

import { useState, useEffect, useMemo, Suspense, useCallback } from "react";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Users, Calendar, Clock, ChevronRight, Send, Loader2, AlertTriangle, ShieldCheck, Phone, Sparkles, Search, Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { format } from 'date-fns';
import { getAllRestaurants } from "@/services/restaurantService";
import { ContactsModal } from "@/components/app/contacts-modal";
import type { Contact } from "@/models/contact";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { createLunchEvent, type CreateLunchEventOutput } from "@/ai/flows/create-lunch-event";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckInCard } from "@/components/app/check-in-card";
import type { Restaurant } from "@/models/restaurant";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


interface ConfirmedEvent extends CreateLunchEventOutput {
    title: string;
    restaurant: Restaurant;
    dateTime: string;
    organizerName: string;
}

const formSchema = z.object({
  title: z.string().min(1, "El título del evento es obligatorio."),
  date: z.string().min(1, "La fecha es obligatoria."),
  time: z.string().min(1, "La hora es obligatoria."),
  restaurantName: z.string().min(1, "Debes seleccionar un restaurante."),
  notes: z.string().optional(),
  selectedContacts: z.array(z.any()).min(1, "Debes seleccionar al menos un invitado."),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.object({
    frequency: z.enum(['weekly', 'monthly', 'annually']).optional(),
    days: z.array(z.string()).optional(), // For weekly
    endDate: z.string().optional(),
    occurrences: z.number().optional(),
  }).optional(),
  acceptedPolicy: z.boolean().default(false),
  acceptedGeneralPolicy: z.boolean().refine(val => val === true, {
    message: "Debes aceptar las condiciones de responsabilidad para organizar."
  }),
  sharePhoneNumber: z.boolean().default(false),
  paymentMethod: z.string().optional(),
}).refine(data => {
    // Si el evento es recurrente, debe tener una frecuencia.
    if (data.isRecurring && !data.recurrenceRule?.frequency) {
        return false;
    }
    return true;
}, {
    message: "Debes seleccionar una frecuencia para eventos recurrentes.",
    path: ["recurrenceRule.frequency"],
});


function OrganizePageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Data State
  const [dineInRestaurants, setDineInRestaurants] = useState<Restaurant[]>([]);
  
  // UI State
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [isWaitlistDialogOpen, setIsWaitlistDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmedEvent, setConfirmedEvent] = useState<ConfirmedEvent | null>(null);
  const [organizerName, setOrganizerName] = useState("Anónimo");


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "Almuerzo de Hoy",
      date: format(new Date(), 'yyyy-MM-dd'),
      time: (() => {
          const now = new Date();
          now.setMinutes(now.getMinutes() + 15);
          return format(now, 'HH:mm');
      })(),
      restaurantName: "",
      notes: "",
      selectedContacts: [],
      isRecurring: false,
      recurrenceRule: {
        frequency: undefined,
        days: [],
        endDate: undefined,
        occurrences: undefined,
      },
      acceptedPolicy: false,
      acceptedGeneralPolicy: false,
      sharePhoneNumber: false,
      paymentMethod: "pay-own",
    },
  });

  const selectedRestaurantName = form.watch('restaurantName');
  
  const selectedRestaurant = useMemo(() => {
    return dineInRestaurants.find(r => r.name === selectedRestaurantName) || null;
  }, [selectedRestaurantName, dineInRestaurants]);

  const isRecurring = form.watch('isRecurring');
  const recurrenceFrequency = form.watch('recurrenceRule.frequency');

   const handleRestaurantChange = useCallback((value: string) => {
    form.setValue('restaurantName', value, { shouldValidate: true });
    form.setValue('title', value ? `Almuerzo en ${value}` : 'Almuerzo de Hoy');
    form.setValue('acceptedPolicy', false); // Reset policy acceptance when restaurant changes
  }, [form]);

  useEffect(() => {
    async function loadData() {
      const data = await getAllRestaurants();
      // Filter restaurants to only include those that offer dine-in service
      const filteredRestaurants = data.filter(r => r.availableServices.includes('Para servir'));
      setDineInRestaurants(filteredRestaurants);
      
      const restaurantNameParam = searchParams.get('restaurant');
      if (restaurantNameParam) {
          const decodedRestaurantName = decodeURIComponent(restaurantNameParam);
          if(filteredRestaurants.some(r => r.name === decodedRestaurantName)) {
            // Using handleRestaurantChange ensures title is also updated
            handleRestaurantChange(decodedRestaurantName);
          }
      }
    }
    loadData();
  }, [searchParams, handleRestaurantChange]);

  const handleConfirmContacts = (contacts: Contact[]) => {
    form.setValue('selectedContacts', contacts, { shouldValidate: true });
    setIsContactsModalOpen(false);
  }

  const proceedWithBooking = async (formData: z.infer<typeof formSchema>, status: 'confirmado' | 'lista-de-espera' | 'pendiente-confirmacion' = 'confirmado') => {
    setLoading(true);
    setConfirmedEvent(null);
    try {
      if (!selectedRestaurant) throw new Error("Restaurante no seleccionado");
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      const response = await createLunchEvent({
        title: formData.title,
        restaurantName: selectedRestaurant.name,
        organizerName: organizerName,
        dateTime: dateTime.toISOString(),
        notes: formData.notes,
        guests: formData.selectedContacts,
        status,
        recurrenceRule: formData.isRecurring ? formData.recurrenceRule : undefined,
      });

      if (response.success) {
        toast({
          title: status === 'lista-de-espera' ? "¡Anotado en la lista!" : status === 'pendiente-confirmacion' ? '¡Solicitud Enviada!' : "¡Invitaciones Enviadas!",
          description: response.message,
        });
        if (status === 'confirmado') {
             setConfirmedEvent({
                ...response,
                title: formData.title,
                restaurant: selectedRestaurant,
                dateTime: dateTime.toISOString(),
                organizerName: organizerName,
            });
        }
        form.reset();
      } else {
         throw new Error(response.message);
      }
    } catch (error) {
      console.error("Error creating lunch event:", error);
      toast({
        variant: "destructive",
        title: "¡Oh no! Algo salió mal.",
        description: "No se pudo procesar la solicitud. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  }

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    if (selectedRestaurant?.noShowPolicyMinutes && !data.acceptedPolicy) {
      form.setError("acceptedPolicy", { type: "manual", message: "Debes aceptar la política de cancelación del restaurante para continuar." });
      toast({
        variant: "destructive",
        title: "Política no aceptada",
        description: "Debes aceptar la política de cancelación del restaurante para continuar.",
      });
      return;
    }
    
    const eventDateTime = new Date(`${data.date}T${data.time}`);
    const now = new Date();
    const hoursDifference = (eventDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursDifference > 24) {
        await proceedWithBooking(data, 'pendiente-confirmacion');
        return;
    }
    
    const isRestaurantFull = data.restaurantName === "Pizzería Del Fuego"; // Mock condition
    const hasWaitlist = true; // Mock condition

    if (isRestaurantFull && hasWaitlist) {
        setIsWaitlistDialogOpen(true);
    } else {
        await proceedWithBooking(data, 'confirmado');
    }
  };
    
  return (
    <>
      <div className="space-y-8 pt-8">
        <PageHeader
          title="Organizar un Almuerzo"
          description="Planea tu próximo encuentro para almorzar con amigos o colegas."
        />

        <div className="mx-auto max-w-[750px] space-y-8">
          {confirmedEvent && (
            <CheckInCard
                eventId={confirmedEvent.eventId}
                restaurant={confirmedEvent.restaurant}
                dateTime={confirmedEvent.dateTime}
                organizerName={confirmedEvent.organizerName}
                eventTitle={confirmedEvent.title}
            />
          )}

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
                <div className="w-[70%] pr-4">
                     <CardTitle className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        Tu Reputación
                    </CardTitle>
                    <CardDescription>
                        Este índice refleja tu compromiso con las reservas. ¡Un buen historial te da prestigio!
                    </CardDescription>
                </div>
                 <div className="w-[30%] text-center bg-muted/50 p-2 rounded-lg">
                    <p className="text-sm text-muted-foreground">Nivel</p>
                    <p className="text-4xl font-bold text-gray-500">--</p>
                    <p className="text-xs text-muted-foreground">(Sin Datos)</p>
                </div>
            </CardContent>
          </Card>

          <Accordion type="multiple" defaultValue={['new-event']} className="w-full space-y-4">
            <Card className="bg-accent/10 data-[state=closed]:bg-accent/20 transition-colors">
              <AccordionItem value="new-event" className="border-b-0">
                  <AccordionTrigger className="p-6 hover:no-underline">
                     <div className="flex justify-between items-center w-full">
                        <CardTitle>Organiza un almuerzo</CardTitle>
                    </div>
                  </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6 p-0">
                           <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Título del Evento</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Ej: Almuerzo de equipo en La Pica' de la Esquina" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                             <FormField
                              control={form.control}
                              name="restaurantName"
                              render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Restaurante</FormLabel>
                                    <div className="flex gap-2">
                                        <Select value={field.value} onValueChange={handleRestaurantChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un restaurante" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {dineInRestaurants.map(r => (
                                                    <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button asChild type="button" variant="outline" size="icon" aria-label="Explorar restaurantes" className="max-w-[750px]">
                                            <Link href="/eater/discover?from=organize">
                                                <Search className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button asChild type="button" variant="outline" size="icon" aria-label="Obtener sugerencia de IA" className="max-w-[750px]">
                                            <Link href="/eater/assistant?from=organize">
                                                <Sparkles className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            {selectedRestaurant?.noShowPolicyMinutes && (
                            <FormField
                                control={form.control}
                                name="acceptedPolicy"
                                render={({ field }) => (
                                <FormItem>
                                    <Alert variant="destructive" className="animate-in fade-in">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Política de Cancelación por No-Show del Restaurante</AlertTitle>
                                        <AlertDescription>
                                        Este restaurante tiene una política de cancelación automática. Si no realizas el check-in antes de <strong>{selectedRestaurant.noShowPolicyMinutes} minutos</strong> después de la hora de tu reserva, esta se anulará.
                                        </AlertDescription>
                                        <div className="flex items-center space-x-2 pt-4">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} id="accept-policy" />
                                            </FormControl>
                                            <label
                                                htmlFor="accept-policy"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Acepto las condiciones de la política de cancelación del restaurante.
                                            </label>
                                        </div>
                                    </Alert>
                                    <FormMessage className="pt-2" />
                                </FormItem>
                                )}
                            />
                            )}

                            <FormField
                                control={form.control}
                                name="sharePhoneNumber"
                                render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base font-medium flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            Compartir mi teléfono con el restaurante
                                        </FormLabel>
                                        <p className="text-sm text-muted-foreground pl-6">
                                            Permite que el restaurante te contacte directamente si es necesario.
                                        </p>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                                )}
                            />


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <FormField
                                  control={form.control}
                                  name="date"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Fecha</FormLabel>
                                      <FormControl>
                                        <Input type="date" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="time"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Hora</FormLabel>
                                      <FormControl>
                                        <Input type="time" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                            </div>

                             <FormField
                                control={form.control}
                                name="isRecurring"
                                render={({ field }) => (
                                <FormItem className="space-y-4 rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="is-recurring" className="flex flex-col gap-1">
                                            <span className="text-base font-semibold">¿Repetir este evento?</span>
                                            <span className="font-normal text-muted-foreground text-xs">Actívalo para programar eventos recurrentes.</span>
                                        </Label>
                                        <FormControl>
                                            <Switch id="is-recurring" checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </div>
                                     {isRecurring && (
                                        <div className="space-y-4 animate-in fade-in">
                                            <FormField
                                                control={form.control}
                                                name="recurrenceRule.frequency"
                                                render={({ field: recurrenceField }) => (
                                                    <FormItem>
                                                        <FormLabel>Frecuencia</FormLabel>
                                                        <Select onValueChange={recurrenceField.onChange} defaultValue={recurrenceField.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Selecciona la frecuencia" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="weekly">Semanal</SelectItem>
                                                                <SelectItem value="monthly">Mensual</SelectItem>
                                                                <SelectItem value="annually">Anual</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {recurrenceFrequency === 'weekly' && (
                                                <FormField
                                                    control={form.control}
                                                    name="recurrenceRule.days"
                                                    render={() => (
                                                        <FormItem>
                                                            <FormLabel>Repetir los días</FormLabel>
                                                            <div className="grid grid-cols-4 gap-2">
                                                                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                                                                     <FormField
                                                                        key={day}
                                                                        control={form.control}
                                                                        name="recurrenceRule.days"
                                                                        render={({ field }) => (
                                                                            <FormItem className="flex items-center justify-center p-2 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                        checked={field.value?.includes(day)}
                                                                                        onCheckedChange={(checked) => {
                                                                                            const newValue = field.value ? [...field.value] : [];
                                                                                            if (checked) {
                                                                                                newValue.push(day);
                                                                                            } else {
                                                                                                const index = newValue.indexOf(day);
                                                                                                if (index > -1) newValue.splice(index, 1);
                                                                                            }
                                                                                            return field.onChange(newValue);
                                                                                        }}
                                                                                        className="sr-only"
                                                                                        id={`day-${day}`}
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel htmlFor={`day-${day}`} className="cursor-pointer">{day}</FormLabel>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            )}
                                        </div>
                                     )}
                                </FormItem>
                                )}
                            />

                             <div className="space-y-4 rounded-lg border p-4">
                                <h3 className="text-base font-semibold">¿Cómo se paga la cuenta?</h3>
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                     <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona cómo se pagará" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pay-own">Cada uno paga lo que consume</SelectItem>
                                                        <SelectItem value="split-equally">Se divide la cuenta en partes iguales</SelectItem>
                                                        <SelectItem value="host-pays">Paga quien invita</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            <FormField
                                control={form.control}
                                name="selectedContacts"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Invitados ({field.value.length})</FormLabel>
                                        <FormControl>
                                             <Button type="button" variant="outline" className="w-full justify-start text-muted-foreground max-w-[750px]" onClick={() => setIsContactsModalOpen(true)}>
                                                <Users className="mr-2 h-4 w-4" />
                                                {field.value.length > 0 ? "Editar Invitados" : "Seleccionar Invitados"}
                                            </Button>
                                        </FormControl>
                                        <FormMessage />
                                        {field.value.length > 0 && (
                                            <div className="space-y-2 pt-2">
                                                <div className="flex flex-wrap gap-2">
                                                {field.value.map((contact: Contact) => (
                                                    <div key={contact.id} className="flex items-center gap-2 bg-muted p-1.5 rounded-md text-sm">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                                                        <AvatarFallback>{contact.name.substring(0, 1)}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{contact.name}</span>
                                                    </div>
                                                ))}
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            Le mandaremos una invitación a cada persona que elijas.
                                        </p>
                                    </FormItem>
                                )}
                            />

                             <FormField
                              control={form.control}
                              name="notes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Notas o Comentarios</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="Añade detalles importantes, como si hay que reservar, si es una ocasión especial, etc." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="acceptedGeneralPolicy"
                                render={({ field }) => (
                                    <FormItem>
                                        <Alert variant="destructive">
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertTitle>¡Un Gran Poder Conlleva una Gran Responsabilidad!</AlertTitle>
                                            <AlertDescription>
                                            Organizar un almuerzo implica hacer una reserva en el restaurante. Al enviar la solicitud, te haces responsable de cumplirla: la hora de llegada y la cantidad de comensales (con una tolerancia del 20%). Tu "Nivel de Respeto a las Reservas" es visible para los restaurantes. ¡Cuídalo, es parte esencial de nuestra comunidad!
                                            </AlertDescription>
                                            <div className="flex items-center space-x-2 pt-4">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="accept-general-policy" />
                                                </FormControl>
                                                <label
                                                    htmlFor="accept-general-policy"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Entiendo y acepto las condiciones.
                                                </label>
                                            </div>
                                        </Alert>
                                        <FormMessage className="pt-2"/>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="pt-6">
                            <Button type="submit" className="ml-auto max-w-[750px] bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                <Send className="mr-2 h-4 w-4" />
                                )}
                                Enviar Solicitud
                            </Button>
                        </CardFooter>
                    </form>
                    </Form>
                </AccordionContent>
              </AccordionItem>
            </Card>
              <Card>
                  <AccordionItem value="received-invitations" className="border-b-0">
                  <AccordionTrigger className="p-6 hover:no-underline">
                      <div className="flex justify-between items-center w-full">
                        <CardTitle>Invitaciones Recibidas</CardTitle>
                      </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <div className="text-center text-muted-foreground p-4">
                            <Info className="h-6 w-6 mx-auto mb-2" />
                            <p>Aquí aparecerán las invitaciones que recibas.</p>
                        </div>
                      </div>
                  </AccordionContent>
                  </AccordionItem>
            </Card>

            <Card>
              <AccordionItem value="confirmed-events" className="border-b-0">
                  <AccordionTrigger className="p-6 hover:no-underline">
                    <div className="flex justify-between items-center w-full">
                        <CardTitle>Eventos Confirmados</CardTitle>
                    </div>
                  </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <div className="space-y-4">
                     <div className="text-center text-muted-foreground p-4">
                        <Info className="h-6 w-6 mx-auto mb-2" />
                        <p>Aquí aparecerán tus eventos confirmados.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>

            <Card>
              <AccordionItem value="organized-by-me" className="border-b-0">
                  <AccordionTrigger className="p-6 hover:no-underline">
                     <div className="flex justify-between items-center w-full">
                        <CardTitle>Almuerzos Organizados por Mí</CardTitle>
                    </div>
                  </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                   <div className="text-center text-muted-foreground p-4">
                        <Info className="h-6 w-6 mx-auto mb-2" />
                        <p>Aquí aparecerán los eventos que organices.</p>
                    </div>
                </AccordionContent>
              </AccordionItem>
            </Card>

          </Accordion>
        </div>
      </div>
      <ContactsModal 
        isOpen={isContactsModalOpen}
        onClose={() => setIsContactsModalOpen(false)}
        onConfirm={handleConfirmContacts}
        initialSelectedContacts={form.getValues('selectedContacts')}
      />
      <AlertDialog open={isWaitlistDialogOpen} onOpenChange={setIsWaitlistDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Restaurante Lleno</AlertDialogTitle>
            <AlertDialogDescription>
                &quot;{form.getValues('restaurantName')}&quot; está lleno en este momento pero tiene una lista de espera. ¿Te gustaría unirte?
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancelar Reserva</AlertDialogCancel>
            <AlertDialogAction onClick={() => proceedWithBooking(form.getValues(), 'lista-de-espera')}>
                Sí, unirme a la lista
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function OrganizePage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <OrganizePageContent />
        </Suspense>
    );
}
