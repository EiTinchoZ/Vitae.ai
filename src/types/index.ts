// Types para el portfolio de Martín Bundy

export interface PersonalInfo {
  name: string;
  fullName: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
}

export interface Skill {
  name: string;
  category: 'ai' | 'programming' | 'industrial' | 'technology';
}

export interface Education {
  id: string;
  title: string;
  institution: string;
  startYear: number | null;
  endYear: number | string;
  startDate?: string;
  endDate?: string;
  status: 'completed' | 'in_progress';
  description?: string;
  qaNotes?: string;
}

export interface Certificate {
  id: string;
  name: string;
  institution: string;
  period: string;
  status: 'completed' | 'in_progress';
  description: string;
  category: 'master' | 'specialization' | 'technical' | 'languages' | 'programming';
  group?: string;
  module?: string;
  file?: string;
  thumbnail?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startPeriod: string;
  endPeriod: string;
  duration?: string;
  responsibilities: string[];
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  type: string;
  event?: string;
  year: number;
  result?: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  technologies: string[];
  impact?: string;
  githubUrl?: string;
  demoUrl?: string;
  images?: string[];
  isHighlighted?: boolean;
}

export interface Language {
  id: string;
  name: string;
  level: string;
  certification?: string;
  description: string;
}

export interface AboutContent {
  quote: string;
  specialties: string[];
  image?: string;
  imageAlt?: string;
  highlights: {
    educationValue: string;
    specializationValue: string;
    locationValue: string;
    languagesValue: string;
  };
}

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  stargazersCount: number;
  forksCount: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  languages?: Record<string, number>;
}

export interface CVData {
  personal: PersonalInfo;
  profile: string;
  about: AboutContent;
  skills: Skill[];
  education: Education[];
  certificates: Certificate[];
  experience: Experience[];
  projects: Project[];
  languages: Language[];
}
