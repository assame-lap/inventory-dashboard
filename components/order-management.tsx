"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Eye, Edit, AlertCircle, CheckCircle, Clock, Truck } from "lucide-react"

interface PurchaseOrder {
  id: string
  orderNumber: string
  supplier: string
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
    total: number
  }>
  totalAmount: number
  status: "pending" | "approved" | "shipped" | "delivered" | "cancelled"
  orderDate: string
  expectedDelivery: string
  notes: string
}

interface LowStockItem {
  id: number
  name: string
  currentStock: number
  safeStock: number
  supplier: string
  unitPrice: number
  suggestedQuantity: number
}

const purchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-001",
    orderNumber: "PO-2024-001",
    supplier: "케이스월드",
    items: [
      { name: "삼성 갤럭시 케이스", quantity: 50, unitPrice: 15000, total: 750000 },
      { name: "아이폰 케이스", quantity: 30, unitPrice: 18000, total: 540000 },
    ],
    totalAmount: 1290000,
    status: "approved",
    orderDate: "2024-01-15",
    expectedDelivery: "2024-01-20",
    notes: "긴급 발주 - 재고 부족",
  },
  {
    id: "PO-002",
    orderNumber: "PO-2024-002",
    supplier: "애플코리아",
    items: [{ name: "아이폰 충전기", quantity: 100, unitPrice: 25000, total: 2500000 }],
    totalAmount: 2500000,
    status: "shipped",
    orderDate: "2024-01-12",
    expectedDelivery: "2024-01-18",
    notes: "정기 발주",
  },
  {
    id: "PO-003",
    orderNumber: "PO-2024-003",
    supplier: "사운드테크",
    items: [
      { name: "무선 이어폰", quantity: 25, unitPrice: 89000, total: 2225000 },
      { name: "블루투스 스피커", quantity: 15, unitPrice: 125000, total: 1875000 },
    ],
    totalAmount: 4100000,
    status: "pending",
    orderDate: "2024-01-16",
    expectedDelivery: "2024-01-25",
    notes: "",
  },
  {
    id: "PO-004",
    orderNumber: "PO-2024-004",
    supplier: "밴드플러스",
    items: [{ name: "스마트워치 밴드", quantity: 40, unitPrice: 35000, total: 1400000 }],
    totalAmount: 1400000,
    status: "delivered",
    orderDate: "2024-01-10",
    expectedDelivery: "2024-01-15",
    notes: "배송 완료",
  },
]

