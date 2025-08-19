import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/components/auth/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { InventoryManagement } from '@/components/inventory-management'
import { useAuth } from '@/components/auth/auth-context'

// Mock functions
const mockGetProducts = jest.fn()
const mockGetLowStockProducts = jest.fn()
const mockCreateNotification = jest.fn()
const mockGetNotifications = jest.fn()

jest.mock('@/lib/products', () => ({
  getProducts: mockGetProducts,
  getLowStockProducts: mockGetLowStockProducts,
}))

jest.mock('@/lib/notifications', () => ({
  createNotification: mockCreateNotification,
  getNotifications: mockGetNotifications,
}))

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  )
}

// Mock products data with low stock items
const mockProducts = [
  {
    id: '1',
    name: '정상 재고 상품',
    sku: 'NORMAL001',
    description: '정상 재고를 보유한 상품',
    category: '전자제품',
    current_stock: 50,
    min_stock: 10,
    max_stock: 100,
    unit_price: 15000,
    supplier_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: '재고 부족 상품',
    sku: 'LOW001',
    description: '재고가 부족한 상품',
    category: '의류',
    current_stock: 5,
    min_stock: 10,
    max_stock: 50,
    unit_price: 25000,
    supplier_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: '재고 소진 상품',
    sku: 'OUT001',
    description: '재고가 소진된 상품',
    category: '식품',
    current_stock: 0,
    min_stock: 5,
    max_stock: 30,
    unit_price: 8000,
    supplier_id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    user_id: '1',
    type: 'low_stock',
    title: '재고 부족 알림',
    message: '재고 부족 상품의 재고가 부족합니다',
    product_id: '2',
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '1',
    type: 'out_of_stock',
    title: '재고 소진 알림',
    message: '재고 소진 상품의 재고가 소진되었습니다',
    product_id: '3',
    is_read: false,
    created_at: new Date().toISOString(),
  },
]

