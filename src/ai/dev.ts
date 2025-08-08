import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-lunch-menu.ts';
import '@/ai/flows/create-lunch-event.ts';
import '@/ai/flows/send-rating-request.ts';
import '@/ai/flows/migrate-db-flow.ts';
