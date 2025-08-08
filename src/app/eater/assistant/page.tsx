
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { suggestLunchMenu, type SuggestLunchMenuInput, type SuggestLunchMenuOutput, type Suggestion } from "@/ai/flows/suggest-lunch-menu";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Wand2, MessageSquareQuote, Utensils, Users, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RestaurantCard } from "@/components/app/restaurant-card";
import type { Restaurant } from "@/models/restaurant";
import { RestaurantModal } from "@/components/app/restaurant-modal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { getPaymentMethods, getAvailableDiscounts } from "@/services/restaurantService";
import type { PaymentMethod, Discount } from "@/models/restaurant";

const formSchema = z.object({
  cravings: z.string().min(2, "Por favor, cuéntanos de qué tienes ganas."),
  pickyHabits: z.string().optional(),
  budget: z.number().min(0).max(100),
  distance: z.number().min(0).max(100),
  serviceType: z.enum(['dine-in', 'takeaway']),
  paymentMethods: z.array(z.string()).default([]),
  discounts: z.array(z.string()).default([]),
  searchFavoritesOnly: z.boolean().optional(),
  searchNew: z.boolean().optional(),
  searchFeatured: z.boolean().optional(),
});

export default function AssistantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestLunchMenuOutput | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [availableDiscounts, setAvailableDiscounts] = useState<Discount[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
        const [payments, discounts] = await Promise.all([
            getPaymentMethods(),
            getAvailableDiscounts()
        ]);
        setPaymentMethods(payments);
        setAvailableDiscounts(discounts);
    }
    loadData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cravings: "",
      pickyHabits: "",
      budget: 50,
      distance: 50,
      serviceType: "dine-in",
      paymentMethods: [],
      discounts: [],
      searchFavoritesOnly: false,
      searchNew: false,
      searchFeatured: false,
    },
  });

  const onSubmit: SubmitHandler<SuggestLunchMenuInput> = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await suggestLunchMenu(data);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "¡Oh no! Algo salió mal.",
        description: "Hubo un problema con nuestro asistente de IA. Por favor, inténtalo de nuevo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSuggestionAction = (suggestion: Suggestion) => {
    const serviceType = form.getValues('serviceType');
    const { dish, restaurant } = suggestion;

    if (serviceType === 'dine-in') {
      router.push(`/eater/organize?restaurant=${encodeURIComponent(restaurant.name)}`);
    } else {
      const params = new URLSearchParams({
          itemId: dish.id,
          restaurant: restaurant.name
      });
      router.push(`/eater/take-away?${params.toString()}`);
    }
  };

  return (
    <div className="space-y-8 pt-8">
      <PageHeader
        title="Pregúntale a OlivIA"
        description="Deja que nuestra IA te ayude a decidir qué almorzar."
      />
      <div className="grid gap-8 lg:grid-cols-3 items-start">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>¿De que tienes ganas hoy?</CardTitle>
            <CardDescription>¡Mientras más detalles nos des, mejor será la sugerencia!</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="cravings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿De qué tienes ganas?</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Algo fresco y liviano, una hamburguesa contundente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="pickyHabits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿Alguna maña?</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Sin cebolla, no muy picante" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Presupuesto</FormLabel>
                       <FormControl>
                        <Slider 
                          value={[field.value]}
                          max={100} 
                          step={1} 
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Económico</span>
                        <span>Lujoso</span>
                      </div>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="distance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distancia a caminar</FormLabel>
                       <FormControl>
                        <Slider 
                          value={[field.value]}
                          max={100} 
                          step={1} 
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                       <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Aquí mismo</span>
                        <span>Lejos</span>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Accordion type="multiple" className="w-full">
                    <AccordionItem value="more-criteria">
                        <AccordionTrigger className="text-base font-semibold">Más Criterios</AccordionTrigger>
                        <AccordionContent className="space-y-6 pt-4">
                            <FormField
                            control={form.control}
                            name="paymentMethods"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Medios de Pago</FormLabel>
                                    </div>
                                    {paymentMethods.map((item) => (
                                        <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="paymentMethods"
                                        render={({ field }) => {
                                            return (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(item.id)}
                                                    onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...field.value, item.id])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                            (value) => value !== item.id
                                                            )
                                                        )
                                                    }}
                                                />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                {item.label}
                                                </FormLabel>
                                            </FormItem>
                                            )
                                        }}
                                        />
                                    ))}
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="discounts"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Descuentos del Día</FormLabel>
                                    </div>
                                    {availableDiscounts.map((item) => (
                                        <FormField
                                        key={item.sponsor}
                                        control={form.control}
                                        name="discounts"
                                        render={({ field }) => {
                                            return (
                                            <FormItem
                                                key={item.sponsor}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(item.sponsor)}
                                                    onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...field.value, item.sponsor])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                            (value) => value !== item.sponsor
                                                            )
                                                        )
                                                    }}
                                                />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                {item.sponsor} - {item.description}
                                                </FormLabel>
                                            </FormItem>
                                            )
                                        }}
                                        />
                                    ))}
                                </FormItem>
                            )}
                            />
                            
                            <div className="space-y-4 rounded-lg border p-4">
                                <Label className="text-base">Filtros Adicionales</Label>
                                <FormField
                                    control={form.control}
                                    name="searchFavoritesOnly"
                                    render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between">
                                        <FormLabel>Solo en Favoritos</FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="searchNew"
                                    render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between">
                                        <FormLabel>Solo Restaurantes Nuevos</FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="searchFeatured"
                                    render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between">
                                        <FormLabel>Solo Restaurantes Destacados</FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                    )}
                                />
                            </div>

                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                     <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Tipo de Servicio
                        </FormLabel>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-4">
                            <Label>Para Llevar</Label>
                            <Switch
                                checked={field.value === 'dine-in'}
                                onCheckedChange={(checked) => field.onChange(checked ? 'dine-in' : 'takeaway')}
                            />
                            <Label>Para Servir</Label>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading} className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground max-w-[750px]">
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Sugerir Almuerzo
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <div className="flex flex-col space-y-4 lg:col-span-2">
            <CardHeader className="flex flex-row items-center gap-2 p-0">
              <Sparkles className="h-6 w-6 text-primary" />
              <CardTitle>OlivIA te propone</CardTitle>
            </CardHeader>
            {loading && <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            
            {!loading && !result && (
                <Card className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground text-center">Tu sugerencia de almuerzo personalizada aparecerá aquí.</p>
                </Card>
            )}

            {!loading && result && result.suggestions.length === 0 && (
                <Card className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground text-center p-4">¡Vaya! No encontramos sugerencias que coincidan con tu búsqueda. <br /> Intenta con criterios más amplios.</p>
                </Card>
            )}

            {result && result.suggestions.length > 0 && (
              <div className="space-y-6">
                {result.suggestions.map((suggestion, index) => (
                   <Card key={index} className="flex-grow flex flex-col">
                      <CardContent className="p-4 flex flex-col gap-4">
                          <div className="space-y-2">
                            <h3 className="font-semibold flex items-center text-sm gap-2"><MessageSquareQuote className="h-4 w-4 text-primary"/>El porqué de la IA</h3>
                            <p className="text-xs text-muted-foreground italic bg-muted/50 p-2 rounded-lg">"{suggestion.reasoning}"</p>
                          </div>
                          
                          <Separator />

                          <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-muted-foreground">Te gustaría comer:</h4>
                              <p className="font-bold text-primary flex items-center gap-2"><Utensils className="h-5 w-5"/>{suggestion.dish.name}</p>
                          </div>
                          
                           <div className="pt-2">
                             <RestaurantCard
                                restaurant={suggestion.restaurant}
                                onClick={() => setSelectedRestaurant(suggestion.restaurant)}
                                />
                           </div>
                           <Button onClick={() => handleSuggestionAction(suggestion)} className="w-full mt-2 max-w-[750px]">
                             {form.getValues('serviceType') === 'dine-in' ? 
                                <><Users className="mr-2 h-4 w-4" />Organizar Almuerzo</> : 
                                <><ShoppingBag className="mr-2 h-4 w-4" />Pedir para Llevar</>}
                            </Button>
                      </CardContent>
                   </Card>
                ))}
              </div>
            )}
        </div>
      </div>
      {selectedRestaurant && (
        <RestaurantModal
          restaurant={selectedRestaurant}
          isOpen={!!selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          fromOrganize={form.getValues('serviceType') === 'dine-in'}
        />
      )}
    </div>
  );
}
