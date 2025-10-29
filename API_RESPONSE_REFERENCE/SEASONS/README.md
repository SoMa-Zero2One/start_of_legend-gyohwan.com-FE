## Seasons (`/v1/seasons`)

### 공통 정보
- `GET /v1/seasons`, `GET /v1/seasons/{seasonId}`, `GET /v1/seasons/{seasonId}/slots`는 인증 없이 접근 가능하다. 인증되지 않은 경우 `hasApplied`가 항상 `false`로 내려간다.
- `/v1/seasons/{seasonId}/my-application`, `/v1/seasons/{seasonId}/eligibility`, `POST /v1/seasons/{seasonId}`, `PUT /v1/seasons/{seasonId}/my-application`은 JWT 인증이 필수다. 토큰이 없거나 만료되면 Spring Security가 401 ProblemDetail을 반환한다.
- 모든 오류 응답은 `GlobalExceptionHandler`를 거쳐 [`ProblemDetail`](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html) 형식으로 내려간다. `detail`에는 `ErrorCode`의 한글 메시지가 그대로 들어간다.
- 시즌/슬롯 관련 DTO는 `compare/dto` 패키지에 있으며, 내부 숫자·문자 타입은 엔티티 필드를 그대로 따른다.

---

### `GET /v1/seasons`
- **성공 (200 OK)**: `SeasonListResponse`(`compare/dto/SeasonListResponse.java:8`)
  ```json
  {
    "seasons": [
      {
        "seasonId": 3,
        "domesticUniversity": "교환대학교",
        "domesticUniversityLogoUri": "https://...",
        "name": "2025년 1학기",
        "startDate": "2024-12-01T00:00:00",
        "endDate": "2025-01-15T23:59:59",
        "isApplied": false
      }
    ]
  }
  ```
  - `startDate`, `endDate`는 ISO-8601 문자열로 직렬화된 `LocalDateTime`이며, 아직 일정이 정해지지 않은 경우 `null`.
  - `domesticUniversityLogoUri`는 CDN 경로 문자열이나 `null`이 올 수 있다.
  - 현재 서비스 구현(`SeasonService#findSeasons`)은 `isApplied`를 항상 `false`로 반환한다.
- **오류 응답**: 추가 예외 없음.

---

### `GET /v1/seasons/{seasonId}`
- **성공 (200 OK)**: `SeasonDetailResponse`(`compare/dto/SeasonDetailResponse.java:5`)
  ```json
  {
    "seasonId": 3,
    "domesticUniversity": "교환대학교",
    "domesticUniversityLogoUri": "",
    "name": "2025년 1학기",
    "startDate": "2024-12-01T00:00:00",
    "endDate": "2025-01-15T23:59:59",
    "hasApplied": true,
    "applicantCount": 42
  }
  ```
  - `domesticUniversityLogoUri`는 현재 빈 문자열로 내려오며, 향후 값이 채워질 예정.
  - 로그인하지 않았거나 아직 지원하지 않은 경우 `hasApplied`는 `false`.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 404 Not Found | `SEASON_NOT_FOUND` | `시즌을 찾을 수 없습니다.` | 시즌 ID가 존재하지 않을 때 |
| 400 Bad Request | `SEASON_DATA_INCOMPLETE` | `시즌의 학교 정보가 누락되었습니다.` | 시즌에 학교 정보가 연결되어 있지 않을 때 |

---

### `GET /v1/seasons/{seasonId}/slots`
- **성공 (200 OK)**: `SeasonSlotsResponse`(`compare/dto/SeasonSlotsResponse.java:9`)
  ```json
  {
    "seasonId": 3,
    "seasonName": "2025년 1학기",
    "hasApplied": true,
    "applicantCount": 42,
    "slots": [
      {
        "slotId": 12,
        "name": "UC Berkeley",
        "country": "US",
        "logoUrl": "https://...",
        "choiceCount": 15,
        "slotCount": "2명",
        "duration": "1학기"
      }
    ]
  }
  ```
  - `choiceCount`는 `long` (참여한 지원서 수).
  - `slotCount`는 문자열이므로 `"2"`, `"2명"`, `"15-20"` 등 다양한 형식이 그대로 온다.
  - `duration`은 `"1학기"`(SEMESTER), `"1년"`(YEAR), 값이 없으면 `"미정"`.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 404 Not Found | `SEASON_NOT_FOUND` | `시즌을 찾을 수 없습니다.` | 시즌 ID가 존재하지 않을 때 |

