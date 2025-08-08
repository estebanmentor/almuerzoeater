// The AI lunch event creation flow.
//
// This file defines a Genkit flow that handles the creation of a new lunch event,
// including sending invitations to guests and notifying the restaurant.
//
// - createLunchEvent - A function that takes event details and guest list, then processes the creation.
// - CreateLunchEventInput - The input type for the createLunchEvent function.
// - CreateLunchEventOutput - The return type for the createLunchEvent function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Contact } from '@/models/contact';
import { sendRatingRequest } from './send-rating-request';

const ContactSchema = z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().optional(),
    source: z.enum(['Teléfono', 'WhatsApp', 'Telegram', 'Instagram', 'Facebook', 'Email']),
    phone: z.string().optional(),
    email: z.string().optional(),
    username: z.string().optional(),
    profileUrl: z.string().optional(),
});

const RecurrenceRuleSchema = z.object({
    frequency: z.enum(['weekly', 'monthly', 'annually']).optional(),
    days: z.array(z.string()).optional(),
    endDate: z.string().optional(),
    occurrences: z.number().optional(),
}).optional();

const CreateLunchEventInputSchema = z.object({
  title: z.string().describe('El título del evento de almuerzo.'),
  restaurantName: z.string().describe('El nombre del restaurante elegido.'),
  organizerName: z.string().describe('El nombre de la persona que organiza.'),
  dateTime: z.string().describe('La fecha y hora del evento en formato ISO.'),
  notes: z.string().optional().describe('Cualquier nota o comentario adicional para el evento.'),
  guests: z.array(ContactSchema).describe('La lista de contactos invitados.'),
  status: z.enum(['confirmado', 'lista-de-espera', 'pendiente-confirmacion']).optional().default('confirmado').describe('El estado de la reserva.'),
  recurrenceRule: RecurrenceRuleSchema.describe('La regla de recurrencia para el evento.'),
});
export type CreateLunchEventInput = z.infer<typeof CreateLunchEventInputSchema>;

const CreateLunchEventOutputSchema = z.object({
  success: z.boolean(),
  eventId: z.string().describe('El ID único del evento creado.'),
  message: z.string().describe('Un mensaje de confirmación o error.'),
});
export type CreateLunchEventOutput = z.infer<typeof CreateLunchEventOutputSchema>;

export async function createLunchEvent(input: CreateLunchEventInput): Promise<CreateLunchEventOutput> {
  return createLunchEventFlow(input);
}

const createLunchEventFlow = ai.defineFlow(
  {
    name: 'createLunchEventFlow',
    inputSchema: CreateLunchEventInputSchema,
    outputSchema: CreateLunchEventOutputSchema,
  },
  async (input) => {
    // 1. Generate a unique event ID
    const eventId = `evt_${new Date().getTime()}_${Math.random().toString(36).substring(2, 9)}`;
    const eventUrl = `https://almuerzo.cl/event/${eventId}`;

    // 2. Simulate sending invitations to guests
    for (const guest of input.guests) {
        let invitationMessage = '';
        switch(input.status) {
            case 'lista-de-espera':
                invitationMessage = `¡Hola ${guest.name}! ${input.organizerName} te ha puesto en la lista de espera para un almuerzo: "${input.title}" en ${input.restaurantName}. Te notificaremos si se libera un espacio. Detalles: ${eventUrl}`;
                break;
            case 'pendiente-confirmacion':
                invitationMessage = `¡Hola ${guest.name}! ${input.organizerName} ha solicitado una reserva para "${input.title}" en ${input.restaurantName}. Te notificaremos tan pronto como el restaurante confirme. Detalles: ${eventUrl}`;
                break;
            case 'confirmado':
            default:
                 invitationMessage = `¡Hola ${guest.name}! ${input.organizerName} te ha invitado a un almuerzo: "${input.title}" en ${input.restaurantName}. Revisa los detalles y confirma tu asistencia aquí: ${eventUrl}`;
                 break;
        }
      console.log(`Simulando envío de invitación a ${guest.name} vía ${guest.source}: ${invitationMessage}`);
      // In a real app, you would integrate with services like Twilio for SMS/WhatsApp, SendGrid for email, etc.
    }

    // 3. Simulate notifying the restaurant
     let restaurantNotification = '';
     let successMessage = '';
     switch(input.status) {
        case 'lista-de-espera':
            restaurantNotification = `Nuevo registro en lista de espera para ${input.guests.length + 1} personas para el ${new Date(input.dateTime).toLocaleString('es-CL')}. Evento: ${input.title}. ID: ${eventId}.`;
            successMessage = `¡Estás en la lista de espera! Se notificó al restaurante y a tus invitados.`;
            break;
        case 'pendiente-confirmacion':
            restaurantNotification = `Nueva solicitud de reserva para ${input.guests.length + 1} personas para el ${new Date(input.dateTime).toLocaleString('es-CL')}. Evento: ${input.title}. ID: ${eventId}. Por favor, confirma o rechaza esta solicitud en tu panel de administrador.`;
            successMessage = `¡Solicitud de reserva enviada! El restaurante ha sido notificado y te avisaremos cuando la confirmen.`;
            break;
        case 'confirmado':
        default:
            restaurantNotification = `Nueva reserva confirmada para ${input.guests.length + 1} personas el ${new Date(input.dateTime).toLocaleString('es-CL')}. Evento: ${input.title}. ID: ${eventId}.`;
            successMessage = `¡Evento creado y ${input.guests.length} invitaciones enviadas! El restaurante ha sido notificado.`;
            break;
     }

    console.log(`Simulando notificación al restaurante "${input.restaurantName}": ${restaurantNotification}`);

    // 4. Schedule a rating request notification
    if (input.status === 'confirmado') {
        const reservationTime = new Date(input.dateTime);
        const notificationTime = new Date(reservationTime.getTime() + 5 * 60 * 60 * 1000); // 5 hours after reservation
        console.log(`Simulando programación de notificación de calificación para el evento ${eventId} a las ${notificationTime.toLocaleString('es-CL')}`);
        // In a real app, you would use a scheduler (e.g., Cloud Tasks, cron job) to trigger this.
        // For simulation purposes, we can call it directly or with a delay.
        // We will just log it here.
        setTimeout(() => {
            sendRatingRequest({
                eventId,
                organizerName: input.organizerName,
                restaurantName: input.restaurantName,
            });
        }, 10000); // Simulating a delay for demo
    }
      
    return {
      success: true,
      eventId: eventId,
      message: successMessage,
    };
  }
);
