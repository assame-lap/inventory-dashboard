"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Calendar } from "lucide-react"

// Sample data for analytics
const salesData = [
  { date: "2024-01-01", sales: 1200000, orders: 45, customers: 38 },
  { date: "2024-01-02", sales: 1450000, orders: 52, customers: 41 },
  { date: "2024-01-03", sales: 980000, orders: 38, customers: 32 },
  { date: "2024-01-04", sales: 1680000, orders: 61, customers: 48 },
  { date: "2024-01-05", sales: 1320000, orders: 49, customers: 42 },
  { date: "2024-01-06", sales: 1890000, orders: 67, customers: 55 },
  { date: "2024-01-07", sales: 2100000, orders: 74, customers: 61 },
  { date: "2024-01-08", sales: 1750000, orders: 63, customers: 51 },
  { date: "2024-01-09", sales: 1420000, orders: 51, customers: 44 },
  { date: "2024-01-10", sales: 1650000, orders: 58, customers: 47 },
  { date: "2024-01-11", sales: 1980000, orders: 69, customers: 56 },
  { date: "2024-01-12", sales: 2250000, orders: 78, customers: 64 },
  { date: "2024-01-13", sales: 1850000, orders: 65, customers: 53 },
  { date: "2024-01-14", sales: 1600000, orders: 57, customers: 46 },
]

const productSalesData = [
  { name: "삼성 갤럭시 케이스", sales: 3200000, quantity: 213, growth: 12.5 },
  { name: "아이폰 충전기", sales: 2800000, quantity: 112, growth: 8.3 },
  { name: "무선 이어폰", sales: 4500000, quantity: 51, growth: 15.7 },
  { name: "블루투스 스피커", sales: 3750000, quantity: 30, growth: -2.1 },
  { name: "스마트워치 밴드", sales: 2100000, quantity: 60, growth: 22.4 },
  { name: "태블릿 보호필름", sales: 1680000, quantity: 140, growth: 5.8 },
  { name: "USB-C 케이블", sales: 1440000, quantity: 80, growth: 18.9 },
  { name: "노트북 파우치", sales: 2250000, quantity: 50, growth: -5.3 },
]

const categorySalesData = [
  { name: "액세서리", value: 8550000, color: "hsl(var(--chart-1))" },
  { name: "충전기", value: 4240000, color: "hsl(var(--chart-2))" },
  { name: "오디오", value: 8250000, color: "hsl(var(--chart-3))" },
  { name: "보호용품", value: 3930000, color: "hsl(var(--chart-4))" },
  { name: "케이블", value: 1440000, color: "hsl(var(--chart-5))" },
]

const monthlySalesData = [
  { month: "1월", sales: 28500000, target: 25000000 },
  { month: "2월", sales: 32100000, target: 30000000 },
  { month: "3월", sales: 29800000, target: 28000000 },
  { month: "4월", sales: 35200000, target: 32000000 },
  { month: "5월", sales: 38900000, target: 35000000 },
  { month: "6월", sales: 42300000, target: 40000000 },
]

const chartConfig = {
  sales: {
    label: "매출",
    color: "hsl(var(--chart-1))",
  },
  orders: {
    label: "주문",
    color: "hsl(var(--chart-2))",
  },
  customers: {
    label: "고객",
    color: "hsl(var(--chart-3))",
  },
  target: {
    label: "목표",
    color: "hsl(var(--chart-4))",
  },
  value: {
    label: "매출액",
    color: "hsl(var(--chart-1))",
  },
  name: {
    label: "카테고리",
    color: "hsl(var(--chart-1))",
  },
}

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("7days")
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate summary statistics
  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0)
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0)
  const totalCustomers = salesData.reduce((sum, day) => sum + day.customers, 0)
  const avgOrderValue = totalSales / totalOrders

  const salesGrowth = 12.5 // Mock growth percentage
  const ordersGrowth = 8.3
  const customersGrowth = 15.2

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">매출 분석</h1>
          <p className="text-muted-foreground">비즈니스 성과를 분석하고 인사이트를 확인하세요</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">최근 7일</SelectItem>
              <SelectItem value="30days">최근 30일</SelectItem>
              <SelectItem value="90days">최근 90일</SelectItem>
              <SelectItem value="1year">최근 1년</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 매출</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground font-heading">₩{totalSales.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              <span className="text-green-600">+{salesGrowth}%</span>
              <span className="ml-1">지난 기간 대비</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 주문</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground font-heading">{totalOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              <span className="text-green-600">+{ordersGrowth}%</span>
              <span className="ml-1">지난 기간 대비</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">고객 수</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground font-heading">{totalCustomers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              <span className="text-green-600">+{customersGrowth}%</span>
              <span className="ml-1">지난 기간 대비</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">평균 주문가</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground font-heading">
              ₩{Math.round(avgOrderValue).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              <span className="text-green-600">+3.2%</span>
              <span className="ml-1">지난 기간 대비</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="products">제품별 분석</TabsTrigger>
          <TabsTrigger value="categories">카테고리별 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sales Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">매출 추세</CardTitle>
                <CardDescription>일별 매출 변화</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                      <YAxis tickFormatter={(value) => `₩${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip
                        formatter={(value, name) => [
                          `₩${Number(value).toLocaleString()}`,
                          name === "sales" ? "매출" : name,
                        ]}
                        labelFormatter={(label) => `날짜: ${new Date(label).toLocaleDateString()}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--chart-1))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Monthly Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">월별 성과</CardTitle>
                <CardDescription>목표 대비 실제 매출</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `₩${(value / 1000000).toFixed(0)}M`} />
                      <Tooltip
                        formatter={(value, name) => [
                          `₩${Number(value).toLocaleString()}`,
                          name === "sales" ? "매출" : name === "target" ? "목표" : name,
                        ]}
                      />
                      <Bar dataKey="target" fill="hsl(var(--chart-4))" opacity={0.6} />
                      <Bar dataKey="sales" fill="hsl(var(--chart-1))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">제품별 매출 분석</CardTitle>
              <CardDescription>제품별 매출 성과와 성장률</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">제품명</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">매출액</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">판매량</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">성장률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productSalesData.map((product, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{product.name}</td>
                        <td className="py-3 px-4">₩{product.sales.toLocaleString()}</td>
                        <td className="py-3 px-4">{product.quantity}개</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {product.growth > 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1 text-red-600" />
                            )}
                            <span className={product.growth > 0 ? "text-green-600" : "text-red-600"}>
                              {product.growth > 0 ? "+" : ""}
                              {product.growth}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">카테고리별 매출 분포</CardTitle>
                <CardDescription>전체 매출에서 각 카테고리가 차지하는 비율</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySalesData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categorySalesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`₩${Number(value).toLocaleString()}`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">카테고리별 성과</CardTitle>
                <CardDescription>카테고리별 매출 순위</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categorySalesData
                    .sort((a, b) => b.value - a.value)
                    .map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₩{category.value.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {(
                              (category.value / categorySalesData.reduce((sum, cat) => sum + cat.value, 0)) *
                              100
                            ).toFixed(1)}
                            %
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
