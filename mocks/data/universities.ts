import type { UniversityDetailResponse } from "@/types/university";

/**
 * Mock 대학 데이터
 * 대학별 상세 정보
 */

/**
 * 테네시 대학 - 채터누가 캠퍼스 (univId: 1)
 */
export const mockUniversityUTC: UniversityDetailResponse = {
  univId: 1,
  name: "University of Tennessee at Chattanooga (UTC)",
  countryCode: "US",
  countryName: "미국",
  logoUrl: null,
  information: `### 1. 비자 발급 특이사항
독일 도착 후 현지에서 비자 발급을 진행했다. 3개월 무비자 체류가 가능하므로 도착 직후 시청 사이트에서 테어민(예약)을 빠르게 잡는 것이 중요하다.
담당자에 따라 엄격하거나 유한 경우가 있으므로 서류는 빠짐없이 준비해야 하며, 비자 발급 비용은 현금으로 지불해야 한다.

### 2. 월별 생활비
여행비와 기숙사비를 제외한 생활비는 약 30만원/월 수준이었으며, 전체 지출은 약 100만원/월 내외였다.
마트별 가격은 다음과 같다:
- Lidl: 가장 저렴
- Edeka: 중간
- REWE: 가장 비쌈
기숙사비는 298유로에서 318유로로 인상되었다.

### 3. 현지어 : 영어 비율 (종합 10)
현지인의 약 6~10명 중 대부분이 영어로 의사소통이 가능했다. 실질적인 소통은 대부분 영어로 이뤄졌으며, 기본적인 독일어 인사 정도는 예의 차원에서 사용했다.

### 4. 국제처 프로그램
버디 프로그램을 통해 출국 전부터 연락이 가능했고, 도착 시 짐 옮기기·생필품 구매 등 많은 도움을 받았다.
웰컴데이를 통해 수강신청, 기숙사 안내, 학생증 관련 설명을 들을 수 있었다.
- 개강 전 독일어 수업 제공
- 파티 등은 개별적으로 SNS를 통해 참여

### 5. 기숙사 유무 / 비용 / 거리 / 특이사항
기숙사는 랜덤 배정되며 1인실·2인실 모두 존재했다.
COE 기숙사는 방이 분리된 2인실로 화장실·주방 공용이며, 루프탑·파티룸이 있어 교류가 활발하다.
Pestalozzistraße 기숙사는 1인실이며, 모든 생활 설비가 방 안에 갖춰져 있었다.
- 기숙사비: 298유로 → 318유로
- 기차역 거리: 도보 약 30분 / 버스 약 10분
- 보증금은 귀국 후 2~6개월 내에 분할 환급됨

### 6. 주변 교통 접근성
도시가 작아 도보 이동이 편하고, 학생증으로 버스 무료 이용이 가능했다.
- 기차역: 도보 25~30분 / 버스 10~12분
- Flixbus 정류장: 도보 40분 / 버스 15분
- 공항 없음 → 뉘른베르크 or 뮌헨까지 이동 후 비행기 이용
기차 지연·취소는 잦았지만 대체편 제공이 잘 되어 큰 불편은 없었다.

### 7. 날씨
9월부터 4월까지 머물렀으며, 겨울은 한국보다 덜 추웠지만 건조했다. 패딩, 코트, 목도리 정도는 필수였다.
- 가끔 눈이 내렸고, 해가 잘 뜨지 않음
- 라디에이터로 인해 방이 매우 건조함 → 젖은 수건 활용
- 물은 석회수지만 샤워필터 효과는 미미

### 8. 추가 특이사항

**치안**
도시는 전반적으로 매우 안전했으며, 밤늦게 혼자 다니지만 않으면 큰 문제는 없었다.

**지역 특징**
- 한인마트는 없으며, 소형 아시아마트에서 일부 한국 식품 구매 가능
- 분위기: 낮엔 차분하고 여유로우며, 밤엔 바·클럽으로 활기참
- 축제: 크리스마스 마켓, 옥토버페스트 등 독일 전역의 축제를 현지에서도 즐김

**보험**
TK 사보험 가입, 일부 백신(HPV 등)도 보험처리 가능했다.
병원 예약은 이메일로 가능하며 영어 사용도 문제없었다.

**조언**
하고 싶은 건 다 하고 오라는 마인드로, 걱정보다는 경험을 추천한다. 다양한 국적의 친구들과 교류하며 낭만을 즐기길 바란다는 조언을 남겼다.`,
  data: [
    {
      fieldId: 6,
      fieldName: "예산",
      value: "1,000만원 이상",
      type: "STRING",
    },
    {
      fieldId: 7,
      fieldName: "여학",
      value: "좋음",
      type: "STRING",
    },
    {
      fieldId: 8,
      fieldName: "물가",
      value: "높음",
      type: "STRING",
    },
    {
      fieldId: 9,
      fieldName: "교학생 프로그램",
      value: "프로그램 상세 내용",
      type: "STRING",
    },
  ],
};

/**
 * 도쿄대학 (univId: 2) - 일부 필드 null 테스트
 */
export const mockUniversityTokyo: UniversityDetailResponse = {
  univId: 2,
  name: "University of Tokyo",
  countryCode: "JP",
  countryName: "일본",
  logoUrl: "https://example.com/tokyo-univ-logo.png",
  information: `# University of Tokyo

## About
일본 최고의 명문 대학으로, 도쿄 혼고 캠퍼스에 위치하고 있습니다.

## Key Features
- QS 랭킹 23위
- 우수한 연구 시설
- 다양한 국제 교류 프로그램

## Exchange Student Support
국제교류센터를 통해 교환학생들을 위한 다양한 지원을 제공합니다.`,
  data: [
    {
      fieldId: 6,
      fieldName: "물가지수",
      value: "85",
      type: "NUMBER",
    },
    {
      fieldId: 7,
      fieldName: "QS 랭킹",
      value: "23",
      type: "NUMBER",
    },
    {
      fieldId: 11,
      fieldName: "국제처 프로그램",
      value: "국제교류센터 운영",
      type: "STRING",
    },
    {
      fieldId: 12,
      fieldName: "기숙사",
      value: "캠퍼스 내 기숙사 제공",
      type: "STRING",
    },
    {
      fieldId: 13,
      fieldName: "주변 접근성",
      value: "나리타 공항 60분, 도쿄역 15분",
      type: "STRING",
    },
    {
      fieldId: 14,
      fieldName: "날씨",
      value: "사계절 뚜렷, 여름 습함",
      type: "STRING",
    },
  ],
};

/**
 * 최악의 경우 - 모든 필드 null (univId: 999)
 */
export const mockUniversityMinimal: UniversityDetailResponse = {
  univId: 999,
  name: null,
  countryCode: null,
  countryName: null,
  logoUrl: null,
  information: null,
  data: null,
};

/**
 * 대학 ID별 Mock 데이터 매핑
 */
export const mockUniversities: Record<number, UniversityDetailResponse> = {
  1: mockUniversityUTC,
  2: mockUniversityTokyo,
  999: mockUniversityMinimal,
};
