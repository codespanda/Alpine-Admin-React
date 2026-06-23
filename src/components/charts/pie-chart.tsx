'use client';

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { BaseChart } from './base-chart';
import { ChartTooltip } from './chart-tooltip';
import { CHART_COLORS } from './line-chart';

interface PieDataItem {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieDataItem[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLabel?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  className?: string;
}

const RADIAN = Math.PI / 180;

function renderCustomLabel(props: PieLabelRenderProps) {
  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const midAngle = Number(props.midAngle ?? 0);
  const innerRadius = Number(props.innerRadius ?? 0);
  const outerRadius = Number(props.outerRadius ?? 0);
  const percent = Number(props.percent ?? 0);

  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      className="text-foreground"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function PieChartComponent({
  data,
  height = 350,
  innerRadius = 60,
  outerRadius = 80,
  showLabel = false,
  showTooltip = true,
  showLegend = true,
  className,
}: PieChartProps) {
  return (
    <BaseChart height={height} className={className}>
      <RechartsPieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        {showTooltip && <Tooltip content={<ChartTooltip />} />}
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
          />
        )}
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          strokeWidth={0}
          label={showLabel ? renderCustomLabel : undefined}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={entry.color ?? CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
      </RechartsPieChart>
    </BaseChart>
  );
}

export { PieChartComponent as PieChart, type PieChartProps, type PieDataItem };
