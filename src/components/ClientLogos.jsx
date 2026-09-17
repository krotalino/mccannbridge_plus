import React from 'react';

/**
 * 1. Logo Orange Cameroun ("Orange est là")
 * Exact match to user-uploaded `logo_orange_cameroun.png`:
 * Black background square, central Orange square with white horizontal bar at bottom,
 * and the iconic white "est là" text underneath.
 */
export function OrangeCamerounLogo({ size = 44, radius = 12, className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: '#000000',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.45)',
      }}
      aria-label="Orange Cameroun est là"
    >
      <svg
        viewBox="0 0 100 100"
        width="86%"
        height="86%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Central Orange Square */}
        <rect x="18" y="7" width="64" height="58" rx="2" fill="#FF7900" />

        {/* White Bar at bottom of the orange square */}
        <rect x="25.5" y="47" width="49" height="10" rx="1" fill="#FFFFFF" />

        {/* Brand signature "est là" in white bold sans-serif */}
        <text
          x="50"
          y="89"
          fill="#FFFFFF"
          fontSize="24"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          textAnchor="middle"
          letterSpacing="-0.035em"
        >
          est là
        </text>
      </svg>
    </div>
  );
}

/**
 * 2. Logo Chococam
 * Exact match to user-uploaded `logo_chococam.jpg`:
 * Clean white card, tilted chocolate-brown parallelogram banner with gold/red borders,
 * "CHOCOCAM" in white bold italic, and the top circular Tiger crest.
 */
export function ChococamLogo({ size = 44, radius = 12, className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
      }}
      aria-label="Chococam"
    >
      <svg
        viewBox="0 0 160 100"
        width="92%"
        height="92%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="chococam-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#481F0E" />
            <stop offset="50%" stopColor="#321307" />
            <stop offset="100%" stopColor="#1E0A03" />
          </linearGradient>
          <filter id="chococam-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Angled Parallelogram Banner */}
        <g filter="url(#chococam-glow)">
          {/* Outer red boundary */}
          <polygon
            points="14,76 146,30 154,58 22,104"
            fill="#D42017"
          />
          {/* Middle bright gold line */}
          <polygon
            points="16,74 144,32 151,56 23,98"
            fill="#F6B833"
          />
          {/* Inner dark chocolate fill */}
          <polygon
            points="18.5,72.5 141.5,34 148.5,54 25.5,92.5"
            fill="url(#chococam-grad)"
          />
        </g>

        {/* Text "CHOCOCAM" tilted at -17deg along the banner axis */}
        <g transform="translate(85, 68) rotate(-17)">
          {/* Red/dark shadow */}
          <text
            x="0"
            y="2"
            fill="#80140A"
            fontSize="25"
            fontWeight="900"
            fontStyle="italic"
            fontFamily="'Arial Black', Impact, sans-serif"
            textAnchor="middle"
            letterSpacing="0.04em"
          >
            CHOCOCAM
          </text>
          {/* Main crisp white lettering */}
          <text
            x="0"
            y="0"
            fill="#FFFFFF"
            fontSize="25"
            fontWeight="900"
            fontStyle="italic"
            fontFamily="'Arial Black', Impact, sans-serif"
            textAnchor="middle"
            letterSpacing="0.04em"
          >
            CHOCOCAM
          </text>
        </g>

        {/* Top Circular Emblem (Tiger Crest) */}
        <g transform="translate(80, 36)">
          {/* Gold wings/ribbon behind */}
          <ellipse cx="0" cy="0" rx="17" ry="7" fill="#ECA72C" />
          {/* Red circular badge with gold stroke */}
          <circle cx="0" cy="0" r="11" fill="#C91B10" stroke="#F6B833" strokeWidth="1.8" />
          {/* Gold script monogram */}
          <text
            x="0"
            y="3.5"
            fill="#F6B833"
            fontSize="10.5"
            fontWeight="bold"
            fontStyle="italic"
            fontFamily="Georgia, serif"
            textAnchor="middle"
          >
            Vtt
          </text>
        </g>

        {/* Registered Trademark (R) in red */}
        <g transform="translate(143, 27)">
          <circle cx="0" cy="0" r="4.5" fill="none" stroke="#D42017" strokeWidth="0.8" />
          <text
            x="0"
            y="2.3"
            fill="#D42017"
            fontSize="5.5"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            R
          </text>
        </g>
      </svg>
    </div>
  );
}

/**
 * 3. Logo Boissons du Cameroun
 * Exact match to user-uploaded `logo_brasseries_du _cameroun.png`:
 * Clean white card, gray scalloped bottle cap on the left enclosing the red lion rampant,
 * and the wordmark "Boissons" (red with yellow dot on i) and "du Cameroun" (slate gray).
 */
