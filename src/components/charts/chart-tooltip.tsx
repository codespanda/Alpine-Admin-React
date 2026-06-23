'use client';

import type { TooltipPayloadEntry, TooltipPayload } from 'recharts/types/state/tooltipSlice';
import { cn } from '@/lib/utils';

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload;
  label?: string | number;
  className?: string;
}

function ChartTooltip({ active, payload, label, className }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border/50 bg-popover px-3 py-2 shadow-xl backdrop-blur-sm',
        className
      )}
    >
      {label != null && (
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">
          {label}
        </p>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((entry: TooltipPayloadEntry) => (
          <div key={String(entry.dataKey)} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
              aria-hidden="true"
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground tabular-nums">
              {typeof entry.value === 'number'
                ? entry.value.toLocaleString()
                : String(entry.value ?? '')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { ChartTooltip, type CustomTooltipProps };
