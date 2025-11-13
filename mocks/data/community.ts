import { CountryApiResponse, UniversityApiResponse } from "@/types/community";

// Mock 데이터: 나라 목록 (API 응답 형식)
export const mockCountriesApi: CountryApiResponse[] = [
  // 아시아
  {
    countryCode: "JP",
    name: "일본",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "1", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "일본어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "5", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "50", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
    ],
  },
  {
    countryCode: "CN",
    name: "중국",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "3", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "중국어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "4", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "40", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
    ],
  },
  {
    countryCode: "TW",
    name: "대만",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "1", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "중국어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "5", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "45", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
    ],
  },
  {
    countryCode: "HK",
    name: "홍콩",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "1", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "영어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "5", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "85", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
    ],
  },
  {
    countryCode: "SG",
    name: "싱가포르",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "1", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "영어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "5", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "95", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
    ],
  },
  {
    countryCode: "TH",
    name: "태국",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "1", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "태국어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "3", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "45", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
    ],
  },
  {
    countryCode: "VN",
    name: "베트남",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "1", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "베트남어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "3", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "40", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
    ],
  },
  {
    countryCode: "MY",
    name: "말레이시아",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "1", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "영어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "4", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "70", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
    ],
  },
  {
    countryCode: "ID",
    name: "인도네시아",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "1", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "인도네시아어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "3", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "50", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
    ],
  },
  {
    countryCode: "PH",
    name: "필리핀",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "1", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "영어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "2", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "92", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
    ],
  },

  // 유럽
  {
    countryCode: "GB",
    name: "영국",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "5", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "영어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "4", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "100", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },
  {
    countryCode: "FR",
    name: "프랑스",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "3", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "프랑스어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "3", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "60", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },
  {
    countryCode: "DE",
    name: "독일",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "3", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "독일어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "5", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "65", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },
  {
    countryCode: "IT",
    name: "이탈리아",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "3", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "이탈리아어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "3", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "55", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },
  {
    countryCode: "ES",
    name: "스페인",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "3", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "스페인어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "4", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "50", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },
  {
    countryCode: "NL",
    name: "네덜란드",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "3", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "네덜란드어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "5", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "90", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },
  {
    countryCode: "CH",
    name: "스위스",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "5", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "독일어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "5", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "65", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },
  {
    countryCode: "SE",
    name: "스웨덴",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "3", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "스웨덴어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "5", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "90", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },
  {
    countryCode: "PL",
    name: "폴란드",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "1", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "폴란드어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "4", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "60", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },
  {
    countryCode: "CZ",
    name: "체코",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "1", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "체코어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "4", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "55", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },

  // 북아메리카
  {
    countryCode: "US",
    name: "미국",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "5", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "영어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "3", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "100", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "북아메리카", type: "STRING" },
    ],
  },
  {
    countryCode: "CA",
    name: "캐나다",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "3", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "영어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "5", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "100", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "북아메리카", type: "STRING" },
    ],
  },
  {
    countryCode: "MX",
    name: "멕시코",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "1", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "스페인어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "2", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "45", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "북아메리카", type: "STRING" },
    ],
  },

  // 오세아니아
  {
    countryCode: "AU",
    name: "호주",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "5", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "영어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "5", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "100", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "오세아니아", type: "STRING" },
    ],
  },
  {
    countryCode: "NZ",
    name: "뉴질랜드",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "3", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: "영어", type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "5", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: "100", type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "오세아니아", type: "STRING" },
    ],
  },

  // 테스트 케이스 1: 모든 필드가 null인 나라 (대륙만 있음)
  {
    countryCode: "XX",
    name: "테스트나라(전체NULL)",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: null, type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: null, type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: null, type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: null, type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
    ],
  },

  // 테스트 케이스 2: 일부 필드만 null인 나라
  {
    countryCode: "YY",
    name: "테스트나라(일부NULL)",
    data: [
      { fieldId: 1, fieldName: "비자 발급 난이도", value: "2", type: "LEVEL" },
      { fieldId: 2, fieldName: "사용 언어", value: null, type: "STRING" },
      { fieldId: 3, fieldName: "치안", value: "4", type: "LEVEL" },
      { fieldId: 4, fieldName: "영어 사용지수", value: null, type: "NUMBER" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },
];

// Mock 데이터: 대학 목록 (API 응답 형식)
export const mockUniversitiesApi: UniversityApiResponse[] = [
  // 일본 대학들
  {
    univId: 1,
    name: "도쿄대학",
    countryName: "일본",
    isFavorite: true,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/Thammasat University.png",
    data: [
      { fieldId: 6, fieldName: "물가지수", value: "85", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: "28", type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "50", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: "PEAK 프로그램, 교환학생 프로그램 운영", type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: "기숙사 제공 (월 15만원)", type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: "나리타 공항 60분, 지하철역 도보 5분", type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "사계절 뚜렷, 여름 습함", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
    ],
  },
  {
    univId: 2,
    name: "교토대학",
    countryName: "일본",
    isFavorite: false,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/University of Malaya (UM).png",
    data: [
      { fieldId: 6, fieldName: "물가지수", value: "80", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: "36", type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "45", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: "Kyoto iUP 프로그램", type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: "기숙사 제공 (월 14만원)", type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: "오사카 공항 90분, 지하철역 도보 10분", type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "사계절 뚜렷, 겨울 춥지 않음", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
    ],
  },
  {
    univId: 3,
    name: "와세다대학",
    countryName: "일본",
    isFavorite: true,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/KIMEP University.png",
    data: [
      { fieldId: 6, fieldName: "물가지수", value: "90", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: "199", type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "55", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: null, type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: null, type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: "나리타 공항 70분, 지하철역 도보 3분", type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "도쿄와 유사, 사계절 뚜렷", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
    ],
  },

  // 미국 대학들
  {
    univId: 4,
    name: "하버드대학교",
    countryName: "미국",
    isFavorite: true,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/KIMEP University.png",
    data: [
      { fieldId: 6, fieldName: "물가지수", value: "95", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: "5", type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "100", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: "Harvard International Office 운영", type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: "기숙사 제공 (월 40만원)", type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: "보스턴 로건 공항 30분, 지하철역 도보 15분", type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "겨울 매우 춥고 눈 많음, 여름 온화", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "북아메리카", type: "STRING" },
    ],
  },
  {
    univId: 5,
    name: "MIT",
    countryName: "미국",
    isFavorite: false,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/University of Malaya (UM).png",
    data: [
      { fieldId: 6, fieldName: "물가지수", value: "95", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: "1", type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "100", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: "MIT International Students Office", type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: "기숙사 제공 (월 45만원)", type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: "보스턴 로건 공항 25분, 지하철역 도보 5분", type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "겨울 매우 춥고 눈 많음", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "북아메리카", type: "STRING" },
    ],
  },
  {
    univId: 6,
    name: "UC 버클리",
    countryName: "미국",
    isFavorite: false,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/University of Malaya (UM).png",
    data: [
      { fieldId: 6, fieldName: "물가지수", value: "100", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: "27", type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "100", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: null, type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: "기숙사 제공 (월 50만원)", type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: "샌프란시스코 공항 60분, BART역 도보 10분", type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "연중 온화, 여름 건조", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "북아메리카", type: "STRING" },
    ],
  },

  // 영국 대학들
  {
    univId: 7,
    name: "옥스퍼드대학교",
    countryName: "영국",
    isFavorite: true,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/KIMEP University.png",
    data: [
      { fieldId: 6, fieldName: "물가지수", value: "88", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: "3", type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "100", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: "Oxford International Office", type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: "컬리지별 기숙사 제공 (월 35만원)", type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: "히드로 공항 90분, 기차역 도보 20분", type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "연중 비 자주 옴, 겨울 춥지 않음", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },
  {
    univId: 8,
    name: "케임브리지대학교",
    countryName: "영국",
    isFavorite: false,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/University of Malaya (UM).png",
    data: [
      { fieldId: 6, fieldName: "물가지수", value: "85", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: "2", type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "100", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: null, type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: "컬리지별 기숙사 제공 (월 32만원)", type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: "히드로 공항 120분, 기차역 도보 15분", type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "비 자주 옴, 여름 온화", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },

  // 캐나다 대학들
  {
    univId: 9,
    name: "토론토대학교",
    countryName: "캐나다",
    isFavorite: false,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/University of Malaya (UM).png",
    data: [
      { fieldId: 6, fieldName: "물가지수", value: "82", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: "21", type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "100", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: "Centre for International Experience", type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: "기숙사 제공 (월 30만원)", type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: "토론토 피어슨 공항 40분, 지하철역 도보 5분", type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "겨울 매우 춥고 눈 많음, 여름 온화", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "북아메리카", type: "STRING" },
    ],
  },
  {
    univId: 10,
    name: "UBC",
    countryName: "캐나다",
    isFavorite: true,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/KIMEP University.png",
    data: [
      { fieldId: 6, fieldName: "물가지수", value: "85", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: "34", type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "100", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: null, type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: "기숙사 제공 (월 28만원)", type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: "밴쿠버 공항 40분, 버스 정류장 도보 3분", type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "겨울 비 많음, 여름 온화하고 쾌적", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "북아메리카", type: "STRING" },
    ],
  },

  // 호주 대학들
  {
    univId: 11,
    name: "멜버른대학교",
    countryName: "호주",
    isFavorite: false,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/University of Malaya (UM).png",
    data: [
      { fieldId: 6, fieldName: "물가지수", value: "92", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: "14", type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "100", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: "Melbourne Global Mobility", type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: "기숙사 제공 (월 35만원)", type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: "멜버른 공항 30분, 트램역 도보 5분", type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "사계절이 하루에, 변덕스러움", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "오세아니아", type: "STRING" },
    ],
  },
  {
    univId: 12,
    name: "시드니대학교",
    countryName: "호주",
    isFavorite: false,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/University of Malaya (UM).png",
    data: [
      { fieldId: 6, fieldName: "물가지수", value: "95", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: "19", type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "100", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: null, type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: null, type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: "시드니 공항 25분, 버스 정류장 도보 2분", type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "연중 온화, 여름 매우 더움", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "오세아니아", type: "STRING" },
    ],
  },

  // 독일 대학들
  {
    univId: 13,
    name: "뮌헨공대",
    countryName: "독일",
    isFavorite: false,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/University of Malaya (UM).png",
    data: [
      { fieldId: 6, fieldName: "물가지수", value: "78", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: "37", type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "65", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: "TUM Global & Alumni Office", type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: "학생기숙사 신청 가능 (월 20만원)", type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: "뮌헨 공항 45분, U-Bahn역 도보 10분", type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "겨울 춥고 눈 옴, 여름 온화", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },
  {
    univId: 14,
    name: "하이델베르크대학교",
    countryName: "독일",
    isFavorite: true,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/KIMEP University.png",
    data: [
      { fieldId: 6, fieldName: "물가지수", value: "75", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: "87", type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "60", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: null, type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: "학생기숙사 신청 가능 (월 18만원)", type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: "프랑크푸르트 공항 90분, 기차역 도보 20분", type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "겨울 춥지 않음, 사계절 뚜렷", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },

  // 싱가포르 대학들
  {
    univId: 15,
    name: "싱가포르국립대학교",
    countryName: "싱가포르",
    isFavorite: true,
    logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/KIMEP University.png",
    data: [
      { fieldId: 6, fieldName: "물가지수", value: "98", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: "8", type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "95", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: "NUS Overseas Colleges 프로그램", type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: "기숙사 제공 (월 25만원)", type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: "창이 공항 30분, MRT역 도보 5분", type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "연중 더움, 비 자주 옴", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
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
      { fieldId: 6, fieldName: "물가지수", value: null, type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: null, type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: null, type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: null, type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: null, type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: null, type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: null, type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "아시아", type: "STRING" },
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
      { fieldId: 6, fieldName: "물가지수", value: "80", type: "NUMBER" },
      { fieldId: 7, fieldName: "QS 랭킹", value: null, type: "NUMBER" },
      { fieldId: 8, fieldName: "영어 사용지수", value: "60", type: "NUMBER" },
      { fieldId: 9, fieldName: "국제처 프로그램", value: null, type: "STRING" },
      { fieldId: 10, fieldName: "기숙사", value: "기숙사 없음", type: "STRING" },
      { fieldId: 11, fieldName: "주변 접근성", value: null, type: "STRING" },
      { fieldId: 12, fieldName: "날씨", value: "사계절 뚜렷", type: "STRING" },
      { fieldId: 5, fieldName: "대륙", value: "유럽", type: "STRING" },
    ],
  },
];
