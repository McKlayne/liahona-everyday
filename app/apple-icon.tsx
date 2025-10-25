import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #002b36 0%, #073642 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle - brass ball */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="url(#brassGradient)"
            stroke="#8b7355"
            strokeWidth="2"
          />

          {/* Inner decorative circles */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="rgba(139, 115, 85, 0.3)"
            strokeWidth="1"
          />

          {/* Center circle */}
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="#f5deb3"
            stroke="#6b5345"
            strokeWidth="1.5"
          />

          {/* Cardinal marks */}
          <line x1="50" y1="15" x2="50" y2="8" stroke="#6b5345" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="85" y1="50" x2="92" y2="50" stroke="#6b5345" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="85" x2="50" y2="92" stroke="#6b5345" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="15" y1="50" x2="8" y2="50" stroke="#6b5345" strokeWidth="2.5" strokeLinecap="round" />

          {/* Main pointer */}
          <path
            d="M 50 15 L 55 50 L 50 55 L 45 50 Z"
            fill="#ffd700"
            stroke="#d4af37"
            strokeWidth="1"
            opacity="0.9"
          />

          <defs>
            <radialGradient id="brassGradient">
              <stop offset="0%" stopColor="#f5deb3" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#b8860b" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
