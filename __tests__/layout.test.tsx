import { metadata } from "@/app/layout";

describe("RootLayout metadata", () => {
  it("includes a title with Suchintan's name and role", () => {
    expect(metadata.title).toBeDefined();
    expect(String(metadata.title)).toContain("Suchintan");
    expect(String(metadata.title)).toContain("Software Test Engineer");
  });

  it("includes a description mentioning testing expertise", () => {
    expect(metadata.description).toBeDefined();
    expect(metadata.description).toContain("manual and automation testing");
  });

  it("includes SEO keywords related to testing", () => {
    const keywords = metadata.keywords as string[];
    expect(keywords).toBeDefined();
    expect(keywords.length).toBeGreaterThan(0);
    expect(keywords).toContain("Selenium");
    expect(keywords).toContain("Playwright");
    expect(keywords).toContain("Manual Testing");
    expect(keywords).toContain("Automation Testing");
  });
});
