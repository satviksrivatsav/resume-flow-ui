import { ResumeData } from '@/shared/types/resume';

export const isBasicsComplete = (basics: ResumeData['basics']) => {
  return !!(basics.name?.trim() && basics.email?.trim() && basics.phone?.trim());
};

export const getMissingMandatorySections = (resumeData: ResumeData): string[] => {
  const missingForms: string[] = [];

  if (!isBasicsComplete(resumeData.basics)) {
    missingForms.push('Personal Info');
  }

  const { sections, customSections } = resumeData;

  // Work Experience
  if (
    sections.experience.items.length > 0 &&
    sections.experience.items.some(
      (exp) => !exp.position?.trim() || !exp.company?.trim() || !exp.period?.trim(),
    )
  ) {
    missingForms.push('Work Experience');
  }

  // Education
  if (
    sections.education.items.length > 0 &&
    sections.education.items.some(
      (edu) =>
        !edu.school?.trim() ||
        !edu.degree?.trim() ||
        !edu.period?.trim() ||
        !edu.grade?.trim() ||
        !edu.area?.trim(),
    )
  ) {
    missingForms.push('Education');
  }

  // Projects
  if (
    sections.projects.items.length > 0 &&
    sections.projects.items.some((proj) => !proj.name?.trim() || !proj.description?.trim())
  ) {
    missingForms.push('Projects');
  }

  // Skills
  if (
    sections.skills.items.length > 0 &&
    sections.skills.items.some((skill) => !skill.name?.trim() || skill.keywords.length === 0)
  ) {
    missingForms.push('Skills');
  }

  // Languages
  if (
    sections.languages.items.length > 0 &&
    sections.languages.items.some((lang) => !lang.name?.trim())
  ) {
    missingForms.push('Languages');
  }

  // Interests
  if (
    sections.interests.items.length > 0 &&
    sections.interests.items.some((interest) => !interest.name?.trim())
  ) {
    missingForms.push('Interests');
  }

  // Awards
  if (
    sections.awards.items.length > 0 &&
    sections.awards.items.some((award) => !award.title?.trim())
  ) {
    missingForms.push('Awards');
  }

  // Certifications
  if (
    sections.certifications.items.length > 0 &&
    sections.certifications.items.some((cert) => !cert.name?.trim() || !cert.issuer?.trim())
  ) {
    missingForms.push('Certifications');
  }

  // Publications
  if (
    sections.publications.items.length > 0 &&
    sections.publications.items.some((pub) => !pub.name?.trim() || !pub.publisher?.trim())
  ) {
    missingForms.push('Publications');
  }

  // Volunteer
  if (
    sections.volunteer.items.length > 0 &&
    sections.volunteer.items.some((vol) => !vol.organization?.trim() || !vol.position?.trim())
  ) {
    missingForms.push('Volunteer');
  }

  // References
  if (
    sections.references.items.length > 0 &&
    sections.references.items.some(
      (ref) => !ref.name?.trim() || (!ref.email?.trim() && !ref.phone?.trim()),
    )
  ) {
    missingForms.push('References');
  }

  // Custom Sections
  customSections.forEach((section) => {
    // 1. Check if it's an "Additional" style section (one with a top-level description)
    const asAdditional = section as typeof section & { description?: string };
    if (asAdditional.description !== undefined) {
      if (!section.name?.trim() || !asAdditional.description.trim()) {
        missingForms.push(section.name || 'Additional Section');
      }
      return;
    }

    // 2. Otherwise check standard custom sections with items
    if (
      section.items.length > 0 &&
      section.items.some((item: unknown) => {
        const customItem = item as { title?: string; description?: string };
        return !customItem.title?.trim() || !customItem.description?.trim();
      })
    ) {
      missingForms.push(section.name || 'Custom Section');
    }
  });

  return missingForms;
};

export const getSectionCompletionStatus = (sectionId: string, resumeData: ResumeData): boolean => {
  const { basics, sections, customSections } = resumeData;
  switch (sectionId) {
    case 'personal':
      return isBasicsComplete(basics);
    case 'experience':
      return (
        sections.experience.items.length > 0 &&
        sections.experience.items.every(
          (exp) => exp.position?.trim() && exp.company?.trim() && exp.period?.trim(),
        )
      );
    case 'education':
      return (
        sections.education.items.length > 0 &&
        sections.education.items.every(
          (edu) =>
            edu.school?.trim() &&
            edu.degree?.trim() &&
            edu.period?.trim() &&
            edu.grade?.trim() &&
            edu.area?.trim(),
        )
      );
    case 'projects':
      return (
        sections.projects.items.length > 0 &&
        sections.projects.items.every((proj) => proj.name?.trim() && proj.description?.trim())
      );
    case 'skills':
      return (
        sections.skills.items.length > 0 &&
        sections.skills.items.every((skill) => skill.name?.trim() && skill.keywords.length > 0)
      );
    case 'languages':
      return (
        sections.languages.items.length > 0 &&
        sections.languages.items.every((lang) => lang.name?.trim())
      );
    case 'interests':
      return (
        sections.interests.items.length > 0 &&
        sections.interests.items.every((interest) => interest.name?.trim())
      );
    case 'awards':
      return (
        sections.awards.items.length > 0 &&
        sections.awards.items.every((award) => award.title?.trim())
      );
    case 'certifications':
      return (
        sections.certifications.items.length > 0 &&
        sections.certifications.items.every((cert) => cert.name?.trim() && cert.issuer?.trim())
      );
    case 'publications':
      return (
        sections.publications.items.length > 0 &&
        sections.publications.items.every((pub) => pub.name?.trim() && pub.publisher?.trim())
      );
    case 'volunteer':
      return (
        sections.volunteer.items.length > 0 &&
        sections.volunteer.items.every((vol) => vol.organization?.trim() && vol.position?.trim())
      );
    case 'references':
      return (
        sections.references.items.length > 0 &&
        sections.references.items.every(
          (ref) => ref.name?.trim() && (ref.email?.trim() || ref.phone?.trim()),
        )
      );
    case 'profiles':
      return sections.profiles.items.length > 0;
    case 'settings':
      return true;
    default: {
      const custom = customSections.find((s) => s.id === sectionId);
      if (!custom) return false;

      // 1. Check Additional style
      const asAdditional = custom as typeof custom & { description?: string };
      if (asAdditional.description !== undefined) {
        return !!(custom.name?.trim() && asAdditional.description.trim());
      }

      // 2. Standard custom section with items
      return (
        custom.items.length > 0 &&
        custom.items.every((item: unknown) => {
          const customItem = item as { title?: string; description?: string };
          return !!(customItem.title?.trim() && customItem.description?.trim());
        })
      );
    }
  }
};