export function BoissonsDuCamerounLogo({ size = 44, radius = 12, className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
      }}
      aria-label="Boissons du Cameroun"
    >
      <svg
        viewBox="0 0 100 100"
        width="92%"
        height="92%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Crown Bottle Cap (Capsule dentelée) in Slate Gray */}
        {/* Radius ~ 20, center at (26, 50) */}
        <g stroke="#717376" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Circular arc with teeth on left side */}
          <path d="
            M 26,24
            L 22,25 L 23,29 L 19,31 L 21,35 L 16,38 L 19,42 L 15,46 L 18,50 
            L 15,54 L 19,58 L 16,62 L 21,65 L 19,69 L 23,71 L 22,75 L 26,76
            A 26 26 0 0 0 45,69
            M 45,31
            A 26 26 0 0 0 26,24
          " />
        </g>

        {/* Heraldic Red Lion Rampant inside the bottle cap */}
        <g fill="#E21E26" transform="translate(25, 49) scale(0.68)">
          {/* Head, open jaw, ears */}
          <path d="M 0,-18 C -3,-18 -5,-16 -6,-13 C -8,-10 -6,-7 -4,-6 C -6,-5 -7,-3 -7,-1 C -5,0 -3,-1 -1,-2 C -2,0 -2,3 -1,5 C 2,4 3,1 4,-1 C 6,-3 5,-6 4,-8 C 6,-9 6,-13 4,-15 C 3,-17 2,-18 0,-18 Z" />
          {/* Body and flowing mane */}
          <path d="M -3,-10 C -7,-6 -8,0 -7,6 C -5,11 -3,15 -1,18 C 1,16 2,11 2,6 C 1,0 0,-6 -3,-10 Z" />
          {/* Raised forepaws / claws reaching right */}
          <path d="M 2,-10 C 6,-11 11,-12 14,-10 C 15,-9 14,-7 12,-7 C 14,-6 15,-4 13,-4 C 10,-4 6,-7 3,-6 Z" />
          <path d="M 1,-4 C 5,-5 9,-4 12,-1 C 13,0 12,2 10,1 C 11,3 11,5 9,4 C 6,3 3,0 1,-2 Z" />
          {/* Hind legs planted firmly */}
          <path d="M -5,12 C -8,14 -12,17 -13,21 C -12,23 -9,22 -8,20 C -7,18 -5,16 -4,14 Z" />
          <path d="M -1,14 C 1,17 3,20 4,23 C 6,24 8,23 7,21 C 5,18 2,15 0,13 Z" />
          {/* Waving tail with tuft */}
          <path d="M -6,6 C -11,4 -15,1 -16,-4 C -17,-8 -15,-12 -13,-15 C -11,-17 -9,-14 -10,-12 C -11,-8 -12,-4 -10,0 C -8,3 -6,5 -5,6 Z" />
          <circle cx="-13" cy="-15" r="2.2" />
        </g>

        {/* Wordmark "Boissons" in red */}
        <text
          x="44"
          y="48"
          fill="#E21E26"
          fontSize="14.5"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          letterSpacing="-0.02em"
        >
          Boissons
        </text>

        {/* Bright Yellow Dot over 'i' in Boissons */}
        <circle cx="63.2" cy="38" r="2.2" fill="#F8BA00" />

        {/* Wordmark "du Cameroun" in slate gray */}
        <text
          x="44"
          y="63"
          fill="#52555A"
          fontSize="10.8"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          letterSpacing="-0.02em"
        >
          du Cameroun
        </text>
      </svg>
    </div>
  );
}

/**
 * 4. Logo Orange Burkina Faso ("Orange est là")
 * Exact match to user-uploaded `logo_orange_burkina.png`:
 * Black background square, central Orange square with white horizontal bar,
 * and the iconic white "est là" wordmark underneath.
 */
export function OrangeBurkinaLogo({ size = 44, radius = 12, className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: '#000000',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.45)',
      }}
      aria-label="Orange Burkina Faso est là"
    >
      <svg
        viewBox="0 0 100 100"
        width="86%"
        height="86%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Central Orange Square */}
        <rect x="18" y="7" width="64" height="58" rx="2" fill="#FF7900" />

        {/* White Bar at bottom of the orange square */}
        <rect x="25.5" y="47" width="49" height="10" rx="1" fill="#FFFFFF" />

        {/* Brand signature "est là" in white bold sans-serif */}
        <text
          x="50"
          y="89"
          fill="#FFFFFF"
          fontSize="24"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          textAnchor="middle"
          letterSpacing="-0.035em"
        >
          est là
        </text>
      </svg>
    </div>
  );
}

/**
 * Dynamic Universal Client Logo Component
 * Dispatches to the exact official logo based on the client ID or mark.
 */
export default function DynamicClientLogo({ client, size = 44, radius = 12, className = '' }) {
  if (!client) return null;

  const id = (client.id || client.mark || client.name || '').toLowerCase();

  // 1. Orange Cameroun ("Orange est là")
  if (id.includes('orange-cm') || (id.includes('orange') && id.includes('cameroun')) || id === 'orange_cameroun') {
    return <OrangeCamerounLogo size={size} radius={radius} className={className} />;
  }

  // 2. Chococam
  if (id.includes('chococam') || id.includes('coco')) {
    return <ChococamLogo size={size} radius={radius} className={className} />;
  }

  // 3. Boissons du Cameroun / SABC
  if (id.includes('sabc') || id.includes('boisson') || id.includes('brasserie')) {
    return <BoissonsDuCamerounLogo size={size} radius={radius} className={className} />;
  }

  // 4. Orange Burkina Faso
  if (id.includes('orange-bf') || id.includes('burkina')) {
    return <OrangeBurkinaLogo size={size} radius={radius} className={className} />;
  }

  // Default fallback for any other Orange entity
  if (id.includes('orange')) {
    return <OrangeCamerounLogo size={size} radius={radius} className={className} />;
  }

  // Fallback styling with initials
  return (
    <div
      className={`relative flex items-center justify-center font-bold overflow-hidden shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: client.bg || '#333333',
        color: client.fg || '#ffffff',
        fontSize: Math.max(9, Math.round(size * 0.28)),
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
      }}
    >
      {client.mark || client.name?.slice(0, 2)?.toUpperCase() || 'OC'}
    </div>
  );
}
