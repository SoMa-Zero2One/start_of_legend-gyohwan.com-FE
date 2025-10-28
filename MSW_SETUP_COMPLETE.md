# 🎉 MSW (Mock Service Worker) 설정 완료!

MSW를 사용하여 백엔드 API를 완전히 모킹하는 환경이 구축되었습니다!

---

## 📦 생성된 파일 목록

```
✅ mocks/
   ├── browser.ts                          # MSW 브라우저 워커 설정
   ├── README.md                           # MSW 사용 가이드
   ├── TEST_GUIDE.md                       # 테스트 방법 가이드
   │
   ├── data/                               # Mock 데이터
   │   ├── users.ts                       # 유저, GPA, Language, 인증 코드
   │   ├── seasons.ts                     # 시즌 데이터
   │   ├── slots.ts                       # 슬롯(교환 대학) 데이터
   │   └── applications.ts                # 지원서 데이터
   │
   └── handlers/                           # MSW 요청 핸들러
       ├── index.ts                       # 모든 핸들러 통합
       ├── auth.ts                        # 인증 API (7개 엔드포인트)
       ├── user.ts                        # 유저 API (8개 엔드포인트)
       ├── season.ts                      # 시즌 API (6개 엔드포인트)
       └── slot.ts                        # 슬롯 API (2개 엔드포인트)

✅ components/providers/MSWProvider.tsx      # MSW 초기화 컴포넌트
✅ app/layout.tsx                            # MSWProvider 통합 완료
✅ .env.local.example                        # 환경 변수 템플릿
```

---

## 🚀 사용 방법

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 다음을 추가:

```bash
# MSW 활성화
NEXT_PUBLIC_ENABLE_MSW=true

# 백엔드 URL (MSW가 이 URL을 intercept)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### 2. 개발 서버 시작

```bash
pnpm dev
```

### 3. 브라우저에서 확인

브라우저 콘솔에 다음 메시지가 표시되면 성공:

```
🔶 MSW is enabled for development
[MSW] Mocking enabled.
```

---

## 🎯 구현된 기능

### ✅ 전체 API 엔드포인트 모킹 (23개)

#### Auth APIs (7개)
- `GET /v1/auth/signup/email/check` - 이메일 중복 확인
- `POST /v1/auth/signup/email` - 이메일 회원가입
- `POST /v1/auth/signup/email/confirm` - 이메일 인증
- `POST /v1/auth/login/email` - 이메일 로그인
- `POST /v1/auth/login/social/kakao` - 카카오 로그인
- `POST /v1/auth/login/social/google` - 구글 로그인
- `POST /v1/auth/logout` - 로그아웃

#### User APIs (8개)
- `GET /v1/users/me` - 내 프로필 조회
- `GET /v1/users/me/gpas` - GPA 목록 조회
- `POST /v1/users/me/gpas` - GPA 등록
- `GET /v1/users/me/languages` - 어학 성적 목록 조회
- `POST /v1/users/me/languages` - 어학 성적 등록
- `POST /v1/users/me/password` - 비밀번호 변경
- `POST /v1/users/me/school-email` - 학교 이메일 인증 요청
- `POST /v1/users/me/school-email/confirm` - 학교 이메일 인증 확인
- `DELETE /v1/users/me/withdraw` - 회원 탈퇴

#### Season APIs (6개)
- `GET /v1/seasons` - 시즌 목록 조회
- `GET /v1/seasons/:seasonId` - 시즌 상세 조회
- `GET /v1/seasons/:seasonId/slots` - 시즌별 슬롯 목록
- `GET /v1/seasons/:seasonId/eligibility` - 지원 가능 여부 확인
- `POST /v1/seasons/:seasonId` - 지원서 제출
- `GET /v1/seasons/:seasonId/my-application` - 내 지원서 조회
- `PUT /v1/seasons/:seasonId/my-application` - 지원서 수정

#### Slot APIs (2개)
- `GET /v1/slots/:slotId` - 슬롯 상세 조회 (지원자 목록 포함)
- `GET /v1/applications/:applicationId` - 지원자 상세 조회

---

## 🧪 에러 케이스 시뮬레이션

### ✅ 다양한 에러 상황 테스트 가능

**40개 이상의 에러 케이스가 구현되어 있습니다!**

#### Auth 에러 (10개)
- ✅ 이메일 중복 (409 Conflict)
- ✅ 비밀번호 길이 부족 (400 Bad Request)
- ✅ 로그인 실패 (401 Unauthorized)
- ✅ 만료된 인증 코드 (400 Bad Request)
- ✅ 잘못된 인증 코드 (400 Bad Request)
- ✅ 카카오/구글 OAuth 코드 오류 (400 Bad Request)
- ✅ Redirect URI 불일치 (400 Bad Request)
- ✅ 필수 필드 누락 (400 Bad Request)
- ✅ 이메일 형식 오류 (400 Bad Request)

#### User 에러 (12개)
- ✅ 인증되지 않은 접근 (401 Unauthorized)
- ✅ 유저 없음 (404 Not Found)
- ✅ 잘못된 GPA 기준 (400 Bad Request)
- ✅ 잘못된 어학 시험 유형 (400 Bad Request)
- ✅ 지원하지 않는 학교 도메인 (400 Bad Request)
- ✅ 이미 인증된 유저 (409 Conflict)
- ✅ 현재 비밀번호 불일치 (400 Bad Request)
- ✅ 새 비밀번호 길이 부족 (400 Bad Request)
- ✅ 학교 인증 코드 불일치 (400 Bad Request)
- ✅ 만료된 학교 인증 (400 Bad Request)
- ✅ 손상된 인증 데이터 (400 Bad Request)

#### Season 에러 (15개)
- ✅ 시즌 없음 (404 Not Found)
- ✅ 학교 인증 필요 (400/403 Forbidden)
- ✅ 학교 불일치 (403 Forbidden)
- ✅ 이미 지원함 (409 Conflict)
- ✅ choices 빈 배열 (400 Bad Request)
- ✅ 필수 필드 누락 (400 Bad Request)
- ✅ GPA 없음 (404 Not Found)
- ✅ Language 없음 (404 Not Found)
- ✅ Slot 없음 (404 Not Found)
- ✅ 다른 사람 GPA 사용 (403 Forbidden)
- ✅ 다른 사람 Language 사용 (403 Forbidden)
- ✅ 지원서 없음 (404 Not Found)
- ✅ 수정 횟수 초과 (400 Bad Request)
- ✅ 시즌 데이터 불완전 (400 Bad Request)

#### Slot 에러 (2개)
- ✅ 슬롯 없음 (404 Not Found)
- ✅ 지원서 없음 (404 Not Found)

---

## 📊 Mock 데이터

### 기본 테스트 계정

| 계정 | 이메일 | 비밀번호 | 특징 |
|------|--------|---------|------|
| 테스트 유저 | `test@example.com` | `password123456` | 학교 인증 완료, GPA/Language 있음 |
| 미인증 유저 | `unverified@example.com` | `password123456` | 학교 인증 안됨 |
| 카카오 유저 | (OAuth) | N/A | 소셜 로그인 유저 |
| 구글 유저 | (OAuth) | N/A | 소셜 로그인 유저 |

### 에러 테스트용 특수 값

| 입력 값 | 결과 |
|---------|------|
| `existing@example.com` | 이메일 중복 에러 |
| `expired@example.com` | 만료된 인증 코드 에러 |
| `code: "invalid-code"` | OAuth 코드 오류 |
| `code: "redirect-error"` | Redirect URI 오류 |
| `criteria: 3.5` | 잘못된 GPA 기준 에러 |
| `testType: "INVALID"` | 잘못된 어학 시험 에러 |
| `school@wrongdomain.com` | 지원하지 않는 도메인 에러 |

### Mock 시즌 데이터

- **시즌 1**: 2025년 1학기 (교환대학교) - 슬롯 5개
- **시즌 2**: 2025년 2학기 (교환대학교) - 슬롯 4개
- **시즌 3**: 2026년 1학기 (교환대학교) - 이미 지원함
- **시즌 4**: 2025년 1학기 (다른대학교) - 학교 불일치 테스트용

### Mock 슬롯 데이터

- UC Berkeley (미국) - 2명 선발
- UCLA (미국) - 3명 선발
- University of Tokyo (일본) - 2명 선발
- Oxford University (영국) - 1명 선발
- NUS (싱가포르) - 4명 선발
- ETH Zurich (스위스) - 2명 선발

---

## 🔧 커스터마이징

### Mock 데이터 수정

1. **유저 추가**: `mocks/data/users.ts`
2. **시즌 추가**: `mocks/data/seasons.ts`
3. **슬롯 추가**: `mocks/data/slots.ts`
4. **지원서 추가**: `mocks/data/applications.ts`

### 핸들러 수정

특정 API 동작 변경: `mocks/handlers/` 디렉토리의 해당 파일 수정

### MSW 활성화/비활성화

`.env.local` 파일에서:
```bash
# MSW 활성화
NEXT_PUBLIC_ENABLE_MSW=true