const lowStockItems: LowStockItem[] = [
  {
    id: 1,
    name: "아이폰 충전기",
    currentStock: 8,
    safeStock: 15,
    supplier: "애플코리아",
    unitPrice: 25000,
    suggestedQuantity: 25,
  },
  {
    id: 2,
    name: "스마트워치 밴드",
    currentStock: 3,
    safeStock: 10,
    supplier: "밴드플러스",
    unitPrice: 35000,
    suggestedQuantity: 20,
  },
  {
    id: 3,
    name: "노트북 파우치",
    currentStock: 2,
    safeStock: 8,
    supplier: "파우치월드",
    unitPrice: 45000,
    suggestedQuantity: 15,
  },
  {
    id: 4,
    name: "USB-C 케이블",
    currentStock: 12,
    safeStock: 20,
    supplier: "케이블프로",
    unitPrice: 18000,
    suggestedQuantity: 30,
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />
    case "approved":
      return <CheckCircle className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "delivered":
      return <CheckCircle className="h-4 w-4" />
    case "cancelled":
      return <AlertCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "대기"
    case "approved":
      return "승인"
    case "shipped":
      return "배송중"
    case "delivered":
      return "완료"
    case "cancelled":
      return "취소"
    default:
      return "대기"
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "pending":
      return "secondary"
    case "approved":
      return "default"
    case "shipped":
      return "default"
    case "delivered":
      return "default"
    case "cancelled":
      return "destructive"
    default:
      return "secondary"
  }
}

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false)
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null)
  const [activeTab, setActiveTab] = useState("orders")

  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const orderStats = {
    total: purchaseOrders.length,
    pending: purchaseOrders.filter((o) => o.status === "pending").length,
    approved: purchaseOrders.filter((o) => o.status === "approved").length,
    shipped: purchaseOrders.filter((o) => o.status === "shipped").length,
    delivered: purchaseOrders.filter((o) => o.status === "delivered").length,
  }

  const openOrderDetail = (order: PurchaseOrder) => {
    setSelectedOrder(order)
    setIsOrderDetailModalOpen(true)
  }

  const createAutoOrder = (item: LowStockItem) => {
    console.log(`자동 발주 생성: ${item.name}, 수량: ${item.suggestedQuantity}`)
    // Here you would typically create a new purchase order
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">발주 관리</h1>
        <p className="text-muted-foreground">발주 현황을 관리하고 새로운 발주를 생성하세요</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">전체 발주</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground font-heading">{orderStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">대기</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground font-heading">{orderStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">승인</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground font-heading">{orderStats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">배송중</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground font-heading">{orderStats.shipped}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">완료</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground font-heading">{orderStats.delivered}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="orders">발주 목록</TabsTrigger>
          <TabsTrigger value="suggestions">발주 제안</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">검색 및 필터</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="search">발주번호 또는 공급업체</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="검색어를 입력하세요"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">발주 상태</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="pending">대기</SelectItem>
                      <SelectItem value="approved">승인</SelectItem>
                      <SelectItem value="shipped">배송중</SelectItem>
                      <SelectItem value="delivered">완료</SelectItem>
                      <SelectItem value="cancelled">취소</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={() => setIsNewOrderModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />새 발주 생성
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">발주 목록</CardTitle>
              <CardDescription>총 {filteredOrders.length}개 발주</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">발주번호</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">공급업체</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">발주금액</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">발주일</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">예상배송일</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">상태</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                        <td className="py-3 px-4">{order.supplier}</td>
                        <td className="py-3 px-4">₩{order.totalAmount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-muted-foreground">{order.orderDate}</td>
                        <td className="py-3 px-4 text-muted-foreground">{order.expectedDelivery}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={getStatusVariant(order.status) as any}
                            className="flex items-center gap-1 w-fit"
                          >
                            {getStatusIcon(order.status)}
                            {getStatusText(order.status)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => openOrderDetail(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
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

        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle className="font-heading">재고 부족 품목 - 발주 제안</CardTitle>
              </div>
              <CardDescription>
                안전 재고 수준 이하의 품목들입니다. 자동 발주를 생성하거나 수동으로 발주하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>
                          현재고: <span className="text-destructive font-medium">{item.currentStock}개</span>
                        </span>
                        <span>안전재고: {item.safeStock}개</span>
                        <span>공급업체: {item.supplier}</span>
                        <span>단가: ₩{item.unitPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">제안 수량</div>
                        <div className="font-medium">{item.suggestedQuantity}개</div>
                        <div className="text-sm text-muted-foreground">
                          ₩{(item.suggestedQuantity * item.unitPrice).toLocaleString()}
                        </div>
                      </div>
                      <Button onClick={() => createAutoOrder(item)}>자동 발주</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Order Modal */}
      <Dialog open={isNewOrderModalOpen} onOpenChange={setIsNewOrderModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading">새 발주 생성</DialogTitle>
            <DialogDescription>새로운 발주를 생성합니다</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">공급업체</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="공급업체 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="케이스월드">케이스월드</SelectItem>
                    <SelectItem value="애플코리아">애플코리아</SelectItem>
                    <SelectItem value="사운드테크">사운드테크</SelectItem>
                    <SelectItem value="밴드플러스">밴드플러스</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedDelivery">예상 배송일</Label>
                <Input id="expectedDelivery" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">메모</Label>
              <Textarea id="notes" placeholder="발주 관련 메모를 입력하세요" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewOrderModalOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsNewOrderModalOpen(false)}>발주 생성</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Detail Modal */}
      <Dialog open={isOrderDetailModalOpen} onOpenChange={setIsOrderDetailModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-heading">발주 상세 정보</DialogTitle>
            <DialogDescription>{selectedOrder?.orderNumber}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">발주 정보</h4>
                  <div className="space-y-1 text-sm">
                    <div>공급업체: {selectedOrder.supplier}</div>
                    <div>발주일: {selectedOrder.orderDate}</div>
                    <div>예상 배송일: {selectedOrder.expectedDelivery}</div>
                    <div className="flex items-center gap-2">
                      상태:
                      <Badge
                        variant={getStatusVariant(selectedOrder.status) as any}
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(selectedOrder.status)}
                        {getStatusText(selectedOrder.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">금액 정보</h4>
                  <div className="space-y-1 text-sm">
                    <div>총 발주 금액: ₩{selectedOrder.totalAmount.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">발주 품목</h4>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-2 px-3 text-sm font-medium">제품명</th>
                        <th className="text-left py-2 px-3 text-sm font-medium">수량</th>
                        <th className="text-left py-2 px-3 text-sm font-medium">단가</th>
                        <th className="text-left py-2 px-3 text-sm font-medium">합계</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="border-t border-border">
                          <td className="py-2 px-3 text-sm">{item.name}</td>
                          <td className="py-2 px-3 text-sm">{item.quantity}개</td>
                          <td className="py-2 px-3 text-sm">₩{item.unitPrice.toLocaleString()}</td>
                          <td className="py-2 px-3 text-sm">₩{item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h4 className="font-medium mb-2">메모</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrderDetailModalOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