describe('Low Stock Alerts Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetProducts.mockResolvedValue({
      data: mockProducts,
      count: mockProducts.length,
      error: null,
    })
    mockGetLowStockProducts.mockResolvedValue({
      data: mockProducts.filter(p => p.current_stock <= p.min_stock),
      count: 2,
      error: null,
    })
    mockGetNotifications.mockResolvedValue({
      data: mockNotifications,
      count: mockNotifications.length,
      error: null,
    })
  })

  describe('TC-009: Low Stock Alert System', () => {
    it('should display low stock warnings for products below minimum stock', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for low stock warnings
      const lowStockProduct = screen.getByText('재고 부족 상품')
      const lowStockRow = lowStockProduct.closest('tr')
      
      if (lowStockRow) {
        // Should have warning styling
        expect(lowStockRow).toHaveClass('bg-yellow-50')
        
        // Should show low stock indicator
        const lowStockBadge = lowStockRow.querySelector('[data-testid="low-stock-badge"]')
        expect(lowStockBadge).toBeInTheDocument()
        expect(lowStockBadge).toHaveTextContent('재고 부족')
      }
    })

    it('should display out of stock warnings for products with zero stock', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for out of stock warnings
      const outOfStockProduct = screen.getByText('재고 소진 상품')
      const outOfStockRow = outOfStockProduct.closest('tr')
      
      if (outOfStockRow) {
        // Should have critical styling
        expect(outOfStockRow).toHaveClass('bg-red-50')
        
        // Should show out of stock indicator
        const outOfStockBadge = outOfStockRow.querySelector('[data-testid="out-of-stock-badge"]')
        expect(outOfStockBadge).toBeInTheDocument()
        expect(outOfStockBadge).toHaveTextContent('재고 소진')
      }
    })

    it('should show low stock count in dashboard stats', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for low stock count display
      const lowStockCount = screen.getByText(/재고 부족/i)
      expect(lowStockCount).toBeInTheDocument()
      
      // Should show the actual count
      const countElement = lowStockCount.closest('div')?.querySelector('[data-testid="low-stock-count"]')
      expect(countElement).toHaveTextContent('2')
    })

    it('should create notifications for low stock products', async () => {
      // Mock notification creation
      mockCreateNotification.mockResolvedValue({
        data: { id: '3', type: 'low_stock' },
        error: null,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check if notifications were created for low stock products
      expect(mockCreateNotification).toHaveBeenCalledWith({
        user_id: '1',
        type: 'low_stock',
        title: '재고 부족 알림',
        message: expect.stringContaining('재고 부족 상품'),
        product_id: '2',
      })

      expect(mockCreateNotification).toHaveBeenCalledWith({
        user_id: '1',
        type: 'out_of_stock',
        title: '재고 소진 알림',
        message: expect.stringContaining('재고 소진 상품'),
        product_id: '3',
      })
    })

    it('should display low stock alerts in notification center', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Click on notification bell or alerts section
      const alertButton = screen.getByRole('button', { name: /알림/i })
      fireEvent.click(alertButton)

      // Should show low stock notifications
      await waitFor(() => {
        expect(screen.getByText('재고 부족 알림')).toBeInTheDocument()
        expect(screen.getByText('재고 소진 알림')).toBeInTheDocument()
      })

      // Check notification details
      expect(screen.getByText(/재고 부족 상품의 재고가 부족합니다/i)).toBeInTheDocument()
      expect(screen.getByText(/재고 소진 상품의 재고가 소진되었습니다/i)).toBeInTheDocument()
    })

    it('should allow users to mark low stock notifications as read', async () => {
      const mockMarkAsRead = jest.fn()
      jest.mock('@/lib/notifications', () => ({
        ...jest.requireActual('@/lib/notifications'),
        markNotificationAsRead: mockMarkAsRead,
      }))

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Open notifications
      const alertButton = screen.getByRole('button', { name: /알림/i })
      fireEvent.click(alertButton)

      await waitFor(() => {
        expect(screen.getByText('재고 부족 알림')).toBeInTheDocument()
      })

      // Click on notification to mark as read
      const notification = screen.getByText('재고 부족 알림')
      fireEvent.click(notification)

      // Should mark notification as read
      expect(mockMarkAsRead).toHaveBeenCalledWith('1')
    })

    it('should provide quick actions for low stock products', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Find low stock product row
      const lowStockProduct = screen.getByText('재고 부족 상품')
      const lowStockRow = lowStockProduct.closest('tr')
      
      if (lowStockRow) {
        // Should have quick action buttons
        const restockButton = lowStockRow.querySelector('[data-testid="restock-button"]')
        const orderButton = lowStockRow.querySelector('[data-testid="order-button"]')
        
        expect(restockButton).toBeInTheDocument()
        expect(orderButton).toBeInTheDocument()
        
        // Check button labels
        expect(restockButton).toHaveTextContent('재고 보충')
        expect(orderButton).toHaveTextContent('발주')
      }
    })

    it('should show low stock products in dedicated section', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for low stock section
      expect(screen.getByText(/재고 부족 상품/i)).toBeInTheDocument()
      
      // Should show low stock products list
      const lowStockSection = screen.getByTestId('low-stock-section')
      expect(lowStockSection).toBeInTheDocument()
      
      // Should contain low stock products
      expect(lowStockSection).toHaveTextContent('재고 부족 상품')
      expect(lowStockSection).toHaveTextContent('재고 소진 상품')
    })

    it('should provide low stock alert settings', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for alert settings
      const settingsButton = screen.getByRole('button', { name: /설정/i })
      fireEvent.click(settingsButton)

      // Should show alert settings
      await waitFor(() => {
        expect(screen.getByText(/알림 설정/i)).toBeInTheDocument()
      })

      // Check for low stock threshold settings
      expect(screen.getByText(/재고 부족 임계값/i)).toBeInTheDocument()
      expect(screen.getByText(/알림 주기/i)).toBeInTheDocument()
      expect(screen.getByText(/이메일 알림/i)).toBeInTheDocument()
    })

    it('should allow users to customize low stock thresholds', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Open settings
      const settingsButton = screen.getByRole('button', { name: /설정/i })
      fireEvent.click(settingsButton)

      await waitFor(() => {
        expect(screen.getByText(/알림 설정/i)).toBeInTheDocument()
      })

      // Find threshold input for a specific product
      const thresholdInput = screen.getByLabelText(/재고 부족 임계값/i)
      fireEvent.change(thresholdInput, { target: { value: '15' } })

      // Save settings
      const saveButton = screen.getByRole('button', { name: /저장/i })
      fireEvent.click(saveButton)

      // Should update threshold
      await waitFor(() => {
        expect(screen.getByText(/설정이 저장되었습니다/i)).toBeInTheDocument()
      })
    })

    it('should send email notifications for critical low stock', async () => {
      const mockSendEmail = jest.fn()
      jest.mock('@/lib/email', () => ({
        sendLowStockAlert: mockSendEmail,
      }))

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check if email notifications were sent for critical items
      expect(mockSendEmail).toHaveBeenCalledWith({
        to: 'user@example.com',
        subject: '재고 부족 알림',
        product: '재고 부족 상품',
        currentStock: 5,
        minStock: 10,
      })
    })

    it('should provide low stock reporting', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for reports section
      const reportsButton = screen.getByRole('button', { name: /보고서/i })
      fireEvent.click(reportsButton)

      // Should show low stock report
      await waitFor(() => {
        expect(screen.getByText(/재고 부족 보고서/i)).toBeInTheDocument()
      })

      // Check report content
      expect(screen.getByText(/총 재고 부족 상품/i)).toBeInTheDocument()
      expect(screen.getByText(/예상 재고 소진일/i)).toBeInTheDocument()
      expect(screen.getByText(/권장 발주 수량/i)).toBeInTheDocument()
    })
  })
})
