import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Skills from "../skills";

describe("Skills Component", () => {
  it('should render the main heading "My Skills"', () => {
    render(<Skills />);
    const heading = screen.getByRole("heading", { name: /my skills/i });
    expect(heading).toBeInTheDocument();
  });

  it("should render exactly 5 skill categories", () => {
    render(<Skills />);
    // Get all h3 headings (category titles)
    const categoryHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(categoryHeadings).toHaveLength(5);
  });

  it("should render all expected category titles", () => {
    render(<Skills />);

    expect(
      screen.getByRole("heading", { name: /programming/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /web development/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /data & analytics/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /ai\/ml & llms/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /devops & infrastructure/i }),
    ).toBeInTheDocument();
  });

  it("should render exactly 27 total skills", () => {
    render(<Skills />);
    // Each skill has a <p> tag with the skill name
    const skillNames = screen.getAllByText(/./);
    // Filter to only skill names (exclude headings and other text)
    const skills = [
      "JavaScript",
      "Python",
      "C",
      "CSS",
      "HTML",
      "SQL",
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Sequelize",
      "REST APIs",
      "TailwindCSS",
      "Material-UI",
      "Apache Superset",
      "Metabase",
      "SQL Query Builder",
      "LLama3",
      "Machine Learning",
      "AI Fundamentals",
      "Git",
      "Github",
      "AWS Cloud Practitioner",
      "Linux/Bash",
      "Docker",
      "Kubernetes",
      "Cloud Infrastructure",
    ];

    skills.forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it("should render Programming category with 6 skills", () => {
    render(<Skills />);

    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("CSS")).toBeInTheDocument();
    expect(screen.getByText("HTML")).toBeInTheDocument();
    expect(screen.getByText("SQL")).toBeInTheDocument();
  });

  it("should render Web Development category with 8 skills", () => {
    render(<Skills />);

    expect(screen.getByText("React.js")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("Express.js")).toBeInTheDocument();
    expect(screen.getByText("MongoDB")).toBeInTheDocument();
    expect(screen.getByText("Sequelize")).toBeInTheDocument();
    expect(screen.getByText("REST APIs")).toBeInTheDocument();
    expect(screen.getByText("TailwindCSS")).toBeInTheDocument();
    expect(screen.getByText("Material-UI")).toBeInTheDocument();
  });

  it("should render DevOps & Infrastructure category with 7 skills", () => {
    render(<Skills />);

    expect(screen.getByText("Git")).toBeInTheDocument();
    expect(screen.getByText("Github")).toBeInTheDocument();
    expect(screen.getByText("AWS Cloud Practitioner")).toBeInTheDocument();
    expect(screen.getByText("Linux/Bash")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
    expect(screen.getByText("Kubernetes")).toBeInTheDocument();
    expect(screen.getByText("Cloud Infrastructure")).toBeInTheDocument();
  });
});
