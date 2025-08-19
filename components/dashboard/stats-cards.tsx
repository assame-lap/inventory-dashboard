"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react'

interface StatsCardsProps {
  totalProducts: number
  lowStockProducts: number
  outOfStockProducts: number
  totalValue: number
  monthlySales: number
  monthlyProfit: number
}

export function StatsCards({
  totalProducts,
  lowStockProducts,
  outOfStockProducts,
  totalValue,
  monthlySales,
  monthlyProfit,
}: StatsCardsProps) {
  const stats = [
    {
      title: '총 상품 수',
      value: totalProducts.toLocaleString(),
      description: '등록된 상품의 총 개수',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '재고 부족',
      value: lowStockProducts.toLocaleString(),
      description: '최소 재고 수준 이하 상품',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: '재고 없음',
      value: outOfStockProducts.toLocaleString(),
      description: '재고가 0인 상품',
      icon: Package,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: '총 재고 가치',
      value: `₩${totalValue.toLocaleString()}`,
      description: '현재 재고의 총 가치',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: '월 매출',
      value: `₩${monthlySales.toLocaleString()}`,
      description: '이번 달 총 매출',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: '월 수익',
      value: `₩${monthlyProfit.toLocaleString()}`,
      description: '이번 달 총 수익',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
