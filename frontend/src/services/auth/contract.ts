export interface IAuthUser {
  id: string;
  auth_user_id: string;
  email: string;
  name: string | null;
  resume_url: string | null;
  phone: string | null;
}

export interface IProfile extends IAuthUser {
  summary: string | null;
  skills: string[];
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  experience: IExperience[];
  projects: IProject[];
  education: IEducation[];
  certifications: string[];
  experience_summary: IExperienceSummary;
}

export interface IExperience {
  role: string;
  company: string;
  type: "full-time" | "internship" | "contract" | string;
  duration: string;
  achievements: string[];
  technologies: string[];
}

export interface IProject {
  name: string;
  description: string;
  technologies: string[];
}

export interface IEducation {
  year: string;
  degree: string;
  institution: string;
}

export interface IExperienceSummary {
  total_experience_years: number;
  fulltime_experience_years: number;
  internship_experience_months: number;
}

export interface IUpdateProfile {
  name?: string;
  resume_url?: string;
  skills?: string[];
}

export interface ICreateProfile {
  authUserId: string;
  email: string;
  name: string | null;
  resumeUrl: string | null;
}
