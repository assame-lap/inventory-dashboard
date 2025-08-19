"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Edit,
  ArrowUpDown,
  AlertTriangle,
  Settings,
  Trash2,
  Copy,
  Upload,
  Download,
  FileSpreadsheet,
} from "lucide-react"
import * as XLSX from "xlsx"

interface InventoryItem {
  id: number
  name: string
  category: string
  size?: string
  color?: string
  stock: number
  safeStock: number
  price: number
  supplier: string
  lastUpdated: string
  status: "normal" | "low" | "critical"
  parentProduct: string
}

interface ProductVariant {
  size: string
  color: string
  stock: number
  safeStock: number
  price: number
}

interface NewProduct {
  name: string
  category: string
  supplier: string
  description: string
  variants: ProductVariant[]
}

const inventoryData: InventoryItem[] = [
  {
    id: 1,
    name: "삼성 갤럭시 케이스",
    parentProduct: "삼성 갤럭시 케이스",
    category: "액세서리",
    size: "S22",
    color: "블랙",
    stock: 45,
    safeStock: 20,
    price: 15000,
    supplier: "케이스월드",
    lastUpdated: "2024-01-15",
    status: "normal",
  },
  {
    id: 2,
    name: "삼성 갤럭시 케이스",
    parentProduct: "삼성 갤럭시 케이스",
    category: "액세서리",
    size: "S22",
    color: "화이트",
    stock: 12,
    safeStock: 20,
    price: 15000,
    supplier: "케이스월드",
    lastUpdated: "2024-01-15",
    status: "low",
  },
  {
    id: 3,
    name: "삼성 갤럭시 케이스",
    parentProduct: "삼성 갤럭시 케이스",
    category: "액세서리",
    size: "S23",
    color: "블랙",
    stock: 8,
    safeStock: 15,
    price: 16000,
    supplier: "케이스월드",
    lastUpdated: "2024-01-14",
    status: "low",
  },
  {
    id: 4,
    name: "아이폰 충전기",
    parentProduct: "아이폰 충전기",
    category: "충전기",
    size: "Lightning",
    color: "화이트",
    stock: 25,
    safeStock: 15,
    price: 25000,
    supplier: "애플코리아",
    lastUpdated: "2024-01-14",
    status: "normal",
  },
  {
    id: 5,
    name: "아이폰 충전기",
    parentProduct: "아이폰 충전기",
    category: "충전기",
    size: "USB-C",
    color: "화이트",
    stock: 5,
    safeStock: 15,
    price: 28000,
    supplier: "애플코리아",
    lastUpdated: "2024-01-13",
    status: "critical",
  },
  {
    id: 6,
    name: "무선 이어폰",
    parentProduct: "무선 이어폰",
    category: "오디오",
    size: "Pro",
    color: "화이트",
    stock: 67,
    safeStock: 30,
    price: 89000,
    supplier: "사운드테크",
    lastUpdated: "2024-01-13",
    status: "normal",
  },
  {
    id: 7,
    name: "무선 이어폰",
    parentProduct: "무선 이어폰",
    category: "오디오",
    size: "Pro",
    color: "블랙",
    stock: 34,
    safeStock: 30,
    price: 89000,
    supplier: "사운드테크",
    lastUpdated: "2024-01-12",
    status: "normal",
  },
  {
    id: 8,
    name: "스마트워치 밴드",
    parentProduct: "스마트워치 밴드",
    category: "액세서리",
    size: "42mm",
    color: "블랙",
    stock: 3,
    safeStock: 10,
    price: 35000,
    supplier: "밴드플러스",
    lastUpdated: "2024-01-12",
    status: "critical",
  },
  {
    id: 9,
    name: "스마트워치 밴드",
    parentProduct: "스마트워치 밴드",
    category: "액세서리",
    size: "44mm",
    color: "브라운",
    stock: 15,
    safeStock: 10,
    price: 37000,
    supplier: "밴드플러스",
    lastUpdated: "2024-01-11",
    status: "normal",
  },
  {
    id: 10,
    name: "태블릿 보호필름",
    parentProduct: "태블릿 보호필름",
    category: "보호용품",
    size: "11인치",
    color: "투명",
    stock: 89,
    safeStock: 25,
    price: 12000,
    supplier: "필름마스터",
    lastUpdated: "2024-01-11",
    status: "normal",
  },
  {
    id: 11,
    name: "태블릿 보호필름",
    parentProduct: "태블릿 보호필름",
    category: "보호용품",
    size: "12.9인치",
    color: "투명",
    stock: 45,
    safeStock: 25,
    price: 15000,
    supplier: "필름마스터",
    lastUpdated: "2024-01-10",
    status: "normal",
  },
]

