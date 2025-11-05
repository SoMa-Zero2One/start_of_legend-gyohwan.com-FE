## Applications (`/v1/applications`)

### 공통 정보
- 현재 컨트롤러는 인증 검사를 수행하지 않는다. 추후 접근 제약이 생기면 문서를 갱신해야 한다.
- 성공/실패 응답은 모두 JSON이며, 비즈니스 오류는 `GlobalExceptionHandler`가 [`ProblemDetail`](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html) 형태로 내려준다. `detail` 필드에 `ErrorCode`의 한글 메시지가 그대로 담긴다.
- 응답에는 지원서와 연결된 슬롯/학점/어학 정보가 함께 직렬화된다. 변환 로직은 `ApplicationService`(`compare/service/ApplicationService.java`)와 `ApplicationDetailResponse` DTO에 구현되어 있다.

---

### `GET /v1/applications/{applicationId}`
- **성공 (200 OK)**: `ApplicationDetailResponse`(`compare/dto/ApplicationDetailResponse.java:9`)
  ```json
  {
    "applicationId": 20,
    "seasonId": 3,
    "nickname": "교환희망자",
    "gpa": {
      "score": 4.21,
      "criteria": "_4_5"
    },
    "language": {
      "testType": "TOEIC",
      "score": "900",
      "grade": "A"
    },
    "choices": [
      {
        "choice": 1,
        "slot": {
          "slotId": 12,
          "name": "UC Berkeley",
          "country": "미국",
          "logoUrl": "https://cdn.example.com/univ/ucb.png",
          "choiceCount": 15,
          "slotCount": "2명",
          "duration": "1학기"
        }
      }
    ]
  }
  ```
  - `gpa.criteria`는 `Gpa.Criteria` 열거형 문자열(`_4_5`, `_4_3`, `_4_0`) 그대로 내려간다. 필요 시 프런트에서 숫자로 매핑한다.
  - `language.testType`는 `Language.TestType` 열거형(`TOEFL_IBT`, `TOEFL_ITP`, `IELTS`, `TOEIC`, `HSK`, `JLPT`) 중 하나다. 점수/등급은 문자열이며 값이 없으면 `null`.
  - 슬롯 정보의 `choiceCount`는 해당 슬롯을 선택한 전체 지원서 수다. `slotCount`는 문자열이므로 `"2"`, `"2명"`, `"15-20"` 등 다양한 형식을 그대로 유지한다. `duration`은 `Slot.Duration`에 따라 `"1학기"`, `"1년"`, 값이 없으면 `"미정"`.
  - 지원서가 아직 지망을 담고 있지 않으면 `choices`는 빈 배열이다. 이때 `gpa`와 `language`는 `{ "score": null, "criteria": null }`, `{ "testType": null, "score": null, "grade": null }`처럼 모든 필드가 `null`로 내려간다.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 404 Not Found | `APPLICATION_NOT_FOUND` | `지원 정보를 찾을 수 없습니다.` | `applicationId`가 존재하지 않을 때 |

---
