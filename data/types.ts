export interface NavLink {
  label: string;
  sectionId: string;
}

export interface Skill {
  name: string;
  percentage: number;
  category: string;
}

export interface ExperienceCategory {
  title: string;
  bullets: string[];
}

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  link?: string;
  categories: ExperienceCategory[];
}

export interface EducationEntry {
  course: string;
  platform: string;
  period: string;
  link?: string;
}

export interface Project {
  title: string;
  description: string;
  thumbnailUrl: string;
  githubUrl: string;
  link?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}
