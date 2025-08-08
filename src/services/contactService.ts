
'use server';

import { db } from '@/lib/firebase-admin';
import type { Contact } from '@/models/contact';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getContacts(): Promise<Contact[]> {
    await delay(50);
    const contactsCol = db.collection('contacts');
    const contactsSnapshot = await contactsCol.get();
    const contactsList = contactsSnapshot.docs.map(doc => doc.data() as Contact);
    return contactsList;
}