---

### `POST /v1/seasons/{seasonId}`
시즌 지원 등록. 컨트롤러는 `ApplicationService.applyToSeason`(`compare/service/ApplicationService.java:34`)을 호출한다.

- **요청 본문**: `ApplicationRequest`(`compare/dto/ApplicationRequest.java:13`)
  ```json
  {
    "extraScore": 1.5,
    "choices": [
      { "choice": 1, "slotId": 12 },
      { "choice": 2, "slotId": 15 }
    ],
    "gpaId": 10,
    "languageId": 7
  }
  ```
  - `choices`는 최소 1개 이상(`@NotEmpty`). 각 항목은 `choice`(1지망, 2지망 등)와 `slotId`(Long)로 구성된다.
  - `gpaId`, `languageId`는 본인 소유의 학점/어학 정보 ID여야 한다.
- **성공 (201 Created)**: `ApplicationResponse`(`compare/dto/ApplicationResponse.java:10`)
  ```json
  {
    "applicationId": 20,
    "seasonId": 3,
    "nickname": "지원자",
    "choices": [
      {
        "choice": 1,
        "slot": {
          "slotId": 12,
          "name": "UC Berkeley",
          "country": "US",
          "logoUrl": "https://...",
          "choiceCount": 15,
          "slotCount": "2명",
          "duration": "1학기"
        }
      }
    ]
  }
  ```
  - `nickname`은 `NicknameGenerator`에서 생성된 20자 미만 문자열.
  - `choices[].slot.choiceCount`는 현재까지 접수된 지원 수, `slotCount`는 문자열, `duration`은 위와 동일한 규칙.
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 400 Bad Request | Bean Validation | 필수 필드 누락(`choices`, `gpaId`, `languageId`, `choice`, `slotId`) | 요청 본문 검증 실패 |
| 400 Bad Request | `CHOICES_REQUIRED` | `지원 선택 항목은 필수입니다.` | `choices`가 비어 있을 때 |
| 400 Bad Request | `SCHOOL_NOT_VERIFIED` | `학교 인증이 완료되지 않았습니다.` | 학교 인증 전이거나 학교 정보 미연결 |
| 400 Bad Request | `INVALID_GPA_CRITERIA` | `유효하지 않은 학점 기준입니다. 4.0, 4.3, 4.5 중 하나여야 합니다.` | (내부 변환 중 발생 가능) |
| 403 Forbidden | `UNIV_MISMATCH` | `해당 시즌은 귀하의 학교에서 지원할 수 없습니다.` | 시즌 학교와 유저 학교 불일치 |
| 403 Forbidden | `UNAUTHORIZED_GPA` | `본인의 학점 정보만 사용할 수 있습니다.` | 다른 사람 GPA 사용 |
| 403 Forbidden | `UNAUTHORIZED_LANGUAGE` | `본인의 어학 정보만 사용할 수 있습니다.` | 다른 사람 어학 정보 사용 |
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 인증 정보와 일치하는 유저 없음 |
| 404 Not Found | `SEASON_NOT_FOUND` | `시즌을 찾을 수 없습니다.` | 시즌 ID 존재하지 않음 |
| 404 Not Found | `GPA_NOT_FOUND` | `학점 정보를 찾을 수 없습니다.` | `gpaId`가 존재하지 않음 |
| 404 Not Found | `LANGUAGE_NOT_FOUND` | `어학 정보를 찾을 수 없습니다.` | `languageId`가 존재하지 않음 |
| 404 Not Found | `SLOT_NOT_FOUND` | `슬롯을 찾을 수 없습니다.` | `choices`의 `slotId`가 잘못됨 |
| 409 Conflict | `ALREADY_APPLIED` | `이미 해당 시즌에 지원하였습니다.` | 동일 시즌에 기등록 |

---

### `PUT /v1/seasons/{seasonId}/my-application`
기존 지원서의 지망 정보를 수정한다.

- **요청 본문**: `ApplicationModifyRequest`(`compare/dto/ApplicationModifyRequest.java:13`)
  ```json
  {
    "choices": [
      { "choice": 1, "slotId": 12 },
      { "choice": 2, "slotId": 15 }
    ]
  }
  ```
  - `choices`는 최소 1개 이상이며 각 항목에 `choice`, `slotId`가 필수.
