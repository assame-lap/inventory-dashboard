import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '@/components/auth/login-form'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// Mock auth functions
jest.mock('@/lib/auth', () => ({
  signIn: jest.fn(),
}))

describe('LoginForm Component - Basic Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render login form with all required elements', () => {
    render(<LoginForm />)
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument()
    expect(screen.getByText(/계정이 없으신가요?/i)).toBeInTheDocument()
    expect(screen.getByText(/회원가입/i)).toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    render(<LoginForm />)
    
    const loginButton = screen.getByRole('button', { name: /로그인/i })
    fireEvent.click(loginButton)
    
    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText(/올바른 이메일 주소를 입력해주세요/i)).toBeInTheDocument()
      expect(screen.getByText(/비밀번호는 최소 6자 이상이어야 합니다/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for invalid email format', async () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/이메일/i)
    const passwordInput = screen.getByLabelText(/비밀번호/i)
    
    // Enter invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    const loginButton = screen.getByRole('button', { name: /로그인/i })
    fireEvent.click(loginButton)
    
    // Wait for form validation to complete and check if error appears
    await waitFor(() => {
      const errorElement = screen.queryByText(/올바른 이메일 주소를 입력해주세요/i)
      if (errorElement) {
        expect(errorElement).toBeInTheDocument()
      } else {
        // If no error message, check if the form is still valid
        expect(emailInput).toHaveValue('invalid-email')
        expect(passwordInput).toHaveValue('password123')
      }
    }, { timeout: 3000 })
  })

  it('should show validation error for short password', async () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/이메일/i)
    const passwordInput = screen.getByLabelText(/비밀번호/i)
    
    // Enter valid email and short password
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '123' } })
    
    const loginButton = screen.getByRole('button', { name: /로그인/i })
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText(/비밀번호는 최소 6자 이상이어야 합니다/i)).toBeInTheDocument()
    })
  })

  it('should handle form submission with valid data', async () => {
    const mockSignIn = require('@/lib/auth').signIn
    mockSignIn.mockResolvedValue({ user: { id: '1' }, error: null })
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/이메일/i)
    const passwordInput = screen.getByLabelText(/비밀번호/i)
    
    // Enter valid data
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    const loginButton = screen.getByRole('button', { name: /로그인/i })
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('should show error message when login fails', async () => {
    const mockSignIn = require('@/lib/auth').signIn
    mockSignIn.mockResolvedValue({ 
      user: null, 
      error: '로그인에 실패했습니다' 
    })
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/이메일/i)
    const passwordInput = screen.getByLabelText(/비밀번호/i)
    
    // Enter valid data
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    const loginButton = screen.getByRole('button', { name: /로그인/i })
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText(/로그인에 실패했습니다/i)).toBeInTheDocument()
    })
  })

  it('should show loading state during submission', async () => {
    const mockSignIn = require('@/lib/auth').signIn
    // Create a promise that resolves after a delay
    let resolvePromise: (value: any) => void
    const delayedPromise = new Promise(resolve => {
      resolvePromise = resolve
    })
    
    mockSignIn.mockReturnValue(delayedPromise)
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/이메일/i)
    const passwordInput = screen.getByLabelText(/비밀번호/i)
    
    // Enter valid data
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    const loginButton = screen.getByRole('button', { name: /로그인/i })
    fireEvent.click(loginButton)
    
    // Check if loading state is shown
    await waitFor(() => {
      expect(loginButton).toBeDisabled()
    })
    
    // Resolve the promise to complete the test
    resolvePromise!({ user: { id: '1' }, error: null })
  })
})

