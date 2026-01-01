# Gyohwan GA4 이벤트 현황

이 문서는 **현재 서비스에서 실제로 전송 중인 GA 이벤트와 파라미터**를 설명합니다.  
커뮤니티 영역은 제외하고, 성적 공유/학교 인증/CTA 중심으로 측정합니다.

---

## 1) 목적 요약

- **성적 공유 퍼널**: 어디에서 이탈하는지/완료율이 어떤지 확인
- **학교 인증 퍼널**: 인증 시도와 완료율 확인
- **CTA 의미 전달**: 어떤 버튼이 실제 행동으로 이어지는지 확인
- **게이트 분석**: 로그인/학교 인증 장벽이 어느 지점에서 발생하는지 확인

---

## 2) 공통 파라미터 (자동 포함)

로그인 사용자만 포함:
- `user_id` (string)
- `school_verified` (boolean)
- `domestic_university` (string)

모든 사용자:
- `user_status` = `guest` | `member`

> PII(이메일, 닉네임, 상세 GPA 등)는 전송하지 않습니다.

---

## 3) 이벤트 목록 (현재 전송 중)

### 3.1 CTA 클릭

- `cta_click`
  - 필수: `cta_id`, `cta_location`
  - 선택: `cta_label`, `season_id`, `season_name`, `entry_point`
  - 주요 entry_point:
    - `nav`
    - `home_card`
    - `strategy_room_bottom_bar`
    - `strategy_room_overlay`
    - `application_detail_overlay`

### 3.2 성적 공유 퍼널

- `grade_share_start`  
  - `season_id`, `season_name`
  - 같은 세션에서 1회만 전송
- `grade_share_step_submit`
  - `season_id`, `season_name`, `step`
  - 선택: `has_extra_score`
- `grade_share_complete`
  - `season_id`, `season_name`, `choices_count`, `has_extra_score`
- `grade_share_validation_error`
  - `season_id`, `season_name`, `step`, `field`, `reason`
- `grade_share_error`
  - `season_id`, `season_name`, `step`, `error_code`

### 3.3 성적 공유 페이지 사용성

- `grade_share_page_view`
  - `season_id`, `season_name`, `tab`
  - 초기 탭이 확정된 후 1회 전송
- `grade_share_page_tab_change`
  - `season_id`, `tab`, `prev_tab`
- `grade_share_page_search`
  - `season_id`, `season_name`, `query_length`, `result_count`
- `openchat_click`
  - `season_id`, `season_name`, `cta_location`

### 3.4 학교 인증 퍼널

- `school_verification_start`
  - `page_path`
- `school_verification_email_submit`
- `school_verification_code_submit`
- `school_verification_resend`
- `school_verification_complete`
- `school_verification_error`
  - `step`, `error_code`

### 3.5 게이트/리다이렉트

- `gate_redirect`
  - `reason`, `from_path`, `target_path`
  - 선택: `season_id`, `season_name`

### 3.6 마이페이지(미인증 유입)

- `my_page_unverified_view`
  - `page_path`
  - 같은 세션에서 1회만 전송

---

## 4) 주의 사항

- `trackEvent`는 gtag 미로드 시 **클라이언트 큐에 적재 후 flush**합니다.
- `grade_share_start`, `my_page_unverified_view`는 세션 중복 전송을 막습니다.
- `grade_share_page_view`는 초기 탭 결정 이후에만 전송합니다.

---

## 5) GA에서 확인하는 위치

- **실시간 확인**: DebugView
- **일반 리포트**: 보고서 > 참여도 > 이벤트
- **퍼널 분석**: 탐색 > 퍼널 분석

> 이벤트 파라미터를 보고서/탐색에서 쓰려면 **커스텀 정의 등록**이 필요합니다.  
> 등록 방법은 내부 위키에 별도 문서로 분리해도 됩니다.
