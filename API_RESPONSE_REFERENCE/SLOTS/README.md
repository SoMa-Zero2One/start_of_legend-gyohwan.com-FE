## Slots (`/v1/slots`)

### 공통 정보
- 슬롯 상세 조회는 인증이 선택 사항이다. 인증된 사용자가 해당 시즌에 지원했다면 민감한 점수 정보까지 내려가고, 그렇지 않으면 제한된 정보만 제공된다.
- `SlotController`(`compare/controller/SlotController.java:21`)는 로그인 여부와 `SlotService.hasApplicationForSlot` 결과에 따라 `SlotService.findSlot`(전체 정보) 또는 `SlotService.publicFindSlot`(제한 정보)을 호출한다.
- 실패 시 `GlobalExceptionHandler`가 [`ProblemDetail`](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html)을 사용한다. `detail`에는 `ErrorCode`의 메시지가 들어간다.

---

### `GET /v1/slots/{slotId}`
- **성공 (200 OK)**: `SlotDetailResponse`(`compare/dto/SlotDetailResponse.java:10`)
  ```json
  {
    "slotId": 12,
    "seasonId": 3,
    "name": "UC Berkeley",
    "country": "미국",
    "logoUrl": "https://...",
    "homepageUrl": "https://example.edu",
    "choiceCount": 15,
    "slotCount": "2명",
    "duration": "1학기",
    "etc": "추가 정보",
    "hasApplied": true,
    "choices": [
      {
        "applicationId": 20,
        "nickname": "지원자",
        "choice": 1,
        "gpaScore": 4.21,
        "gpaCriteria": 4.5,
        "languageTest": "TOEIC",
        "languageGrade": "A",
        "languageScore": "900",
        "extraScore": 1.5,
        "score": 85.5,
        "etc": ""
      }
    ]
  }
  ```
  - `choiceCount`는 `long`이며, 해당 슬롯을 선택한 지원서 수다.
  - `slotCount`는 문자열이므로 `"2"`, `"2명"`, `"15-20"`처럼 단위나 범위가 포함될 수 있으며, 데이터에 따라 공백 문자가 남아 있을 수도 있다.
  - `country`는 파트너 대학의 국가 한글명이며, 슬롯에 국가가 연결되지 않은 경우 `null`로 내려간다.
  - `homepageUrl`은 파트너 대학 홈페이지 URL 문자열이며, 데이터가 없으면 `null`.
  - `duration`은 `"1학기"`(SEMESTER), `"1년"`(YEAR), 값이 없으면 `"미정"`.
  - `etc`는 자유 입력 텍스트로, 없으면 `null`.
  - `hasApplied`가 `false`일 때는 `choices` 내 민감한 필드(`gpaScore`, `gpaCriteria`, `languageTest`, `languageGrade`, `languageScore`, `extraScore`, `score`)가 모두 `null`로 내려간다.
    ```json
    {
      "applicationId": 20,
      "nickname": "지원자",
      "choice": 1,
      "gpaScore": null,
      "gpaCriteria": null,
      "languageTest": null,
      "languageGrade": null,
      "languageScore": null,
      "extraScore": null,
      "score": null,
      "etc": ""
    }
    ```
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 404 Not Found | `SLOT_NOT_FOUND` | `슬롯을 찾을 수 없습니다.` | `slotId`에 해당하는 슬롯이 없을 때 |

---

### 인증 실패 시 공통 응답 예시
인증 없이 호출해도 제한 정보는 제공되지만, 만약 이후 필터에서 인증이 필요한 다른 엔드포인트를 호출하고 토큰이 없다면 다음과 같은 ProblemDetail이 내려간다.

```json
{
  "type": "about:blank",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Full authentication is required to access this resource"
}
```
