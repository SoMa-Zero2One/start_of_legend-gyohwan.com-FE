# Analytics Event Spec (GA4)

커뮤니티 영역을 제외하고, "성적 공유", "학교 인증", "버튼 의미 전달 여부"를 중심으로 지표와 이벤트 스펙을 정리합니다.
PII(이메일, 닉네임, 상세 GPA 등)는 GA로 전송하지 않습니다.

---

## 1) 우리가 보고 싶은 지표와 목적

| 지표                       | 목적                           | 계산/참고 이벤트                                                         |
| -------------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| 성적 공유 완료율           | 핵심 전환(가치 도달) 성과 확인 | `grade_share_complete / grade_share_start`                               |
| 성적 공유 퍼널 누락 구간   | 퍼널 어디서 이탈하는지 파악    | `grade_share_start` → `grade_share_step_submit` → `grade_share_complete` |
| 학교 인증 완료율           | 접근 권한 전환 성과 확인       | `school_verification_complete / school_verification_start`               |
| 버튼 의미 전달 지표        | CTA 의도 전달 여부 확인        | `cta_click` (entry_point별 클릭 비교)                                   |
| CTA → 행동 전환율          | 클릭 이후 실제 행동 유도 확인  | `grade_share_start / cta_click` (성적 공유 CTA 기준)                     |
| 지원 대학 변경 버튼 클릭률 | 변경 니즈 및 관심도 확인       | `cta_click` (유니크 사용자 기준, `cta_id=university_reselect_cta`)       |
| 학교 인증 CTA 시도율       | 미인증 사용자 인증 시도 확인   | `cta_click / my_page_unverified_view`                                    |
| 게이트 원인 분석           | 로그인/학교인증 장벽 여부 파악 | `gate_redirect` (reason별 비율)                                          |

권장 세그먼트:
`user_status(guest|member)`, `school_verified(true|false)`, `season_id`, `season_name`, `domestic_university`

---

## 2) 이벤트 네이밍 규칙

- `lower_snake_case`
- 접미사 규칙: `_start`, `_submit`, `_complete`, `_error`, `_impression`, `_click`
- CTA는 `cta_click` 필수, `cta_impression`은 향후 필요 시 추가

---

## 3) 파라미터 스펙 (공통)

| param                 | type          | 예시                               | 설명                                 |
| --------------------- | ------------- | ---------------------------------- | ------------------------------------ |
| `user_id`             | string        | `12345`                            | 사용자 식별자(로그인 사용자만 전송)  |
| `user_status`         | string        | `guest`, `member`                  | 로그인 여부 구분(닉네임 대신)        |
| `school_verified`     | boolean       | `true`                             | 학교 인증 여부(로그인 사용자만 전송) |
| `domestic_university` | string        | `인천대학교`                       | 사용자 소속 학교(로그인 사용자만)    |
| `season_id`           | string/number | `123`                              | 시즌 식별용(정합성)                  |
| `season_name`         | string        | `인천대학교 2026-1 모집`           | 가독성용, 변경 가능성 있음           |
| `page_path`           | string        | `/strategy-room/12`                | GA 기본 수집과 병행 가능             |
| `entry_point`         | string        | `nav`, `strategy_room_overlay`     | CTA 유입 구분용                       |
| `cta_id`              | string        | `grade_share_cta_bottom_bar`       | CTA 고유 식별자                      |
| `cta_location`        | string        | `grade_share_page`                 | CTA 노출 위치                        |
| `cta_label`           | string        | `성적 공유하기`                    | 실제 버튼 문구                       |
| `cta_variant`         | string        | `A`                                | A/B 테스트용(없으면 생략)            |

PII 금지:
`email`, `nickname`, `raw_gpa`, `raw_language_score` 등은 전송 금지.

---

## 4) CTA 인벤토리 (초안)

| cta_id                            | cta_location         | 설명                                            |
| --------------------------------- | -------------------- | ----------------------------------------------- |
| `grade_share_cta_nav`             | `home_nav`           | 홈 하단 네비 "성적 공유" 버튼                   |
| `grade_share_cta_card`            | `home_strategy_card` | 홈 카드 내 "성적 공유하기"                      |
| `grade_share_cta_bottom_bar`      | `grade_share_page`   | 성적 공유 페이지 하단 고정 CTA                  |
| `grade_share_cta_overlay`         | `grade_share_page`   | 성적 공유 페이지 오버레이 CTA                   |
| `grade_share_cta_profile_overlay` | `application_detail` | 지원자 상세 오버레이 CTA                        |
| `university_reselect_cta`         | `grade_share_page`   | 성적 공유 페이지 "지원 대학 변경" (클릭만 측정) |
| `university_reselect_cta`         | `application_detail` | 내 프로필 "지원 대학교 변경" (클릭만 측정)      |
| `school_verify_cta_mypage`        | `my_page`            | 마이페이지 "인증하기" (클릭만 측정)             |

---

## 5) 이벤트 스펙

### 5.1 CTA (공통)

현재는 `cta_impression`을 수집하지 않고, `cta_click`만 수집합니다.

