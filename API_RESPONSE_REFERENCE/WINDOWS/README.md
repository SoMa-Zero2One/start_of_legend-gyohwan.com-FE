## Windows (`/v1/windows`)

### 공통 정보
- 국가/대학 조회 API는 인증 없이 호출할 수 있다. 로그인한 사용자가 호출하면 즐겨찾기 여부(`isFavorite`) 판단에 사용자 ID가 사용된다.
- 즐겨찾기 등록/해제는 JWT 인증이 필수이며, 인증이 없으면 Spring Security가 401 ProblemDetail을 반환한다.
- 응답 필드는 `window/dto` 패키지에 정의되어 있다. `DataFieldDto.type`은 `STRING` 또는 `NUMBER` 중 하나이며, 값이 존재하지 않으면 `value`가 `null`이다.
- 비즈니스 오류는 `GlobalExceptionHandler`를 통해 [`ProblemDetail`](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html) 형식으로 내려간다. `detail`에는 `ErrorCode` 메시지가 그대로 담긴다.

---

### `GET /v1/windows/countries`
- **성공 (200 OK)**: `List<CountryListResponse>`(`window/dto/CountryListResponse.java:8`)
  ```json
  [
    {
      "countryCode": "US",
      "name": "미국",
      "data": [
        {
          "fieldId": 1,
          "fieldName": "언어",
          "value": "영어",
          "type": "STRING"
        },
        {
          "fieldId": 2,
          "fieldName": "학기 일정",
          "value": "8월-12월",
          "type": "STRING"
        }
      ]
    }
  ]
  ```
  - 모든 국가를 반환하며, `data`는 설정된 커스텀 필드 목록이다. 값이 없으면 `value`가 `null`.
- **오류 응답**: 별도 정의 없음.

---

### `GET /v1/windows/countries/{countryCode}`
- **성공 (200 OK)**: `CountryDetailResponse`(`window/dto/CountryDetailResponse.java:9`)
  ```json
  {
    "countryCode": "FR",
    "name": "프랑스",
    "data": [
      {
        "fieldId": 1,
        "fieldName": "언어",
        "value": "프랑스어",
        "type": "STRING"
      }
    ],
    "universities": [
      {
        "univId": 33,
        "nameKo": "파리소르본대학교",
        "nameEn": "Sorbonne University",
        "logoUrl": "https://cdn.example.com/univ/sorbonne.png"
      }
    ]
  }
  ```
  - `universities`는 해당 국가에 속한 교환 대학 요약 정보다.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 404 Not Found | `COUNTRY_NOT_FOUND` | `국가를 찾을 수 없습니다.` | 존재하지 않는 `countryCode` |

---

### `GET /v1/windows/outgoing-universities`
- **쿼리 파라미터**
  - `seasons`(선택): 시즌 ID. 값이 있으면 해당 시즌에 연결된 대학만 반환한다.
- **성공 (200 OK)**: `List<UnivListResponse>`(`window/dto/UnivListResponse.java:9`)
  ```json
  [
    {
      "univId": 10,
      "name": "UC Berkeley",
      "countryCode": "US",
      "countryName": "미국",
      "isFavorite": true,
      "data": [
        {
          "fieldId": 5,
          "fieldName": "교환 유형",
          "value": "학기",
          "type": "STRING"
        },
        {
          "fieldId": 6,
          "fieldName": "등록금",
          "value": null,
          "type": "NUMBER"
        }
      ]
    }
  ]
  ```
  - 로그인하지 않은 경우 `isFavorite`는 항상 `false`.
  - `seasons` 파라미터가 없으면 모든 대학이 반환된다.
- **오류 응답**: 별도 정의 없음.

---

### `GET /v1/windows/outgoing-universities/{universityId}`
- **성공 (200 OK)**: `UnivDetailResponse`(`window/dto/UnivDetailResponse.java:9`)
  ```json
  {
    "univId": 10,
    "name": "UC Berkeley",
    "countryCode": "US",
    "countryName": "미국",
    "data": [
      {
        "fieldId": 5,
        "fieldName": "교환 유형",
        "value": "학기",
        "type": "STRING"
      }
    ]
  }
  ```
  - 즐겨찾기 여부는 포함되지 않는다. 대학에 매핑된 모든 필드를 내려준다.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 404 Not Found | `UNIV_NOT_FOUND` | `대학을 찾을 수 없습니다.` | `universityId`가 존재하지 않을 때 |

---

### `POST /v1/windows/outgoing-universities/{universityId}/favorite`
- **요청 본문**: 없음.
- **성공 (201 Created)**: 본문 없음.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 401 Unauthorized | - | `Full authentication is required to access this resource` | 인증 없이 호출했을 때 (Spring Security 기본 메시지) |
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 토큰의 사용자 ID가 DB에 없을 때 |
| 404 Not Found | `UNIV_NOT_FOUND` | `대학을 찾을 수 없습니다.` | `universityId`가 존재하지 않을 때 |
| 409 Conflict | `ALREADY_FAVORITED` | `이미 즐겨찾기에 추가되었습니다.` | 이미 즐겨찾기에 등록된 경우 |

---

### `DELETE /v1/windows/outgoing-universities/{universityId}/favorite`
- **요청 본문**: 없음.
- **성공 (204 No Content)**: 본문 없음.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 401 Unauthorized | - | `Full authentication is required to access this resource` | 인증 없이 호출했을 때 |
| 404 Not Found | `FAVORITE_NOT_FOUND` | `즐겨찾기를 찾을 수 없습니다.` | 즐겨찾기 레코드가 없을 때 |

---

### 참고
- 데이터 필드(`DataField`)는 관리자 설정값에 따라 동적으로 변할 수 있다. 프런트에서는 `fieldId`를 키로 사용하거나, `fieldName`을 그대로 렌더링하고 `type`에 따라 입력/출력 포맷을 조정하면 된다.
