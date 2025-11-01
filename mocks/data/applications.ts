/**
 * Mock 지원서 데이터
 */

export interface MockApplication {
  applicationId: number;
  seasonId: number;
  userId: number;
  nickname: string;
  gpaId: number;
  languageId: number;
  extraScore: number;
  choices: MockChoice[];
  modifyCount: number; // 수정 가능 횟수
}

export interface MockChoice {
  choice: number; // 1지망, 2지망, ...
  slotId: number;
}

/**
 * 전체 지원서 목록
 */
export const mockApplications: MockApplication[] = [
  {
    applicationId: 1,
    seasonId: 3,
    userId: 1,
    nickname: "열정적인펭귄",
    gpaId: 1,
    languageId: 1,
    extraScore: 1.5,
    choices: [
      { choice: 1, slotId: 2 },
      { choice: 2, slotId: 4 },
      { choice: 3, slotId: 6 },
    ],
    modifyCount: 3,
  },
  {
    applicationId: 2,
    seasonId: 1,
    userId: 3,
    nickname: "카카오유저",
    gpaId: 4,
    languageId: 4,
    extraScore: 0,
    choices: [
      { choice: 1, slotId: 1 },
      { choice: 2, slotId: 2 },
    ],
    modifyCount: 3,
  },
];

/**
 * 유저 ID와 시즌 ID로 지원서 찾기
 */
export function findApplicationByUserAndSeason(userId: number, seasonId: number): MockApplication | undefined {
  return mockApplications.find((app) => app.userId === userId && app.seasonId === seasonId);
}

/**
 * 지원서 ID로 지원서 찾기
 */
export function findApplicationById(applicationId: number): MockApplication | undefined {
  return mockApplications.find((app) => app.applicationId === applicationId);
}

/**
 * 지원서 추가 (새로운 지원)
 */
export function addApplication(
  userId: number,
  seasonId: number,
  gpaId: number,
  languageId: number,
  extraScore: number,
  choices: MockChoice[]
): MockApplication {
  const newApplication: MockApplication = {
    applicationId: mockApplications.length + 1,
    seasonId,
    userId,
    nickname: generateNickname(),
    gpaId,
    languageId,
    extraScore,
    choices,
    modifyCount: 3,
  };
  mockApplications.push(newApplication);
  return newApplication;
}

/**
 * 지원서 수정
 */
export function updateApplication(applicationId: number, choices: MockChoice[]): MockApplication | null {
  const app = findApplicationById(applicationId);
  if (!app) return null;
  if (app.modifyCount <= 0) return null; // 수정 횟수 초과

  app.choices = choices;
  app.modifyCount -= 1;
  return app;
}

/**
 * 랜덤 닉네임 생성 (간단한 버전)
 */
function generateNickname(): string {
  const adjectives = ["열정적인", "성실한", "똑똑한", "용감한", "부지런한", "친절한", "귀여운", "강인한"];
  const animals = ["펭귄", "사자", "여우", "독수리", "토끼", "호랑이", "판다", "코알라"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return adj + animal;
}
