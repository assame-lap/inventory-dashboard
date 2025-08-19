import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">재고관리닷컴</h1>
          <p className="mt-2 text-sm text-gray-600">
            소상공인을 위한 스마트 재고 관리 시스템
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
