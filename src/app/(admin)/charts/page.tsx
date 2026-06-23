'use client';

import { PageHeader } from '@/components/shared/page-header';
import { ChartCard } from '@/components/shared/chart-card';
import { LineChart } from '@/components/charts';
import { BarChart } from '@/components/charts';
import { PieChart } from '@/components/charts';
import { AreaChart } from '@/components/charts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ---------------------------------------------------------------------------
// Sample Data
// ---------------------------------------------------------------------------

const revenueData = [
  { month: 'Jan', revenue: 4200, expenses: 2800, profit: 1400 },
  { month: 'Feb', revenue: 4800, expenses: 3100, profit: 1700 },
  { month: 'Mar', revenue: 5100, expenses: 2900, profit: 2200 },
  { month: 'Apr', revenue: 4600, expenses: 3200, profit: 1400 },
  { month: 'May', revenue: 5800, expenses: 3400, profit: 2400 },
  { month: 'Jun', revenue: 6200, expenses: 3100, profit: 3100 },
  { month: 'Jul', revenue: 5900, expenses: 3500, profit: 2400 },
  { month: 'Aug', revenue: 6800, expenses: 3300, profit: 3500 },
  { month: 'Sep', revenue: 7200, expenses: 3600, profit: 3600 },
  { month: 'Oct', revenue: 6900, expenses: 3800, profit: 3100 },
  { month: 'Nov', revenue: 7500, expenses: 3400, profit: 4100 },
  { month: 'Dec', revenue: 8100, expenses: 3900, profit: 4200 },
];

const userGrowthData = [
  { month: 'Jan', users: 1200, activeUsers: 980 },
  { month: 'Feb', users: 1450, activeUsers: 1180 },
  { month: 'Mar', users: 1680, activeUsers: 1350 },
  { month: 'Apr', users: 1920, activeUsers: 1540 },
  { month: 'May', users: 2300, activeUsers: 1890 },
  { month: 'Jun', users: 2650, activeUsers: 2180 },
  { month: 'Jul', users: 2900, activeUsers: 2400 },
  { month: 'Aug', users: 3200, activeUsers: 2650 },
  { month: 'Sep', users: 3600, activeUsers: 2980 },
  { month: 'Oct', users: 4100, activeUsers: 3400 },
  { month: 'Nov', users: 4500, activeUsers: 3750 },
  { month: 'Dec', users: 5000, activeUsers: 4200 },
];

const weeklyTrafficData = [
  { day: 'Mon', pageViews: 4500, uniqueVisitors: 2100, bounceRate: 35 },
  { day: 'Tue', pageViews: 5200, uniqueVisitors: 2400, bounceRate: 32 },
  { day: 'Wed', pageViews: 4800, uniqueVisitors: 2200, bounceRate: 38 },
  { day: 'Thu', pageViews: 5600, uniqueVisitors: 2700, bounceRate: 30 },
  { day: 'Fri', pageViews: 4900, uniqueVisitors: 2300, bounceRate: 36 },
  { day: 'Sat', pageViews: 3200, uniqueVisitors: 1500, bounceRate: 42 },
  { day: 'Sun', pageViews: 2800, uniqueVisitors: 1300, bounceRate: 45 },
];

const salesByRegionData = [
  { region: 'North America', Q1: 42000, Q2: 48000, Q3: 51000, Q4: 55000 },
  { region: 'Europe', Q1: 35000, Q2: 38000, Q3: 42000, Q4: 45000 },
  { region: 'Asia Pacific', Q1: 28000, Q2: 32000, Q3: 38000, Q4: 43000 },
  { region: 'Latin America', Q1: 12000, Q2: 14000, Q3: 16000, Q4: 18000 },
  { region: 'Middle East', Q1: 8000, Q2: 9500, Q3: 11000, Q4: 13000 },
];

const browserShareData = [
  { name: 'Chrome', value: 62, color: '#6366f1' },
  { name: 'Safari', value: 19, color: '#8b5cf6' },
  { name: 'Firefox', value: 8, color: '#ec4899' },
  { name: 'Edge', value: 7, color: '#f59e0b' },
  { name: 'Others', value: 4, color: '#10b981' },
];

const deviceDistributionData = [
  { name: 'Desktop', value: 55, color: '#6366f1' },
  { name: 'Mobile', value: 35, color: '#ec4899' },
  { name: 'Tablet', value: 10, color: '#f59e0b' },
];

const categoryBreakdownData = [
  { name: 'Electronics', value: 35, color: '#6366f1' },
  { name: 'Clothing', value: 25, color: '#8b5cf6' },
  { name: 'Food & Beverage', value: 18, color: '#10b981' },
  { name: 'Home & Garden', value: 12, color: '#f59e0b' },
  { name: 'Sports', value: 6, color: '#ec4899' },
  { name: 'Books', value: 4, color: '#06b6d4' },
];

