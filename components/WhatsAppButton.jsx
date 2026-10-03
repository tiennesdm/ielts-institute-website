'use client';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({ whatsapp = '919876543210', whatsappConfig }) {
  if (whatsappConfig?.enabled === false) return null;

  const rawNumber = whatsappConfig?.number || whatsapp || '919876543210';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  if (!cleanNumber) return null;

  const prefilled = whatsappConfig?.prefilledMessage || 'Hello First Class Global Education, I am interested in IELTS coaching and would like to know batch timings and fees.';
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(prefilled)}`;
  const buttonText = whatsappConfig?.buttonText || 'Chat on WhatsApp';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with our counselor on WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 group transition-all hover:scale-105 active:scale-95"
    >
      <MessageCircle className="w-6 h-6 fill-white" />
      <span className="hidden sm:inline font-bold text-xs">{buttonText}</span>
    </a>
  );
}
