import { ResumeData } from "@/types/resume";

export const isBasicsComplete = (basics: ResumeData['basics']) => {
  return !!(
    basics.name?.trim() &&
    basics.email?.trim() &&
    basics.phone?.trim()
  );
};

export const isWorkExperienceComplete = (workExperience: ResumeData['sections']['experience']['items']) => {
  return workExperience.length > 0 &&
    workExperience.every(exp =>
      exp.position?.trim() &&
      exp.company?.trim() &&
      exp.period?.trim()
    );
};

export const isEducationComplete = (education: ResumeData['sections']['education']['items']) => {
  return education.length > 0 &&
    education.every(edu =>
      edu.school?.trim() &&
      edu.degree?.trim() &&
      edu.period?.trim()
    );
};

export const isProjectsComplete = (projects: ResumeData['sections']['projects']['items']) => {
  return projects.length > 0 &&
    projects.every(proj =>
      proj.name?.trim() &&
      proj.description?.trim()
    );
};

export const isSkillsComplete = (skills: ResumeData['sections']['skills']['items']) => {
  return skills.length > 0 &&
    skills.every(skill => skill.name?.trim() && skill.keywords.length > 0);
};

/**
 * Validates mandatory fields specifically for the download action.
 * Returns an array of missing mandatory section labels.
 */
export const getMissingMandatorySections = (resumeData: ResumeData): string[] => {
  const missingForms: string[] = [];

  if (!isBasicsComplete(resumeData.basics)) {
    missingForms.push('Personal Info');
  }

  const { sections } = resumeData;

  // Work Experience (if entries exist, they must be valid)
  if (sections.experience.items.some(exp => 
    !exp.position?.trim() || !exp.company?.trim() || !exp.period?.trim()
  )) {
    missingForms.push('Work Experience');
  }

  // Education (if entries exist, they must be valid)
  if (sections.education.items.some(edu => 
    !edu.school?.trim() || !edu.degree?.trim() || !edu.period?.trim()
  )) {
    missingForms.push('Education');
  }

  // Projects (if entries exist, they must be valid)
  if (sections.projects.items.some(proj => 
    !proj.name?.trim() || !proj.description?.trim()
  )) {
    missingForms.push('Projects');
  }

  return missingForms;
};

/**
 * Returns completion status for a specific section ID used in the sidebar.
 */
export const getSectionCompletionStatus = (sectionId: string, resumeData: ResumeData): boolean => {
  const { basics, sections, customSections } = resumeData;
  switch (sectionId) {
    case "personal":
      return isBasicsComplete(basics);
    case "work":
      return isWorkExperienceComplete(sections.experience.items);
    case "education":
      return isEducationComplete(sections.education.items);
    case "projects":
      return isProjectsComplete(sections.projects.items);
    case "skills":
      return isSkillsComplete(sections.skills.items);
    case "profiles":
      return sections.profiles.items.length > 0;
    case "languages":
      return sections.languages.items.length > 0;
    case "interests":
      return sections.interests.items.length > 0;
    case "awards":
      return sections.awards.items.length > 0;
    case "certifications":
      return sections.certifications.items.length > 0;
    case "publications":
      return sections.publications.items.length > 0;
    case "volunteer":
      return sections.volunteer.items.length > 0;
    case "references":
      return sections.references.items.length > 0;
    case "settings":
      return true;
    default:
      // Check if it's a custom section
      const custom = customSections.find(s => s.id === sectionId);
      return custom ? custom.items.length > 0 : false;
  }
};
