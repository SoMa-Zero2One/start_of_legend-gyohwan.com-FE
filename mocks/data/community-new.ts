import { CountryApiResponse, UniversityApiResponse } from "@/types/community";

// Mock 데이터: 나라 목록 (API 응답 형식 - 새 메타데이터)
export const mockCountriesApi: CountryApiResponse[] = [
  // 아시아
  {
    countryCode: "JP",
    name: "일본",
    data: [
      { fieldId: 1, fieldName: "대륙", value: "아시아", type: "STRING" },
      { fieldId: 2, fieldName: "비자 발급 특이사항", value: "관광비자 90일", type: "STRING" },
      { fieldId: 3, fieldName: "사용 언어", value: "일본어", type: "STRING" },
      { fieldId: 4, fieldName: "영어 사용 비율", value: "30:70", type: "STRING" },
    ],
  },
  {
    countryCode: "CN",
    name: "중국",
    data: [
      { fieldId: 1, fieldName: "대륙", value: "아시아", type: "STRING" },
      { fieldId: 2, fieldName: "비자 발급 특이사항", value: "학생비자 필요", type: "STRING" },
      { fieldId: 3, fieldName: "사용 언어", value: "중국어", type: "STRING" },
      { fieldId: 4, fieldName: "영어 사용 비율", value: "20:80", type: "STRING" },
    ],
  },

  // 테스트 케이스 1: 모든 필드가 null인 나라 (대륙만 있음)
  {
    countryCode: "XX",
    name: "테스트나라(전체NULL)",
    data: [
      { fieldId: 1, fieldName: "대륙", value: "아시아", type: "STRING" },
      { fieldId: 2, fieldName: "비자 발급 특이사항", value: null, type: "STRING" },
      { fieldId: 3, fieldName: "사용 언어", value: null, type: "STRING" },
      { fieldId: 4, fieldName: "영어 사용 비율", value: null, type: "STRING" },
    ],
  },

  // 테스트 케이스 2: 일부 필드만 null인 나라
  {
    countryCode: "YY",
    name: "테스트나라(일부NULL)",
    data: [
      { fieldId: 1, fieldName: "대륙", value: "유럽", type: "STRING" },
      { fieldId: 2, fieldName: "비자 발급 특이사항", value: "무비자", type: "STRING" },
      { fieldId: 3, fieldName: "사용 언어", value: null, type: "STRING" },
      { fieldId: 4, fieldName: "영어 사용 비율", value: null, type: "STRING" },
    ],
  },
];

// Mock 데이터: 대학 목록 (API 응답 형식 - 새 메타데이터)
export const mockUniversitiesApi: UniversityApiResponse[] = [
  // 일본 대학들
  {
    univId: 1,
    name: "도쿄대학",
    countryName: "일본",
    isFavorite: true,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/University_of_Tokyo.png",
    data: [
      { fieldId: 1, fieldName: "대륙", value: "아시아", type: "STRING" },
      { fieldId: 5, fieldName: "총액", value: "₩15,000,000", type: "STRING" },
      { fieldId: 6, fieldName: "QS 랭킹", value: "28", type: "STRING" },
      { fieldId: 7, fieldName: "영어 사용 비율", value: "50:50", type: "STRING" },
      { fieldId: 8, fieldName: "국제처 프로그램", value: "UTSIP 프로그램", type: "STRING" },
      { fieldId: 9, fieldName: "기숙사", value: "기숙사 제공 (월 30만원, 도보 15분)", type: "STRING" },
      { fieldId: 10, fieldName: "주변 교통 접근성", value: "나리타 공항 1시간, 지하철역 도보 5분", type: "STRING" },
      { fieldId: 11, fieldName: "날씨", value: "사계절 뚜렷, 여름 습함", type: "STRING" },
      { fieldId: 12, fieldName: "치안", value: "매우 안전", type: "STRING" },
    ],
  },
  {
    univId: 2,
    name: "와세다대학",
    countryName: "일본",
    isFavorite: false,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/Waseda_University.png",
    data: [
      { fieldId: 1, fieldName: "대륙", value: "아시아", type: "STRING" },
      { fieldId: 5, fieldName: "총액", value: "₩18,000,000", type: "STRING" },
      { fieldId: 6, fieldName: "QS 랭킹", value: "197", type: "STRING" },
      { fieldId: 7, fieldName: "영어 사용 비율", value: "70:30", type: "STRING" },
      { fieldId: 8, fieldName: "국제처 프로그램", value: "WIT 교환학생 프로그램", type: "STRING" },
      { fieldId: 9, fieldName: "기숙사", value: "기숙사 신청 가능 (월 40만원, 도보 10분)", type: "STRING" },
      { fieldId: 10, fieldName: "주변 교통 접근성", value: "나리타 공항 1시간, JR역 도보 3분", type: "STRING" },
      { fieldId: 11, fieldName: "날씨", value: "사계절 뚜렷", type: "STRING" },
      { fieldId: 12, fieldName: "치안", value: "안전", type: "STRING" },
    ],
  },

  // 테스트 케이스 1: 나라를 제외한 모든 필드가 null인 대학
  {
    univId: 9999,
    name: "테스트대학(전체NULL)",
    countryName: "일본",
    isFavorite: false,
    logoUrl: null,
    data: [
      { fieldId: 1, fieldName: "대륙", value: "아시아", type: "STRING" },
      { fieldId: 5, fieldName: "총액", value: null, type: "STRING" },
      { fieldId: 6, fieldName: "QS 랭킹", value: null, type: "STRING" },
      { fieldId: 7, fieldName: "영어 사용 비율", value: null, type: "STRING" },
      { fieldId: 8, fieldName: "국제처 프로그램", value: null, type: "STRING" },
      { fieldId: 9, fieldName: "기숙사", value: null, type: "STRING" },
      { fieldId: 10, fieldName: "주변 교통 접근성", value: null, type: "STRING" },
      { fieldId: 11, fieldName: "날씨", value: null, type: "STRING" },
      { fieldId: 12, fieldName: "치안", value: null, type: "STRING" },
    ],
  },

  // 테스트 케이스 2: 일부 필드만 null인 대학
  {
    univId: 9998,
    name: "테스트대학(일부NULL)",
    countryName: "프랑스",
    isFavorite: false,
    logoUrl: null,
    data: [
      { fieldId: 1, fieldName: "대륙", value: "유럽", type: "STRING" },
      { fieldId: 5, fieldName: "총액", value: "₩20,000,000", type: "STRING" },
      { fieldId: 6, fieldName: "QS 랭킹", value: null, type: "STRING" },
      { fieldId: 7, fieldName: "영어 사용 비율", value: "60:40", type: "STRING" },
      { fieldId: 8, fieldName: "국제처 프로그램", value: null, type: "STRING" },
      { fieldId: 9, fieldName: "기숙사", value: "기숙사 없음", type: "STRING" },
      { fieldId: 10, fieldName: "주변 교통 접근성", value: null, type: "STRING" },
      { fieldId: 11, fieldName: "날씨", value: "사계절 뚜렷", type: "STRING" },
      { fieldId: 12, fieldName: "치안", value: "보통", type: "STRING" },
    ],
  },
];
