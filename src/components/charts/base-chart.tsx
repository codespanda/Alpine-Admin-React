'use client';

import * as React from 'react';
import { ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface BaseChartProps {
  children: React.ReactElement;
  height?: number;
  className?: string;
}

function BaseChart({ children, height = 350, className }: BaseChartProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export { BaseChart, type BaseChartProps };
