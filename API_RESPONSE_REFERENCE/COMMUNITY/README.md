## Community (`/v1/community`)

### 공통 정보
- 조회 엔드포인트는 인증 없이 호출 가능하다. 인증된 사용자는 각 게시글에 대한 `isLiked` 값과 본인 권한에 따른 필드를 받을 수 있다.
- 게시글/댓글 작성은 회원과 비회원 모두 가능하다. 비회원은 `guestPassword`를 반드시 입력해야 하며, 이후 수정·삭제 시 동일한 비밀번호를 `DeleteRequest`로 전달해야 한다.
- 모든 비즈니스 오류는 `GlobalExceptionHandler`가 [`ProblemDetail`](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html) 구조로 내려준다. `detail`에는 `ErrorCode`의 한글 메시지가 그대로 담긴다. Bean Validation 오류는 필드별 메시지를 포함한다.
- 응답 모델은 `community/dto` 패키지에 정의되어 있다. `AuthorDto`는 `nickname`, `isAnonymous`, `isMember`, `isAuthor` 네 가지 속성을 내려주며, `isAuthor=true`이면 현재 인증 사용자와 작성자의 ID가 일치한다.
- 게시글 좋아요(`POST/DELETE /v1/community/posts/{postId}/like`)는 JWT가 필수다. 컨트롤러가 직접 401을 반환하므로 인증이 없으면 본문 없는 응답이 내려온다.

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
          "isMember": true,
          "isAuthor": false
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
  - `author.isAuthor=true`이면 현재 인증 사용자가 해당 글 작성자라는 뜻이다. 미로그인 혹은 다른 사용자는 항상 `false`.
  - `isLiked`는 인증된 사용자가 해당 게시글에 좋아요를 눌렀는지 여부다. 미로그인 상태에서는 항상 `false`.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 400 Bad Request | `INVALID_INPUT_VALUE` | `countryCode 또는 outgoingUnivId를 입력해주세요.` | 필터 파라미터를 둘 다 생략했을 때 |
| 404 Not Found | `COUNTRY_NOT_FOUND` | `국가를 찾을 수 없습니다.` | 존재하지 않는 `countryCode`로 조회했을 때 |

---

### `GET /v1/community/posts/country/{countryCode}`
- 특정 국가에 속한 모든 교환 대학의 게시글을 모아 조회한다. 내부적으로 해당 `countryCode`에 매핑된 `OutgoingUniv` ID 리스트를 만든 뒤, `PostListResponse` 구조로 내려준다.
- **쿼리 파라미터**: `page`(기본 0), `limit`(기본 20)만 지원한다.
- **성공 (200 OK)**: 응답 본문은 위 `GET /v1/community/posts`와 동일한 `PostListResponse`.
- **오류 응답**

| HTTP 상태 | ErrorCode | `detail` 메시지 | 발생 조건 |
|-----------|-----------|-----------------|-----------|
| 404 Not Found | `COUNTRY_NOT_FOUND` | `국가를 찾을 수 없습니다.` | `countryCode`가 존재하지 않을 때 |

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
      "isMember": true,
      "isAuthor": true
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
          "isMember": true,
          "isAuthor": false
        }
      }
    ]
  }
  ```
  - 댓글은 게시글 엔티티에 연결된 순서대로 직렬화된다. 비회원 댓글이면 `author.isMember=false`, `nickname`은 게스트가 입력한 값(기본 `"익명"`).
  - 댓글의 `author.isAuthor`는 로그인한 사용자가 해당 댓글을 작성했는지 여부다. 미로그인 상태에서는 항상 `false`.
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
    "outgoingUnivId": null
  }
  ```
  - 회원 글: `isAnonymous=true`로 익명 게시 가능. `guestPassword`는 `null`이어도 된다.
  - 비회원 글: `guestPassword`를 반드시 입력해야 하며(`""`·공백 불가), 닉네임은 시스템에서 `"익명"`으로 고정된다.
  - `countryCode`, `outgoingUnivId` 중 정확히 하나만 지정해야 한다. 국가 탭에 노출할 글이면 `countryCode`, 특정 대학 탭이면 `outgoingUnivId`를 채운다.
- **성공 (201 Created)**: `PostDetailResponse`
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 400 Bad Request | Bean Validation | 예: `제목은 비어 있을 수 없습니다.` | `title` 또는 `content`가 공백일 때 |
| 400 Bad Request | `INVALID_INPUT_VALUE` | `비회원은 비밀번호를 입력해야 합니다.` | 비회원 글인데 `guestPassword`가 비어 있을 때 |
| 400 Bad Request | `INVALID_INPUT_VALUE` | `countryCode 또는 outgoingUnivId를 입력해주세요.` | 두 필드를 모두 비웠을 때 |
| 400 Bad Request | `INVALID_INPUT_VALUE` | `countryCode와 outgoingUnivId는 동시에 입력할 수 없습니다.` | 두 필드를 모두 채웠을 때 |
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 인증된 사용자의 ID가 DB에 없을 때 |
| 404 Not Found | `COUNTRY_NOT_FOUND` | `국가를 찾을 수 없습니다.` | `countryCode`가 존재하지 않을 때 |
| 404 Not Found | `UNIVERSITY_NOT_FOUND` | `대학을 찾을 수 없습니다.` | `outgoingUnivId`가 존재하지 않을 때 |

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
      "isMember": false,
      "isAuthor": false
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

### `POST /v1/community/posts/{postId}/like`
- **요청 본문**: 없음. JWT가 필요하며, 인증이 없으면 컨트롤러가 본문 없는 `401 Unauthorized`를 반환한다.
- **성공 (200 OK)**: `PostLikeResponse`(`community/dto/PostLikeResponse.java`)
  ```json
  {
    "postId": 101,
    "isLiked": true,
    "likeCount": 13
  }
  ```
  - `likeCount`는 처리 직후의 총 좋아요 개수다.
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 400 Bad Request | `INVALID_INPUT_VALUE` | `이미 좋아요를 누른 게시글입니다.` | 동일 사용자가 중복으로 좋아요 요청 |
| 401 Unauthorized | - | (본문 없음) | JWT 미포함 또는 만료 |
| 404 Not Found | `USER_NOT_FOUND` | `유저를 찾을 수 없습니다.` | 토큰의 사용자 ID가 DB에 없을 때 |
| 404 Not Found | `POST_NOT_FOUND` | `게시글을 찾을 수 없습니다.` | `postId`가 존재하지 않을 때 |

---

### `DELETE /v1/community/posts/{postId}/like`
- **요청 본문**: 없음. JWT 필수(`401` 처리 동일).
- **성공 (200 OK)**: `PostLikeResponse`
  ```json
  {
    "postId": 101,
    "isLiked": false,
    "likeCount": 12
  }
  ```
- **오류 응답**

| HTTP 상태 | ErrorCode/유형 | `detail` 메시지 | 발생 조건 |
|-----------|----------------|-----------------|-----------|
| 400 Bad Request | `INVALID_INPUT_VALUE` | `좋아요를 누르지 않은 게시글입니다.` | 좋아요하지 않은 게시글에 취소 요청 |
| 401 Unauthorized | - | (본문 없음) | JWT 미포함 또는 만료 |
| 404 Not Found | `POST_NOT_FOUND` | `게시글을 찾을 수 없습니다.` | `postId`가 존재하지 않을 때 |

---

### 참고
- `likeCount`와 `isLiked`는 실시간 좋아요 테이블을 기반으로 계산되며, 좋아요 API 역시 `PostLikeResponse`로 현재 상태를 돌려준다.
