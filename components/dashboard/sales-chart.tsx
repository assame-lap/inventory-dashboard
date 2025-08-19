"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface SalesChartProps {
  data: Array<{
    date: string
    sales: number
    profit: number
  }>
  type?: 'line' | 'bar'
}

export function SalesChart({ data, type = 'line' }: SalesChartProps) {
  const formatCurrency = (value: number) => {
    return `₩${value.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return `${date.getMonth() + 1}/${date.getDate()}`
    } catch {
      return dateString
    }
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>매출 차트</CardTitle>
          <CardDescription>매출 데이터가 없습니다.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const chartData = data.map(item => ({
    ...item,
    formattedDate: formatDate(item.date),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>매출 추이</CardTitle>
        <CardDescription>일별 매출 및 수익 현황</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="formattedDate" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                  labelFormatter={(label) => `날짜: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="매출"
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="수익"
                  dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#82ca9d', strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="formattedDate" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                  labelFormatter={(label) => `날짜: ${label}`}
                />
                <Bar dataKey="sales" fill="#8884d8" name="매출" />
                <Bar dataKey="profit" fill="#82ca9d" name="수익" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ₩{data.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">총 매출</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ₩{data.reduce((sum, item) => sum + item.profit, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">총 수익</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
