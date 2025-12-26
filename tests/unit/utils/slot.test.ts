import { getChoiceCountDisplay, getSlotCountDisplay, getSlotSafeDefaults } from "@/lib/utils/slot";
import type { Slot } from "@/types/slot";

describe("slot utils", () => {
  it("getSlotSafeDefaults returns safe defaults for null", () => {
    const result = getSlotSafeDefaults(null);
    expect(result.name).toBe("정보 없음");
    expect(result.country).toBe("기타");
    expect(result.slotId).toBe(0);
  });

  it("getSlotSafeDefaults preserves provided values", () => {
    const slot: Slot = {
      slotId: 10,
      name: null,
      country: "한국",
      choiceCount: 3,
      slotCount: "2",
      duration: null,
      logoUrl: null,
      homepageUrl: "https://example.com",
      universityId: 1,
    };

    const result = getSlotSafeDefaults(slot);
    expect(result.name).toBe("정보 없음");
    expect(result.country).toBe("한국");
    expect(result.choiceCount).toBe(3);
    expect(result.homepageUrl).toBe("https://example.com");
  });

  it("getChoiceCountDisplay handles null and numbers", () => {
    expect(getChoiceCountDisplay(null)).toBe("정보 없음");
    expect(getChoiceCountDisplay(0)).toBe("0명");
    expect(getChoiceCountDisplay(12)).toBe("12명");
  });

  it("getSlotCountDisplay handles null and values", () => {
    expect(getSlotCountDisplay(null)).toBe("미정");
    expect(getSlotCountDisplay("미정")).toBe("미정");
    expect(getSlotCountDisplay("2")).toBe("2명");
  });
});
