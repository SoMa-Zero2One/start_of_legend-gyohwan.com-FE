## Users (`/v1/users`)

### 공통 정보
- 모든 엔드포인트는 JWT 인증이 필요하다. `JwtAuthenticationFilter`가 쿠키(`accessToken`) 또는 `Authorization: Bearer` 헤더에서 토큰을 읽어 인증을 채운다.
- 미인증 상태로 호출하면 Spring Security가 401 Unauthorized를 돌려준다(ProblemDetail 형태, `title`이 `"Unauthorized"`).
- 컨트롤러는 `@AuthenticationPrincipal`로 받은 `UserDetails.username`을 Long으로 파싱해 서비스에 전달한다. 인증 이후에도 ID가 없으면 `USER_NOT_FOUND`로 404가 발생한다.
- 모든 성공/실패 응답은 JSON. 실패는 `GlobalExceptionHandler`가 내려주는 `ProblemDetail` 구조를 사용한다.

---

### `GET /v1/users/me`
- **성공 (200 OK)**: `MyUserResponse`(`common/dto/MyUserResponse.java:7`)
  ```json
  {
    "userId": 1,
    "email": "user@example.com",
    "schoolEmail": "student@univ.ac.kr",
    "nickname": "닉네임",
    "domesticUniversity": "교환대학교",
    "schoolVerified": true,
    "loginType": "BASIC",
    "socialType": "KAKAO"
  }
  ```
  - `schoolEmail`, `domesticUniversity`, `socialType`는 없을 경우 `null`.
  - `loginType`은 `BASIC` 또는 `SOCIAL`.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 인증 토큰의 사용자 ID를 DB에서 찾지 못했을 때 |

---

### `GET /v1/users/me/gpas`
- **성공 (200 OK)**: `UserGpaResponse`(`common/dto/UserGpaResponse.java:8`)
  ```json
  {
    "userId": 1,
    "gpas": [
      {
        "gpaId": 10,
        "score": 4.21,
        "criteria": "4.5",
        "verifyStatus": "APPROVED",
        "statusReason": null
      }
    ]
  }
  ```
  - `criteria`는 문자열 `"4.5"`, `"4.3"`, `"4.0"` 중 하나로 직렬화된다(`compare/domain/Gpa.java:48`).
  - `verifyStatus`는 `PENDING`, `APPROVED`, `REJECTED` 중 하나.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 사용자 ID를 찾을 수 없음 |

---

### `POST /v1/users/me/gpas`
- **요청 본문**: `CreateGpaRequest`(`common/dto/CreateGpaRequest.java:5`)
  ```json
  { "score": 4.21, "criteria": 4.5 }
  ```
  - `score`, `criteria` 모두 숫자이면서 양수여야 한다(`@NotNull`, `@Positive`).
  - `criteria`는 4.5/4.3/4.0 중 하나로 전달해야 하며, 소수점 비교 허용 오차는 ±0.01 (`UserService#convertToCriteria`).
- **성공 (200 OK)**: `GpaResponse`(`common/dto/GpaResponse.java:5`)
  ```json
  {
    "gpaId": 10,
    "score": 4.21,
    "criteria": "4.5",
    "verifyStatus": "APPROVED",
    "statusReason": null
  }
  ```
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 400 Bad Request | Bean Validation | 예: `must not be null`, `must be greater than 0` | `score` 또는 `criteria`가 누락/0 이하 |
| 400 Bad Request | `INVALID_GPA_CRITERIA` | `유효하지 않은 학점 기준입니다. 4.0, 4.3, 4.5 중 하나여야 합니다.` | `criteria` 값이 허용 범위를 벗어남 |
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 사용자 ID 존재하지 않음 |

---

### `GET /v1/users/me/languages`
- **성공 (200 OK)**: `UserLanguageResponse`(`common/dto/UserLanguageResponse.java:8`)
  ```json
  {
    "userId": 1,
    "languages": [
      {
        "languageId": 7,
        "testType": "TOEIC",
        "score": "900",
        "grade": "A",
        "verifyStatus": "APPROVED",
        "statusReason": null
      }
    ]
  }
  ```
  - `testType`는 `Language.TestType` 열거형 이름(`TOEFL_IBT`, `TOEFL_ITP`, `IELTS`, `TOEIC`, `HSK`, `JLPT`) 중 하나.
  - `score`, `grade`, `statusReason`는 문자형이며 없으면 `null`.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 사용자 ID 존재하지 않음 |

---

### `POST /v1/users/me/languages`
- **요청 본문**: `CreateLanguageRequest`(`common/dto/CreateLanguageRequest.java:5`)
  ```json
  { "testType": "TOEIC", "score": "900", "grade": "A" }
  ```
  - `testType`는 필수(`@NotNull`), 대문자 열거형 이름으로 전달해야 한다.
  - `score`, `grade`는 선택 문자열.
- **성공 (200 OK)**: `LanguageResponse`(`common/dto/LanguageResponse.java:5`)
  ```json
  {
    "languageId": 7,
    "testType": "TOEIC",
    "score": "900",
    "grade": "A",
    "verifyStatus": "APPROVED",
    "statusReason": null
  }
  ```
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 400 Bad Request | Bean Validation | `must not be null` | `testType` 누락 |
| 400 Bad Request | `INVALID_LANGUAGE_TEST_TYPE` | `유효하지 않은 어학 시험 유형입니다.` | 지원하지 않는 시험 코드 전달 |
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 사용자 ID 존재하지 않음 |

