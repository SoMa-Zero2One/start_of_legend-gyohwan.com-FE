## Community (`/v1/community`)

### 공통 정보
- 조회 엔드포인트는 인증 없이 호출 가능하다. 인증된 사용자는 각 게시글에 대한 `isLiked` 값과 본인 권한에 따른 필드를 받을 수 있다.
- 게시글/댓글 작성은 회원과 비회원 모두 가능하다. 비회원은 `guestPassword`를 반드시 입력해야 하며, 이후 수정·삭제 시 동일한 비밀번호를 `DeleteRequest`로 전달해야 한다.
- 모든 비즈니스 오류는 `GlobalExceptionHandler`가 [`ProblemDetail`](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html) 구조로 내려준다. `detail`에는 `ErrorCode`의 한글 메시지가 그대로 담긴다. Bean Validation 오류는 필드별 메시지를 포함한다.
- 응답 모델은 `community/dto` 패키지에 정의되어 있다. `AuthorDto.isAnonymous`, `AuthorDto.isMember`는 불리언 값이며 JSON 키는 `isAnonymous`, `isMember`로 직렬화된다.

---

### `GET /v1/community/posts`
- **쿼리 파라미터**
  - `countryCode`(선택): ISO 국가 코드. 값이 있으면 해당 국가 게시글만 조회한다.
  - `outgoingUnivId`(선택): 교환 대학 ID. `countryCode` 대신 사용할 수 있다.
  - `page`(기본 0), `limit`(기본 20): 페이지네이션 파라미터.
  - `countryCode`와 `outgoingUnivId`를 모두 비우면 `INVALID_INPUT_VALUE` 예외가 발생한다.
- **성공 (200 OK)**: `PostListResponse`(`community/dto/PostListResponse.java:11`)
  ```json
  {
    "pagination": {
      "totalItems": 58,
      "totalPages": 3,
      "currentPage": 0,
      "limit": 20
    },
    "posts": [
      {
        "postId": 101,
        "title": "익명 질문 있어요",
        "content": "해외 교환 지원 준비 어떻게 하셨나요?",
        "createdAt": "2025-01-05T12:34:56.000000",
        "author": {
          "nickname": "익명",
          "isAnonymous": true,
          "isMember": true
        },
        "likeCount": 12,
        "commentsCount": 4,
        "isLiked": false
      }
    ]
  }
  ```
  - `pagination`은 전체 건수와 페이지 정보를 담는다.
  - `posts[].author.nickname`은 회원+실명일 때 실제 닉네임, 회원+익명일 때 `"익명"`, 비회원일 때 게스트 닉네임을 그대로 반환한다.
  - `isLiked`는 인증된 사용자가 해당 게시글에 좋아요를 눌렀는지 여부다. 미로그인 상태에서는 항상 `false`.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 400 Bad Request | `INVALID_INPUT_VALUE` | `countryCode 또는 outgoingUnivId를 입력해주세요.` | 필터 파라미터를 둘 다 생략했을 때 |
| 404 Not Found | `COUNTRY_NOT_FOUND` | `국가를 찾을 수 없습니다.` | 존재하지 않는 `countryCode`로 조회했을 때 |

---

### `GET /v1/community/posts/{postId}`
- **성공 (200 OK)**: `PostDetailResponse`(`community/dto/PostDetailResponse.java:12`)
  ```json
  {
    "postId": 101,
    "title": "익명 질문 있어요",
    "content": "해외 교환 지원 준비 어떻게 하셨나요?",
    "createdAt": "2025-01-05T12:34:56.000000",
    "author": {
      "nickname": "익명",
      "isAnonymous": true,
      "isMember": true
    },
    "likeCount": 12,
    "isLiked": false,
    "comments": [
      {
        "commentId": 301,
        "content": "교환 준비 자료 공유드려요!",
        "createdAt": "2025-01-05T13:20:10.000000",
        "author": {
          "nickname": "교환왕",
          "isAnonymous": false,
          "isMember": true
        }
      }
    ]
  }
  ```
  - 댓글은 게시글 엔터티에 연결된 순서대로 직렬화된다. 비회원 댓글이면 `author.isMember=false`, `nickname`은 게스트가 입력한 값(기본 `"익명"`).
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 404 Not Found | `POST_NOT_FOUND` | `게시글을 찾을 수 없습니다.` | `postId`가 존재하지 않을 때 |

---

### `POST /v1/community/posts`
- **요청 본문**: `PostCreateRequest`(`community/dto/PostCreateRequest.java:11`)
  ```json
  {
    "title": "익명 질문 있어요",
    "content": "해외 교환 지원 준비 어떻게 하셨나요?",
    "isAnonymous": true,
    "guestPassword": null,
    "countryCode": "US",
    "outgoingUnivId": 10
  }
  ```
  - 회원 글: `isAnonymous=true`로 익명 게시 가능. `guestPassword`는 `null`이어도 된다.
  - 비회원 글: `guestPassword`를 반드시 입력해야 하며(`""`·공백 불가), 닉네임은 시스템에서 `"익명"`으로 고정된다.
  - `countryCode`, `outgoingUnivId`는 선택 필드다. 둘 다 비워도 되고, 둘 다 채워도 허용된다.
