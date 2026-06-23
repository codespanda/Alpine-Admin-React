'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { BaseChart } from './base-chart';
import { ChartTooltip } from './chart-tooltip';
import { CHART_COLORS } from './line-chart';

interface BarConfig {
  key: string;
  color?: string;
  name: string;
  stackId?: string;
}

interface BarChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  bars: BarConfig[];
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

function BarChartComponent({
  data,
  xKey,
  bars,
  height = 350,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  layout = 'horizontal',
  className,
}: BarChartProps) {
  const isVertical = layout === 'vertical';

  return (
    <BaseChart height={height} className={className}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-border"
            opacity={0.3}
            vertical={!isVertical}
            horizontal={isVertical}
          />
        )}
        {isVertical ? (
          <>
            <XAxis
              type="number"
              stroke="currentColor"
              className="text-muted-foreground"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => value.toLocaleString()}
            />
            <YAxis
              dataKey={xKey}
              type="category"
              stroke="currentColor"
              className="text-muted-foreground"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={80}
            />
          </>
        ) : (
          <>
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
          </>
        )}
        {showTooltip && (
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: 'currentColor', opacity: 0.05 }}
          />
        )}
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="rect"
            iconSize={10}
            wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
          />
        )}
        {bars.map((bar, index) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.name}
            fill={bar.color ?? CHART_COLORS[index % CHART_COLORS.length]}
            stackId={bar.stackId}
            radius={bar.stackId ? [0, 0, 0, 0] : [4, 4, 0, 0]}
            maxBarSize={48}
          />
        ))}
      </RechartsBarChart>
    </BaseChart>
  );
}

export { BarChartComponent as BarChart, type BarChartProps };
