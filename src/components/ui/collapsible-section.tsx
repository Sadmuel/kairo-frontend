import { useRef, useState, type ReactNode } from 'react';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { CollapsibleContent } from './collapsible-content';

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
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        className="flex w-full items-center justify-between text-sm text-muted-foreground hover:text-foreground"
        onClick={(event) => {
          if (isExpanded) event.currentTarget.focus();
          setIsExpanded(!isExpanded);
        }}
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        <span className="flex items-center gap-1.5">
          <Icon className="h-4 w-4" />
          {label}
          {badge && <span className="text-xs">({badge})</span>}
        </span>
        <ChevronDown
          className="h-4 w-4 collapsible-chevron"
          data-expanded={isExpanded}
        />
      </button>

      <CollapsibleContent id={contentId} open={isExpanded} triggerRef={triggerRef}>
        <div className="pt-2">{children}</div>
      </CollapsibleContent>
    </div>
  );
}
