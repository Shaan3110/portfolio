// Feature: ui-enhancements-v2, Property 9: All skills have valid categories
// **Validates: Requirements 8.2**

import * as fc from "fast-check";
import { skills } from "@/data/skills";

const VALID_CATEGORIES = [
  "Automation Frameworks",
  "BDD Frameworks",
  "Programming Languages",
  "Testing Tools",
  "CI/CD & Management",
] as const;

describe("Property 9: All skills have valid categories", () => {
  it("every skill's category is one of the four allowed strings", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...skills),
        (skill) => {
          expect(VALID_CATEGORIES).toContain(skill.category);
        }
      ),
      { numRuns: 100 }
    );
  });
});
