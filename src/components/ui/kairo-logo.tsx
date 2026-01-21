import { cn } from '@/lib/utils';

interface KairoLogoProps {
  className?: string;
}

export function KairoLogo({ className }: KairoLogoProps) {
  return (
    <svg
      viewBox="0 0 95 45"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-6 w-auto', className)}
    >
      <defs>
        <linearGradient id="kairoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A5D8FF" />
          <stop offset="50%" stopColor="#D0BFFF" />
          <stop offset="100%" stopColor="#FCC2D7" />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="35"
        fontFamily="Inter, Poppins, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="38"
        fontWeight="700"
        fill="url(#kairoGradient)"
      >
        Kairo
      </text>
    </svg>
  );
}
