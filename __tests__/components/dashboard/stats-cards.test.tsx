import React from 'react'
import { render, screen } from '@testing-library/react'
import { StatsCards } from '@/components/dashboard/stats-cards'

// Mock data for testing
const mockStats = {
  totalProducts: 150,
  lowStockProducts: 12,
  outOfStockProducts: 3,
  totalValue: 2500000,
  monthlySales: 450000,
  monthlyProfit: 120000,
}

describe('StatsCards Component - Basic Unit Tests', () => {
  it('should render all stat cards', () => {
    render(<StatsCards {...mockStats} />)
    
    // Check if all stat cards are rendered
    expect(screen.getByText('총 상품 수')).toBeInTheDocument()
    expect(screen.getByText('재고 부족')).toBeInTheDocument()
    expect(screen.getByText('재고 없음')).toBeInTheDocument()
    expect(screen.getByText('총 재고 가치')).toBeInTheDocument()
    expect(screen.getByText('월 매출')).toBeInTheDocument()
    expect(screen.getByText('월 수익')).toBeInTheDocument()
  })

  it('should display correct values', () => {
    render(<StatsCards {...mockStats} />)
    
    // Check if values are displayed correctly
    expect(screen.getByText('150')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('₩2,500,000')).toBeInTheDocument()
    expect(screen.getByText('₩450,000')).toBeInTheDocument()
    expect(screen.getByText('₩120,000')).toBeInTheDocument()
  })

  it('should display correct descriptions', () => {
    render(<StatsCards {...mockStats} />)
    
    expect(screen.getByText('등록된 상품의 총 개수')).toBeInTheDocument()
    expect(screen.getByText('최소 재고 수준 이하 상품')).toBeInTheDocument()
    expect(screen.getByText('재고가 0인 상품')).toBeInTheDocument()
    expect(screen.getByText('현재 재고의 총 가치')).toBeInTheDocument()
    expect(screen.getByText('이번 달 총 매출')).toBeInTheDocument()
    expect(screen.getByText('이번 달 총 수익')).toBeInTheDocument()
  })

  it('should render with empty stats', () => {
    const emptyStats = {
      totalProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      totalValue: 0,
      monthlySales: 0,
      monthlyProfit: 0,
    }
    
    render(<StatsCards {...emptyStats} />)
    
    // Check if all cards still render with zero values
    const zeroValues = screen.getAllByText('0')
    expect(zeroValues).toHaveLength(3) // 3 cards have numeric 0 values
    
    const zeroWonValues = screen.getAllByText('₩0')
    expect(zeroWonValues).toHaveLength(3) // 3 cards have ₩0 values
  })

  it('should have proper CSS classes for responsive design', () => {
    render(<StatsCards {...mockStats} />)
    
    // Find the main grid container by looking for the div with grid classes
    const gridContainer = document.querySelector('.grid.gap-4.md\\:grid-cols-2.lg\\:grid-cols-3')
    expect(gridContainer).toBeInTheDocument()
    expect(gridContainer).toHaveClass('grid', 'gap-4', 'md:grid-cols-2', 'lg:grid-cols-3')
  })

  it('should render icons for each stat card', () => {
    render(<StatsCards {...mockStats} />)
    
    // Each card should have an icon container with appropriate background color
    const iconContainers = document.querySelectorAll('[class*="p-2 rounded-lg"]')
    expect(iconContainers).toHaveLength(6)
  })
})
