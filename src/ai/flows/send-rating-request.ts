// The AI rating request flow.
//
// This file defines a Genkit flow that simulates sending a request to the user
// to rate a restaurant 5 hours after their reservation.
//
// - sendRatingRequest - A function that takes event details and simulates the notification.
// - SendRatingRequestInput - The input type for the sendRatingRequest function.
// - SendRatingRequestOutput - The return type for the sendRatingRequest function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendRatingRequestInputSchema = z.object({
  eventId: z.string().describe('The unique ID of the lunch event.'),
  organizerName: z.string().describe('The name of the person who organized the event.'),
  restaurantName: z.string().describe('The name of the restaurant.'),
});
export type SendRatingRequestInput = z.infer<typeof SendRatingRequestInputSchema>;

const SendRatingRequestOutputSchema = z.object({
  success: z.boolean(),
  message: z.string().describe('A confirmation or error message.'),
});
export type SendRatingRequestOutput = z.infer<typeof SendRatingRequestOutputSchema>;

export async function sendRatingRequest(input: SendRatingRequestInput): Promise<SendRatingRequestOutput> {
  return sendRatingRequestFlow(input);
}

const sendRatingRequestFlow = ai.defineFlow(
  {
    name: 'sendRatingRequestFlow',
    inputSchema: SendRatingRequestInputSchema,
    outputSchema: SendRatingRequestOutputSchema,
  },
  async (input) => {
    const ratingUrl = `https://almuerzo.cl/rate-event/${input.eventId}`;

    // Simulate sending a push notification or email
    console.log(`
      ================================================
      SIMULATING SENDING RATING REQUEST NOTIFICATION
      ================================================
      To: ${input.organizerName}
      Type: Push Notification / Email

      Subject: ¿Cómo estuvo tu almuerzo en ${input.restaurantName}?

      Hola, ${input.organizerName},

      ¡Esperamos que hayas disfrutado tu almuerzo! Tu opinión es muy importante para
      la comunidad de almuerzo.cl.

      Por favor, tómate un momento para calificar tu experiencia en "${input.restaurantName}".

      Califícalo en una escala de 1 a 5 tenedores aquí:
      >>> ${ratingUrl} <<<

      ¡Gracias por tu ayuda!

      El equipo de almuerzo.cl
      ================================================
    `);

    // For this simulation, we'll always return success.
    return {
      success: true,
      message: `Rating request for event ${input.eventId} has been sent.`,
    };
  }
);
