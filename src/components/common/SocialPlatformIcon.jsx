import React from 'react';

/**
 * Composant d'icône officiel et stylisé pour les canaux de diffusion social media
 * Respecte les identités visuelles officielles (Facebook, Instagram, TikTok, X, LinkedIn, YouTube)
 */
export default function SocialPlatformIcon({ platform = '', size = 18, className = '', showLabel = false, labelClass = '' }) {
  const normalized = (platform || '').toLowerCase().trim();

  let icon = null;
  let label = platform;
  let bg = '#1E293B';
  let fg = '#FFFFFF';

  if (normalized.includes('facebook') || normalized === 'fb') {
    label = 'Facebook';
    bg = '#1877F2';
    icon = (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="12" fill="#1877F2" />
        <path
          d="M15.117 12.062h-2.19v7.938h-3.28v-7.938H7.906V9.281h1.741V7.477c0-2.38 1.008-3.477 3.515-3.477h2.247v2.781h-1.406c-1.109 0-1.406.523-1.406 1.398v1.102h2.797l-.277 2.781z"
          fill="#FFFFFF"
        />
      </svg>
    );
  } else if (normalized.includes('instagram') || normalized === 'insta' || normalized === 'ig') {
    label = 'Instagram';
    bg = 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)';
    icon = (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="igGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#833AB4" />
            <stop offset="0.5" stopColor="#FD1D1D" />
            <stop offset="1" stopColor="#FCB045" />
          </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#igGrad)" />
        <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
        <circle cx="12" cy="12" r="3.2" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
        <circle cx="15.8" cy="8.2" r="0.9" fill="#FFFFFF" />
      </svg>
    );
  } else if (normalized.includes('tiktok') || normalized === 'tk') {
    label = 'TikTok';
    bg = '#000000';
    icon = (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#000000" />
        <path
          d="M16.6 8.2c-1.1-.3-1.9-1.2-2.1-2.2H12v9.3c0 1.5-1.2 2.7-2.7 2.7s-2.7-1.2-2.7-2.7 1.2-2.7 2.7-2.7c.3 0 .6.1.9.2v-2.6c-.3 0-.6-.1-.9-.1-2.9 0-5.3 2.4-5.3 5.3s2.4 5.3 5.3 5.3 5.3-2.4 5.3-5.3V9.8c1.3.9 2.8 1.4 4.4 1.4V8.6c-.8 0-1.5-.1-2.1-.4z"
          fill="#25F4EE"
        />
        <path
          d="M16.3 7.8c-1.1-.3-1.9-1.2-2.1-2.2H12v9.3c0 1.5-1.2 2.7-2.7 2.7s-2.7-1.2-2.7-2.7 1.2-2.7 2.7-2.7c.3 0 .6.1.9.2v-2.6c-.3 0-.6-.1-.9-.1-2.9 0-5.3 2.4-5.3 5.3s2.4 5.3 5.3 5.3 5.3-2.4 5.3-5.3V9.4c1.3.9 2.8 1.4 4.4 1.4V8.2c-.7 0-1.4-.1-2.1-.4z"
          fill="#FE2C55"
        />
        <path
          d="M16.1 8c-1.1-.3-1.9-1.2-2.1-2.2h-2.1v9.3c0 1.5-1.2 2.7-2.7 2.7s-2.7-1.2-2.7-2.7 1.2-2.7 2.7-2.7c.3 0 .6.1.9.2V9.8c-.3 0-.6-.1-.9-.1-2.9 0-5.3 2.4-5.3 5.3s2.4 5.3 5.3 5.3 5.3-2.4 5.3-5.3V9.6c1.3.9 2.8 1.4 4.4 1.4V8.4c-.8 0-1.4-.1-2-.4z"
          fill="#FFFFFF"
        />
      </svg>
    );
  } else if (normalized.includes('twitter') || normalized === 'x' || normalized.includes('x_twitter')) {
    label = 'X (Twitter)';
    bg = '#000000';
    icon = (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#0F1419" />
        <path
          d="M17.3 4h2.1l-4.6 5.3L20.2 20h-4.2l-3.3-4.3-3.8 4.3H6.8l4.9-5.6L6.5 4h4.3l3 4 3.5-4zm-.7 14.7h1.2L9.4 5.2H8.1l8.5 13.5z"
          fill="#FFFFFF"
        />
      </svg>
    );
  } else if (normalized.includes('linkedin') || normalized === 'in') {
    label = 'LinkedIn';
    bg = '#0A66C2';
    icon = (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#0A66C2" />
        <path
          d="M6.9 8.7h2.6V18H6.9V8.7zM8.2 5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5S6.7 7.3 6.7 6.5 7.4 5 8.2 5zM11.4 8.7h2.5v1.3h.1c.4-.7 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.4V18h-2.6v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V18h-2.6l-.2-9.3z"
          fill="#FFFFFF"
        />
      </svg>
    );
  } else if (normalized.includes('youtube') || normalized === 'yt') {
    label = 'YouTube';
    bg = '#FF0000';
    icon = (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#FF0000" />
        <path
          d="M18.8 8.4c-.2-.7-.7-1.2-1.4-1.4C16.2 6.7 12 6.7 12 6.7s-4.2 0-5.4.3c-.7.2-1.2.7-1.4 1.4C5 9.6 5 12 5 12s0 2.4.2 3.6c.2.7.7 1.2 1.4 1.4 1.2.3 5.4.3 5.4.3s4.2 0 5.4-.3c.7-.2 1.2-.7 1.4-1.4.2-1.2.2-3.6.2-3.6s0-2.4-.2-3.6z"
          fill="#FFFFFF"
        />
        <path d="M10.6 14.1l3.7-2.1-3.7-2.1v4.2z" fill="#FF0000" />
      </svg>
    );
  } else {
    // Default fallback
    icon = (
      <div 
        style={{ 
          width: size, 
          height: size, 
          borderRadius: 6, 
          background: '#FF7900', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#FFF',
          fontSize: size * 0.5,
          fontWeight: 800
        }}
      >
        O
      </div>
    );
  }

  if (showLabel) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className="flex-shrink-0 inline-flex items-center justify-center">{icon}</span>
        <span className={labelClass || 'text-xs font-semibold'}>{label}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      {icon}
    </span>
  );
}
