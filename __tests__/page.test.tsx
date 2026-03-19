import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/app/page";

// Mock framer-motion with a Proxy so all motion.* elements render as plain HTML
jest.mock("framer-motion", () => {
  const filterMotionProps = (props: Record<string, unknown>) =>
    Object.fromEntries(
      Object.entries(props).filter(
        ([k]) =>
          ![
            "initial",
            "animate",
            "exit",
            "transition",
            "whileHover",
            "whileInView",
            "whileTap",
            "variants",
            "viewport",
            "layout",
            "layoutId",
          ].includes(k)
      )
    );

  const motion = new Proxy(
    {},
    {
      get: (_target, prop: string) =>
        React.forwardRef(({ children, ...props }: any, ref: any) =>
          React.createElement(prop, { ...filterMotionProps(props), ref }, children)
        ),
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useInView: () => true,
  };
});

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, ...rest } = props;
    return <img {...rest} />;
  },
}));

function renderHome() {
  return render(
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
}

describe("Home page", () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => store[key] ?? null);
    jest.spyOn(Storage.prototype, "setItem").mockImplementation((key, value) => {
      store[key] = value;
    });
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders without errors", () => {
    renderHome();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("contains a section with id 'home'", () => {
    const { container } = renderHome();
    expect(container.querySelector("#home")).toBeInTheDocument();
  });

  it("contains all section IDs for scroll navigation", () => {
    const { container } = renderHome();
    const sectionIds = ["home", "about", "skills", "experience", "education", "projects"];
    sectionIds.forEach((id) => {
      expect(container.querySelector(`#${id}`)).toBeInTheDocument();
    });
  });

  it("renders the navbar", () => {
    renderHome();
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
  });

  it("renders the footer", () => {
    renderHome();
    expect(screen.getByLabelText("Footer")).toBeInTheDocument();
  });
});
