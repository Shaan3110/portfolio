// Feature: ui-enhancements-v2, Property 5: Delhivery and Salescode entries share identical category structure
// **Validates: Requirements 5.2**

import * as fc from "fast-check";
import { experience } from "@/data/experience";

describe("Property 5: Delhivery and Salescode entries share identical category structure", () => {
  const salescodeEntry = experience.find((e) => e.company === "Salescode.ai");
  const delhiveryEntry = experience.find((e) => e.company === "Delhivery Ltd");

  it("both Salescode.ai and Delhivery Ltd entries exist", () => {
    expect(salescodeEntry).toBeDefined();
    expect(delhiveryEntry).toBeDefined();
  });

  it("both entries have the same set of category titles", () => {
    fc.assert(
      fc.property(
        fc.constant([salescodeEntry!, delhiveryEntry!] as const),
        ([salescode, delhivery]) => {
          const salescodeTitles = salescode.categories
            .map((c) => c.title)
            .sort();
          const delhiveryTitles = delhivery.categories
            .map((c) => c.title)
            .sort();

          expect(salescodeTitles).toEqual(delhiveryTitles);
        }
      ),
      { numRuns: 100 }
    );
  });
});