- **성공 (200 OK)**: `ApplicationResponse` 구조는 지원 등록 시와 동일.
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 400 Bad Request | Bean Validation | `choices` 또는 내부 필드가 비어 있을 때 | 요청 본문 검증 실패 |
| 400 Bad Request | `CHOICES_REQUIRED` | `지원 선택 항목은 필수입니다.` | `choices`가 비었을 때 |
| 400 Bad Request | `MODIFY_COUNT_EXCEEDED` | `지원서 수정 가능 횟수를 초과했습니다.` | `modifyCount`가 0 이하 |
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 사용자 ID 불일치 |
| 404 Not Found | `SEASON_NOT_FOUND` | `시즌을 찾을 수 없습니다.` | 시즌 없음 |
| 404 Not Found | `APPLICATION_NOT_FOUND` | `지원 정보를 찾을 수 없습니다.` | 지원서가 없거나 삭제됨 |
| 404 Not Found | `GPA_NOT_FOUND` | `학점 정보를 찾을 수 없습니다.` | 기존 choice의 GPA 정보를 유저에서 찾지 못함 |
| 404 Not Found | `LANGUAGE_NOT_FOUND` | `어학 정보를 찾을 수 없습니다.` | 기존 choice의 어학 정보를 유저에서 찾지 못함 |
| 404 Not Found | `SLOT_NOT_FOUND` | `슬롯을 찾을 수 없습니다.` | 전달한 `slotId`가 존재하지 않음 |

---

### `GET /v1/seasons/{seasonId}/my-application`
- **성공 (200 OK)**: `ApplicationDetailResponse`(`compare/dto/ApplicationDetailResponse.java:9`)
  ```json
  {
    "applicationId": 20,
    "seasonId": 3,
    "nickname": "지원자",
    "gpa": { "score": 4.21, "criteria": "4.5" },
    "language": { "testType": "TOEIC", "score": "900", "grade": "A" },
    "choices": [
      {
        "choice": 1,
        "slot": {
          "slotId": 12,
          "name": "UC Berkeley",
          "country": "US",
          "logoUrl": "https://...",
          "choiceCount": 15,
          "slotCount": "2명",
          "duration": "1학기"
        }
      }
    ]
  }
  ```
  - `gpa.criteria`는 문자열 `"4.5"`, `"4.3"`, `"4.0"` 중 하나.
  - `language.testType`는 `Language.TestType` 열거형 이름(대문자).
  - 지원서에 GPA/어학 정보가 비어 있으면 각 필드는 `null`.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 사용자 ID 불일치 |
| 404 Not Found | `SEASON_NOT_FOUND` | `시즌을 찾을 수 없습니다.` | 시즌 없음 |
| 404 Not Found | `APPLICATION_NOT_FOUND` | `지원 정보를 찾을 수 없습니다.` | 해당 시즌에 사용자의 지원서가 없을 때 |

---

### `GET /v1/seasons/{seasonId}/eligibility`
- **성공 (200 OK)**: `SeasonEligibilityResponse`(`compare/dto/SeasonEligibilityResponse.java:3`)
  ```json
  { "eligible": true, "detail": "지원 가능합니다." }
  ```
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 사용자 ID가 존재하지 않음 |
| 404 Not Found | `SEASON_NOT_FOUND` | `시즌을 찾을 수 없습니다.` | 시즌 없음 |
| 403 Forbidden | `SCHOOL_NOT_VERIFIED` | `학교 인증이 완료되지 않았습니다.` | 학교 인증 미완료 또는 학교 정보 없음 |
| 403 Forbidden | `SEASON_SCHOOL_MISMATCH` | `해당 시즌은 귀하의 학교에서 지원할 수 없습니다.` | 시즌 학교와 유저 학교 불일치 |
| 409 Conflict | `ALREADY_APPLIED` | `이미 해당 시즌에 지원하였습니다.` | 기존 지원서 존재 |

---

### 인증 실패 시 공통 응답 예시
인증이 필요한 시즌 API를 토큰 없이 호출하면 다음과 같은 ProblemDetail이 내려온다.

```json
{
  "type": "about:blank",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Full authentication is required to access this resource"
}
```
