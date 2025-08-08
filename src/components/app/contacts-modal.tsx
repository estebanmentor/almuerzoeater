
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Phone, Mail, Check, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Contact, ContactSource } from "@/models/contact";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getContacts } from "@/services/contactService";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12.06 0C5.43 0 0 5.42 0 12.04c0 2.12.55 4.14 1.58 5.92L0 24l6.22-1.54a11.96 11.96 0 0 0 5.84 1.55h.01c6.63 0 12.05-5.42 12.05-12.05S18.68 0 12.06 0zm6.51 17.58c-.37.42-.84.67-1.42.75-.58.08-1.16.1-3.61-.89-2.45-.99-4.22-2.7-6-4.91-.7-1.09-1.02-2.22-1.02-3.37s.35-2.21 1.02-3.29c.32-.47.72-.73 1.18-.81.47-.07.93-.07 1.34.02.43.08.64.12.87.5.23.37.76 1.83.82 1.96.06.13.1.28.01.44-.09.16-.16.24-.31.41-.16.16-.32.35-.46.48-.15.13-.29.28-.42.45-.13.17-.27.35-.12.64.15.29.68 1.2 1.48 1.95.95.9 1.86 1.24 2.19 1.39.33.15.52.12.7-.08.18-.2.37-.47.52-.66.15-.19.29-.35.49-.35h.01c.21 0 .54.21.62.41.08.2.12.48.12.78-.01.3-.01.62-.03.73z"/>
    </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.17 7.153l-2.73 12.793c-.22.992-1.33.805-1.782-.243l-2.433-5.53-5.53-2.433c-1.047-.452-.855-1.562.243-1.782L17.413 6.82c.935-.18 1.48.375.957 1.333z"/>
    </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.784.305-1.455.718-2.126 1.387C1.333 2.705.92 3.376.612 4.14c-.3.765-.5 1.635-.558 2.913-.06 1.28-.072 1.687-.072 4.947s.015 3.667.072 4.947c.06 1.278.258 2.148.558 2.913.308.765.72 1.436 1.387 2.106.67.67 1.342 1.078 2.106 1.387.765.3 1.635.5 2.913.558 1.28.058 1.687.072 4.947.072s3.667-.015 4.947-.072c1.278-.06 2.148-.258 2.913-.558.765-.308 1.436-.718 2.106-1.387.67-.67 1.078-1.342 1.387-2.106.3-.765.5-1.635.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.278-.258-2.148-.558-2.913-.308-.765-.72-1.436-1.387-2.106-.67-.67-1.342-1.078-2.106-1.387-.765-.3-1.635-.5-2.913-.558C15.667.015 15.26 0 12 0zm0 2.16c3.203 0 3.585.012 4.85.07 1.17.055 1.805.248 2.17.415.53.25.925.592 1.317 1.317.39.39.785.733 1.317 1.317.168.365.36.998.415 2.17.058 1.265.07 1.646.07 4.85s-.012 3.585-.07 4.85c-.055 1.17-.248 1.805-.415 2.17-.25.53-.592.925-1.317 1.317-.39.39-.785.733-1.317-1.317-.365-.168-.998.36-2.17.415-1.265.058-1.646.07-4.85.07s-3.585-.012-4.85-.07c-1.17-.055-1.805-.248-2.17-.415-.53-.25-.925-.592-1.317-1.317-.39-.39-.785.733-1.317-1.317-.168-.365-.36-.998-.415-2.17-.058-1.265-.07-1.646-.07-4.85s.012-3.585.07-4.85c.055-1.17.248-1.805.415-2.17.25-.53.592.925 1.317-1.317.39-.39.785.733 1.317-1.317.365-.168.998.36 2.17.415 1.265-.058 1.646.07 4.85.07zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
    </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29h-3.128v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h5.694c.735 0 1.325-.59 1.325-.1.325V1.325C24 .59 23.41 0 22.675 0z"/>
    </svg>
);

