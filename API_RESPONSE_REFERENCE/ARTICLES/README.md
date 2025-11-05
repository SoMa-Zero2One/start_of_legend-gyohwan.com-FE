## Articles (`/v1/article-groups`, `/v1/articles`)

### 공통 정보
- 모든 엔드포인트는 공개되어 있으며 인증이 필요 없다.
- 비즈니스 로직은 `ArticleService`(`article/service/ArticleService.java`)가 담당한다. 리소스를 찾지 못하면 `ResponseStatusException`을 던지며, Spring Boot가 [`ProblemDetail`](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html) JSON으로 직렬화한다.
- 아티클 본문(`content`)은 HTML 문자열이 그대로 내려오므로 프런트에서 XSS 방어를 고려해 랜더링해야 한다.

---

### `GET /v1/article-groups`
- **성공 (200 OK)**: `ArticleGroupsResponse`(`article/dto/ArticleGroupsResponse.java:5`)
  ```json
  {
    "userStatus": {
      "country": null,
      "domesticUniv": null
    },
    "common": {
      "name": "공통 가이드",
      "code": null,
      "path": "/article-groups/common"
    },
    "countries": [
      {
        "name": "미국",
        "code": "US",
        "path": "/article-groups/country/US"
      }
    ],
    "domesticUnivs": [
      {
        "name": "고려대학교",
        "code": "KOREA",
        "path": "/article-groups/domestic-univ/KOREA"
      }
    ]
  }
  ```
  - `userStatus`는 추후 개인화 정보를 담기 위한 자리로 현재는 `null` 값이 내려온다.
  - `code`가 `null`인 공통 그룹은 단일 항목이다.
- **오류 응답**: 없음.

---

### `GET /v1/article-groups/common`
- **성공 (200 OK)**: `ArticleGroupDetailResponse`
  ```json
  {
    "groupName": "공통 가이드",
    "articles": [
      {
        "uuid": "6a1b26a4-8dd9-4f7b-94c8-40d8e8801f1e",
        "title": "해외 교환 준비 체크리스트",
        "coverImageUrl": "https://cdn.example.com/articles/common-checklist.png"
      }
    ]
  }
  ```
  - `articles`는 그룹에 연결된 순서를 유지한다. 각 항목은 요약 정보(`ArticleSummary`)만 포함한다.
- **오류 응답**

| HTTP 상태 | 메시지 | 발생 조건 |
|-----------|--------|-----------|
| 404 Not Found | `요청한 아티클 그룹을 찾을 수 없습니다.` | 공통 그룹이 비활성화되었거나 누락된 경우 |

---

### `GET /v1/article-groups/country/{countryCode}`
- **성공 (200 OK)**: `ArticleGroupDetailResponse`
  ```json
  {
    "groupName": "미국 준비 가이드",
    "articles": [
      {
        "uuid": "f79fb03e-5c7c-4cc5-a31a-0b0eec7ef5a1",
        "title": "미국 비자 준비",
        "coverImageUrl": null
      }
    ]
  }
  ```
  - 컨트롤러는 파라미터를 대문자로 변환(`countryCode.toUpperCase()`)한 뒤 검색한다.
- **오류 응답**

| HTTP 상태 | 메시지 | 발생 조건 |
|-----------|--------|-----------|
| 404 Not Found | `요청한 아티클 그룹을 찾을 수 없습니다.` | 코드에 대응하는 그룹이 없을 때 |

---

### `GET /v1/article-groups/domestic-univ/{univCode}`
- **성공 (200 OK)**: `ArticleGroupDetailResponse` (응답 구조는 위와 동일)
  - `univCode` 역시 대문자로 변환해 검색한다.
- **오류 응답**

| HTTP 상태 | 메시지 | 발생 조건 |
|-----------|--------|-----------|
| 404 Not Found | `요청한 아티클 그룹을 찾을 수 없습니다.` | 코드에 대응하는 그룹이 없을 때 |

---

### `GET /v1/articles/{articleUuid}`
- **성공 (200 OK)**: `ArticleDetailResponse`(`article/dto/ArticleDetailResponse.java:7`)
  ```json
  {
    "id": 45,
    "uuid": "6a1b26a4-8dd9-4f7b-94c8-40d8e8801f1e",
    "title": "해외 교환 준비 체크리스트",
    "content": "<h1>체크리스트</h1><p>여권, 비자, 보험을 준비하세요.</p>",
    "coverImageUrl": "https://cdn.example.com/articles/common-checklist.png"
  }
  ```
  - `content`는 HTML/마크다운이 문자열 형태로 저장되어 있어 그대로 내려간다.
- **오류 응답**

| HTTP 상태 | 메시지 | 발생 조건 |
|-----------|--------|-----------|
| 404 Not Found | `아티클을 찾을 수 없습니다: {articleUuid}` | UUID가 존재하지 않을 때 |

---

### 참고
- 현재 서비스는 아티클을 읽기 전용으로만 제공한다. 추후 작성/수정 API가 추가되면 별도 문서를 생성해야 한다.
