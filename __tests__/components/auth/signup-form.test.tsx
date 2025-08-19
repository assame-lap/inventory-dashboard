import React from 'react'
import { render, screen } from '@testing-library/react'
import { SignupForm } from '@/components/auth/signup-form'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// Mock auth functions
jest.mock('@/lib/auth', () => ({
  signUp: jest.fn(),
}))

describe('SignupForm Component - Basic Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render signup form with basic elements', () => {
    render(<SignupForm />)
    
    // Check if basic form elements are rendered
    const signupTexts = screen.getAllByText('회원가입')
    expect(signupTexts).toHaveLength(2) // Title and button
    
    expect(screen.getByText('재고 관리 시스템 계정을 생성하세요')).toBeInTheDocument()
    expect(screen.getByText('이름')).toBeInTheDocument()
    expect(screen.getByText('이메일')).toBeInTheDocument()
    expect(screen.getByText('역할')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /회원가입/i })).toBeInTheDocument()
    expect(screen.getByText(/이미 계정이 있으신가요?/i)).toBeInTheDocument()
    expect(screen.getByText(/로그인/i)).toBeInTheDocument()
  })

  it('should render form inputs', () => {
    render(<SignupForm />)
    
    // Check if input fields are rendered
    expect(screen.getByPlaceholderText('홍길동')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('example@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('비밀번호를 입력하세요')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('비밀번호를 다시 입력하세요')).toBeInTheDocument()
  })

  it('should render role selector', () => {
    render(<SignupForm />)
    
    // Check if role selector is rendered
    const roleTexts = screen.getAllByText('직원')
    expect(roleTexts).toHaveLength(2) // Select value and option
  })
})
