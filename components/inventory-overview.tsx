import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, TrendingUp, AlertTriangle, ShoppingCart, Plus, Search } from "lucide-react"

const inventoryStats = [
  {
    title: "총 재고 품목",
    value: "1,247",
    change: "+12%",
    changeType: "positive" as const,
    icon: Package,
  },
  {
    title: "재고 부족 품목",
    value: "23",
    change: "-5%",
    changeType: "negative" as const,
    icon: AlertTriangle,
  },
  {
    title: "이번 달 입고",
    value: "₩12,450,000",
    change: "+8%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "발주 대기",
    value: "15",
    change: "+3",
    changeType: "neutral" as const,
    icon: ShoppingCart,
  },
]

const recentInventory = [
  { id: 1, name: "삼성 갤럭시 케이스", stock: 45, safeStock: 20, status: "normal" },
  { id: 2, name: "아이폰 충전기", stock: 8, safeStock: 15, status: "low" },
  { id: 3, name: "무선 이어폰", stock: 67, safeStock: 30, status: "normal" },
  { id: 4, name: "스마트워치 밴드", stock: 3, safeStock: 10, status: "critical" },
  { id: 5, name: "태블릿 보호필름", stock: 89, safeStock: 25, status: "normal" },
]

export function InventoryOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {inventoryStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground font-heading">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "negative"
                        ? "text-red-600"
                        : "text-muted-foreground"
                  }
                >
                  {stat.change}
                </span>{" "}
                지난 달 대비
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div>
              <CardTitle className="font-heading">재고 현황</CardTitle>
              <CardDescription>실시간 재고 수준과 상태를 확인하세요</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                재고 추가
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">제품명</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">현재고</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">안전재고</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">상태</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">작업</th>
                </tr>
              </thead>
              <tbody>
                {recentInventory.map((item) => (
                  <tr key={item.id} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4">{item.stock}개</td>
                    <td className="py-3 px-4">{item.safeStock}개</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          item.status === "critical" ? "destructive" : item.status === "low" ? "secondary" : "default"
                        }
                      >
                        {item.status === "critical" ? "긴급" : item.status === "low" ? "부족" : "정상"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        입출고
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
