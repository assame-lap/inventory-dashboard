import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/components/auth/auth-context'
import LoginForm from '@/components/auth/login-form'
import SignupForm from '@/components/auth/signup-form'
import { useAuth } from '@/components/auth/auth-context'

// Mock auth functions
const mockSignIn = jest.fn()
const mockSignUp = jest.fn()
const mockSignOut = jest.fn()

jest.mock('@/lib/auth', () => ({
  signIn: mockSignIn,
  signUp: mockSignUp,
  signOut: mockSignOut,
}))

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>
}

// Mock component to test auth context
const TestAuthComponent = () => {
  const { user, loading, signOut } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {user ? (
        <div>
          <span>Logged in as: {user.name}</span>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <span>Not logged in</span>
      )}
    </div>
  )
}

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('TC-001: User Registration Flow', () => {
    it('should complete full registration flow successfully', async () => {
      const mockUser = {
        id: '1',
        name: '테스트 사용자',
        email: 'test@example.com',
        role: 'staff' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockSignUp.mockResolvedValueOnce({ user: mockUser, error: null })

      render(
        <TestWrapper>
          <SignupForm />
        </TestWrapper>
      )

      // Fill out registration form
      fireEvent.change(screen.getByLabelText(/이름/i), {
        target: { value: '테스트 사용자' },
      })
      fireEvent.change(screen.getByLabelText(/이메일/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/비밀번호/i), {
        target: { value: 'password123' },
      })
      fireEvent.change(screen.getByLabelText(/비밀번호 확인/i), {
        target: { value: 'password123' },
      })
      
      // Select role
      const roleSelect = screen.getByLabelText(/역할/i)
      fireEvent.change(roleSelect, { target: { value: 'staff' } })

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /회원가입/i }))

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          name: '테스트 사용자',
          email: 'test@example.com',
          password: 'password123',
          role: 'staff',
        })
      })
    })

    it('should show validation errors for invalid input', async () => {
      render(
        <TestWrapper>
          <SignupForm />
        </TestWrapper>
      )

      // Try to submit empty form
      fireEvent.click(screen.getByRole('button', { name: /회원가입/i }))

      await waitFor(() => {
        expect(screen.getByText(/이름을 입력해주세요/i)).toBeInTheDocument()
        expect(screen.getByText(/이메일을 입력해주세요/i)).toBeInTheDocument()
        expect(screen.getByText(/비밀번호를 입력해주세요/i)).toBeInTheDocument()
      })
    })

    it('should show error for password mismatch', async () => {
      render(
        <TestWrapper>
          <SignupForm />
        </TestWrapper>
      )

      // Fill form with mismatched passwords
      fireEvent.change(screen.getByLabelText(/이름/i), {
        target: { value: '테스트 사용자' },
      })
      fireEvent.change(screen.getByLabelText(/이메일/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/비밀번호/i), {
        target: { value: 'password123' },
      })
      fireEvent.change(screen.getByLabelText(/비밀번호 확인/i), {
        target: { value: 'different123' },
      })

      fireEvent.click(screen.getByRole('button', { name: /회원가입/i }))

      await waitFor(() => {
        expect(screen.getByText(/비밀번호가 일치하지 않습니다/i)).toBeInTheDocument()
      })
    })
  })

  describe('TC-002: User Login Flow', () => {
    it('should complete login flow successfully', async () => {
      const mockUser = {
        id: '1',
        name: '테스트 사용자',
        email: 'test@example.com',
        role: 'staff' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockSignIn.mockResolvedValueOnce({ user: mockUser, error: null })

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      )

      // Fill out login form
      fireEvent.change(screen.getByLabelText(/이메일/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/비밀번호/i), {
        target: { value: 'password123' },
      })

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /로그인/i }))

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        })
      })
    })

    it('should show error for invalid credentials', async () => {
      mockSignIn.mockResolvedValueOnce({ 
        user: null, 
        error: { message: 'Invalid credentials' } 
      })

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      )

      // Fill out login form
      fireEvent.change(screen.getByLabelText(/이메일/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/비밀번호/i), {
        target: { value: 'wrongpassword' },
      })

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /로그인/i }))

      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument()
      })
    })
  })

  describe('TC-003: Logout Flow', () => {
    it('should complete logout flow successfully', async () => {
      mockSignOut.mockResolvedValueOnce({ error: null })

      render(
        <TestWrapper>
          <TestAuthComponent />
        </TestWrapper>
      )

      // Initially should show "Not logged in"
      expect(screen.getByText(/Not logged in/i)).toBeInTheDocument()

      // Mock user login state
      const mockUser = {
        id: '1',
        name: '테스트 사용자',
        email: 'test@example.com',
        role: 'staff' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Simulate user login by updating context
      // This would normally happen through the auth flow
      // For testing, we'll render with a mock context
      const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
        const mockContextValue = {
          user: mockUser,
          loading: false,
          signOut: mockSignOut,
          refreshUser: jest.fn(),
        }
        
        return (
          <AuthProvider>
            {children}
          </AuthProvider>
        )
      }

      render(
        <MockAuthProvider>
          <TestAuthComponent />
        </MockAuthProvider>
      )

      // Should show logged in state
      expect(screen.getByText(/Logged in as: 테스트 사용자/i)).toBeInTheDocument()

      // Click sign out
      fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }))

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled()
      })
    })
  })

  describe('TC-004: Form Validation Integration', () => {
    it('should validate email format correctly', async () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      )

      // Test invalid email formats
      const emailInput = screen.getByLabelText(/이메일/i)
      
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.blur(emailInput)

      await waitFor(() => {
        expect(screen.getByText(/올바른 이메일 형식이 아닙니다/i)).toBeInTheDocument()
      })

      // Test valid email format
      fireEvent.change(emailInput, { target: { value: 'valid@email.com' } })
      fireEvent.blur(emailInput)

      await waitFor(() => {
        expect(screen.queryByText(/올바른 이메일 형식이 아닙니다/i)).not.toBeInTheDocument()
      })
    })

    it('should validate password strength correctly', async () => {
      render(
        <TestWrapper>
          <SignupForm />
        </TestWrapper>
      )

      const passwordInput = screen.getByLabelText(/비밀번호/i)
      
      // Test weak password
      fireEvent.change(passwordInput, { target: { value: '123' } })
      fireEvent.blur(passwordInput)

      await waitFor(() => {
        expect(screen.getByText(/비밀번호는 최소 8자 이상이어야 합니다/i)).toBeInTheDocument()
      })

      // Test strong password
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } })
      fireEvent.blur(passwordInput)

      await waitFor(() => {
        expect(screen.queryByText(/비밀번호는 최소 8자 이상이어야 합니다/i)).not.toBeInTheDocument()
      })
    })
  })
})
