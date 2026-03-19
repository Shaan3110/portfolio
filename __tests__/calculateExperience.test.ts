import { calculateExperience } from "@/utils/calculateExperience";

describe("calculateExperience", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns a string with exactly one decimal place", () => {
    jest.setSystemTime(new Date(2025, 0, 15)); // Jan 15, 2025
    const result = calculateExperience(new Date(2022, 7)); // Aug 2022
    expect(result).toMatch(/^\d+\.\d$/);
  });

  it("computes correct years for a known date range", () => {
    // Aug 2022 to Aug 2024 = exactly 24 months = 2.0 years
    jest.setSystemTime(new Date(2024, 7, 1)); // Aug 1, 2024
    const result = calculateExperience(new Date(2022, 7, 1)); // Aug 1, 2022
    expect(result).toBe("2.0");
  });

  it("computes correct fractional years", () => {
    // Aug 2022 to Feb 2025 = 30 months = 2.5 years
    jest.setSystemTime(new Date(2025, 1, 1)); // Feb 1, 2025
    const result = calculateExperience(new Date(2022, 7, 1)); // Aug 1, 2022
    expect(result).toBe("2.5");
  });

  it("returns '0.0' when start date equals current date", () => {
    jest.setSystemTime(new Date(2024, 3, 10)); // Apr 10, 2024
    const result = calculateExperience(new Date(2024, 3, 10));
    expect(result).toBe("0.0");
  });

  it("computes correctly for a single month difference", () => {
    // 1 month = 1/12 ≈ 0.0833... → "0.1"
    jest.setSystemTime(new Date(2023, 1, 1)); // Feb 2023
    const result = calculateExperience(new Date(2023, 0, 1)); // Jan 2023
    expect(result).toBe("0.1");
  });
});