---

### `POST /v1/users/me/password`
- **요청 본문**: `ChangePasswordRequest`(`common/dto/ChangePasswordRequest.java:5`)
  ```json
  { "currentPassword": "old-password", "newPassword": "new-password" }
  ```
  - 두 필드 모두 공백 불가(`@NotBlank`).
- **성공 (200 OK)**: `ChangePasswordResponse`(`common/dto/ChangePasswordResponse.java:3`)
  ```json
  { "message": "비밀번호가 성공적으로 변경되었습니다." }
  ```
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 400 Bad Request | Bean Validation | `현재 비밀번호는 필수입니다`, `새 비밀번호는 필수입니다` | 필드가 공백 |
| 400 Bad Request | `PASSWORD_CHANGE_FAILED` | `비밀번호 변경에 실패하였습니다. 현재 비밀번호를 확인해주세요.` | 현재 비밀번호 일치하지 않음 |
| 400 Bad Request | `INVALID_PASSWORD_FORMAT` | `비밀번호는 최소 8자 이상이어야 합니다.` | 새 비밀번호 길이가 8자 미만 |
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 사용자 ID 존재하지 않음 |

---

### `POST /v1/users/me/school-email`
- **요청 본문**: `SchoolEmailRequest`(`common/dto/SchoolEmailRequest.java:5`)
  ```json
  { "schoolEmail": "student@univ.ac.kr" }
  ```
  - 빈 값 불가, 이메일 형식(`@NotBlank`, `@Email`).
- **성공 (202 Accepted)**: `SchoolEmailResponse`(`common/dto/SchoolEmailResponse.java:3`)
  ```json
  { "schoolEmail": "student@univ.ac.kr" }
  ```
  - Redis에 `school:{userId}` 형태로 5분간 코드가 저장되고, 이메일로 인증 코드가 발송된다.
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 400 Bad Request | Bean Validation | `학교 이메일은 필수입니다`, `올바른 이메일 형식이 아닙니다` | 값 누락 / 이메일 형식 오류 |
| 400 Bad Request | `SCHOOL_EMAIL_DOMAIN_NOT_SUPPORTED` | `지원하지 않는 학교 이메일 도메인입니다.` | 등록되지 않은 도메인 또는 `@` 미포함 |
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 사용자 ID 존재하지 않음 |
| 409 Conflict | `SCHOOL_EMAIL_ALREADY_VERIFIED` | `이미 학교 인증이 완료된 계정입니다.` | 이미 `schoolVerified = true` |

---

### `POST /v1/users/me/school-email/confirm`
- **요청 본문**: `SchoolEmailConfirmRequest`(`common/dto/SchoolEmailConfirmRequest.java:5`)
  ```json
  { "code": "123456" }
  ```
  - `code`는 발급된 6자리 숫자 문자열, 공백 불가(`@NotBlank`).
- **성공 (200 OK)**: `SchoolEmailResponse`
  ```json
  { "schoolEmail": "student@univ.ac.kr" }
  ```
  - 성공 시 Redis 키가 삭제되고, User의 `schoolVerified`가 true, `schoolEmail`과 `domesticUniv`가 업데이트된다.
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 400 Bad Request | Bean Validation | `인증 코드는 필수입니다` | `code`가 비어 있음 |
| 400 Bad Request | `SCHOOL_EMAIL_CONFIRM_REQUEST_NOT_FOUND` | `인증 시간이 만료되었거나 요청된 적 없는 이메일입니다.` | Redis에 저장된 정보 없음 (만료/미요청) |
| 400 Bad Request | `SCHOOL_EMAIL_CONFIRM_CODE_DIFFERENT` | `인증 코드가 일치하지 않습니다.` | 코드 불일치 |
| 400 Bad Request | `SCHOOL_EMAIL_CONFIRM_DATA_CORRUPTED` | `인증 데이터가 손상되었습니다. 다시 인증을 요청해주세요.` | Redis 값 포맷이 깨진 경우 |
| 400 Bad Request | `SCHOOL_EMAIL_DOMAIN_NOT_SUPPORTED` | `지원하지 않는 학교 이메일 도메인입니다.` | Redis의 대학 ID를 다시 조회하지 못했을 때 |
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 사용자 ID 존재하지 않음 |

---

### `DELETE /v1/users/me/withdraw`
- **성공 (200 OK)**: `WithdrawResponse`(`common/dto/WithdrawResponse.java:3`)
  ```json
  { "message": "회원탈퇴가 완료되었습니다." }
  ```
  - `CookieUtil`이 `accessToken` 쿠키를 즉시 만료시키고, `SecurityContextHolder`를 비운다.
  - `User` 엔티티에 걸린 `cascade = ALL` 덕분에 GPA/LANGUAGE/SOCIAL/Application이 함께 삭제된다.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 사용자 ID 존재하지 않음 |

---

### 인증 실패 시 공통 응답 예시
인증 없이 호출할 경우 Spring Security가 다음과 유사한 ProblemDetail을 반환한다.

```json
{
  "type": "about:blank",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Full authentication is required to access this resource"
}
```
