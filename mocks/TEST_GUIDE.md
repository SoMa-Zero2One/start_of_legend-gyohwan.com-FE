# MSW 테스트 가이드

MSW가 제대로 작동하는지 확인하는 빠른 테스트 방법입니다.

---

## 🚀 빠른 시작

### 1. MSW 활성화

`.env.local` 파일을 생성하고 다음을 추가:

```bash
NEXT_PUBLIC_ENABLE_MSW=true
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### 2. 개발 서버 시작

```bash
pnpm dev
```

### 3. 브라우저 콘솔 확인

브라우저를 열고 (http://localhost:3000) 콘솔에 다음 메시지가 표시되는지 확인:

```
🔶 MSW is enabled for development
[MSW] Mocking enabled.
```

---

## 🧪 테스트 시나리오

### ✅ 1. 로그인 테스트

**브라우저 콘솔에서 실행:**

```javascript
// 성공 케이스
fetch('http://localhost:8080/v1/auth/login/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123456'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Login Success:', data))
.catch(err => console.error('❌ Login Error:', err));

// 실패 케이스 (잘못된 비밀번호)
fetch('http://localhost:8080/v1/auth/login/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'wrongpassword'
  })
})
.then(res => res.json())
.then(data => console.log('❌ Expected Error:', data))
.catch(err => console.error('Error:', err));
```

**예상 결과:**
- 성공: `{ "accessToken": "mock-jwt-token-user-1-..." }`
- 실패: `{ "status": 401, "detail": "이메일 로그인에 실패하였습니다..." }`

---

### ✅ 2. 유저 정보 조회 테스트

먼저 로그인 후 (위의 로그인 테스트 실행):

```javascript
fetch('http://localhost:8080/v1/users/me', {
  method: 'GET',
  credentials: 'include'
})
.then(res => res.json())
.then(data => console.log('✅ User Info:', data))
.catch(err => console.error('❌ Error:', err));
```

**예상 결과:**
```json
{
  "userId": 1,
  "email": "test@example.com",
  "schoolEmail": "test@univ.ac.kr",
  "nickname": "테스트유저",
  "domesticUniversity": "교환대학교",
  "schoolVerified": true,
  "loginType": "BASIC",
  "socialType": null
}
```

---

### ✅ 3. 시즌 목록 조회 테스트

```javascript
fetch('http://localhost:8080/v1/seasons', {
  method: 'GET',
  credentials: 'include'
})
.then(res => res.json())
.then(data => console.log('✅ Seasons:', data))
.catch(err => console.error('❌ Error:', err));
```

**예상 결과:**
```json
{
  "seasons": [
    {
      "seasonId": 1,
      "domesticUniversity": "교환대학교",
      "name": "2025년 1학기",
      "startDate": "2024-12-01T00:00:00",
      "endDate": "2025-01-15T23:59:59",
      "isApplied": false
    },
    ...
  ]
}
```

---

### ✅ 4. GPA 등록 테스트

```javascript
// 성공 케이스
fetch('http://localhost:8080/v1/users/me/gpas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    score: 4.21,
    criteria: 4.5
  })
})
.then(res => res.json())
.then(data => console.log('✅ GPA Created:', data))
.catch(err => console.error('❌ Error:', err));

// 실패 케이스 (잘못된 criteria)
fetch('http://localhost:8080/v1/users/me/gpas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    score: 4.21,
    criteria: 3.5  // ❌ 허용되지 않는 값
  })
})
.then(res => res.json())
.then(data => console.log('❌ Expected Error:', data))
.catch(err => console.error('Error:', err));
```

**예상 결과:**
- 성공: `{ "gpaId": 1234567890, "score": 4.21, "criteria": "4.5", "verifyStatus": "APPROVED" }`
- 실패: `{ "status": 400, "detail": "유효하지 않은 학점 기준입니다. 4.0, 4.3, 4.5 중 하나여야 합니다." }`

---

### ✅ 5. 에러 케이스 테스트

#### 회원가입 - 이메일 중복

```javascript
fetch('http://localhost:8080/v1/auth/signup/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'existing@example.com',  // 이미 존재하는 이메일
    password: 'password123456'
  })
})
.then(res => res.json())
.then(data => console.log('❌ Expected Error:', data));
```

**예상 결과:**
```json
{
  "status": 409,
  "title": "Conflict",
  "detail": "이미 사용 중인 이메일입니다."
}
```

#### 인증 없이 보호된 리소스 접근

```javascript
// 로그아웃 먼저
fetch('http://localhost:8080/v1/auth/logout', {
  method: 'POST',
  credentials: 'include'
})
.then(() => {
  // 인증 없이 유저 정보 조회
  return fetch('http://localhost:8080/v1/users/me', {
    method: 'GET',
    credentials: 'include'
  });
})
.then(res => res.json())
.then(data => console.log('❌ Expected 401:', data));
```

**예상 결과:**
```json
{
  "status": 401,
  "title": "Unauthorized",
  "detail": "Full authentication is required to access this resource"
}
```

---

## 🎯 주요 테스트 포인트

### ✅ 확인할 사항

- [ ] 브라우저 콘솔에 MSW 활성화 메시지 표시
- [ ] Network 탭에서 요청이 `(from service worker)` 표시
- [ ] 정상 케이스 응답 확인
- [ ] 에러 케이스 응답 확인 (401, 404, 409 등)
- [ ] 로그인 후 쿠키 설정 확인
- [ ] 로그아웃 후 인증 실패 확인

---

## 🐛 트러블슈팅

### MSW가 활성화되지 않는 경우

1. `.env.local` 파일에 `NEXT_PUBLIC_ENABLE_MSW=true` 설정 확인
2. 개발 서버 재시작 (`pnpm dev`)
3. 브라우저 캐시 삭제 후 새로고침
4. 브라우저 콘솔에서 에러 메시지 확인

### Service Worker 등록 실패

```bash
# mockServiceWorker.js 파일이 public 디렉토리에 있는지 확인
ls public/mockServiceWorker.js
```

없다면:
```bash
pnpm msw init public
```

### CORS 에러

MSW는 브라우저 레벨에서 작동하므로 CORS 에러가 발생하지 않아야 합니다. 만약 발생한다면 MSW가 제대로 활성화되지 않은 것입니다.

---

## 📝 추가 테스트 케이스

더 많은 테스트 케이스는 [mocks/README.md](./README.md)를 참고하세요!
