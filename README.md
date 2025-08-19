# 재고 관리 대시보드

소상공인을 위한 스마트 재고 관리 시스템입니다. Next.js 14, TypeScript, Tailwind CSS를 사용하여 구축되었습니다.

## 🚀 주요 기능

- **재고 관리**: 상품 등록, 수정, 삭제 및 재고 추적
- **입출고 관리**: 재고 입고, 출고, 조정 처리
- **발주 관리**: 공급업체별 발주서 생성 및 관리
- **매출 분석**: 실시간 대시보드 및 차트를 통한 비즈니스 인사이트
- **사용자 관리**: 역할 기반 접근 제어 (관리자, 매니저, 직원)
- **알림 시스템**: 재고 부족, 발주 예정 등 중요 알림

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Radix UI, Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library

## 📋 요구사항

- Node.js 18+ 
- pnpm (권장) 또는 npm
- Supabase 계정

## 🚀 설치 및 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd inventory-dashboard
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `lib/database.ts`의 `CREATE_TABLES_SQL` 실행
3. 샘플 데이터 삽입을 위해 `INSERT_SAMPLE_DATA_SQL` 실행

### 5. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🧪 테스트 실행

```bash
# 모든 테스트 실행
pnpm test

# 테스트 감시 모드
pnpm test:watch

# 특정 테스트 파일 실행
pnpm test -- components/auth/login-form.test.tsx
```

## 📁 프로젝트 구조

```
inventory-dashboard/
├── app/                    # Next.js App Router
│   ├── login/             # 로그인 페이지
│   ├── signup/            # 회원가입 페이지
│   ├── inventory/         # 재고 관리 페이지
│   ├── orders/            # 발주 관리 페이지
│   ├── analytics/         # 매출 분석 페이지
│   └── settings/          # 설정 페이지
├── components/             # React 컴포넌트
│   ├── auth/              # 인증 관련 컴포넌트
│   ├── dashboard/         # 대시보드 컴포넌트
│   ├── inventory/         # 재고 관리 컴포넌트
│   └── ui/                # UI 기본 컴포넌트
├── lib/                   # 유틸리티 및 설정
│   ├── supabase.ts        # Supabase 클라이언트
│   ├── auth.ts            # 인증 관련 함수
│   ├── products.ts        # 상품 관련 API
│   └── database.ts        # 데이터베이스 스키마
├── types/                 # TypeScript 타입 정의
├── __tests__/             # 테스트 파일
└── public/                # 정적 파일
```

## 🔐 인증 시스템

### 사용자 역할

- **관리자 (admin)**: 모든 기능 접근 가능
- **매니저 (manager)**: 재고 관리, 발주, 분석 기능 접근
- **직원 (staff)**: 기본 재고 조회 및 입출고 처리

### 인증 플로우

1. 회원가입 시 이메일 인증 필요
2. 로그인 후 JWT 토큰 기반 인증
3. 역할 기반 접근 제어 (RBAC)

## 📊 데이터베이스 스키마

### 주요 테이블

- **users**: 사용자 정보 및 역할
- **products**: 상품 정보 및 재고
- **suppliers**: 공급업체 정보
- **stock_transactions**: 재고 거래 이력
- **purchase_orders**: 발주 정보
- **sales**: 매출 정보
- **notifications**: 알림 정보

### RLS (Row Level Security)

모든 테이블에 RLS가 활성화되어 있어 사용자별 데이터 접근을 제한합니다.

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **다크 모드**: 사용자 선호도에 따른 테마 전환
- **접근성**: WCAG 2.1 AA 준수
- **한국어 지원**: 완전한 한국어 현지화

## 🚀 배포

### Vercel 배포 (권장)

1. Vercel에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포 설정

### 수동 배포

```bash
pnpm build
pnpm start
```

## 🔧 개발 가이드

### 새 컴포넌트 추가

1. `components/` 디렉토리에 컴포넌트 생성
2. TypeScript 타입 정의
3. 테스트 코드 작성
4. Storybook 문서화 (선택사항)

### API 엔드포인트 추가

1. `app/api/` 디렉토리에 라우트 생성
2. 입력 검증 (Zod 스키마)
3. 에러 처리
4. 테스트 코드 작성

### 데이터베이스 마이그레이션

1. `lib/database.ts`에 SQL 스크립트 추가
2. Supabase SQL Editor에서 실행
3. 타입 정의 업데이트

## 🐛 문제 해결

### 일반적인 문제

1. **환경 변수 오류**: `.env.local` 파일 확인
2. **Supabase 연결 실패**: 프로젝트 URL과 키 확인
3. **빌드 오류**: Node.js 버전 및 의존성 확인

### 로그 확인

```bash
# 개발 서버 로그
pnpm dev

# Supabase 로그
supabase logs
```

## 📈 성능 최적화

- **이미지 최적화**: Next.js Image 컴포넌트 사용
- **코드 분할**: 동적 import를 통한 번들 최적화
- **캐싱**: Supabase 캐싱 전략 활용
- **CDN**: Vercel Edge Network 활용

## 🔒 보안

- **인증**: JWT 토큰 기반 인증
- **권한**: 역할 기반 접근 제어
- **데이터**: RLS를 통한 데이터 격리
- **입력 검증**: Zod를 통한 스키마 검증

## 🤝 기여하기

1. Fork the repository
2. Feature branch 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. Branch에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

- **이슈 리포트**: GitHub Issues
- **문의**: 프로젝트 관리자에게 연락
- **문서**: [Wiki](../../wiki) 참조

## 🗺️ 로드맵

### v1.1 (다음 릴리스)
- [ ] 바코드/QR코드 스캔 기능
- [ ] 모바일 앱 (PWA)
- [ ] 고급 분석 대시보드
- [ ] API 문서화

### v1.2
- [ ] 다국어 지원
- [ ] 고급 권한 관리
- [ ] 백업 및 복구 기능
- [ ] 통합 테스트

---

**재고관리닷컴** - 소상공인의 비즈니스 성장을 위한 스마트한 선택 🚀
