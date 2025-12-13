import type { Slot } from "@/types/slot";
import { mockApplications } from "./applications";
import { mockGpas, mockLanguages } from "./users";

/**
 * Mock 슬롯 (교환 대학) 데이터
 */
export const mockSlots: Slot[] = [
  {
    slotId: 1,
    name: "UC Berkeley",
    country: "미국",
    logoUrl: "https://example.com/berkeley.png",
    choiceCount: 0,
    slotCount: "2",
    duration: "1학기",
    homepageUrl: "https://www.berkeley.edu/",
    universityId: 1,
  },
  {
    slotId: 2,
    name: "UCLA",
    country: "미국",
    logoUrl: "https://example.com/ucla.png",
    choiceCount: 0,
    slotCount: "3",
    duration: "1학기",
    homepageUrl: "https://www.ucla.edu/",
    universityId: 2,
  },
  {
    slotId: 3,
    name: "University of Tokyo",
    country: "일본",
    logoUrl: "https://example.com/tokyo.png",
    choiceCount: 0,
    slotCount: "2",
    duration: "1학기",
    homepageUrl: "https://www.u-tokyo.ac.jp/en/",
    universityId: 3,
  },
  {
    slotId: 4,
    name: "Oxford University",
    country: "영국",
    logoUrl: "https://example.com/oxford.png",
    choiceCount: 0,
    slotCount: "1",
    duration: "1년",
    homepageUrl: "https://www.ox.ac.uk/",
    universityId: 4,
  },
  {
    slotId: 5,
    name: "National University of Singapore",
    country: "싱가포르",
    logoUrl: "https://example.com/nus.png",
    choiceCount: 0,
    slotCount: "4",
    duration: "1학기",
    homepageUrl: "https://www.nus.edu.sg/",
    universityId: 5,
  },
  {
    slotId: 6,
    name: "ETH Zurich",
    country: "스위스",
    logoUrl: "https://example.com/eth.png",
    choiceCount: 0,
    slotCount: "2",
    duration: "미정",
    homepageUrl: null,
    universityId: null,
  },
  {
    slotId: 7,
    name: "McGill University",
    country: "캐나다",
    logoUrl: "https://example.com/mcgill.png",
    choiceCount: 0,
    slotCount: "2",
    duration: "1학기",
    homepageUrl: "https://www.mcgill.ca/",
    universityId: 6,
  },
  {
    slotId: 8,
    name: "Lund University",
    country: "스웨덴",
    logoUrl: "https://example.com/lund.png",
    choiceCount: 0,
    slotCount: "미정",
    duration: "1년",
    homepageUrl: "https://www.lunduniversity.lu.se/",
    universityId: null,
  },
  {
    slotId: 9,
    name: "University of Sydney",
    country: "호주",
    logoUrl: "https://example.com/sydney.png",
    choiceCount: 0,
    slotCount: "2",
    duration: "1학기",
    homepageUrl: "https://www.sydney.edu.au/",
    universityId: null,
  },
  {
    slotId: 10,
    name: "KU Leuven",
    country: "벨기에",
    logoUrl: "https://example.com/leuven.png",
    choiceCount: 0,
    slotCount: "1",
    duration: "1학기",
    homepageUrl: "https://www.kuleuven.be/",
    universityId: null,
  },
  {
    slotId: 11,
    name: "University of Granada",
    country: "스페인",
    logoUrl: "https://example.com/granada.png",
    choiceCount: 0,
    slotCount: "미정",
    duration: "1학기",
    homepageUrl: "https://www.ugr.es/",
    universityId: null,
  },
];

export function findSlotById(slotId: number): Slot | undefined {
  return mockSlots.find((s) => s.slotId === slotId);
}

export const mockSeasonSlots: Record<number, number[]> = {
  1: [1, 2, 3, 4],
  2: [5, 6],
  3: [7, 8, 9, 10, 11],
  4: [],
  5: [],
};

export function findSeasonIdBySlotId(slotId: number): number | null {
  for (const [seasonId, slots] of Object.entries(mockSeasonSlots)) {
    if (slots.includes(slotId)) {
      return Number(seasonId);
    }
  }
  return null;
}

export interface SlotApplicant {
  applicationId: number;
  nickname: string;
  choice: number;
  gpaScore: number | null;
  gpaCriteria: number | null;
  languageTest: string | null;
  languageGrade: string | null;
  languageScore: string | null;
  extraScore: number | null;
  score: number | null;
  etc: string;
}

export function getSlotChoiceCount(slotId: number): number {
  return mockApplications.reduce((acc, application) => {
    return acc + (application.choices.some((choice) => choice.slotId === slotId) ? 1 : 0);
  }, 0);
}

export function getSlotApplicants(slotId: number): SlotApplicant[] {
  const applicants = mockApplications.filter((application) =>
    application.choices.some((choice) => choice.slotId === slotId)
  );

  return applicants
    .map((application) => {
      const choiceInfo = application.choices.find((choice) => choice.slotId === slotId)!;
      const gpa = (mockGpas[application.userId] || []).find((g) => g.gpaId === application.gpaId);
      const language = (mockLanguages[application.userId] || []).find(
        (l) => l.languageId === application.languageId
      );

      const gpaScore = gpa?.score ?? null;
      const gpaCriteria = gpa ? Number(gpa.criteria) : null;
      const baseScore = gpaScore !== null && gpaCriteria ? (gpaScore / gpaCriteria) * 80 : null;
      const combinedScore =
        baseScore !== null ? Math.round((baseScore + (application.extraScore ?? 0)) * 10) / 10 : null;

      return {
        applicationId: application.applicationId,
        nickname: application.nickname,
        choice: choiceInfo.choice,
        gpaScore,
        gpaCriteria,
        languageTest: language?.testType ?? null,
        languageGrade: language?.grade ?? null,
        languageScore: language?.score ?? null,
        extraScore: application.extraScore ?? null,
        score: combinedScore,
        etc: "",
      };
    })
    .sort((a, b) => {
      if (a.choice !== b.choice) {
        return a.choice - b.choice;
      }
      return a.applicationId - b.applicationId;
    });
}