const sourceIcons: Record<Exclude<ContactSource, 'Todos'>, React.ElementType> = {
  Teléfono: (props) => <Phone {...props} />,
  WhatsApp: (props) => <WhatsAppIcon {...props} fill="currentColor" />,
  Telegram: (props) => <TelegramIcon {...props} fill="currentColor" />,
  Instagram: (props) => <InstagramIcon {...props} fill="currentColor" />,
  Facebook: (props) => <FacebookIcon {...props} fill="currentColor" />,
  Email: (props) => <Mail {...props} />,
};

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedContacts: Contact[]) => void;
  initialSelectedContacts: Contact[];
}

export function ContactsModal({ isOpen, onClose, onConfirm, initialSelectedContacts }: ContactsModalProps) {
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>(initialSelectedContacts);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const contacts = await getContacts();
      setAllContacts(contacts);
      setLoading(false);
    }
    if (isOpen) {
        loadData();
    }
  }, [isOpen]);
  
  useEffect(() => {
    setSelectedContacts(initialSelectedContacts);
  }, [initialSelectedContacts]);

  const sources: ContactSource[] = ["Todos", "Teléfono", "WhatsApp", "Telegram", "Instagram", "Facebook", "Email"];

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  
  const handleSelectContact = (contact: Contact) => {
    setSelectedContacts(prev =>
      prev.some(c => c.id === contact.id)
        ? prev.filter(c => c.id !== contact.id)
        : [...prev, contact]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedContacts);
  };

  const filteredContacts = allContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getSourceIcon = (source: Exclude<ContactSource, 'Todos'>) => {
    const Icon = sourceIcons[source];
    if (!Icon) return null;
    return <Icon className="h-4 w-4 text-muted-foreground" />;
  };

  const renderContactList = (source: ContactSource) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    const contactsToList = (source === "Todos" ? filteredContacts : filteredContacts.filter(c => c.source === source));

    if (contactsToList.length === 0) {
      return (
        <div className="text-center py-16 text-muted-foreground">
          <p>No se encontraron contactos en &quot;{source}&quot;.</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 pr-4">
        {contactsToList.map(contact => (
          <Label
            key={contact.id}
            htmlFor={`contact-${contact.id}`}
            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
          >
            <Checkbox
              id={`contact-${contact.id}`}
              checked={selectedContacts.some(c => c.id === contact.id)}
              onCheckedChange={() => handleSelectContact(contact)}
            />
            <Avatar className="h-10 w-10">
              <AvatarImage src={contact.avatarUrl} alt={contact.name} />
              <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <h3 className="font-semibold">{contact.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {contact.source !== 'Todos' && getSourceIcon(contact.source as Exclude<ContactSource, 'Todos'>)}
                <span>{contact.source}</span>
              </div>
            </div>
          </Label>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
            <DialogHeader className="p-6 pb-0">
                <DialogTitle>Seleccionar Invitados</DialogTitle>
                <DialogDescription>Elige los contactos que quieres invitar a tu almuerzo.</DialogDescription>
            </DialogHeader>

            <div className="flex justify-between items-center gap-4 px-6 pt-4">
                <div className="relative w-full max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Añadir Contacto
                </Button>
            </div>
            
            <div className="flex-grow min-h-0 px-6">
                <Tabs defaultValue="Todos" className="w-full flex flex-col h-full">
                    <TabsList className="mt-4">
                    {sources.map(source => (
                        <TabsTrigger key={source} value={source}>{source}</TabsTrigger>
                    ))}
                    </TabsList>

                    <div className="flex-grow min-h-0 mt-4">
                        {sources.map(source => (
                        <TabsContent key={source} value={source} className="h-full m-0">
                            <ScrollArea className="h-full">
                                {renderContactList(source)}
                            </ScrollArea>
                        </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </div>
            
            <DialogFooter className="p-6 border-t">
                <p className="text-sm font-medium mr-auto">
                {selectedContacts.length > 0 
                    ? `${selectedContacts.length} invitado(s) seleccionado(s)`
                    : 'Selecciona invitados de la lista'
                }
                </p>
                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                <Button onClick={handleConfirm} disabled={selectedContacts.length === 0}>
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar Invitados
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}

    