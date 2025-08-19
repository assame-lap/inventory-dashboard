import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '@/lib/products'

// Mock the entire supabase module
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

describe('Products API - Basic Unit Tests', () => {
  let mockSupabase: any
  let mockFrom: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Create fresh mocks for each test
    mockFrom = {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      single: jest.fn(),
      or: jest.fn().mockReturnThis(),
    }
    
    mockSupabase = require('@/lib/supabase').supabase
    mockSupabase.from.mockReturnValue(mockFrom)
  })

  describe('getProducts', () => {
    it('should call supabase with correct parameters', async () => {
      // Mock the final result
      mockFrom.range.mockResolvedValue({
        data: [],
        count: 0,
        error: null,
      })

      await getProducts({ page: 1, limit: 20 })

      expect(mockSupabase.from).toHaveBeenCalledWith('products')
      expect(mockFrom.select).toHaveBeenCalledWith('*', { count: 'exact' })
      expect(mockFrom.order).toHaveBeenCalledWith('created_at', { ascending: false })
      expect(mockFrom.range).toHaveBeenCalledWith(0, 19)
    })

    it('should handle search parameter', async () => {
      mockFrom.range.mockResolvedValue({
        data: [],
        count: 0,
        error: null,
      })

      await getProducts({ search: 'test' })

      expect(mockFrom.or).toHaveBeenCalledWith(
        'name.ilike.%test%,sku.ilike.%test%,description.ilike.%test%'
      )
    })
  })

  describe('getProduct', () => {
    it('should call supabase with correct parameters', async () => {
      mockFrom.single.mockResolvedValue({
        data: null,
        error: null,
      })

      await getProduct('test-id')

      expect(mockSupabase.from).toHaveBeenCalledWith('products')
      expect(mockFrom.select).toHaveBeenCalledWith('*')
      expect(mockFrom.eq).toHaveBeenCalledWith('id', 'test-id')
      expect(mockFrom.single).toHaveBeenCalled()
    })
  })

  describe('createProduct', () => {
    it('should call supabase with correct parameters', async () => {
      const productData = {
        name: 'Test Product',
        sku: 'TEST001',
        description: 'Test Description',
        category: 'Test',
        min_stock: 10,
        max_stock: 100,
        unit_price: 1000,
        supplier_id: 'supplier-1',
      }

      mockFrom.single.mockResolvedValue({
        data: { id: '1', ...productData },
        error: null,
      })

      await createProduct(productData)

      expect(mockSupabase.from).toHaveBeenCalledWith('products')
      expect(mockFrom.insert).toHaveBeenCalledWith([productData])
      expect(mockFrom.select).toHaveBeenCalled()
      expect(mockFrom.single).toHaveBeenCalled()
    })
  })

  describe('updateProduct', () => {
    it('should call supabase with correct parameters', async () => {
      const updateData = {
        name: 'Updated Product',
        unit_price: 1500,
      }

      mockFrom.single.mockResolvedValue({
        data: { id: '1', ...updateData },
        error: null,
      })

      await updateProduct('1', updateData)

      expect(mockSupabase.from).toHaveBeenCalledWith('products')
      expect(mockFrom.update).toHaveBeenCalledWith(updateData)
      expect(mockFrom.eq).toHaveBeenCalledWith('id', '1')
      expect(mockFrom.select).toHaveBeenCalled()
      expect(mockFrom.single).toHaveBeenCalled()
    })
  })

  describe('deleteProduct', () => {
    it('should call supabase with correct parameters', async () => {
      // Mock the delete method to return an object with eq method
      const mockDelete = {
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }
      
      mockFrom.delete.mockReturnValue(mockDelete)

      await deleteProduct('1')

      expect(mockSupabase.from).toHaveBeenCalledWith('products')
      expect(mockFrom.delete).toHaveBeenCalled()
      expect(mockDelete.eq).toHaveBeenCalledWith('id', '1')
    })
  })
})