const serverMetricsData = [
  { time: '00:00', cpu: 32, memory: 65, disk: 42 },
  { time: '04:00', cpu: 18, memory: 58, disk: 42 },
  { time: '08:00', cpu: 45, memory: 72, disk: 43 },
  { time: '12:00', cpu: 78, memory: 85, disk: 45 },
  { time: '16:00', cpu: 82, memory: 88, disk: 46 },
  { time: '20:00', cpu: 55, memory: 76, disk: 46 },
  { time: '23:59', cpu: 28, memory: 62, disk: 47 },
];

const conversionFunnelData = [
  { stage: 'Visitors', value: 10000 },
  { stage: 'Sign Ups', value: 4500 },
  { stage: 'Active', value: 2800 },
  { stage: 'Paid', value: 1200 },
  { stage: 'Retained', value: 800 },
];

const monthlyOrdersData = [
  { month: 'Jan', orders: 320, returns: 28 },
  { month: 'Feb', orders: 380, returns: 32 },
  { month: 'Mar', orders: 410, returns: 25 },
  { month: 'Apr', orders: 390, returns: 30 },
  { month: 'May', orders: 480, returns: 38 },
  { month: 'Jun', orders: 520, returns: 35 },
  { month: 'Jul', orders: 490, returns: 42 },
  { month: 'Aug', orders: 560, returns: 40 },
  { month: 'Sep', orders: 610, returns: 45 },
  { month: 'Oct', orders: 580, returns: 38 },
  { month: 'Nov', orders: 650, returns: 48 },
  { month: 'Dec', orders: 720, returns: 52 },
];

const stackedRevenueData = [
  { month: 'Jan', subscriptions: 2800, oneTime: 1400 },
  { month: 'Feb', subscriptions: 3100, oneTime: 1700 },
  { month: 'Mar', subscriptions: 3400, oneTime: 1700 },
  { month: 'Apr', subscriptions: 3200, oneTime: 1400 },
  { month: 'May', subscriptions: 3800, oneTime: 2000 },
  { month: 'Jun', subscriptions: 4200, oneTime: 2000 },
  { month: 'Jul', subscriptions: 4000, oneTime: 1900 },
  { month: 'Aug', subscriptions: 4500, oneTime: 2300 },
  { month: 'Sep', subscriptions: 4800, oneTime: 2400 },
  { month: 'Oct', subscriptions: 4600, oneTime: 2300 },
  { month: 'Nov', subscriptions: 5100, oneTime: 2400 },
  { month: 'Dec', subscriptions: 5500, oneTime: 2600 },
];

