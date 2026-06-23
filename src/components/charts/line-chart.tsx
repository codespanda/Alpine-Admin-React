'use client';

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { BaseChart } from './base-chart';
import { ChartTooltip } from './chart-tooltip';

const CHART_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
] as const;

interface LineConfig {
  key: string;
  color?: string;
  name: string;
}

interface LineChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  lines: LineConfig[];
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  className?: string;
}

function LineChartComponent({
  data,
  xKey,
  lines,
  height = 350,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  className,
}: LineChartProps) {
  return (
    <BaseChart height={height} className={className}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-border"
            opacity={0.3}
            vertical={false}
          />
        )}
        <XAxis
          dataKey={xKey}
          stroke="currentColor"
          className="text-muted-foreground"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="currentColor"
          className="text-muted-foreground"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dx={-10}
          tickFormatter={(value: number) => value.toLocaleString()}
        />
        {showTooltip && (
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: 'currentColor', strokeWidth: 1, opacity: 0.15 }}
          />
        )}
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
          />
        )}
        {lines.map((line, index) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.name}
            stroke={line.color ?? CHART_COLORS[index % CHART_COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              strokeWidth: 2,
              fill: 'var(--color-background, #fff)',
            }}
          />
        ))}
      </RechartsLineChart>
    </BaseChart>
  );
}

export { LineChartComponent as LineChart, type LineChartProps, CHART_COLORS };
