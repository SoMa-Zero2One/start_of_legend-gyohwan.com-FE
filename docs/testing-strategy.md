# 테스트 전략

목표: 작은 단위부터 검증하고, 마지막에 전체 플로우가 깨지지 않는지 확인한다.

## 체크리스트를 쓰는 이유

- 진행 상황이 한눈에 보이고 팀 공유가 쉽다.
- 상단의 간단한 맥락으로 신규 참여자도 의도를 이해하기 쉽다.

## 도구 (현재)

- 테스트 러너: Jest (next/jest)
- DOM 헬퍼: @testing-library/react, @testing-library/jest-dom
- API 모킹: MSW (레포에 존재)
- E2E: Playwright (예정)

## 실행 방법

- Unit/Integration: `pnpm test:run`
- Watch 모드: `pnpm test:watch`

## 로드맵 (작게 -> 크게)

- [x] Unit - 유틸: `lib/utils/date.ts`, `lib/utils/apiError.ts`, `lib/utils/continent.ts`
- [x] Unit - 변환: `lib/utils/countryTransform.ts`, `lib/utils/universityTransform.ts`
- [x] Unit - 기타: `lib/utils/slot.ts`, `lib/utils/language.ts`
- [x] Unit - 스토리지: `lib/utils/redirect.ts`, `lib/utils/sessionCache.ts`
- [x] Unit - 환경: `lib/utils/api.ts`
- [ ] Integration - API 클라이언트: `lib/api/*.ts` + MSW (성공/에러 케이스)
- [ ] Integration - 스토어: `stores/authStore.ts` (fetchUser/logout 전이)
- [ ] Integration - 훅: `hooks/useModalHistory.ts` (URL 히스토리 동기화)
- [ ] UI - 인증: `components/auth/*` (검증, 단계 전환)
- [ ] UI - 성적 공유: `components/strategy-room/StrategyRoomClient.tsx` (탭/검색)
- [ ] UI - 대학 선택: `components/application/UniversitySelectionStep.tsx` (순서 변경)
- [ ] UI - 커뮤니티: `components/community/PostCreateModal.tsx` (회원/비회원 분기)
- [ ] Server - 액션: `app/actions/*` (revalidate 호출)
- [ ] Server - 라우트: `app/api/revalidate/route.ts`
- [ ] Integration - 플로우: 로그인 -> 리다이렉트, 신청서 제출 -> 갱신, 글 작성 -> 목록 갱신
- [ ] E2E - 핵심 플로우: 회원가입/로그인, 신청서 제출, 게시글/댓글

## 메모

- 유닛 테스트는 빠르고 결정적이어야 한다 (네트워크 금지).
- API 클라이언트 테스트는 MSW로 실제 계약을 최대한 모사한다.
- E2E는 핵심 플로우 위주로만 확장한다.