- **성공 (201 Created)**: `PostDetailResponse`
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 400 Bad Request | Bean Validation | 예: `제목은 비어 있을 수 없습니다.` | `title` 또는 `content`가 공백일 때 |
| 400 Bad Request | `INVALID_INPUT_VALUE` | `비회원은 비밀번호를 입력해야 합니다.` | 비회원 글인데 `guestPassword`가 비어 있을 때 |
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 인증된 사용자의 ID가 DB에 없을 때 |
| 404 Not Found | `COUNTRY_NOT_FOUND` | `국가를 찾을 수 없습니다.` | `countryCode`가 존재하지 않을 때 |

---

### `PUT /v1/community/posts/{postId}`
- **요청 본문**: `PostUpdateRequest`(`community/dto/PostUpdateRequest.java:7`)
  ```json
  {
    "title": "수정된 제목",
    "content": "본문을 업데이트했습니다.",
    "isAnonymous": false,
    "guestPassword": "plain-text-password"
  }
  ```
  - 회원 글은 `isAnonymous`로 익명 여부를 토글할 수 있다.
  - 비회원 글을 수정하려면 원래 입력했던 비밀번호를 `guestPassword`에 담아야 한다. 값이 없거나 일치하지 않으면 `INVALID_PASSWORD`.
- **성공 (200 OK)**: `PostDetailResponse`
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 400 Bad Request | Bean Validation | `제목은 비어 있을 수 없습니다.` 등 | `title` 또는 `content`가 공백일 때 |
| 401 Unauthorized | `INVALID_PASSWORD` | `비밀번호가 일치하지 않습니다.` | 비회원 글 비밀번호 불일치 |
| 403 Forbidden | `UNAUTHORIZED_POST_ACCESS` | `게시글을 수정/삭제할 권한이 없습니다.` | 다른 회원이 작성한 글을 수정하려 할 때 |
| 404 Not Found | `POST_NOT_FOUND` | `게시글을 찾을 수 없습니다.` | `postId`가 존재하지 않을 때 |

---

### `DELETE /v1/community/posts/{postId}`
- **요청 본문**: 선택. 비회원은 `{"password": "plain-text-password"}` 형태로 전달해야 한다(`DeleteRequest`).
- **성공 (204 No Content)**: 본문 없음.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 401 Unauthorized | `INVALID_PASSWORD` | `비밀번호가 일치하지 않습니다.` | 비회원 글 비밀번호 불일치 |
| 403 Forbidden | `UNAUTHORIZED_POST_ACCESS` | `게시글을 수정/삭제할 권한이 없습니다.` | 다른 회원 글 삭제 시도 |
| 404 Not Found | `POST_NOT_FOUND` | `게시글을 찾을 수 없습니다.` | `postId`가 존재하지 않을 때 |

---

### `POST /v1/community/posts/{postId}/comments`
- **요청 본문**: `CommentCreateRequest`(`community/dto/CommentCreateRequest.java:10`)
  ```json
  {
    "content": "교환 준비 자료 공유드려요!",
    "isAnonymous": false,
    "guestPassword": "guest-secret"
  }
  ```
  - 회원 댓글: `isAnonymous=true`로 닉네임을 `"익명"` 처리할 수 있다. `guestPassword`는 무시된다.
  - 비회원 댓글: `guestPassword` 필수. 익명 여부는 항상 `false`고 닉네임은 `"익명"`으로 고정된다.
- **성공 (201 Created)**: `CommentDto`(`community/dto/CommentDto.java:10`)
  ```json
  {
    "commentId": 301,
    "content": "교환 준비 자료 공유드려요!",
    "createdAt": "2025-01-05T13:20:10.000000",
    "author": {
      "nickname": "익명",
      "isAnonymous": false,
      "isMember": false
    }
  }
  ```
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 400 Bad Request | Bean Validation | `댓글 내용은 비어 있을 수 없습니다.` | `content`가 공백일 때 |
| 400 Bad Request | `INVALID_INPUT_VALUE` | `비회원은 비밀번호를 입력해야 합니다.` | 비회원 댓글인데 비밀번호 미입력 |
| 404 Not Found | `POST_NOT_FOUND` | `게시글을 찾을 수 없습니다.` | 존재하지 않는 게시글에 댓글 작성 |
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 인증 사용자 ID가 존재하지 않을 때 |

---

### `DELETE /v1/community/comments/{commentId}`
- **요청 본문**: 선택. 비회원 댓글 삭제 시 `{"password": "guest-secret"}`를 전달해야 한다.
- **성공 (204 No Content)**: 본문 없음.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 401 Unauthorized | `INVALID_PASSWORD` | `비밀번호가 일치하지 않습니다.` | 비회원 댓글 비밀번호 불일치 |
| 403 Forbidden | `UNAUTHORIZED_COMMENT_ACCESS` | `댓글을 삭제할 권한이 없습니다.` | 다른 회원 댓글 삭제 시도 |
| 404 Not Found | `COMMENT_NOT_FOUND` | `댓글을 찾을 수 없습니다.` | `commentId`가 존재하지 않을 때 |

---

### 참고
- 커뮤니티 API는 아직 좋아요 등록/취소 엔드포인트를 제공하지 않는다. `likeCount`와 `isLiked`는 조회 시점의 DB 값을 기반으로 계산된다.