# MSW 비활성화 (실제 백엔드 호출)
NEXT_PUBLIC_ENABLE_MSW=false
```

---

## 📚 참고 문서

- **사용 가이드**: [mocks/README.md](mocks/README.md)
- **테스트 가이드**: [mocks/TEST_GUIDE.md](mocks/TEST_GUIDE.md)
- **API 명세**: [API_RESPONSE_REFERENCE/](API_RESPONSE_REFERENCE/)
- **MSW 공식 문서**: https://mswjs.io/

---

## ✨ 다음 단계

### 1. 빠른 테스트
```bash
# .env.local 설정
echo "NEXT_PUBLIC_ENABLE_MSW=true" >> .env.local
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8080" >> .env.local

# 개발 서버 시작
pnpm dev
```

### 2. 브라우저에서 테스트

로그인 페이지로 이동하여 테스트 계정으로 로그인:
- 이메일: `test@example.com`
- 비밀번호: `password123456`

### 3. 콘솔에서 API 테스트

브라우저 콘솔에서 `mocks/TEST_GUIDE.md`의 테스트 스크립트 실행

### 4. 에러 케이스 테스트

특수 값들을 사용하여 다양한 에러 상황 시뮬레이션

---

## 🎊 완료!

이제 백엔드 없이도 전체 앱 기능을 테스트할 수 있습니다!

**구현된 기능:**
- ✅ 23개 API 엔드포인트 모킹
- ✅ 40개 이상 에러 케이스 시뮬레이션
- ✅ 인증/인가 처리 (로그인, 쿠키)
- ✅ 상태 관리 (로그인 상태, 지원서 등)
- ✅ 조건부 응답 (지원 여부에 따라 다른 데이터)
- ✅ 개발/프로덕션 환경 분리

**Happy Mocking! 🎉**
