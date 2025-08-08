
export type ContactSource = 'Todos' | 'Teléfono' | 'WhatsApp' | 'Telegram' | 'Instagram' | 'Facebook' | 'Email';

export interface Contact {
  id: string;
  name: string;
  avatarUrl?: string;
  source: 'Teléfono' | 'WhatsApp' | 'Telegram' | 'Instagram' | 'Facebook' | 'Email';
  phone?: string;
  email?: string;
  username?: string;
  profileUrl?: string;
}
