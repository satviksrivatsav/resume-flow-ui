import { ResumeData } from "@/types/resume";

export const isPersonalInfoComplete = (personalInfo: ResumeData['personalInfo']) => {
  return !!(
    personalInfo.name?.trim() &&
    personalInfo.email?.trim() &&
    personalInfo.phone?.trim()
  );
};

export const isWorkExperienceComplete = (workExperience: ResumeData['workExperience']) => {
  return workExperience.length > 0 &&
    workExperience.every(exp =>
      exp.position?.trim() &&
      exp.company?.trim() &&
      exp.startDate?.trim() &&
      (exp.current || exp.endDate?.trim())
    );
};

export const isEducationComplete = (education: ResumeData['education']) => {
  return education.length > 0 &&
    education.every(edu =>
      edu.school?.trim() &&
      edu.degree?.trim() &&
      edu.startDate?.trim() &&
      edu.endDate?.trim() &&
      edu.grade?.trim()
    );
};

export const isProjectsComplete = (projects: ResumeData['projects']) => {
  return projects.length > 0 &&
    projects.every(proj =>
      proj.name?.trim() &&
      proj.description?.trim()
    );
};

export const isSkillsComplete = (skills: ResumeData['skills']) => {
  return skills.length > 0 &&
    skills.every(skill => skill.category?.trim() && skill.items?.trim());
};

export const isCustomSectionsComplete = (customSections: ResumeData['customSections']) => {
  return customSections.length > 0 &&
    customSections.every(section =>
      section.title?.trim() &&
      section.description?.trim() &&
      section.description !== '<p><br></p>'
    );
};

/**
 * Validates mandatory fields specifically for the download action.
 * Returns an array of missing mandatory section labels.
 */
export const getMissingMandatorySections = (resumeData: ResumeData): string[] => {
  const missingForms: string[] = [];

  if (!isPersonalInfoComplete(resumeData.personalInfo)) {
    missingForms.push('Personal Info');
  }

  // Work Experience (if entries exist, they must be valid)
  if (resumeData.workExperience.some(exp => 
    !exp.position?.trim() || !exp.company?.trim() || !exp.startDate?.trim() || (!exp.current && !exp.endDate?.trim())
  )) {
    missingForms.push('Work Experience');
  }

  // Education (if entries exist, they must be valid)
  if (resumeData.education.some(edu => 
    !edu.school?.trim() || !edu.degree?.trim() || !edu.startDate?.trim() || !edu.endDate?.trim() || !edu.grade?.trim()
  )) {
    missingForms.push('Education');
  }

  // Projects (if entries exist, they must be valid)
  if (resumeData.projects.some(proj => 
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
  switch (sectionId) {
    case "personal":
      return isPersonalInfoComplete(resumeData.personalInfo);
    case "work":
      return isWorkExperienceComplete(resumeData.workExperience);
    case "education":
      return isEducationComplete(resumeData.education);
    case "projects":
      return isProjectsComplete(resumeData.projects);
    case "skills":
      return isSkillsComplete(resumeData.skills);
    case "custom":
      return isCustomSectionsComplete(resumeData.customSections);
    case "settings":
      return true;
    default:
      return false;
  }
};
