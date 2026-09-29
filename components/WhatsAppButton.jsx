'use client';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({ whatsapp = '919876543210' }) {
  if (!whatsapp) return null;

  const cleanNumber = whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=Hello%20First%20Class%20Global%20Education,%20I%20am%20interested%20in%20IELTS%20coaching%20and%20would%20like%20to%20know%20batch%20timings%20and%20fees.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with our counselor on WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 group transition-all hover:scale-105 active:scale-95"
    >
      <MessageCircle className="w-6 h-6 fill-white" />
      <span className="hidden sm:inline font-bold text-xs">Chat on WhatsApp</span>
    </a>
  );
}
