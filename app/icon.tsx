import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #f5deb3 0%, #d4af37 50%, #b8860b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="url(#brassGradient)"
            stroke="#8b7355"
            strokeWidth="3"
          />
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="#f5deb3"
            stroke="#6b5345"
            strokeWidth="2"
          />
          {/* Pointer */}
          <path
            d="M 50 15 L 55 50 L 50 55 L 45 50 Z"
            fill="#ffd700"
            stroke="#d4af37"
            strokeWidth="1"
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
