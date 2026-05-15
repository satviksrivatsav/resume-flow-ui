export interface Website {
  label: string;
  href: string;
}

export interface CustomField {
  id: string;
  icon: string;
  text: string;
  link: string;
}

export interface Picture {
  url: string;
  size: number;
  aspectRatio: number;
  borderRadius: number;
  borderColor: string;
  borderWidth: number;
  shadowColor: string;
  shadowWidth: number;
}

export interface Basics {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  url: Website;
  customFields: CustomField[];
}

export interface Summary {
  visible: boolean;
  content: string;
}

export interface SectionBase {
  name: string;
  visible: boolean;
  columns: number;
  separate: boolean;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  area: string;
  grade: string;
  location: string;
  period: string;
  website: Website;
  description: string;
  visible: boolean;
}

export interface ExperienceRole {
  id: string;
  position: string;
  period: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  period: string;
  website: Website;
  description: string;
  roles: ExperienceRole[];
  visible: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  period: string;
  website: Website;
  keywords: string[];
  visible: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  description: string;
  level: number;
  keywords: string[];
  visible: boolean;
}

export interface ProfileItem {
  id: string;
  network: string;
  username: string;
  icon: string;
  website: Website;
  visible: boolean;
}

export interface LanguageItem {
  id: string;
  name: string;
  description: string;
  level: number;
  visible: boolean;
}

export interface InterestItem {
  id: string;
  name: string;
  keywords: string[];
  visible: boolean;
}

export interface AwardItem {
  id: string;
  title: string;
  awarder: string;
  date: string;
  description: string;
  visible: boolean;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
  website: Website;
  visible: boolean;
}

export interface PublicationItem {
  id: string;
  name: string;
  publisher: string;
  date: string;
  description: string;
  website: Website;
  visible: boolean;
}

export interface VolunteerItem {
  id: string;
  organization: string;
  position: string;
  location: string;
  period: string;
  website: Website;
  description: string;
  visible: boolean;
}

export interface ReferenceItem {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  description: string;
  visible: boolean;
}

export interface Section<T> extends SectionBase {
  items: T[];
}

export interface Sections {
  profiles: Section<ProfileItem>;
  experience: Section<ExperienceItem>;
  education: Section<EducationItem>;
  projects: Section<ProjectItem>;
  skills: Section<SkillItem>;
  languages: Section<LanguageItem>;
  interests: Section<InterestItem>;
  awards: Section<AwardItem>;
  certifications: Section<CertificationItem>;
  publications: Section<PublicationItem>;
  volunteer: Section<VolunteerItem>;
  references: Section<ReferenceItem>;
}

export interface CustomSection extends SectionBase {
  id: string;
  items: any[];
}

export const DEFAULT_SECTION_ORDER: string[] = [
  'experience',
  'summary',
  'education',
  'projects',
  'skills',
  'profiles',
  'languages',
  'interests',
  'awards',
  'certifications',
  'publications',
  'volunteer',
  'references',
];

export interface ResumeMetadata {
  template: string;
  layout: {
    pages: {
      main: string[];
      sidebar: string[];
    }[];
  };
  typography: {
    fontFamily: string;
    fontSize: number;
  };
  theme: {
    primary: string;
  };
  sectionOrder?: string[];
}

export interface ResumeData {
  id?: string;
  name?: string;
  picture: Picture;
  basics: Basics;
  summary: Summary;
  sections: Sections;
  customSections: CustomSection[];
  metadata: ResumeMetadata;
}

export const defaultResumeData: ResumeData = {
  picture: {
    url: '',
    size: 64,
    aspectRatio: 1,
    borderRadius: 0,
    borderColor: '#000000',
    borderWidth: 0,
    shadowColor: '#000000',
    shadowWidth: 0,
  },
  basics: {
    name: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    url: { label: '', href: '' },
    customFields: [],
  },
  summary: { visible: true, content: '' },
  sections: {
    profiles: { name: 'Profiles', items: [], visible: true, columns: 1, separate: false },
    experience: { name: 'Experience', items: [], visible: true, columns: 1, separate: false },
    education: { name: 'Education', items: [], visible: true, columns: 1, separate: false },
    projects: { name: 'Projects', items: [], visible: true, columns: 1, separate: false },
    skills: { name: 'Skills', items: [], visible: true, columns: 1, separate: false },
    languages: { name: 'Languages', items: [], visible: true, columns: 1, separate: false },
    interests: { name: 'Interests', items: [], visible: true, columns: 1, separate: false },
    awards: { name: 'Awards', items: [], visible: true, columns: 1, separate: false },
    certifications: {
      name: 'Certifications',
      items: [],
      visible: true,
      columns: 1,
      separate: false,
    },
    publications: { name: 'Publications', items: [], visible: true, columns: 1, separate: false },
    volunteer: { name: 'Volunteer', items: [], visible: true, columns: 1, separate: false },
    references: { name: 'References', items: [], visible: true, columns: 1, separate: false },
  },
  customSections: [],
  metadata: {
    template: 'onyx',
    layout: {
      pages: [
        {
          main: ['summary', 'experience', 'education', 'projects'],
          sidebar: ['skills', 'profiles'],
        },
      ],
    },
    typography: {
      fontFamily: 'Open Sans',
      fontSize: 11,
    },
    theme: {
      primary: '#1f2937',
    },
    sectionOrder: DEFAULT_SECTION_ORDER,
  },
};
