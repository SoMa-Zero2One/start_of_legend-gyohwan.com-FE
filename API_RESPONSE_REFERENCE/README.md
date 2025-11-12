## API Response Reference

문서 구조
- `AUTH/README.md`: 인증 관련 엔드포인트 응답
- `USERS/README.md`: 사용자 정보 및 자기 데이터 관리 API
- `SEASONS/README.md`: 시즌/지원 관련 API
- `SLOTS/README.md`: 슬롯 상세 API
- `APPLICATIONS/README.md`: 단일 지원서 조회 API
- `COMMUNITY/README.md`: 커뮤니티 게시글/댓글 API
- `WINDOWS/README.md`: 국가·대학 탐색 및 즐겨찾기 API
- `ARTICLES/README.md`: 아티클 그룹/본문 API

---

## Backend Commit Log

| 날짜 | 커밋 | 요약 | 비고 |
|------|------|------|------|
| 2025-11-12 | 73fb46a | 시즌 목록 DTO에 `applicationCount` 필드 추가 | Seasons 문서 `GET /v1/seasons` 응답/설명 갱신 완료 |
| 2025-11-10 | bcbdf1d | `UnivDetailResponse`에 `logoUrl` 노출 | Windows 상세 응답에 필드 추가 |
| 2025-11-05 | 8efd7db | Window API가 `DataField` 전체 목록을 항상 반환하도록 수정 | Windows 문서 `data` 동작 설명 추가 |
| 2025-11-04 | a140871 | Slot/Season/Application DTO의 국가명이 null 허용 | Slots/Seasons/Applications 문서에 `country=null` 케이스 명시 |
| 2025-11-04 | 175c29c | `/v1/windows` 국가·대학/즐겨찾기 엔드포인트 추가 | Windows 문서 구조 검토 완료 |
| 2025-11-04 | 853da5e | 커뮤니티 Controller/Service 구현 | Community 문서 엔드포인트 정리 완료 |
| 2025-11-03 | 714738c | 커뮤니티 DTO, 좋아요 카운트/익명 로직 추가 | Community 응답 필드 확인 완료 |
| 2025-11-03 | caa1057 | 이메일 비밀번호 재설정 API 추가 (`/password-reset/*`) | Auth 문서에 엔드포인트 추가 |
| 2025-10-28 | 4c81563 | Slot 상세 `homepageUrl` 오타 수정 | 문서 반영 완료 |
| 2025-10-28 | 4b97410 | Slot 상세에 `homepageUrl` 필드 추가 | Slots 문서에 필드 추가 |
| 2025-10-28 | 4b20957 | 학교 이메일 인증 Redis DTO화 | Users 문서 오류 코드 검토(변경 없음) |
| 2025-10-28 | f0b7c3d | 국내 대학 `logoUrl` 추가 | 시즌/슬롯 문서에 로고 경로 반영 필요 |
| 2025-10-27 | faadd81 | 대학 `homepageUrl` 필드 추가 | 추후 DTO 응답 확인 예정 |
| 2025-10-27 | 76b172a | DTO에 `logoUrl` 속성 노출 | 프런트 mock 업데이트 완료 확인 |
| 2025-10-27 | ef4568e | 로고 URL 처리 로직 추가 | |
| 2025-10-27 | 70e0808 | 학교 지원 가능 여부 API 추가 | `/v1/seasons/{id}/eligibility` 문서화 완료 |

> 다음에 서버 코드 다시 확인할 때 참고할 커밋과 TODO를 이 표에 추가하세요.
