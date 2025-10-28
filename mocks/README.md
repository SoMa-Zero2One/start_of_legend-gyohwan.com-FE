# MSW (Mock Service Worker) 사용 가이드

이 디렉토리는 **MSW (Mock Service Worker)**를 사용하여 백엔드 API를 모킹하는 설정과 데이터를 포함하고 있습니다.

---

## 📁 디렉토리 구조

```
mocks/
├── browser.ts              # MSW 브라우저 워커 설정
├── data/                   # Mock 데이터
│   ├── users.ts           # 유저, GPA, Language 데이터
│   ├── seasons.ts         # 시즌 데이터
│   ├── slots.ts           # 슬롯(교환 대학) 데이터
│   └── applications.ts    # 지원서 데이터
├── handlers/               # MSW 요청 핸들러
│   ├── index.ts           # 모든 핸들러 통합
│   ├── auth.ts            # 인증 관련 핸들러
│   ├── user.ts            # 유저 관련 핸들러
│   ├── season.ts          # 시즌 관련 핸들러
│   └── slot.ts            # 슬롯 관련 핸들러
└── README.md               # 이 파일
```

---

## 🚀 MSW 활성화 방법

### 1. 환경 변수 설정

`.env.local` 파일에 다음을 추가하세요:

```bash
NEXT_PUBLIC_ENABLE_MSW=true
```

### 2. 개발 서버 재시작

```bash
pnpm dev
```

브라우저 콘솔에 `🔶 MSW is enabled for development` 메시지가 표시되면 성공입니다!

---

## 🧪 테스트 시나리오

### ✅ 정상 동작 테스트

#### 1. **로그인 성공**
```typescript
// 이메일: test@example.com
// 비밀번호: password123456
```

#### 2. **회원가입 성공**
```typescript
// 새로운 이메일로 회원가입
// 인증 코드: 123456 (모든 이메일 공통)
```

#### 3. **GPA 등록**
```typescript
{
  "score": 4.21,
  "criteria": 4.5  // 4.0, 4.3, 4.5만 허용
}
```

#### 4. **Language 등록**
```typescript
{
  "testType": "TOEIC",  // TOEFL_IBT, IELTS, TOEIC, JLPT, HSK 등
  "score": "900",
  "grade": "A"
}
```

---

### ❌ 에러 케이스 테스트

#### Auth 에러

| 테스트 케이스 | 입력 값 | 에러 코드 | 설명 |
|--------------|--------|----------|------|
| 이메일 중복 | `existing@example.com` | 409 | 이미 가입된 이메일 |
| 비밀번호 짧음 | 12자 미만 비밀번호 | 400 | 최소 12자 필요 |
| 로그인 실패 | 틀린 이메일/비밀번호 | 401 | 인증 실패 |
| 만료된 인증 코드 | `expired@example.com` | 400 | 인증 시간 만료 |
| 카카오 코드 오류 | `code: "invalid-code"` | 400 | 유효하지 않은 OAuth 코드 |
| 구글 코드 오류 | `code: "invalid-code"` | 400 | 유효하지 않은 OAuth 코드 |

#### User 에러

| 테스트 케이스 | 입력 값 | 에러 코드 | 설명 |
|--------------|--------|----------|------|
| 잘못된 GPA 기준 | `criteria: 3.5` | 400 | 4.0/4.3/4.5만 허용 |
| 잘못된 어학 시험 | `testType: "INVALID"` | 400 | 지원하지 않는 시험 |
| 지원하지 않는 도메인 | `school@wrong.com` | 400 | 학교 도메인 불일치 |
| 이미 인증된 유저 | (schoolVerified=true) | 409 | 이미 인증 완료 |
| 잘못된 비밀번호 | `currentPassword: "wrong"` | 400 | 현재 비밀번호 불일치 |

#### Season 에러

| 테스트 케이스 | 입력 값 | 에러 코드 | 설명 |
|--------------|--------|----------|------|
| 학교 인증 안됨 | (schoolVerified=false) | 400/403 | 학교 인증 필요 |
| 학교 불일치 | 다른 학교 시즌 | 403 | 지원 불가 |
| 이미 지원함 | 동일 시즌 재지원 | 409 | 중복 지원 |
| choices 빈 배열 | `choices: []` | 400 | 최소 1개 필요 |
| 존재하지 않는 GPA | `gpaId: 9999` | 404 | GPA 없음 |
| 존재하지 않는 슬롯 | `slotId: 9999` | 404 | 슬롯 없음 |
| 수정 횟수 초과 | modifyCount=0 | 400 | 수정 불가 |

#### Slot 에러

| 테스트 케이스 | 입력 값 | 에러 코드 | 설명 |
|--------------|--------|----------|------|
| 존재하지 않는 슬롯 | `slotId: 9999` | 404 | 슬롯 없음 |
| 존재하지 않는 지원서 | `applicationId: 9999` | 404 | 지원서 없음 |

---

## 🔧 Mock 데이터 커스터마이징

### 유저 추가

`mocks/data/users.ts` 파일에서 `mockUsers` 객체에 새 유저를 추가하세요:

```typescript
export const mockUsers: Record<number, User> = {
  1: mockCurrentUser,
  2: mockUnverifiedUser,
  // 여기에 새 유저 추가
  5: {
    userId: 5,
    email: 'newuser@example.com',
    // ...
  },
};
```

### 시즌/슬롯 추가

`mocks/data/seasons.ts` 또는 `mocks/data/slots.ts` 파일에서 배열에 추가하세요.

### 핸들러 수정

특정 API 동작을 변경하려면 `mocks/handlers/` 디렉토리의 해당 파일을 수정하세요.

---

## 🎯 사용 팁

1. **MSW를 껐다 켰다 하려면**: `.env.local`에서 `NEXT_PUBLIC_ENABLE_MSW` 값을 변경 후 개발 서버 재시작

2. **특정 API만 모킹하려면**: `mocks/handlers/index.ts`에서 필요한 핸들러만 export

3. **실제 백엔드와 혼용**: 특정 API는 모킹하고 나머지는 실제 백엔드 호출 가능

4. **에러 시뮬레이션**: 각 핸들러에 정의된 특정 값을 사용하면 에러 응답 받을 수 있음

---

## 📚 참고 자료

- [MSW 공식 문서](https://mswjs.io/)
- [Next.js App Router with MSW](https://mswjs.io/docs/integrations/next-js)
- [API Response Reference](../API_RESPONSE_REFERENCE/)

---

## ⚠️ 주의사항

- **프로덕션에서는 자동으로 비활성화됩니다** (`process.env.NODE_ENV !== 'development'`)
- MSW는 **브라우저에서만 동작**합니다 (SSR에서는 동작하지 않음)
- 실제 백엔드 API와 동일한 응답 구조를 유지하세요
