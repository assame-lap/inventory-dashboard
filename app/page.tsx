"use client"

import { useEffect, useState } from 'react'
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, TrendingUp, AlertTriangle, DollarSign, Plus, Search } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"

// 임시 데이터 (실제로는 API에서 가져올 데이터)
const mockStats = {
  totalProducts: 156,
  lowStockProducts: 12,
  outOfStockProducts: 3,
  totalValue: 12500000,
  monthlySales: 8500000,
  monthlyProfit: 3200000,
}

const mockTransactions = [
  {
    id: '1',
    product_id: '1',
    transaction_type: 'in' as const,
    quantity: 50,
    unit_price: 5000,
    total_amount: 250000,
    user_id: '1',
    created_at: '2024-01-15T10:30:00Z',
    products: { name: '프리미엄 커피', sku: 'COFFEE-001', unit: '개' },
    users: { name: '김상점주' },
  },
  {
    id: '2',
    product_id: '2',
    transaction_type: 'out' as const,
    quantity: 25,
    unit_price: 8000,
    total_amount: 200000,
    user_id: '1',
    created_at: '2024-01-15T14:20:00Z',
    products: { name: '유기농 차', sku: 'TEA-001', unit: '개' },
    users: { name: '박카페장' },
  },
  {
    id: '3',
    product_id: '3',
    transaction_type: 'adjustment' as const,
    quantity: 5,
    unit_price: 0,
    total_amount: 0,
    user_id: '1',
    created_at: '2024-01-15T16:45:00Z',
    products: { name: '수제 쿠키', sku: 'COOKIE-001', unit: '개' },
    users: { name: '이화장품점주' },
  },
]

const mockSalesData = [
  { date: '2024-01-10', sales: 1200000, profit: 450000 },
  { date: '2024-01-11', sales: 980000, profit: 380000 },
  { date: '2024-01-12', sales: 1500000, profit: 580000 },
  { date: '2024-01-13', sales: 1100000, profit: 420000 },
  { date: '2024-01-14', sales: 1350000, profit: 520000 },
  { date: '2024-01-15', sales: 1600000, profit: 620000 },
]

export default function HomePage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 실제 API 호출 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">
              안녕하세요, {user?.name || '사용자'}님! 👋
            </h1>
            <p className="text-muted-foreground">
              오늘의 재고 현황과 비즈니스 인사이트를 확인하세요
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              상품 추가
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <StatsCards {...mockStats} />

        {/* 차트와 거래 내역 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 매출 차트 */}
          <SalesChart data={mockSalesData} />
          
          {/* 최근 거래 내역 */}
          <RecentTransactions transactions={mockTransactions} />
        </div>

        {/* 추가 정보 탭 */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="alerts">알림</TabsTrigger>
            <TabsTrigger value="quick-actions">빠른 작업</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    재고 부족 상품
                  </CardTitle>
                  <CardDescription>최소 재고 수준 이하인 상품들</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockStats.lowStockProducts > 0 ? (
                      <div className="text-2xl font-bold text-orange-600">
                        {mockStats.lowStockProducts}개
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-green-600">
                        모든 상품 재고 양호
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-500" />
                    재고 가치
                  </CardTitle>
                  <CardDescription>현재 보유 재고의 총 가치</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    ₩{mockStats.totalValue.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>시스템 알림</CardTitle>
                <CardDescription>중요한 알림과 업데이트</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-medium text-orange-800">재고 부족 알림</div>
                      <div className="text-sm text-orange-600">12개 상품의 재고가 부족합니다.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <Package className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-blue-800">발주 예정</div>
                      <div className="text-sm text-blue-600">3개 상품의 발주가 예정되어 있습니다.</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quick-actions" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Package className="h-6 w-6" />
                <span>상품 등록</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                <span>입고 처리</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <DollarSign className="h-6 w-6" />
                <span>출고 처리</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <AlertTriangle className="h-6 w-6" />
                <span>발주 생성</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
