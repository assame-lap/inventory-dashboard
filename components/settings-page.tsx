"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { User, Bell, Shield, Building, Database, Key, Download, Upload, Save, Eye, EyeOff } from "lucide-react"

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false)
  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    salesReports: false,
    systemUpdates: true,
  })

  const [profile, setProfile] = useState({
    name: "김재고",
    email: "admin@inventory.com",
    phone: "010-1234-5678",
    company: "재고관리 상점",
    position: "대표",
  })

  const [businessSettings, setBusinessSettings] = useState({
    businessName: "재고관리 상점",
    businessNumber: "123-45-67890",
    address: "서울시 강남구 테헤란로 123",
    taxRate: "10",
    currency: "KRW",
    timezone: "Asia/Seoul",
  })

  const handleSaveProfile = () => {
    console.log("프로필 저장:", profile)
    // Here you would typically save to backend
  }

  const handleSaveBusinessSettings = () => {
    console.log("비즈니스 설정 저장:", businessSettings)
    // Here you would typically save to backend
  }

  const handleExportData = () => {
    console.log("데이터 내보내기 시작")
    // Here you would typically trigger data export
  }

  const handleBackup = () => {
    console.log("백업 생성 시작")
    setIsBackupModalOpen(false)
    // Here you would typically create backup
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">설정</h1>
        <p className="text-muted-foreground">시스템 설정을 관리하고 개인화하세요</p>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
          <TabsTrigger value="business">비즈니스</TabsTrigger>
          <TabsTrigger value="security">보안</TabsTrigger>
          <TabsTrigger value="data">데이터</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <CardTitle className="font-heading">개인 정보</CardTitle>
              </div>
              <CardDescription>개인 프로필 정보를 관리하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">직책</Label>
                  <Input
                    id="position"
                    value={profile.position}
                    onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">회사명</Label>
                <Input
                  id="company"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <CardTitle className="font-heading">알림 설정</CardTitle>
              </div>
              <CardDescription>받고 싶은 알림을 선택하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>재고 부족 알림</Label>
                    <p className="text-sm text-muted-foreground">재고가 안전 수준 이하로 떨어질 때 알림</p>
                  </div>
                  <Switch
                    checked={notifications.lowStock}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, lowStock: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>새 주문 알림</Label>
                    <p className="text-sm text-muted-foreground">새로운 주문이 들어올 때 알림</p>
                  </div>
                  <Switch
                    checked={notifications.newOrders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, newOrders: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>매출 리포트 알림</Label>
                    <p className="text-sm text-muted-foreground">주간/월간 매출 리포트 알림</p>
                  </div>
                  <Switch
                    checked={notifications.salesReports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, salesReports: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>시스템 업데이트 알림</Label>
                    <p className="text-sm text-muted-foreground">시스템 업데이트 및 공지사항 알림</p>
                  </div>
                  <Switch
                    checked={notifications.systemUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <CardTitle className="font-heading">비즈니스 설정</CardTitle>
              </div>
              <CardDescription>사업체 정보와 운영 설정을 관리하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">사업체명</Label>
                  <Input
                    id="businessName"
                    value={businessSettings.businessName}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessNumber">사업자등록번호</Label>
                  <Input
                    id="businessNumber"
                    value={businessSettings.businessNumber}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, businessNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">세율 (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={businessSettings.taxRate}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, taxRate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">통화</Label>
                  <Select
                    value={businessSettings.currency}
                    onValueChange={(value) => setBusinessSettings({ ...businessSettings, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KRW">한국 원 (KRW)</SelectItem>
                      <SelectItem value="USD">미국 달러 (USD)</SelectItem>
                      <SelectItem value="EUR">유로 (EUR)</SelectItem>
                      <SelectItem value="JPY">일본 엔 (JPY)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">사업장 주소</Label>
                <Textarea
                  id="address"
                  value={businessSettings.address}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveBusinessSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <CardTitle className="font-heading">보안 설정</CardTitle>
              </div>
              <CardDescription>계정 보안을 강화하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">비밀번호 변경</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">현재 비밀번호</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="현재 비밀번호를 입력하세요"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">새 비밀번호</Label>
                      <Input id="newPassword" type="password" placeholder="새 비밀번호를 입력하세요" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                      <Input id="confirmPassword" type="password" placeholder="새 비밀번호를 다시 입력하세요" />
                    </div>
                    <Button>비밀번호 변경</Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3">2단계 인증</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">계정 보안을 위해 2단계 인증을 활성화하세요</p>
                    </div>
                    <Badge variant="secondary">비활성화</Badge>
                  </div>
                  <Button variant="outline" className="mt-3 bg-transparent">
                    <Key className="h-4 w-4 mr-2" />
                    2단계 인증 설정
                  </Button>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3">로그인 기록</h4>
                  <p className="text-sm text-muted-foreground mb-3">최근 로그인 활동을 확인하세요</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">현재 세션</p>
                        <p className="text-xs text-muted-foreground">Chrome, Seoul - 2024-01-16 09:30</p>
                      </div>
                      <Badge>활성</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">이전 로그인</p>
                        <p className="text-xs text-muted-foreground">Safari, Seoul - 2024-01-15 18:45</p>
                      </div>
                      <Badge variant="secondary">종료됨</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <CardTitle className="font-heading">데이터 관리</CardTitle>
              </div>
              <CardDescription>데이터 백업, 내보내기, 가져오기를 관리하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">데이터 백업</h4>
                  <p className="text-sm text-muted-foreground mb-3">정기적으로 데이터를 백업하여 안전하게 보관하세요</p>
                  <div className="flex space-x-2">
                    <Button onClick={() => setIsBackupModalOpen(true)}>
                      <Database className="h-4 w-4 mr-2" />
                      백업 생성
                    </Button>
                    <Button variant="outline">백업 기록 보기</Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3">데이터 내보내기</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    재고, 발주, 매출 데이터를 Excel 또는 CSV 형식으로 내보내세요
                  </p>
                  <div className="flex space-x-2">
                    <Button onClick={handleExportData}>
                      <Download className="h-4 w-4 mr-2" />
                      데이터 내보내기
                    </Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3">데이터 가져오기</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Excel 또는 CSV 파일에서 데이터를 가져와 시스템에 추가하세요
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      파일 선택
                    </Button>
                    <Button variant="outline">템플릿 다운로드</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Backup Confirmation Modal */}
      <Dialog open={isBackupModalOpen} onOpenChange={setIsBackupModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">데이터 백업 생성</DialogTitle>
            <DialogDescription>
              현재 시스템의 모든 데이터를 백업합니다. 이 과정은 몇 분 정도 소요될 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>백업에 포함될 데이터:</Label>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• 재고 데이터</li>
                <li>• 발주 기록</li>
                <li>• 매출 데이터</li>
                <li>• 사용자 설정</li>
                <li>• 시스템 설정</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBackupModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleBackup}>백업 생성</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
