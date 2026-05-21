import React from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';

const WhatsAppButton = () => {
  const { content } = useSiteContent();

  const phoneNumber = content.whatsapp?.phone || '5581989635638';
  const message = content.whatsapp?.message || 'Olá! Gostaria de solicitar uma cotação.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const title = content.whatsapp?.buttonTitle || 'Fale Conosco pelo WhatsApp';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-[#25D366] text-white shadow-[0_16px_36px_rgba(0,85,99,0.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1FB957]"
      title={title}
      aria-label={title}
    >
      <svg
        className="h-8 w-8"
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.02 4C9.4 4 4 9.38 4 16c0 2.1.55 4.16 1.6 5.98L4 28l6.18-1.62A11.92 11.92 0 0 0 16.02 28C22.64 28 28 22.62 28 16S22.64 4 16.02 4Zm0 21.95a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.67.96.98-3.58-.23-.37A9.95 9.95 0 1 1 16.02 25.95Z"
        />
        <path d="M21.52 18.48c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
