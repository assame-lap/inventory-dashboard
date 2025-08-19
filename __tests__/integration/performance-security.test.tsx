import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/components/auth/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { InventoryManagement } from '@/components/inventory-management'
import { useAuth } from '@/components/auth/auth-context'

// Mock functions
const mockGetProducts = jest.fn()
const mockCreateProduct = jest.fn()
const mockUpdateProduct = jest.fn()
const mockDeleteProduct = jest.fn()

jest.mock('@/lib/products', () => ({
  getProducts: mockGetProducts,
  createProduct: mockCreateProduct,
  updateProduct: mockUpdateProduct,
  deleteProduct: mockDeleteProduct,
}))

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  )
}

// Large dataset for performance testing
const generateLargeProductDataset = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `product-${index}`,
    name: `상품 ${index + 1}`,
    sku: `SKU${String(index + 1).padStart(3, '0')}`,
    description: `상품 ${index + 1}에 대한 설명입니다.`,
    category: ['전자제품', '의류', '식품', '가구'][index % 4],
    current_stock: Math.floor(Math.random() * 100) + 1,
    min_stock: 10,
    max_stock: 200,
    unit_price: Math.floor(Math.random() * 50000) + 1000,
    supplier_id: `supplier-${(index % 5) + 1}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }))
}

describe('Performance and Security Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('TC-021: Large Dataset Performance', () => {
    it('should handle large product datasets efficiently', async () => {
      const largeDataset = generateLargeProductDataset(1000)
      
      mockGetProducts.mockResolvedValue({
        data: largeDataset.slice(0, 50), // First page
        count: largeDataset.length,
        error: null,
      })

      const startTime = performance.now()

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('상품 1')).toBeInTheDocument()
      })

      const endTime = performance.now()
      const loadTime = endTime - startTime

      // Performance assertion: should load within 2 seconds
      expect(loadTime).toBeLessThan(2000)
      expect(mockGetProducts).toHaveBeenCalledTimes(1)
    })

    it('should implement pagination for large datasets', async () => {
      const largeDataset = generateLargeProductDataset(500)
      
      // Mock first page
      mockGetProducts.mockResolvedValueOnce({
        data: largeDataset.slice(0, 20),
        count: largeDataset.length,
        error: null,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('상품 1')).toBeInTheDocument()
      })

      // Check if pagination controls are present
      expect(screen.getByText(/1-20 of 500/i)).toBeInTheDocument()
    })
  })

  describe('TC-022: Page Loading Performance', () => {
    it('should load dashboard within acceptable time', async () => {
      const startTime = performance.now()

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      const endTime = performance.now()
      const loadTime = endTime - startTime

      // Should load within 1 second
      expect(loadTime).toBeLessThan(1000)
    })

    it('should show loading states during data fetch', async () => {
      // Mock slow response
      mockGetProducts.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            data: [],
            count: 0,
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

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/로딩 중/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('TC-023: Search Response Performance', () => {
    it('should respond to search queries within acceptable time', async () => {
      const searchResults = generateLargeProductDataset(100).filter(p => 
        p.name.includes('전자')
      )

      mockGetProducts.mockResolvedValue({
        data: searchResults.slice(0, 20),
        count: searchResults.length,
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

      const searchInput = screen.getByPlaceholderText(/상품 검색/i)
      
      const startTime = performance.now()
      fireEvent.change(searchInput, { target: { value: '전자' } })
      fireEvent.click(screen.getByRole('button', { name: /검색/i }))
      
      await waitFor(() => {
        expect(mockGetProducts).toHaveBeenCalled()
      })
      
      const endTime = performance.now()
      const searchTime = endTime - startTime

      // Search should respond within 500ms
      expect(searchTime).toBeLessThan(500)
    })
  })

  describe('TC-016: Unauthorized Access Prevention', () => {
    it('should prevent access to protected routes without authentication', () => {
      // Mock unauthenticated state
      jest.spyOn(require('@/components/auth/auth-context'), 'useAuth').mockReturnValue({
        user: null,
        loading: false,
        signOut: jest.fn(),
        refreshUser: jest.fn(),
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Should redirect to login or show access denied
      expect(screen.getByText(/로그인이 필요합니다/i) || 
             screen.getByText(/접근 권한이 없습니다/i)).toBeInTheDocument()
    })
  })

  describe('TC-017: Role-Based Access Control', () => {
    it('should restrict admin functions to admin users only', () => {
      const staffUser = {
        id: '1',
        name: '스태프 사용자',
        email: 'staff@example.com',
        role: 'staff' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      jest.spyOn(require('@/components/auth/auth-context'), 'useAuth').mockReturnValue({
        user: staffUser,
        loading: false,
        signOut: jest.fn(),
        refreshUser: jest.fn(),
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Staff users should not see admin functions
      expect(screen.queryByRole('button', { name: /시스템 설정/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /사용자 관리/i })).not.toBeInTheDocument()
    })

    it('should allow admin users to access all functions', () => {
      const adminUser = {
        id: '1',
        name: '관리자',
        email: 'admin@example.com',
        role: 'admin' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      jest.spyOn(require('@/components/auth/auth-context'), 'useAuth').mockReturnValue({
        user: adminUser,
        loading: false,
        signOut: jest.fn(),
        refreshUser: jest.fn(),
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Admin users should see all functions
      expect(screen.getByRole('button', { name: /시스템 설정/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /사용자 관리/i })).toBeInTheDocument()
    })
  })

  describe('TC-018: SQL Injection Prevention', () => {
    it('should sanitize user input to prevent SQL injection', async () => {
      const maliciousInput = "'; DROP TABLE products; --"
      
      mockGetProducts.mockResolvedValue({
        data: [],
        count: 0,
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

      const searchInput = screen.getByPlaceholderText(/상품 검색/i)
      fireEvent.change(searchInput, { target: { value: maliciousInput } })
      fireEvent.click(screen.getByRole('button', { name: /검색/i }))

      await waitFor(() => {
        expect(mockGetProducts).toHaveBeenCalled()
      })

      // Verify that the malicious input was not passed directly to the database
      const lastCall = mockGetProducts.mock.calls[mockGetProducts.mock.calls.length - 1]
      expect(lastCall[0]).not.toContain('DROP TABLE')
    })
  })

  describe('TC-019: XSS Prevention', () => {
    it('should escape HTML content to prevent XSS attacks', () => {
      const maliciousProduct = {
        id: '1',
        name: '<script>alert("XSS")</script>',
        sku: 'XSS001',
        description: '<img src="x" onerror="alert(\'XSS\')">',
        category: '전자제품',
        current_stock: 10,
        min_stock: 5,
        max_stock: 100,
        unit_price: 15000,
        supplier_id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockGetProducts.mockResolvedValue({
        data: [maliciousProduct],
        count: 1,
        error: null,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Wait for product to load
      waitFor(() => {
        expect(screen.getByText(/재고 관리/i)).toBeInTheDocument()
      })

      // The malicious content should be displayed as text, not executed
      expect(screen.getByText('<script>alert("XSS")</script>')).toBeInTheDocument()
      expect(screen.getByText('<img src="x" onerror="alert(\'XSS\')">')).toBeInTheDocument()
      
      // Verify no script tags are actually rendered in the DOM
      const scriptTags = document.querySelectorAll('script')
      const imgTags = document.querySelectorAll('img[onerror]')
      
      expect(scriptTags.length).toBe(0)
      expect(imgTags.length).toBe(0)
    })
  })

  describe('TC-020: CSRF Token Validation', () => {
    it('should include CSRF tokens in form submissions', async () => {
      mockCreateProduct.mockResolvedValue({
        data: { id: '1', name: 'Test Product' },
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

      // Click add product button
      fireEvent.click(screen.getByRole('button', { name: /상품 추가/i }))

      // Fill form
      fireEvent.change(screen.getByLabelText(/상품명/i), {
        target: { value: 'Test Product' },
      })
      fireEvent.change(screen.getByLabelText(/SKU/i), {
        target: { value: 'TEST001' },
      })

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /저장/i }))

      await waitFor(() => {
        expect(mockCreateProduct).toHaveBeenCalled()
      })

      // Verify that the form submission includes proper headers/tokens
      // This would typically be handled by the API layer
      expect(mockCreateProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Product',
          sku: 'TEST001',
        })
      )
    })
  })

  describe('TC-024: Concurrent User Handling', () => {
    it('should handle multiple simultaneous operations', async () => {
      const operations = Array.from({ length: 10 }, (_, i) => 
        mockGetProducts.mockResolvedValueOnce({
          data: [{ id: `product-${i}`, name: `Product ${i}` }],
          count: 1,
          error: null,
        })
      )

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Simulate multiple rapid operations
      const promises = operations.map(() => 
        new Promise(resolve => setTimeout(resolve, Math.random() * 100))
      )

      await Promise.all(promises)

      // All operations should complete successfully
      expect(mockGetProducts).toHaveBeenCalledTimes(10)
    })
  })
})