export function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sizeFilter, setSizeFilter] = useState("all")
  const [colorFilter, setColorFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [groupByProduct, setGroupByProduct] = useState(false)

  // Modal states
  const [isStockModalOpen, setIsStockModalOpen] = useState(false)
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false)
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false)
  const [isVariantManagerOpen, setIsVariantManagerOpen] = useState(false)

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [stockAction, setStockAction] = useState<"in" | "out">("in")
  const [stockQuantity, setStockQuantity] = useState("")

  // New product form state
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    category: "",
    supplier: "",
    description: "",
    variants: [{ size: "", color: "", stock: 0, safeStock: 0, price: 0 }],
  })

  const predefinedSizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "Free",
    "One Size",
    "S22",
    "S23",
    "S24",
    "iPhone 14",
    "iPhone 15",
    "Pro",
    "Lightning",
    "USB-C",
    "42mm",
    "44mm",
    "11인치",
    "12.9인치",
  ]
  const predefinedColors = [
    "블랙",
    "화이트",
    "그레이",
    "네이비",
    "브라운",
    "베이지",
    "레드",
    "블루",
    "그린",
    "옐로우",
    "핑크",
    "퍼플",
    "투명",
    "실버",
    "골드",
  ]

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter and sort inventory data
  const filteredAndSortedData = inventoryData
    .filter((item) => {
      const matchesSearch =
        item.parentProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      const matchesSize = sizeFilter === "all" || item.size === sizeFilter
      const matchesColor = colorFilter === "all" || item.color === colorFilter
      return matchesSearch && matchesCategory && matchesStatus && matchesSize && matchesColor
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof InventoryItem]
      let bValue = b[sortBy as keyof InventoryItem]

      if (typeof aValue === "string") aValue = aValue.toLowerCase()
      if (typeof bValue === "string") bValue = bValue.toLowerCase()

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  const categories = [...new Set(inventoryData.map((item) => item.category))]
  const sizes = [...new Set(inventoryData.map((item) => item.size).filter(Boolean))]
  const colors = [...new Set(inventoryData.map((item) => item.color).filter(Boolean))]
  const lowStockCount = inventoryData.filter((item) => item.status === "low" || item.status === "critical").length

  const getGroupedData = () => {
    if (!groupByProduct) return filteredAndSortedData

    const grouped = filteredAndSortedData.reduce(
      (acc, item) => {
        if (!acc[item.parentProduct]) {
          acc[item.parentProduct] = []
        }
        acc[item.parentProduct].push(item)
        return acc
      },
      {} as Record<string, InventoryItem[]>,
    )

    return Object.entries(grouped).map(([parentProduct, variants]) => ({
      parentProduct,
      variants,
      totalStock: variants.reduce((sum, v) => sum + v.stock, 0),
      lowStockVariants: variants.filter((v) => v.status === "low" || v.status === "critical").length,
    }))
  }

  const addVariant = () => {
    setNewProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "", color: "", stock: 0, safeStock: 0, price: 0 }],
    }))
  }

  const removeVariant = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }))
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    setNewProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant)),
    }))
  }

  const handleCreateProduct = () => {
    console.log("[v0] Creating new product:", newProduct)
    // Here you would typically save to backend
    setIsNewProductModalOpen(false)
    setNewProduct({
      name: "",
      category: "",
      supplier: "",
      description: "",
      variants: [{ size: "", color: "", stock: 0, safeStock: 0, price: 0 }],
    })
  }

  const openVariantManager = (parentProduct: string) => {
    const variants = inventoryData.filter((item) => item.parentProduct === parentProduct)
    setSelectedItem(variants[0]) // Use first variant as reference
    setIsVariantManagerOpen(true)
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const openStockModal = (item: InventoryItem, action: "in" | "out") => {
    setSelectedItem(item)
    setStockAction(action)
    setStockQuantity("")
    setIsStockModalOpen(true)
  }

  const handleStockUpdate = () => {
    // Here you would typically update the inventory in your backend
    console.log(`${stockAction === "in" ? "입고" : "출고"}: ${selectedItem?.name}, 수량: ${stockQuantity}`)
    setIsStockModalOpen(false)
  }

  const downloadTemplate = () => {
    const templateData = [
      {
        제품명: "티셔츠",
        카테고리: "의류",
        사이즈: "M",
        색상: "빨강",
        현재고: 50,
        안전재고: 10,
        가격: 25000,
        공급업체: "패션코리아",
      },
      {
        제품명: "청바지",
        카테고리: "의류",
        사이즈: "L",
        색상: "파랑",
        현재고: 30,
        안전재고: 5,
        가격: 45000,
        공급업체: "데님월드",
      },
    ]

    const ws = XLSX.utils.json_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "제품등록템플릿")

    // Set column widths
    const colWidths = [
      { wch: 20 }, // 제품명
      { wch: 15 }, // 카테고리
      { wch: 10 }, // 사이즈
      { wch: 10 }, // 색상
      { wch: 10 }, // 현재고
      { wch: 10 }, // 안전재고
      { wch: 12 }, // 가격
      { wch: 20 }, // 공급업체
    ]
    ws["!cols"] = colWidths

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([wbout], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "제품등록_템플릿.xlsx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadInventoryData = () => {
    const exportData = filteredAndSortedData.map((item) => ({
      제품명: item.parentProduct,
      카테고리: item.category,
      사이즈: item.size,
      색상: item.color,
      현재고: item.stock,
      안전재고: item.safeStock,
      가격: item.price,
      공급업체: item.supplier,
      상태: item.status === "critical" ? "긴급" : item.status === "low" ? "부족" : "정상",
      최근업데이트: item.lastUpdated,
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "재고현황")

    // Set column widths
    const colWidths = [
      { wch: 20 }, // 제품명
      { wch: 15 }, // 카테고리
      { wch: 10 }, // 사이즈
      { wch: 10 }, // 색상
      { wch: 10 }, // 현재고
      { wch: 10 }, // 안전재고
      { wch: 12 }, // 가격
      { wch: 20 }, // 공급업체
      { wch: 10 }, // 상태
      { wch: 15 }, // 최근업데이트
    ]
    ws["!cols"] = colWidths

    const today = new Date().toISOString().split("T")[0]
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([wbout], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `재고현황_${today}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        console.log("[v0] Uploaded Excel data:", jsonData)

        // Process the uploaded data
        const processedData = jsonData
          .map((row: any, index: number) => {
            const productName = row["제품명"] || row["Product Name"] || row["name"]
            const category = row["카테고리"] || row["Category"] || row["category"]
            const size = row["사이즈"] || row["Size"] || row["size"]
            const color = row["색상"] || row["Color"] || row["color"]
            const stock = Number(row["현재고"] || row["Stock"] || row["stock"]) || 0
            const safeStock = Number(row["안전재고"] || row["Safe Stock"] || row["safeStock"]) || 0
            const price = Number(row["가격"] || row["Price"] || row["price"]) || 0
            const supplier = row["공급업체"] || row["Supplier"] || row["supplier"]

            return {
              id: Date.now() + index,
              name: productName,
              parentProduct: productName,
              category,
              size,
              color,
              stock,
              safeStock,
              price,
              supplier,
              lastUpdated: new Date().toISOString().split("T")[0],
              status: stock <= safeStock ? (stock <= safeStock * 0.5 ? "critical" : "low") : "normal",
            }
          })
          .filter((item) => item.name && item.category) // Filter out invalid rows

        console.log("[v0] Processed data for import:", processedData)

        // Here you would typically save to backend
        alert(`${processedData.length}개의 제품이 성공적으로 업로드되었습니다.`)
      } catch (error) {
        console.error("[v0] Error processing Excel file:", error)
        alert("Excel 파일 처리 중 오류가 발생했습니다. 파일 형식을 확인해주세요.")
      }
    }
    reader.readAsArrayBuffer(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const downloadStockMovements = () => {
    // Sample stock movement data
    const stockMovements = [
      {
        날짜: "2024-01-15",
        제품명: "티셔츠",
        사이즈: "M",
        색상: "빨강",
        구분: "입고",
        수량: 20,
        단가: 25000,
        총액: 500000,
        "공급업체/고객": "패션코리아",
        담당자: "김철수",
      },
      {
        날짜: "2024-01-16",
        제품명: "청바지",
        사이즈: "L",
        색상: "파랑",
        구분: "출고",
        수량: 5,
        단가: 45000,
        총액: 225000,
        "공급업체/고객": "온라인몰",
        담당자: "이영희",
      },
    ]

    const ws = XLSX.utils.json_to_sheet(stockMovements)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "입출고내역")

    // Set column widths
    const colWidths = [
      { wch: 12 }, // 날짜
      { wch: 20 }, // 제품명
      { wch: 10 }, // 사이즈
      { wch: 10 }, // 색상
      { wch: 8 }, // 구분
      { wch: 8 }, // 수량
      { wch: 12 }, // 단가
      { wch: 12 }, // 총액
      { wch: 15 }, // 공급업체/고객
      { wch: 10 }, // 담당자
    ]
    ws["!cols"] = colWidths

    const today = new Date().toISOString().split("T")[0]
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([wbout], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `입출고내역_${today}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header with alerts */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">재고 관리</h1>
          <p className="text-muted-foreground">전체 재고를 관리하고 입출고를 처리하세요</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              템플릿 다운로드
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Excel 업로드
            </Button>
            <Button variant="outline" size="sm" onClick={downloadInventoryData}>
              <Download className="h-4 w-4 mr-2" />
              재고 내보내기
            </Button>
            <Button variant="outline" size="sm" onClick={downloadStockMovements}>
              <Download className="h-4 w-4 mr-2" />
              입출고 내역
            </Button>
          </div>
          {lowStockCount > 0 && (
            <div className="flex items-center space-x-2 bg-destructive/10 text-destructive px-3 py-2 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">{lowStockCount}개 품목이 재고 부족 상태입니다</span>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">검색 및 필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div className="space-y-2">
              <Label htmlFor="search">제품명 검색</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="제품명을 입력하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">사이즈</Label>
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="사이즈 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size!}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">색상</Label>
              <Select value={colorFilter} onValueChange={setColorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="색상 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {colors.map((color) => (
                    <SelectItem key={color} value={color!}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">재고 상태</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="normal">정상</SelectItem>
                  <SelectItem value="low">부족</SelectItem>
                  <SelectItem value="critical">긴급</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>정렬</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">제품명</SelectItem>
                  <SelectItem value="stock">현재고</SelectItem>
                  <SelectItem value="price">가격</SelectItem>
                  <SelectItem value="lastUpdated">최근 업데이트</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-3 lg:col-span-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="group-products" checked={groupByProduct} onCheckedChange={setGroupByProduct} />
                <Label htmlFor="group-products">제품별 그룹화</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div>
              <CardTitle className="font-heading">재고 목록</CardTitle>
              <CardDescription>총 {filteredAndSortedData.length}개 품목</CardDescription>
            </div>
            <Button onClick={() => setIsNewProductModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              신규 제품 등록
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {groupByProduct ? (
              <div className="space-y-4">
                {getGroupedData().map((group: any) => (
                  <div key={group.parentProduct} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{group.parentProduct}</h3>
                        <p className="text-sm text-muted-foreground">
                          총 재고: {group.totalStock}개 | 변형: {group.variants.length}개
                          {group.lowStockVariants > 0 && (
                            <span className="text-destructive ml-2">({group.lowStockVariants}개 부족)</span>
                          )}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => openVariantManager(group.parentProduct)}>
                        <Settings className="h-4 w-4 mr-2" />
                        변형 관리
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      {group.variants.map((item: InventoryItem) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                          <div className="flex items-center space-x-4">
                            <div className="flex space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {item.size}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {item.color}
                              </Badge>
                            </div>
                            <span className="text-sm">재고: {item.stock}개</span>
                            <span className="text-sm text-muted-foreground">₩{item.price.toLocaleString()}</span>
                            <Badge
                              variant={
                                item.status === "critical"
                                  ? "destructive"
                                  : item.status === "low"
                                    ? "secondary"
                                    : "default"
                              }
                              className="text-xs"
                            >
                              {item.status === "critical" ? "긴급" : item.status === "low" ? "부족" : "정상"}
                            </Badge>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openStockModal(item, "in")}
                              className="text-green-600 hover:text-green-700"
                            >
                              입고
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openStockModal(item, "out")}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              출고
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("name")}
                        className="font-medium text-muted-foreground hover:text-foreground"
                      >
                        제품명
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">카테고리</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">사이즈</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">색상</th>
                    <th className="text-left py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("stock")}
                        className="font-medium text-muted-foreground hover:text-foreground"
                      >
                        현재고
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">안전재고</th>
                    <th className="text-left py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("price")}
                        className="font-medium text-muted-foreground hover:text-foreground"
                      >
                        가격
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">공급업체</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">상태</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedData.map((item) => (
                    <tr key={item.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{item.parentProduct}</td>
                      <td className="py-3 px-4 text-muted-foreground">{item.category}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-xs">
                          {item.size}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-xs">
                          {item.color}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className={item.stock <= item.safeStock ? "text-destructive font-medium" : ""}>
                          {item.stock}개
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{item.safeStock}개</td>
                      <td className="py-3 px-4">₩{item.price.toLocaleString()}</td>
                      <td className="py-3 px-4 text-muted-foreground">{item.supplier}</td>
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
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openStockModal(item, "in")}
                            className="text-green-600 hover:text-green-700"
                          >
                            입고
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openStockModal(item, "out")}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            출고
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item)
                              setIsEditProductModalOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isNewProductModalOpen} onOpenChange={setIsNewProductModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">신규 제품 등록</DialogTitle>
            <DialogDescription>새로운 제품과 해당 제품의 변형(사이즈, 색상)을 등록하세요</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">기본 정보</TabsTrigger>
              <TabsTrigger value="variants">변형 관리</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">제품명</Label>
                  <Input
                    id="product-name"
                    placeholder="제품명을 입력하세요"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-category">카테고리</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">새 카테고리 추가</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-supplier">공급업체</Label>
                <Input
                  id="product-supplier"
                  placeholder="공급업체명을 입력하세요"
                  value={newProduct.supplier}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, supplier: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-description">제품 설명</Label>
                <Textarea
                  id="product-description"
                  placeholder="제품에 대한 상세 설명을 입력하세요"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </TabsContent>

            <TabsContent value="variants" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">제품 변형</h3>
                <Button onClick={addVariant} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  변형 추가
                </Button>
              </div>

              <div className="space-y-4">
                {newProduct.variants.map((variant, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">변형 #{index + 1}</h4>
                      {newProduct.variants.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Label>사이즈</Label>
                        <Select value={variant.size} onValueChange={(value) => updateVariant(index, "size", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="사이즈 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {predefinedSizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>색상</Label>
                        <Select value={variant.color} onValueChange={(value) => updateVariant(index, "color", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="색상 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {predefinedColors.map((color) => (
                              <SelectItem key={color} value={color}>
                                {color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>현재고</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={variant.stock}
                          onChange={(e) => updateVariant(index, "stock", Number.parseInt(e.target.value) || 0)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>안전재고</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={variant.safeStock}
                          onChange={(e) => updateVariant(index, "safeStock", Number.parseInt(e.target.value) || 0)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>가격</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, "price", Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewProductModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleCreateProduct}>제품 등록</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isVariantManagerOpen} onOpenChange={setIsVariantManagerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">변형 관리</DialogTitle>
            <DialogDescription>{selectedItem?.parentProduct}의 모든 변형을 관리하세요</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedItem &&
              inventoryData
                .filter((item) => item.parentProduct === selectedItem.parentProduct)
                .map((variant) => (
                  <div key={variant.id} className="border border-border rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                      <div>
                        <Label className="text-xs text-muted-foreground">사이즈</Label>
                        <Badge variant="outline">{variant.size}</Badge>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">색상</Label>
                        <Badge variant="outline">{variant.color}</Badge>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">현재고</Label>
                        <p className="font-medium">{variant.stock}개</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">안전재고</Label>
                        <p className="font-medium">{variant.safeStock}개</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">가격</Label>
                        <p className="font-medium">₩{variant.price.toLocaleString()}</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

            <Button className="w-full bg-transparent" variant="outline">
              <Plus className="h-4 w-4 mr-2" />새 변형 추가
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVariantManagerOpen(false)}>
              닫기
            </Button>
            <Button>변경사항 저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Update Modal */}
      <Dialog open={isStockModalOpen} onOpenChange={setIsStockModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">{stockAction === "in" ? "입고 처리" : "출고 처리"}</DialogTitle>
            <DialogDescription>
              {selectedItem?.parentProduct} ({selectedItem?.size}, {selectedItem?.color})의{" "}
              {stockAction === "in" ? "입고" : "출고"} 수량을 입력하세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">현재 재고:</span>
                <span className="ml-2 font-medium">{selectedItem?.stock}개</span>
              </div>
              <div>
                <span className="text-muted-foreground">안전 재고:</span>
                <span className="ml-2 font-medium">{selectedItem?.safeStock}개</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">수량</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="수량을 입력하세요"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStockModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleStockUpdate} disabled={!stockQuantity}>
              {stockAction === "in" ? "입고 처리" : "출고 처리"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
