// src/types/index.ts

export interface Skill {
  name: string;
  count: number;
  percentage: number;
}

export interface SalaryRange {
  avg_min: number;
  avg_max: number;
  currency: string;
}

export interface CategoryData {
  job_count: number;
  salary: SalaryRange;
  top_hard_skills: Skill[];
  top_soft_skills: string[]; // Note: Your JSON has this as a string list
  top_technical_context: Skill[];
}

export interface GapReport {
  generated_at: string;
  total_jobs_analyzed: number;
  categories: Record<string, CategoryData>; // "Backend": {...}, "Frontend": {...}
}