| event_name       | when                     | required params          | optional params                                        |
| ---------------- | ------------------------ | ------------------------ | ------------------------------------------------------ |
| `cta_click` | CTA 클릭 | `cta_id`, `cta_location` | `cta_label`, `cta_variant`, `season_id`, `season_name`, `entry_point` |

`entry_point` 권장 값:
`nav`, `home_card`, `strategy_room_bottom_bar`, `strategy_room_overlay`, `application_detail_overlay`

### 5.2 성적 공유

| event_name                     | when                  | required params              | optional params                   |
| ------------------------------ | --------------------- | ---------------------------- | --------------------------------- |
| `grade_share_start`            | 성적 공유 플로우 진입 | `season_id`                  | `season_name`, `entry_point`      |
| `grade_share_step_submit`      | Step 제출 성공        | `season_id`, `step`          | `has_language`, `has_extra_score` |
| `grade_share_complete`         | 최종 제출 성공        | `season_id`, `choices_count` | `has_extra_score`                 |
| `grade_share_validation_error` | 유효성 실패           | `season_id`, `step`, `field` | `reason`                          |
| `grade_share_error`            | API/서버 실패         | `season_id`, `step`          | `error_code`                      |

`step` 권장 값:
`grade_registration`, `university_selection`

추가 정책:
- `grade_share_start`는 같은 탭 세션에서 1회만 전송(새로고침으로는 중복 전송하지 않음)

### 5.3 학교 인증

| event_name                         | when                  | required params | optional params        |
| ---------------------------------- | --------------------- | --------------- | ---------------------- |
| `school_verification_start`        | 학교 인증 페이지 진입 | `page_path`     | `entry_point`          |
| `school_verification_email_submit` | 학교 이메일 제출      |                 | `domain_type`          |
| `school_verification_code_submit`  | 인증코드 제출         |                 | `attempt`              |
| `school_verification_resend`       | 인증메일 재전송       |                 | `attempt`              |
| `school_verification_complete`     | 인증 완료             |                 | `time_to_complete_sec` |
| `school_verification_error`        | 인증 실패             | `step`          | `error_code`           |

### 5.4 인증/게이트

| event_name      | when                 | required params       | optional params                           |
| --------------- | -------------------- | --------------------- | ----------------------------------------- |
| `auth_start`    | 로그인/가입 시작     | `method`, `action`    | `entry_point`                             |
| `auth_complete` | 로그인/가입 완료     | `method`, `action`    | `time_to_complete_sec`                    |
| `gate_redirect` | 접근 제한 리다이렉트 | `reason`, `from_path` | `target_path`, `season_id`, `season_name` |

`method` 권장 값: `email`, `google`, `kakao`  
`action` 권장 값: `login`, `sign_up`  
`reason` 권장 값: `login_required`, `school_verification_required`

### 5.5 성적 공유 페이지 사용(기본)

| event_name                    | when                  | required params    | optional params                |
| ----------------------------- | --------------------- | ------------------ | ------------------------------ |
| `grade_share_page_view`       | 성적 공유 페이지 진입 | `season_id`        | `season_name`, `tab`           |
| `grade_share_page_tab_change` | 탭 변경               | `season_id`, `tab` | `prev_tab`                     |
| `grade_share_page_search`     | 대학 검색             | `season_id`        | `query_length`, `result_count` |
| `openchat_click`              | 오픈채팅 버튼 클릭    | `season_id`        | `season_name`, `cta_location`  |

`tab` 권장 값:
`my_choices`, `has_applicants`, `all`

### 5.6 지원 대학 변경 버튼 (클릭 전용)

이 버튼은 노출(impression)을 측정하지 않고, 클릭 사용자(유니크) 중심으로 확인합니다.

| event_name  | when                | required params                                  | optional params            |
| ----------- | ------------------- | ------------------------------------------------ | -------------------------- |
| `cta_click` | 지망 대학 변경 클릭 | `cta_id=university_reselect_cta`, `cta_location` | `season_id`, `season_name` |

**지표 정의(유니크 사용자 기준):**

- 분자: `cta_click` + `cta_id=university_reselect_cta`의 `Users`
- 분모(선택):
  - 성적 공유 페이지 방문 사용자 `Users`
  - 성적 공유 완료 사용자 `Users`
- 분해 기준: `season_id`, `season_name`, `domestic_university`

### 5.7 마이페이지 미인증 유입 (클릭 전용)

미인증 사용자의 마이페이지 진입을 세션당 1회로 기록합니다.

| event_name | when                      | required params | optional params |
| ---------- | ------------------------- | --------------- | --------------- |
| `my_page_unverified_view` | 마이페이지 진입(미인증) | `page_path`     |                 |

---

## 6) A/B 테스트 파라미터 (reserved)

현재 A/B 테스트는 사용하지 않지만, 향후를 위해 `cta_variant` 파라미터를 예약합니다.
미사용 시에는 전송하지 않습니다.

---

## 7) 측정 해석 팁

- `cta_click`만 높고 `grade_share_start`가 낮으면 "의미 전달" 문제보단 "이동/게이트" 문제가 큼.
- `grade_share_start` 대비 `grade_share_complete`가 낮으면 폼 UX/검증/데이터 입력 난이도 이슈 가능성 높음.
- `user_status`, `school_verified` 세그먼트로 원인을 빠르게 분리 가능.
