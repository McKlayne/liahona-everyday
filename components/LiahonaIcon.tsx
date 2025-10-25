interface LiahonaIconProps {
  size?: number;
  className?: string;
}

export default function LiahonaIcon({ size = 24, className = '' }: LiahonaIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle - brass ball */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#brassGradient)"
        stroke="url(#brassStroke)"
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
      <circle
        cx="50"
        cy="50"
        r="32"
        fill="none"
        stroke="rgba(139, 115, 85, 0.2)"
        strokeWidth="1"
      />

      {/* Center circle */}
      <circle
        cx="50"
        cy="50"
        r="8"
        fill="url(#centerGradient)"
        stroke="#6b5345"
        strokeWidth="1.5"
      />

      {/* Cardinal directions - decorative marks */}
      {[0, 90, 180, 270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 50 + Math.cos(rad) * 35;
        const y1 = 50 + Math.sin(rad) * 35;
        const x2 = 50 + Math.cos(rad) * 42;
        const y2 = 50 + Math.sin(rad) * 42;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#6b5345"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}

      {/* Spindles/pointers - the key feature of the Liahona */}
      {/* Main pointer (pointing upward - representing faith/direction) */}
      <g transform="rotate(-45 50 50)">
        <path
          d="M 50 15 L 55 50 L 50 55 L 45 50 Z"
          fill="url(#pointerGradient)"
          stroke="#d4af37"
          strokeWidth="1"
          opacity="0.9"
        />
      </g>

      {/* Secondary pointer */}
      <g transform="rotate(135 50 50)">
        <path
          d="M 50 20 L 53 50 L 50 53 L 47 50 Z"
          fill="url(#pointer2Gradient)"
          stroke="#b8860b"
          strokeWidth="1"
          opacity="0.7"
        />
      </g>

      {/* Decorative dots around the edge */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x = 50 + Math.cos(angle) * 28;
        const y = 50 + Math.sin(angle) * 28;
        return (
          <circle
            key={`dot-${i}`}
            cx={x}
            cy={y}
            r="1.5"
            fill="#8b7355"
            opacity="0.5"
          />
        );
      })}

      {/* Gradients */}
      <defs>
        <radialGradient id="brassGradient">
          <stop offset="0%" stopColor="#f5deb3" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#b8860b" />
        </radialGradient>

        <linearGradient id="brassStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8b7355" />
        </linearGradient>

        <radialGradient id="centerGradient">
          <stop offset="0%" stopColor="#f5deb3" />
          <stop offset="100%" stopColor="#d4af37" />
        </radialGradient>

        <linearGradient id="pointerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>

        <linearGradient id="pointer2Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e6c200" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
      </defs>
    </svg>
  );
}
