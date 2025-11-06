import type { CountryDetailResponse } from "@/types/country";

/**
 * Mock 국가 데이터
 * 국가별 상세 정보 및 대학 목록
 */

/**
 * 미국 (US) Mock 데이터
 */
export const mockCountryUS: CountryDetailResponse = {
  countryCode: "US",
  name: "미국",
  data: [
    {
      fieldId: 1,
      fieldName: "비자 발급 난이도",
      value: null,
      type: "NUMBER",
    },
    {
      fieldId: 2,
      fieldName: "모국어",
      value: null,
      type: "STRING",
    },
    {
      fieldId: 3,
      fieldName: "영어 사용지수",
      value: null,
      type: "NUMBER",
    },
    {
      fieldId: 4,
      fieldName: "대륙",
      value: null,
      type: "STRING",
    },
  ],
  universities: [
    {
      univId: 26,
      nameKo: "Emporia State University",
      nameEn: "Emporia State University",
      logoUrl: null,
    },
    {
      univId: 27,
      nameKo: "University of Missouri Kansas City",
      nameEn: "University of Missouri Kansas City",
      logoUrl: null,
    },
    {
      univId: 28,
      nameKo: "University of Nebraska-Omaha",
      nameEn: "University of Nebraska-Omaha",
      logoUrl: null,
    },
    {
      univId: 53,
      nameKo: "캘리포니아주립대 새크라멘토",
      nameEn: "CSU Sacramento",
      logoUrl: null,
    },
    {
      univId: 54,
      nameKo: "네바다주립대학 라스베가스",
      nameEn: "University of Nevada, Las Vegas",
      logoUrl: null,
    },
    {
      univId: 55,
      nameKo: "캘리포니아주립대 몬트레이베이",
      nameEn: "CSU Monterey Bay",
      logoUrl: null,
    },
    {
      univId: 56,
      nameKo: "캘리포니아주립대 이스트베이",
      nameEn: "CSU Eastbay",
      logoUrl: null,
    },
    {
      univId: 57,
      nameKo: "샌트럴아칸소대학",
      nameEn: "University of Central Arkansas",
      logoUrl: null,
    },
    {
      univId: 58,
      nameKo: "미주리대학",
      nameEn: "University of Missouri, Columbia",
      logoUrl: null,
    },
    {
      univId: 59,
      nameKo: "일리노이공과대학",
      nameEn: "Illinois Institute of Technology",
      logoUrl: null,
    },
    {
      univId: 130,
      nameKo: null,
      nameEn: "Augsburg University",
      logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/Augsburg University.png",
    },
    {
      univId: 131,
      nameKo: null,
      nameEn: "California State University, San Bernardino",
      logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/California State University, San Bernardino.png",
    },
    {
      univId: 132,
      nameKo: null,
      nameEn: "Ferrum College",
      logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/Ferrum College.png",
    },
    {
      univId: 133,
      nameKo: null,
      nameEn: "Johnson & Wales University",
      logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/Johnson & Wales University.png",
    },
    {
      univId: 134,
      nameKo: null,
      nameEn: "New Jersey City University",
      logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/New Jersey City University.png",
    },
    {
      univId: 135,
      nameKo: null,
      nameEn: "San Diego State University",
      logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/San Diego State University.png",
    },
    {
      univId: 136,
      nameKo: null,
      nameEn: "Slippery Rock University",
      logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/Slippery Rock University.png",
    },
    {
      univId: 137,
      nameKo: null,
      nameEn: "Temple University",
      logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/Temple University.png",
    },
    {
      univId: 138,
      nameKo: null,
      nameEn: "University of Central Florida",
      logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/University of Central Florida.png",
    },
    {
      univId: 139,
      nameKo: null,
      nameEn: "University of Hawaii at Manoa",
      logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/University of Hawaii at Manoa.png",
    },
    {
      univId: 140,
      nameKo: null,
      nameEn: "University of Houston",
      logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/University of Houston.png",
    },
    {
      univId: 141,
      nameKo: null,
      nameEn: "University of Nebraska at Kearney",
      logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/University of Nebraska at Kearney.png",
    },
    {
      univId: 142,
      nameKo: null,
      nameEn: "University of Navada",
      logoUrl: "d2kydfinz3830f.cloudfront.net/outgoing_univ_logo/University of Navada.png",
    },
  ],
};

/**
 * 일본 (JP) Mock 데이터
 */
export const mockCountryJP: CountryDetailResponse = {
  countryCode: "JP",
  name: "일본",
  data: [
    {
      fieldId: 1,
      fieldName: "비자 발급 난이도",
      value: 2,
      type: "NUMBER",
    },
    {
      fieldId: 2,
      fieldName: "모국어",
      value: "일본어",
      type: "STRING",
    },
    {
      fieldId: 3,
      fieldName: "영어 사용지수",
      value: 3,
      type: "NUMBER",
    },
    {
      fieldId: 4,
      fieldName: "대륙",
      value: "아시아",
      type: "STRING",
    },
  ],
  universities: [
    {
      univId: 1,
      nameKo: "도쿄대학",
      nameEn: "University of Tokyo",
      logoUrl: "https://example.com/tokyo-univ.png",
    },
    {
      univId: 2,
      nameKo: "와세다대학",
      nameEn: "Waseda University",
      logoUrl: "https://example.com/waseda-univ.png",
    },
    {
      univId: 3,
      nameKo: "교토대학",
      nameEn: "Kyoto University",
      logoUrl: "https://example.com/kyoto-univ.png",
    },
  ],
};

/**
 * 국가 코드별 Mock 데이터 매핑
 */
export const mockCountries: Record<string, CountryDetailResponse> = {
  US: mockCountryUS,
  JP: mockCountryJP,
};
