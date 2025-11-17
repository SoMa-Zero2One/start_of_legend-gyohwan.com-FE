## Admin (`/api/admin`)

### 공통 정보
- 모든 엔드포인트는 JWT 인증이 필요하며, `SecurityConfig`가 비로그인 요청을 차단한다. 인증 실패 시 `ErrorCode.AUTHENTICATION_FAILED` ProblemDetail(401)이 내려온다.
- `@AdminOnly` 어노테이션과 `AdminAspect`가 현재 사용자(`User.isAdmin`)가 관리자 권한을 보유했는지 검사한다. 권한이 없으면 `ErrorCode.ADMIN_ACCESS_DENIED`(403), 사용자 레코드가 없으면 `ErrorCode.USER_NOT_FOUND`(404)가 발생한다.
- 요청/응답은 JSON. 비즈니스 오류는 `GlobalExceptionHandler`가 [`ProblemDetail`](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html) 구조로 직렬화한다.

---

### `PUT /api/admin/outgoing-univs/{univId}/information`
교환 대학(OutgoingUniv)의 `information` 필드를 수정한다.

- **요청 본문**: `UpdateUnivInfoRequest`(`admin/dto/UpdateUnivInfoRequest.java`)
  ```json
  { "information": "마크다운/HTML 등 자세한 소개문" }
  ```
  - `information`은 문자열이며 `null` 또는 빈 문자열을 전달하면 해당 필드가 비워진다.
- **성공 (200 OK)**: `UpdateUnivInfoResponse`(`admin/dto/UpdateUnivInfoResponse.java`)
  ```json
  {
    "univId": 25,
    "nameEn": "Korea University",
    "nameKo": "고려대학교",
    "information": "업데이트된 소개문"
  }
  ```
  - `nameEn`, `nameKo`는 `OutgoingUniv` 현재 값을 그대로 반환하며, `information`은 갱신 후의 최종 문자열이다.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 401 Unauthorized | `AUTHENTICATION_FAILED` | `인증에 실패하였습니다.` | JWT 미포함/만료 등으로 인증 객체가 없을 때 |
| 403 Forbidden | `ADMIN_ACCESS_DENIED` | `관리자 권한이 필요합니다.` | `isAdmin=false` 계정이 접근할 때 |
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 토큰 속 사용자 ID가 DB에 없을 때 |
| 404 Not Found | `UNIVERSITY_NOT_FOUND` | `대학을 찾을 수 없습니다.` | `univId`가 존재하지 않을 때 |

> 관리자 API는 현재 OutgoingUniv 정보 갱신만 제공한다. 다른 관리 기능이 추가되면 이 문서에 섹션을 확장해야 한다.
