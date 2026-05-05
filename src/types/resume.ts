export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  location: string;
  linkedin?: string;
  website?: string;
  github?: string;
  summary: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade?: string;
  description: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  role?: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  ongoing?: boolean;
  description: string;
  link?: string;
}

export interface Skill {
  id: string;
  category: string;
  items: string;
}

export interface AdditionalSection {
  id: string;
  title: string;
  description: string;
}

export interface ResumeSettings {
  themeColor: string;
  fontFamily: string;
  fontSize: 'compact' | 'standard' | 'large';
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
  skills: Skill[];
  additionalSections: AdditionalSection[];
  settings: ResumeSettings;
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    phoneCountryCode: '',
    location: '',
    linkedin: '',
    website: '',
    github: '',
    summary: '',
  },
  education: [],
  workExperience: [],
  projects: [],
  skills: [],
  additionalSections: [],
  settings: {
    themeColor: '#1f2937',
    fontFamily: 'Open Sans',
    fontSize: 'standard',
  },
};
