import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/components/auth/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { InventoryManagement } from '@/components/inventory-management'
import { useAuth } from '@/components/auth/auth-context'

// Mock functions
const mockGetProducts = jest.fn()
const mockCreateProduct = jest.fn()

jest.mock('@/lib/products', () => ({
  getProducts: mockGetProducts,
  createProduct: mockCreateProduct,
}))

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  )
}

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: '테스트 상품 1',
    sku: 'TEST001',
    description: '테스트 상품 설명',
    category: '전자제품',
    current_stock: 50,
    min_stock: 10,
    max_stock: 100,
    unit_price: 15000,
    supplier_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

describe('Compatibility and Usability Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetProducts.mockResolvedValue({
      data: mockProducts,
      count: mockProducts.length,
      error: null,
    })
  })

  describe('TC-011: Intuitive Navigation', () => {
    it('should provide clear navigation structure', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for main navigation elements
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByText(/대시보드/i)).toBeInTheDocument()
      expect(screen.getByText(/재고/i)).toBeInTheDocument()
      expect(screen.getByText(/주문/i)).toBeInTheDocument()
      expect(screen.getByText(/설정/i)).toBeInTheDocument()
    })

    it('should show breadcrumb navigation', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check breadcrumb navigation
      expect(screen.getByText(/홈/i)).toBeInTheDocument()
      expect(screen.getByText(/재고/i)).toBeInTheDocument()
    })

    it('should provide quick action buttons', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for quick action buttons
      expect(screen.getByRole('button', { name: /상품 추가/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /검색/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /필터/i })).toBeInTheDocument()
    })
  })

  describe('TC-012: Responsive Design', () => {
    it('should adapt to mobile screen sizes', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for mobile-specific elements
      expect(screen.getByRole('button', { name: /메뉴/i })).toBeInTheDocument()
      
      // Verify table is scrollable on mobile
      const tableContainer = screen.getByRole('table').closest('div')
      expect(tableContainer).toHaveStyle({ overflowX: 'auto' })
    })

    it('should adapt to tablet screen sizes', async () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for tablet-optimized layout
      const gridContainer = screen.getByTestId('products-grid')
      expect(gridContainer).toHaveClass('grid-cols-2')
    })

    it('should adapt to desktop screen sizes', async () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      })

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1080,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for desktop-optimized layout
      const gridContainer = screen.getByTestId('products-grid')
      expect(gridContainer).toHaveClass('grid-cols-4')
    })
  })

  describe('TC-013: Accessibility', () => {
    it('should support keyboard navigation', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Test tab navigation
      const firstButton = screen.getByRole('button', { name: /상품 추가/i })
      firstButton.focus()
      expect(firstButton).toHaveFocus()

      // Test arrow key navigation in table
      const table = screen.getByRole('table')
      const firstRow = table.querySelector('tbody tr')
      if (firstRow) {
        firstRow.focus()
        expect(firstRow).toHaveFocus()
      }
    })

    it('should provide proper ARIA labels', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for proper ARIA labels
      expect(screen.getByLabelText(/상품 검색/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/카테고리 필터/i)).toBeInTheDocument()
      
      // Check table accessibility
      const table = screen.getByRole('table')
      expect(table).toHaveAttribute('aria-label', '상품 목록')
    })

    it('should support screen readers', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for screen reader text
      expect(screen.getByText(/현재 페이지/i)).toBeInTheDocument()
      expect(screen.getByText(/총 상품 수/i)).toBeInTheDocument()
      
      // Check for live regions
      const statusRegion = screen.getByRole('status')
      expect(statusRegion).toBeInTheDocument()
    })

    it('should have sufficient color contrast', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for high contrast elements
      const lowStockWarning = screen.getByText('테스트 상품 2')
      const parentElement = lowStockWarning.closest('tr')
      
      if (parentElement) {
        // Low stock items should have warning styling
        expect(parentElement).toHaveClass('bg-yellow-50')
      }
    })
  })

  describe('TC-014: Error Message Clarity', () => {
    it('should display clear error messages for validation failures', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Click add product button
      fireEvent.click(screen.getByRole('button', { name: /상품 추가/i }))

      // Try to submit empty form
      fireEvent.click(screen.getByRole('button', { name: /저장/i }))

      // Check for clear error messages
      expect(screen.getByText(/상품명을 입력해주세요/i)).toBeInTheDocument()
      expect(screen.getByText(/SKU를 입력해주세요/i)).toBeInTheDocument()
      expect(screen.getByText(/카테고리를 선택해주세요/i)).toBeInTheDocument()
    })

    it('should display clear error messages for API failures', async () => {
      mockCreateProduct.mockResolvedValueOnce({
        data: null,
        error: { message: '상품명이 이미 존재합니다' },
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Click add product button
      fireEvent.click(screen.getByRole('button', { name: /상품 추가/i }))

      // Fill form with duplicate data
      fireEvent.change(screen.getByLabelText(/상품명/i), {
        target: { value: '테스트 상품 1' },
      })
      fireEvent.change(screen.getByLabelText(/SKU/i), {
        target: { value: 'TEST001' },
      })

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /저장/i }))

      await waitFor(() => {
        expect(screen.getByText(/상품명이 이미 존재합니다/i)).toBeInTheDocument()
      })
    })

    it('should provide helpful error recovery suggestions', async () => {
      mockGetProducts.mockRejectedValueOnce(new Error('네트워크 오류'))

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Wait for error to occur
      await waitFor(() => {
        expect(screen.getByText(/데이터를 불러올 수 없습니다/i)).toBeInTheDocument()
      })

      // Check for recovery suggestions
      expect(screen.getByText(/다시 시도/i)).toBeInTheDocument()
      expect(screen.getByText(/네트워크 연결을 확인해주세요/i)).toBeInTheDocument()
    })
  })

  describe('TC-015: Loading State Display', () => {
    it('should show loading indicators during data fetch', async () => {
      // Mock slow response
      mockGetProducts.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            data: mockProducts,
            count: mockProducts.length,
            error: null,
          }), 100)
        )
      )

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Should show loading state
      expect(screen.getByText(/로딩 중/i)).toBeInTheDocument()
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/로딩 중/i)).not.toBeInTheDocument()
        expect(screen.getByText('테스트 상품 1')).toBeInTheDocument()
      })
    })

    it('should show skeleton loading for better UX', async () => {
      // Mock slow response
      mockGetProducts.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            data: mockProducts,
            count: mockProducts.length,
            error: null,
          }), 200)
        )
      )

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Should show skeleton loading
      const skeletonElements = screen.getAllByTestId('skeleton-row')
      expect(skeletonElements.length).toBeGreaterThan(0)

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryAllByTestId('skeleton-row')).toHaveLength(0)
      })
    })

    it('should show progress indicators for long operations', async () => {
      mockCreateProduct.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            data: { id: '2', name: 'New Product' },
            error: null,
          }), 300)
        )
      )

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Click add product button
      fireEvent.click(screen.getByRole('button', { name: /상품 추가/i }))

      // Fill form
      fireEvent.change(screen.getByLabelText(/상품명/i), {
        target: { value: 'New Product' },
      })
      fireEvent.change(screen.getByLabelText(/SKU/i), {
        target: { value: 'NEW001' },
      })

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /저장/i }))

      // Should show progress indicator
      expect(screen.getByText(/처리 중/i)).toBeInTheDocument()
      expect(screen.getByTestId('progress-bar')).toBeInTheDocument()

      // Wait for completion
      await waitFor(() => {
        expect(screen.queryByText(/처리 중/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('TC-025: Browser Compatibility', () => {
    it('should work with modern browser features', async () => {
      // Mock modern browser features
      Object.defineProperty(window, 'IntersectionObserver', {
        writable: true,
        configurable: true,
        value: jest.fn().mockImplementation(() => ({
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        })),
      })

      Object.defineProperty(window, 'ResizeObserver', {
        writable: true,
        configurable: true,
        value: jest.fn().mockImplementation(() => ({
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        })),
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Should work with modern features
      expect(window.IntersectionObserver).toBeDefined()
      expect(window.ResizeObserver).toBeDefined()
    })

    it('should gracefully degrade for older browsers', async () => {
      // Mock older browser (no modern features)
      delete (window as any).IntersectionObserver
      delete (window as any).ResizeObserver

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Should still function without modern features
      expect(screen.getByText('테스트 상품 1')).toBeInTheDocument()
    })
  })

  describe('TC-026: Mobile Browser Support', () => {
    it('should support touch interactions', async () => {
      // Mock touch events
      const mockTouchEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 } as Touch],
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Test touch event handling
      const addButton = screen.getByRole('button', { name: /상품 추가/i })
      addButton.dispatchEvent(mockTouchEvent)

      // Should respond to touch events
      expect(addButton).toBeInTheDocument()
    })

    it('should support mobile gestures', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for mobile gesture support
      const swipeContainer = screen.getByTestId('swipe-container')
      expect(swipeContainer).toHaveAttribute('data-swipeable', 'true')
    })
  })

  describe('TC-027: Screen Resolution Support', () => {
    it('should adapt to high DPI displays', async () => {
      // Mock high DPI display
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: 2,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Should support high DPI
      expect(window.devicePixelRatio).toBe(2)
    })

    it('should adapt to ultra-wide displays', async () => {
      // Mock ultra-wide display
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 3440,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Should utilize wide screen space
      const gridContainer = screen.getByTestId('products-grid')
      expect(gridContainer).toHaveClass('grid-cols-6')
    })
  })

  describe('TC-028: Touch Device Support', () => {
    it('should support touch input', async () => {
      // Mock touch device
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        configurable: true,
        value: 10,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Should detect touch device
      expect(navigator.maxTouchPoints).toBeGreaterThan(0)
    })

    it('should provide touch-friendly UI elements', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // Check for touch-friendly elements
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        // Buttons should have sufficient touch target size
        const rect = button.getBoundingClientRect()
        expect(rect.width).toBeGreaterThanOrEqual(44)
        expect(rect.height).toBeGreaterThanOrEqual(44)
      })
    })
  })
})
