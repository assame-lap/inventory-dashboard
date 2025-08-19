import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/components/auth/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { InventoryManagement } from '@/components/inventory-management'
import { useAuth } from '@/components/auth/auth-context'

// Mock product functions
const mockGetProducts = jest.fn()
const mockCreateProduct = jest.fn()
const mockUpdateProduct = jest.fn()
const mockDeleteProduct = jest.fn()
const mockSearchProducts = jest.fn()

jest.mock('@/lib/products', () => ({
  getProducts: mockGetProducts,
  createProduct: mockCreateProduct,
  updateProduct: mockUpdateProduct,
  deleteProduct: mockDeleteProduct,
  searchProducts: mockSearchProducts,
}))

// Mock stock functions
const mockProcessStockIn = jest.fn()
const mockProcessStockOut = jest.fn()

jest.mock('@/lib/stock', () => ({
  processStockIn: mockProcessStockIn,
  processStockOut: mockProcessStockOut,
}))

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  )
}

// Mock auth context
const mockUser = {
  id: '1',
  name: '테스트 사용자',
  email: 'test@example.com',
  role: 'manager' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
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
  {
    id: '2',
    name: '테스트 상품 2',
    sku: 'TEST002',
    description: '테스트 상품 설명 2',
    category: '의류',
    current_stock: 5,
    min_stock: 10,
    max_stock: 50,
    unit_price: 25000,
    supplier_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

describe('Inventory CRUD Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetProducts.mockResolvedValue({
      data: mockProducts,
      count: mockProducts.length,
      error: null,
    })
  })

  describe('TC-004: Product Addition', () => {
    it('should add new product successfully', async () => {
      const newProduct = {
        name: '새로운 상품',
        sku: 'NEW001',
        description: '새로운 상품 설명',
        category: '전자제품',
        min_stock: 5,
        max_stock: 100,
        unit_price: 20000,
        supplier_id: '1',
      }

      mockCreateProduct.mockResolvedValueOnce({
        data: { ...newProduct, id: '3', current_stock: 0 },
        error: null,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('테스트 상품 1')).toBeInTheDocument()
      })

      // Click add product button
      fireEvent.click(screen.getByRole('button', { name: /상품 추가/i }))

      // Fill product form
      fireEvent.change(screen.getByLabelText(/상품명/i), {
        target: { value: '새로운 상품' },
      })
      fireEvent.change(screen.getByLabelText(/SKU/i), {
        target: { value: 'NEW001' },
      })
      fireEvent.change(screen.getByLabelText(/설명/i), {
        target: { value: '새로운 상품 설명' },
      })
      fireEvent.change(screen.getByLabelText(/카테고리/i), {
        target: { value: '전자제품' },
      })
      fireEvent.change(screen.getByLabelText(/최소 재고/i), {
        target: { value: '5' },
      })
      fireEvent.change(screen.getByLabelText(/최대 재고/i), {
        target: { value: '100' },
      })
      fireEvent.change(screen.getByLabelText(/단가/i), {
        target: { value: '20000' },
      })

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /저장/i }))

      await waitFor(() => {
        expect(mockCreateProduct).toHaveBeenCalledWith(newProduct)
      })
    })

    it('should show validation errors for invalid product data', async () => {
      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('테스트 상품 1')).toBeInTheDocument()
      })

      // Click add product button
      fireEvent.click(screen.getByRole('button', { name: /상품 추가/i }))

      // Try to submit empty form
      fireEvent.click(screen.getByRole('button', { name: /저장/i }))

      await waitFor(() => {
        expect(screen.getByText(/상품명을 입력해주세요/i)).toBeInTheDocument()
        expect(screen.getByText(/SKU를 입력해주세요/i)).toBeInTheDocument()
      })
    })
  })

  describe('TC-005: Product Modification', () => {
    it('should update existing product successfully', async () => {
      const updatedProduct = {
        id: '1',
        name: '수정된 상품명',
        sku: 'TEST001',
        description: '수정된 설명',
        category: '전자제품',
        min_stock: 15,
        max_stock: 120,
        unit_price: 18000,
        supplier_id: '1',
      }

      mockUpdateProduct.mockResolvedValueOnce({
        data: updatedProduct,
        error: null,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('테스트 상품 1')).toBeInTheDocument()
      })

      // Click edit button for first product
      const editButtons = screen.getAllByRole('button', { name: /수정/i })
      fireEvent.click(editButtons[0])

      // Modify product name
      const nameInput = screen.getByDisplayValue('테스트 상품 1')
      fireEvent.change(nameInput, { target: { value: '수정된 상품명' } })

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /저장/i }))

      await waitFor(() => {
        expect(mockUpdateProduct).toHaveBeenCalledWith('1', {
          name: '수정된 상품명',
          sku: 'TEST001',
          description: '테스트 상품 설명',
          category: '전자제품',
          min_stock: 10,
          max_stock: 100,
          unit_price: 15000,
          supplier_id: '1',
        })
      })
    })
  })

  describe('TC-006: Product Deletion', () => {
    it('should delete product successfully', async () => {
      mockDeleteProduct.mockResolvedValueOnce({
        data: null,
        error: null,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('테스트 상품 1')).toBeInTheDocument()
      })

      // Click delete button for first product
      const deleteButtons = screen.getAllByRole('button', { name: /삭제/i })
      fireEvent.click(deleteButtons[0])

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /확인/i })
      fireEvent.click(confirmButton)

      await waitFor(() => {
        expect(mockDeleteProduct).toHaveBeenCalledWith('1')
      })
    })
  })

  describe('TC-007: Stock In Process', () => {
    it('should process stock in successfully', async () => {
      const stockInData = {
        product_id: '1',
        quantity: 20,
        unit_cost: 12000,
        supplier_id: '1',
        notes: '신규 입고',
      }

      mockProcessStockIn.mockResolvedValueOnce({
        data: { id: '1', ...stockInData },
        error: null,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('테스트 상품 1')).toBeInTheDocument()
      })

      // Click stock in button for first product
      const stockInButtons = screen.getAllByRole('button', { name: /입고/i })
      fireEvent.click(stockInButtons[0])

      // Fill stock in form
      fireEvent.change(screen.getByLabelText(/수량/i), {
        target: { value: '20' },
      })
      fireEvent.change(screen.getByLabelText(/단가/i), {
        target: { value: '12000' },
      })
      fireEvent.change(screen.getByLabelText(/비고/i), {
        target: { value: '신규 입고' },
      })

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /입고 처리/i }))

      await waitFor(() => {
        expect(mockProcessStockIn).toHaveBeenCalledWith(stockInData)
      })
    })
  })

  describe('TC-008: Stock Out Process', () => {
    it('should process stock out successfully', async () => {
      const stockOutData = {
        product_id: '1',
        quantity: 10,
        unit_price: 15000,
        customer_id: '1',
        notes: '고객 주문',
      }

      mockProcessStockOut.mockResolvedValueOnce({
        data: { id: '1', ...stockOutData },
        error: null,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('테스트 상품 1')).toBeInTheDocument()
      })

      // Click stock out button for first product
      const stockOutButtons = screen.getAllByRole('button', { name: /출고/i })
      fireEvent.click(stockOutButtons[0])

      // Fill stock out form
      fireEvent.change(screen.getByLabelText(/수량/i), {
        target: { value: '10' },
      })
      fireEvent.change(screen.getByLabelText(/단가/i), {
        target: { value: '15000' },
      })
      fireEvent.change(screen.getByLabelText(/비고/i), {
        target: { value: '고객 주문' },
      })

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /출고 처리/i }))

      await waitFor(() => {
        expect(mockProcessStockOut).toHaveBeenCalledWith(stockOutData)
      })
    })

    it('should prevent stock out when insufficient stock', async () => {
      mockProcessStockOut.mockResolvedValueOnce({
        data: null,
        error: { message: '재고가 부족합니다' },
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('테스트 상품 1')).toBeInTheDocument()
      })

      // Click stock out button for first product
      const stockOutButtons = screen.getAllByRole('button', { name: /출고/i })
      fireEvent.click(stockOutButtons[0])

      // Try to process more than available stock
      fireEvent.change(screen.getByLabelText(/수량/i), {
        target: { value: '100' },
      })

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /출고 처리/i }))

      await waitFor(() => {
        expect(screen.getByText(/재고가 부족합니다/i)).toBeInTheDocument()
      })
    })
  })

  describe('TC-010: Product Search and Filtering', () => {
    it('should search products correctly', async () => {
      const searchResults = [mockProducts[0]]
      mockSearchProducts.mockResolvedValueOnce({
        data: searchResults,
        count: searchResults.length,
        error: null,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('테스트 상품 1')).toBeInTheDocument()
      })

      // Search for product
      const searchInput = screen.getByPlaceholderText(/상품 검색/i)
      fireEvent.change(searchInput, { target: { value: '테스트' } })
      fireEvent.click(screen.getByRole('button', { name: /검색/i }))

      await waitFor(() => {
        expect(mockSearchProducts).toHaveBeenCalledWith('테스트')
      })
    })

    it('should filter products by category', async () => {
      const filteredProducts = [mockProducts[0]]
      mockGetProducts.mockResolvedValueOnce({
        data: filteredProducts,
        count: filteredProducts.length,
        error: null,
      })

      render(
        <TestWrapper>
          <InventoryManagement />
        </TestWrapper>
      )

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('테스트 상품 1')).toBeInTheDocument()
      })

      // Filter by category
      const categoryFilter = screen.getByLabelText(/카테고리/i)
      fireEvent.change(categoryFilter, { target: { value: '전자제품' } })

      await waitFor(() => {
        expect(mockGetProducts).toHaveBeenCalledWith(
          expect.objectContaining({
            category: '전자제품',
          })
        )
      })
    })
  })
})
