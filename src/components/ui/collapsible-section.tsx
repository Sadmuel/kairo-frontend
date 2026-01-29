import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react';

interface CollapsibleSectionProps {
  icon: LucideIcon;
  label: string;
  badge?: string;
  contentId: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({
  icon: Icon,
  label,
  badge,
  contentId,
  defaultExpanded = true,
  children,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="space-y-2">
      <button
        className="flex w-full items-center justify-between text-sm text-muted-foreground hover:text-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        <span className="flex items-center gap-1.5">
          <Icon className="h-4 w-4" />
          {label}
          {badge && <span className="text-xs">({badge})</span>}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isExpanded && <div id={contentId}>{children}</div>}
    </div>
  );
}
