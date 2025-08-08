
// The AI lunch menu assistant flow.
//
// This file defines a Genkit flow that suggests lunch menus based on dietary preferences, mood, and available restaurants.
//
// - suggestLunchMenu - A function that takes dietary preferences, mood, and available restaurants as input and returns a suggested lunch menu.
// - SuggestLunchMenuInput - The input type for the suggestLunchMenu function.
// - SuggestLunchMenuOutput - The return type for the suggestLunchMenu function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getAllRestaurants } from '@/services/restaurantService';
import type { Restaurant } from '@/models/restaurant';

const SuggestLunchMenuInputSchema = z.object({
  cravings: z
    .string()
    .describe('Lo que el usuario tiene ganas de comer (ej: algo liviano, una hamburguesa contundente).'),
  pickyHabits: z
    .string()
    .optional()
    .describe('Cualquier maña o cosa que el usuario quiera evitar (ej: sin cebolla, no muy picante).'),
  budget: z.number().min(0).max(100).describe('El presupuesto para la comida, en una escala de 0 a 100.'),
  distance: z.number().min(0).max(100).describe('La preferencia de distancia para caminar, en una escala de 0 a 100.'),
  serviceType: z.enum(['dine-in', 'takeaway']).describe("Si el usuario quiere comer en el local ('para servir') o pedir para llevar ('para llevar')."),
  searchFavoritesOnly: z.boolean().optional().describe('Si se debe buscar solo en los restaurantes favoritos.'),
  paymentMethods: z.array(z.string()).optional().describe('Los medios de pago que el usuario prefiere usar.'),
  discounts: z.array(z.string()).optional().describe('Descuentos específicos que el usuario quiere aprovechar.'),
  searchNew: z.boolean().optional().describe('Si se debe buscar solo en restaurantes nuevos.'),
  searchFeatured: z.boolean().optional().describe('Si se debe buscar solo en restaurantes destacados.'),
  eventTitle: z.string().optional().describe('El título de un evento de almuerzo que se está organizando. Úsalo como contexto.'),
  eventNotes: z.string().optional().describe('Las notas para un evento de almuerzo que se está organizando. Úsalo como contexto.'),
});
export type SuggestLunchMenuInput = z.infer<typeof SuggestLunchMenuInputSchema>;

const MenuItemSchema = z.object({
    id: z.string(),
    restaurantId: z.string(),
    name: z.string(),
    description: z.string(),
    regularPrice: z.number(),
    salePrice: z.number().optional(),
    rating: z.number().optional(),
    imageUrl: z.string(),
    imageHint: z.string().optional(),
    availableForTakeaway: z.boolean(),
    isVegan: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    stock: z.number().optional(),
});

const RestaurantSchema = z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    location: z.object({ lat: z.number(), lon: z.number() }),
    imageUrl: z.string(),
    distance: z.number(),
    cuisine: z.string(),
    rating: z.object({ google: z.number(), userCount: z.number() }),
    isNew: z.boolean(),
    isFavorite: z.boolean(),
    menu: z.array(MenuItemSchema),
});

const SuggestionSchema = z.object({
  reasoning: z.string().max(300).describe('El razonamiento detrás de la sugerencia, en unos 300 caracteres.'),
  dish: MenuItemSchema.describe('El objeto completo del plato sugerido.'),
  restaurant: RestaurantSchema.describe('El objeto completo del restaurante sugerido, incluyendo su menú.'),
  distance: z.string().describe('La distancia al restaurante.'),
});

const SuggestLunchMenuOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema).length(4).describe('Una lista de 4 sugerencias de almuerzo.'),
});
export type SuggestLunchMenuOutput = z.infer<typeof SuggestLunchMenuOutputSchema>;

export async function suggestLunchMenu(input: SuggestLunchMenuInput): Promise<SuggestLunchMenuOutput> {
  return suggestLunchMenuFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLunchMenuPrompt',
  input: {schema: z.object({ 
    ...SuggestLunchMenuInputSchema.shape,
    restaurants: z.array(RestaurantSchema).describe('Lista de restaurantes disponibles para elegir.'),
  })},
  output: {schema: SuggestLunchMenuOutputSchema},
  prompt: `Eres un asistente de almuerzo IA, buena onda y que habla en chileno. Tu objetivo es dar 4 recomendaciones de almuerzo súper personalizadas de 4 restaurantes DIFERENTES.
Analiza la información del usuario, incluyendo su comportamiento anterior (si tienes acceso a esos datos, como horarios, preferencias, si come solo o acompañado) y el contexto actual (clima, estación del año).
Tu búsqueda se limita a la lista de restaurantes disponibles proporcionada. Si el usuario te pide buscar solo en sus restaurantes favoritos, hazle caso y prioriza esos. También considera sus filtros de "nuevos" y "destacados".

Basado en toda esta información, genera una respuesta estructurada con un campo 'suggestions' que contenga un arreglo de 4 objetos. Cada objeto debe tener los siguientes campos:
1.  **reasoning**: Un resumen de 300 caracteres con la lógica detrás de tu elección para esta opción. Sé creativo y simpático.
2.  **dish**: El objeto completo de un plato específico de uno de los restaurantes disponibles.
3.  **restaurant**: El objeto completo del restaurante donde se puede encontrar el plato. Asegúrate de devolver el objeto completo del restaurante elegido de la lista, incluyendo su menú.
4.  **distance**: La distancia al restaurante (ej: "a 5 minutos caminando", "1.2 km").

Datos del usuario:
Ganas de comer: {{{cravings}}}
Mañas: {{{pickyHabits}}}
Nivel de Presupuesto (0-100): {{{budget}}}
Ganas de caminar (0-100): {{{distance}}}
Tipo de Servicio: {{{serviceType}}}
Buscar solo en favoritos: {{{searchFavoritesOnly}}}
Buscar solo nuevos: {{{searchNew}}}
Buscar solo destacados: {{{searchFeatured}}}
Medios de pago preferidos: {{{json paymentMethods}}}
Descuentos a usar: {{{json discounts}}}

Contexto del evento (si aplica):
Título: {{{eventTitle}}}
Notas: {{{eventNotes}}}

Restaurantes disponibles:
{{{json restaurants}}}

Ahora, ¡tírate las 4 recomendaciones!
`,
});

const suggestLunchMenuFlow = ai.defineFlow(
  {
    name: 'suggestLunchMenuFlow',
    inputSchema: SuggestLunchMenuInputSchema,
    outputSchema: SuggestLunchMenuOutputSchema,
  },
  async (input) => {
    // In a real app, you would filter restaurants based on location, user prefs, etc.
    // For this demo, we'll use a simplified list from the DB.
    let allRestaurants = await getAllRestaurants();

    let availableRestaurants = allRestaurants.map(r => ({
      ...r, // Spread all properties from the restaurant
      // Ensure menu is an array, defaulting to empty if it doesn't exist
      menu: r.menu || [], 
    }));

    // Filter by service type based on user input
    if (input.serviceType === 'dine-in') {
        availableRestaurants = availableRestaurants.filter(r => r.availableServices.includes('Para servir'));
    } else if (input.serviceType === 'takeaway') {
        availableRestaurants = availableRestaurants.filter(r => r.availableServices.includes('Para llevar'));
    }
    
    const {output} = await prompt({
      ...input,
      restaurants: availableRestaurants,
    });
    return output!;
  }
);
