## API Response Reference

문서 구조
- `AUTH/README.md`: 인증 관련 엔드포인트 응답
- `USERS/README.md`: 사용자 정보 및 자기 데이터 관리 API
- `SEASONS/README.md`: 시즌/지원 관련 API
- `SLOTS/README.md`: 슬롯 상세 API

---

## Backend Commit Log

| 날짜 | 커밋 | 요약 | 비고 |
|------|------|------|------|
| 2025-10-28 | f0b7c3d | 국내 대학 `logoUrl` 추가 | 시즌/슬롯 문서에 로고 경로 반영 필요 |
| 2025-10-27 | faadd81 | 대학 `homepageUrl` 필드 추가 | 추후 DTO 응답 확인 예정 |
| 2025-10-27 | 76b172a | DTO에 `logoUrl` 속성 노출 | 프런트 mock 업데이트 완료 확인 |
| 2025-10-27 | ef4568e | 로고 URL 처리 로직 추가 | |
| 2025-10-27 | 70e0808 | 학교 지원 가능 여부 API 추가 | `/v1/seasons/{id}/eligibility` 문서화 완료 |

> 다음에 서버 코드 다시 확인할 때 참고할 커밋과 TODO를 이 표에 추가하세요.