const temperatureData = [
  { month: 'Jan', high: 5, low: -2 },
  { month: 'Feb', high: 7, low: -1 },
  { month: 'Mar', high: 12, low: 3 },
  { month: 'Apr', high: 18, low: 8 },
  { month: 'May', high: 23, low: 13 },
  { month: 'Jun', high: 28, low: 18 },
  { month: 'Jul', high: 31, low: 21 },
  { month: 'Aug', high: 30, low: 20 },
  { month: 'Sep', high: 25, low: 15 },
  { month: 'Oct', high: 18, low: 9 },
  { month: 'Nov', high: 11, low: 4 },
  { month: 'Dec', high: 6, low: 0 },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChartsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Charts"
        description="Chart components reference — Line, Bar, Pie, and Area charts with various configurations."
      />

      <Tabs defaultValue="line">
        <TabsList>
          <TabsTrigger value="line">Line Charts</TabsTrigger>
          <TabsTrigger value="bar">Bar Charts</TabsTrigger>
          <TabsTrigger value="pie">Pie & Donut</TabsTrigger>
          <TabsTrigger value="area">Area Charts</TabsTrigger>
          <TabsTrigger value="mixed">Combined</TabsTrigger>
        </TabsList>

        {/* LINE CHARTS */}
        <TabsContent value="line" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Revenue Trend"
              description="Monthly revenue over the past year."
            >
              <LineChart
                data={revenueData}
                xKey="month"
                lines={[
                  { key: 'revenue', name: 'Revenue', color: '#6366f1' },
                ]}
                height={300}
              />
            </ChartCard>

            <ChartCard
              title="Multi-Line: Revenue vs Expenses"
              description="Comparing revenue, expenses, and profit."
            >
              <LineChart
                data={revenueData}
                xKey="month"
                lines={[
                  { key: 'revenue', name: 'Revenue', color: '#6366f1' },
                  { key: 'expenses', name: 'Expenses', color: '#ec4899' },
                  { key: 'profit', name: 'Profit', color: '#10b981' },
                ]}
                height={300}
                showLegend
              />
            </ChartCard>

            <ChartCard
              title="User Growth"
              description="Total users vs active users over time."
            >
              <LineChart
                data={userGrowthData}
                xKey="month"
                lines={[
                  { key: 'users', name: 'Total Users', color: '#8b5cf6' },
                  { key: 'activeUsers', name: 'Active Users', color: '#06b6d4' },
                ]}
                height={300}
                showLegend
              />
            </ChartCard>

            <ChartCard
              title="Temperature Range"
              description="Monthly high and low temperatures."
            >
              <LineChart
                data={temperatureData}
                xKey="month"
                lines={[
                  { key: 'high', name: 'High', color: '#f59e0b' },
                  { key: 'low', name: 'Low', color: '#06b6d4' },
                ]}
                height={300}
                showLegend
              />
            </ChartCard>
          </div>
        </TabsContent>

        {/* BAR CHARTS */}
        <TabsContent value="bar" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Weekly Traffic"
              description="Page views and unique visitors by day."
            >
              <BarChart
                data={weeklyTrafficData}
                xKey="day"
                bars={[
                  { key: 'pageViews', name: 'Page Views', color: '#6366f1' },
                  { key: 'uniqueVisitors', name: 'Unique Visitors', color: '#8b5cf6' },
                ]}
                height={300}
                showLegend
              />
            </ChartCard>

            <ChartCard
              title="Sales by Region"
              description="Quarterly sales performance across regions."
            >
              <BarChart
                data={salesByRegionData}
                xKey="region"
                bars={[
                  { key: 'Q1', name: 'Q1', color: '#6366f1' },
                  { key: 'Q2', name: 'Q2', color: '#8b5cf6' },
                  { key: 'Q3', name: 'Q3', color: '#ec4899' },
                  { key: 'Q4', name: 'Q4', color: '#f59e0b' },
                ]}
                height={300}
                showLegend
              />
            </ChartCard>

            <ChartCard
              title="Monthly Orders"
              description="Orders vs returns over the year."
            >
              <BarChart
                data={monthlyOrdersData}
                xKey="month"
                bars={[
                  { key: 'orders', name: 'Orders', color: '#10b981' },
                  { key: 'returns', name: 'Returns', color: '#ec4899' },
                ]}
                height={300}
                showLegend
              />
            </ChartCard>

            <ChartCard
              title="Stacked Revenue"
              description="Subscription vs one-time revenue breakdown."
            >
              <BarChart
                data={stackedRevenueData}
                xKey="month"
                bars={[
                  { key: 'subscriptions', name: 'Subscriptions', color: '#6366f1', stackId: 'revenue' },
                  { key: 'oneTime', name: 'One-Time', color: '#8b5cf6', stackId: 'revenue' },
                ]}
                height={300}
                showLegend
              />
            </ChartCard>

            <ChartCard
              title="Conversion Funnel"
              description="User journey from visitor to retained customer."
            >
              <BarChart
                data={conversionFunnelData}
                xKey="stage"
                bars={[
                  { key: 'value', name: 'Users', color: '#6366f1' },
                ]}
                height={300}
              />
            </ChartCard>

            <ChartCard
              title="Bounce Rate by Day"
              description="Weekly bounce rate percentage."
            >
              <BarChart
                data={weeklyTrafficData}
                xKey="day"
                bars={[
                  { key: 'bounceRate', name: 'Bounce Rate %', color: '#f59e0b' },
                ]}
                height={300}
              />
            </ChartCard>
          </div>
        </TabsContent>

        {/* PIE / DONUT CHARTS */}
        <TabsContent value="pie" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <ChartCard
              title="Browser Market Share"
              description="Distribution of browser usage."
            >
              <PieChart
                data={browserShareData}
                height={300}
                showLabel
                showLegend
              />
            </ChartCard>

            <ChartCard
              title="Device Distribution"
              description="Traffic by device type."
            >
              <PieChart
                data={deviceDistributionData}
                height={300}
                showLabel
                showLegend
              />
            </ChartCard>

            <ChartCard
              title="Product Categories"
              description="Sales breakdown by product category."
            >
              <PieChart
                data={categoryBreakdownData}
                height={300}
                showLabel
                showLegend
              />
            </ChartCard>

            <ChartCard
              title="Donut: Browser Share"
              description="Same data as a donut chart with larger radius."
            >
              <PieChart
                data={browserShareData}
                height={300}
                innerRadius={70}
                outerRadius={100}
                showLegend
              />
            </ChartCard>

            <ChartCard
              title="Donut: Device Split"
              description="Device distribution as a compact donut."
            >
              <PieChart
                data={deviceDistributionData}
                height={300}
                innerRadius={60}
                outerRadius={90}
                showLabel
                showLegend
              />
            </ChartCard>

            <ChartCard
              title="Donut: Categories"
              description="Category breakdown as a donut."
            >
              <PieChart
                data={categoryBreakdownData}
                height={300}
                innerRadius={50}
                outerRadius={85}
                showLegend
              />
            </ChartCard>
          </div>
        </TabsContent>

        {/* AREA CHARTS */}
        <TabsContent value="area" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Revenue Over Time"
              description="Monthly revenue with gradient fill."
            >
              <AreaChart
                data={revenueData}
                xKey="month"
                areas={[
                  { key: 'revenue', name: 'Revenue', color: '#6366f1' },
                ]}
                height={300}
              />
            </ChartCard>

            <ChartCard
              title="User Growth Trend"
              description="Total vs active users with area comparison."
            >
              <AreaChart
                data={userGrowthData}
                xKey="month"
                areas={[
                  { key: 'users', name: 'Total Users', color: '#8b5cf6' },
                  { key: 'activeUsers', name: 'Active Users', color: '#06b6d4' },
                ]}
                height={300}
                showLegend
              />
            </ChartCard>

            <ChartCard
              title="Server Metrics"
              description="CPU, memory, and disk usage over 24 hours."
            >
              <AreaChart
                data={serverMetricsData}
                xKey="time"
                areas={[
                  { key: 'cpu', name: 'CPU %', color: '#ec4899' },
                  { key: 'memory', name: 'Memory %', color: '#6366f1' },
                  { key: 'disk', name: 'Disk %', color: '#10b981' },
                ]}
                height={300}
                showLegend
              />
            </ChartCard>

            <ChartCard
              title="Revenue Breakdown"
              description="Subscriptions vs one-time with stacked area."
            >
              <AreaChart
                data={stackedRevenueData}
                xKey="month"
                areas={[
                  { key: 'subscriptions', name: 'Subscriptions', color: '#6366f1' },
                  { key: 'oneTime', name: 'One-Time', color: '#f59e0b' },
                ]}
                height={300}
                showLegend
              />
            </ChartCard>
          </div>
        </TabsContent>

        {/* COMBINED / DASHBOARD STYLE */}
        <TabsContent value="mixed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dashboard-Style Layout</CardTitle>
              <CardDescription>
                Multiple chart types combined in a dashboard grid, showcasing
                how different visualizations complement each other.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Revenue Trend</p>
                  <LineChart
                    data={revenueData}
                    xKey="month"
                    lines={[
                      { key: 'revenue', name: 'Revenue', color: '#6366f1' },
                      { key: 'profit', name: 'Profit', color: '#10b981' },
                    ]}
                    height={250}
                    showLegend
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Traffic by Day</p>
                  <BarChart
                    data={weeklyTrafficData}
                    xKey="day"
                    bars={[
                      { key: 'pageViews', name: 'Views', color: '#6366f1' },
                      { key: 'uniqueVisitors', name: 'Visitors', color: '#8b5cf6' },
                    ]}
                    height={250}
                    showLegend
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Device Distribution</p>
                  <PieChart
                    data={deviceDistributionData}
                    height={250}
                    innerRadius={50}
                    outerRadius={80}
                    showLabel
                    showLegend
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Server Load</p>
                  <AreaChart
                    data={serverMetricsData}
                    xKey="time"
                    areas={[
                      { key: 'cpu', name: 'CPU', color: '#ec4899' },
                      { key: 'memory', name: 'Memory', color: '#6366f1' },
                    ]}
                    height={250}
                    showLegend
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <ChartCard
              title="Sales Funnel"
              description="Conversion at each stage."
            >
              <BarChart
                data={conversionFunnelData}
                xKey="stage"
                bars={[{ key: 'value', name: 'Users', color: '#8b5cf6' }]}
                height={250}
              />
            </ChartCard>

            <ChartCard
              title="Browser Share"
              description="Current browser distribution."
            >
              <PieChart
                data={browserShareData}
                height={250}
                innerRadius={55}
                outerRadius={80}
                showLegend
              />
            </ChartCard>

            <ChartCard
              title="Orders Trend"
              description="Monthly orders with returns overlay."
            >
              <AreaChart
                data={monthlyOrdersData}
                xKey="month"
                areas={[
                  { key: 'orders', name: 'Orders', color: '#10b981' },
                  { key: 'returns', name: 'Returns', color: '#ec4899' },
                ]}
                height={250}
                showLegend
              />
            </ChartCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
