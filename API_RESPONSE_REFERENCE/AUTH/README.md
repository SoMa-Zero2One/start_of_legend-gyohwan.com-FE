## Auth (`/v1/auth`)

### 공통 정보
- 모든 엔드포인트는 인증 없이 접근 가능하며, 본문과 응답은 JSON 형식이다.
- 성공 시 `TokenResponse`(`auth/dto/TokenResponse.java:3`)는 JWT 문자열을 `accessToken` 필드에 담아 반환한다.
- 토큰을 발급하는 모든 성공 응답은 `CookieUtil`(`src/main/java/com/gyohwan/gyohwan/security/CookieUtil.java`)을 통해 이름이 `accessToken`인 HTTP-only 쿠키를 설정한다. `SameSite=Lax`, `Path=/`, `Secure` 값은 `jwt.cookie.secure` 설정에 따라 결정된다.
- 실패 시 `GlobalExceptionHandler`가 `ProblemDetail`을 내려준다. `detail` 필드에 `ErrorCode`의 한글 메시지가 그대로 들어가며, `title`은 HTTP 상태에 대응하는 영문 Reason Phrase다.

### `POST /v1/auth/login/social/kakao`
- **요청 본문**: `OAuthCodeRequest`(`auth/dto/OAuthCodeRequest.java:6`)
  ```json
  { "code": "카카오에서 받은 인증 코드" }
  ```
  `code`는 공백이 아닌 문자열이어야 한다.
- **성공 (200 OK)**:
  ```json
  { "accessToken": "jwt 문자열" }
  ```
  동시에 `accessToken` 쿠키가 세션 쿠키 형태로 설정된다.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 400 Bad Request | `KAKAO_REDIRECT_URI_MISMATCH` | `리다이렉트 uri가 잘못되었습니다.` | 클라이언트에서 넘겨준 redirect URI가 카카오에 등록된 값과 다른 경우 (`KakaoOAuthClient#getAccessTokenFromKakao`) |
| 400 Bad Request | `INVALID_OR_EXPIRED_KAKAO_AUTH_CODE` | `사용할 수 없는 카카오 인증 코드입니다. 카카오 인증 코드는 일회용이며, 인증 만료 시간은 10분입니다.` | 인증 코드가 만료되었거나 이미 사용된 경우, 혹은 토큰 요청이 기타 이유로 실패한 경우 |
| 400 Bad Request | Bean Validation | 예: `인증 코드를 입력해주세요.` | 요청 본문에서 `code`가 비어 있을 때 (`@NotBlank`) |

### `POST /v1/auth/login/social/google`
- **요청 본문**: `OAuthCodeRequest`
  ```json
  { "code": "구글에서 받은 인증 코드" }
  ```
- **성공 (200 OK)**: `TokenResponse`와 `accessToken` 쿠키 설정.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 400 Bad Request | `INVALID_OR_EXPIRED_GOOGLE_AUTH_CODE` | `사용할 수 없는 구글 인증 코드입니다.` | 구글 토큰 발급 요청이 실패한 경우 (`GoogleOAuthClient#getAccessTokenFromGoogle`) |
| 400 Bad Request | Bean Validation | 예: `인증 코드를 입력해주세요.` | `code`가 비어 있을 때 |

### `POST /v1/auth/login/email`
- **요청 본문**: `EmailLoginRequest`(`auth/dto/EmailLoginRequest.java:6`)
  ```json
  { "email": "user@example.com", "password": "비밀번호" }
  ```
  - `email`은 이메일 형식이어야 하며(`@Email`), 빈 값이면 안 된다.
  - `password`도 공백이 허용되지 않는다.
- **성공 (200 OK)**: `TokenResponse` + `accessToken` 쿠키 설정.
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 401 Unauthorized | `EMAIL_LOGIN_FAILED` | `이메일 로그인에 실패하였습니다. 이메일 또는 비밀번호를 확인해주세요.` | `AuthenticationManager` 인증이 실패했을 때 (`AuthenticationException`) |
| 400 Bad Request | Bean Validation | `이메일을 입력해 주세요.`, `비밀번호를 입력해 주세요.`, 혹은 기본 메시지(예: `must be a well-formed email address`) | 이메일/비밀번호가 비어 있거나 이메일 형식이 아닐 때 |

### `POST /v1/auth/signup/email`
- **요청 본문**: `EmailSignupRequest`(`auth/dto/EmailSignupRequest.java:5`)
  ```json
  { "email": "user@example.com", "password": "최소 12자" }
  ```
  - 두 필드 모두 공백을 허용하지 않는다.
- **성공 (200 OK)**:
  ```json
  { "email": "user@example.com" }
  ```
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 409 Conflict | `EMAIL_ALREADY_EXISTS` | `이미 사용 중인 이메일입니다.` | `UserRepository`에 동일 이메일이 존재할 때 |
| 400 Bad Request | `PASSWORD_TOO_SHORT` | `비밀번호는 최소 12자 이상이어야 합니다.` | 비밀번호 길이가 12자 미만일 때 |
| 400 Bad Request | Bean Validation | `이메일을 입력해 주세요.`, `비밀번호를 입력해 주세요.` | 요청 본문 필드가 비어 있을 때 |

### `POST /v1/auth/signup/email/confirm`
- **요청 본문**: `EmailConfirmRequest`(`auth/dto/EmailConfirmRequest.java:6`)
  ```json
  { "email": "user@example.com", "code": "123456" }
  ```
  - `code`는 문자열 형태의 6자리 숫자이다. (`EmailAuthService#generateVerificationCode`)
- **성공 (200 OK)**: `TokenResponse` + `accessToken` 쿠키 설정. 동시에 Redis에 저장된 인증 내역이 삭제되고, 학교 도메인일 경우 `User`가 자동으로 학교 인증 처리된다.
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 400 Bad Request | `EMAIL_CONFIRM_REQUEST_NOT_FOUND` | `인증 시간이 만료되었거나 요청된 적 없는 이메일입니다.` | Redis에 해당 이메일의 인증 정보가 없을 때 (만료/미요청) |
| 400 Bad Request | `EMAIL_CONFIRM_CODE_DIFFERENT` | `인증 코드가 일치하지 않습니다.` | 저장된 인증 코드와 입력 코드가 다를 때 |
| 400 Bad Request | Bean Validation | `이메일을 입력해 주세요.`, `인증코드를 입력해 주세요.`, 혹은 이메일 형식 오류 메시지 | 필수 값 누락 또는 이메일 형식 오류 |

### `GET /v1/auth/signup/email/check`
- **쿼리 파라미터**: `email=<string>`
- **성공 (200 OK)**: `EmailCheckResponse`(`auth/dto/EmailCheckResponse.java:3`)
  ```json
  { "exists": true }
  ```
  `exists`는 불리언이며, 해당 이메일이 이미 존재하면 `true`.
- **오류 응답**: 별도 비즈니스 오류는 없지만, `email` 파라미터를 누락하면 Spring MVC가 400 Bad Request를 반환한다.

### `POST /v1/auth/logout`
- **성공 (200 OK)**: `LogoutResponse`(`auth/dto/LogoutResponse.java:3`)
  ```json
  { "message": "로그아웃되었습니다." }
  ```
  `accessToken` 쿠키가 즉시 만료되고, `SecurityContextHolder`가 초기화된다.
- 별도의 오류 응답 정의는 없으며, 인증 상태와 무관하게 동일한 응답을 돌려준다.
