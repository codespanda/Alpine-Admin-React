'use client';

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { BaseChart } from './base-chart';
import { ChartTooltip } from './chart-tooltip';
import { CHART_COLORS } from './line-chart';

interface AreaConfig {
  key: string;
  color?: string;
  name: string;
}

interface AreaChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  areas: AreaConfig[];
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  gradient?: boolean;
  className?: string;
}

function AreaChartComponent({
  data,
  xKey,
  areas,
  height = 350,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  gradient = true,
  className,
}: AreaChartProps) {
  return (
    <BaseChart height={height} className={className}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
      >
        {gradient && (
          <defs>
            {areas.map((area, index) => {
              const color =
                area.color ?? CHART_COLORS[index % CHART_COLORS.length];
              return (
                <linearGradient
                  key={area.key}
                  id={`gradient-${area.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              );
            })}
          </defs>
        )}
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
        {areas.map((area, index) => {
          const color =
            area.color ?? CHART_COLORS[index % CHART_COLORS.length];
          return (
            <Area
              key={area.key}
              type="monotone"
              dataKey={area.key}
              name={area.name}
              stroke={color}
              strokeWidth={2}
              fill={gradient ? `url(#gradient-${area.key})` : color}
              fillOpacity={gradient ? 1 : 0.1}
            />
          );
        })}
      </RechartsAreaChart>
    </BaseChart>
  );
}

export { AreaChartComponent as AreaChart, type AreaChartProps };
