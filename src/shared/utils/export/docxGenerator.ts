import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';

import { cleanPhoneNumber, getCountryByCode } from '@/shared/lib/countries';
import { cleanProfileDisplay, hasContent, stripHtml } from '@/shared/lib/utils';
import { DEFAULT_SECTION_ORDER, ResumeData } from '@/shared/types/resume';

const renderDescription = (text: string, fontSize: number, lineSpacing: number): Paragraph[] => {
  if (!text) return [];

  const processedText = stripHtml(text);
  const lines = processedText.split('\n');
  const paragraphs: Paragraph[] = [];

  lines.forEach((line) => {
    const bulletMatch = /^(\s*)([•\-\*·\u2022\u2023\u2043\u204c\u204d\u2219])\s+(.*)/.exec(line);

    if (bulletMatch) {
      const indent = bulletMatch[1];
      const bulletChar = bulletMatch[2];
      const content = bulletMatch[3];

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${bulletChar} `,
              size: fontSize * 2,
            }),
            new TextRun({
              text: content,
              size: fontSize * 2,
            }),
          ],
          indent: {
            left: (indent ? indent.length * 40 : 0) + 240,
            hanging: 240,
          },
          spacing: { after: 40, line: lineSpacing },
        }),
      );
    } else {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: fontSize * 2,
            }),
          ],
          spacing: { after: line.trim() === '' ? 80 : 40, line: lineSpacing },
        }),
      );
    }
  });

  return paragraphs;
};

export const generateDocx = async (resumeData: ResumeData): Promise<Blob> => {
  const { basics, summary, sections, customSections, metadata } = resumeData;

  const baseSize = metadata.typography.fontSize || 11;
  const sizes = {
    base: baseSize,
    heading: baseSize + 2,
    name: baseSize * 2,
  };
  const fontFamily = metadata.typography.fontFamily || 'Roboto';
  const primaryColor = (metadata.theme.primary || '#1f2937').replace('#', '');
  const sectionOrder = metadata.sectionOrder ?? DEFAULT_SECTION_ORDER;

  // ── Spacing and Sizing Helper ─────────────────────────────────────────────
  const baseLineHeight = metadata.typography.lineHeight || 1.5;
  const effectiveLineHeight = Math.max(1.0, baseLineHeight);
  const spacingScale = baseLineHeight / 1.5;

  const getSpacingTwips = (basePoints: number) => {
    return Math.round(basePoints * spacingScale * 20);
  };

  const lineSpacingTwips = Math.round(effectiveLineHeight * 240);

  const children: any[] = [];

  // ── Header ────────────────────────────────────────────────────────────────
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: basics.name || 'Your Name',
          bold: true,
          size: sizes.name * 2,
          color: primaryColor,
        }),
      ],
      spacing: { after: getSpacingTwips(6) },
    }),
  );

  if (basics.headline) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: basics.headline,
            size: sizes.heading * 2,
            color: '444444',
          }),
        ],
        spacing: { after: getSpacingTwips(10) },
      }),
    );
  }

  const country = basics.countryCode ? getCountryByCode(basics.countryCode) : null;
  const dialCode = country?.dialCode || '';
  const localPhone = cleanPhoneNumber(basics.phone, basics.countryCode);
  const formattedPhone = dialCode ? `${dialCode} ${localPhone}` : localPhone;

  const contactInfo = [
    { value: basics.email, isLink: true, prefix: 'mailto:' },
    { value: formattedPhone, isLink: false },
    { value: basics.location, isLink: false },
    { value: basics.url.href, isLink: true, prefix: '' },
  ].filter((item) => item.value && item.value.trim());

  const visibleProfiles = sections.profiles.items.filter(
    (p: any) => p.visible && (p.network || p.username || p.website?.href),
  );

  if (contactInfo.length > 0) {
    const contactParagraphChildren: any[] = [];
    contactInfo.forEach((item, index) => {
      if (item.isLink) {
        contactParagraphChildren.push(
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: item.value,
                size: (sizes.base - 1) * 2,
                color: primaryColor,
                underline: {},
              }),
            ],
            link: item.prefix + item.value,
          }),
        );
      } else {
        contactParagraphChildren.push(
          new TextRun({
            text: item.value,
            size: (sizes.base - 1) * 2,
          }),
        );
      }
      if (index < contactInfo.length - 1) {
        contactParagraphChildren.push(
          new TextRun({
            text: '   |   ',
            size: (sizes.base - 1) * 2,
          }),
        );
      }
    });

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: contactParagraphChildren,
        spacing: { after: visibleProfiles.length > 0 ? getSpacingTwips(4) : getSpacingTwips(20) },
      }),
    );
  }

  if (visibleProfiles.length > 0) {
    const profileParagraphChildren: any[] = [];
    visibleProfiles.forEach((profile, index) => {
      if (profile.website?.href) {
        profileParagraphChildren.push(
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: profile.website.href,
                size: (sizes.base - 1) * 2,
                color: primaryColor,
                underline: {},
              }),
            ],
            link: profile.website.href,
          }),
        );
      } else {
        profileParagraphChildren.push(
          new TextRun({
            text: `${profile.network}${profile.username ? `: ${profile.username}` : ''}`,
            size: (sizes.base - 1) * 2,
          }),
        );
      }
      if (index < visibleProfiles.length - 1) {
        profileParagraphChildren.push(
          new TextRun({
            text: '   |   ',
            size: (sizes.base - 1) * 2,
          }),
        );
      }
    });

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: profileParagraphChildren,
        spacing: { after: getSpacingTwips(20) },
      }),
    );
  }

  // ── Section Title Helper ──────────────────────────────────────────────────
  const createSectionTitle = (title: string) => {
    return [
      new Paragraph({
        keepNext: true,
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: sizes.heading * 2,
            color: primaryColor,
          }),
        ],
        border: {
          bottom: {
            color: primaryColor,
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        spacing: { before: getSpacingTwips(18), after: getSpacingTwips(10) },
      }),
    ];
  };

  const createItemWebsiteParagraph = (website?: { label?: string; href?: string }) => {
    if (!website?.href?.trim()) return null;
    const displayText = website.label?.trim() || website.href.trim();
    return new Paragraph({
      children: [
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: displayText,
              size: (sizes.base - 1) * 2,
              color: primaryColor,
              underline: {},
            }),
          ],
          link: website.href,
        }),
      ],
      spacing: { after: getSpacingTwips(2), line: lineSpacingTwips },
    });
  };

  // ── Section Renderers ──────────────────────────────────────────────────────
  const renderSummary = () => {
    if (hasContent(summary.content) && summary.visible) {
      children.push(...createSectionTitle('Summary'));
      children.push(...renderDescription(summary.content, sizes.base, lineSpacingTwips));
    }
  };

  const renderExperience = () => {
    const visibleItems = sections.experience.items.filter(
      (i) => i.visible && (i.company || i.position || hasContent(i.description)),
    );
    if (!sections.experience.visible || visibleItems.length === 0) return;

    children.push(...createSectionTitle(sections.experience.name));

    visibleItems.forEach((exp) => {
      children.push(
        new Paragraph({
          keepNext: true,
          children: [
            new TextRun({ text: exp.position || 'Position', bold: true, size: sizes.base * 2 }),
            ...(exp.company
              ? [new TextRun({ text: `, ${exp.company}`, size: sizes.base * 2 })]
              : []),
            new TextRun({ text: `\t${exp.period}`, size: sizes.base * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10300 }],
          spacing: { after: getSpacingTwips(2), line: lineSpacingTwips },
        }),
      );

      const websitePara = createItemWebsiteParagraph(exp.website);
      if (websitePara) {
        children.push(websitePara);
      }

      if (hasContent(exp.description)) {
        children.push(...renderDescription(exp.description, sizes.base, lineSpacingTwips));
      }

      children.push(new Paragraph({ spacing: { after: getSpacingTwips(12) } }));
    });
  };

  const renderEducation = () => {
    const visibleItems = sections.education.items.filter(
      (i) => i.visible && (i.school || i.degree || hasContent(i.description)),
    );
    if (!sections.education.visible || visibleItems.length === 0) return;

    children.push(...createSectionTitle(sections.education.name));

    visibleItems.forEach((edu) => {
      children.push(
        new Paragraph({
          keepNext: true,
          children: [
            new TextRun({ text: edu.degree || 'Degree', bold: true, size: sizes.base * 2 }),
            ...(edu.area ? [new TextRun({ text: ` in ${edu.area}`, size: sizes.base * 2 })] : []),
            new TextRun({ text: `\t${edu.period}`, size: sizes.base * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10300 }],
          spacing: { after: getSpacingTwips(2), line: lineSpacingTwips },
        }),
      );

      if (edu.school) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: edu.school, bold: true, size: sizes.base * 2 }),
              ...(edu.grade
                ? [new TextRun({ text: ` • ${edu.grade}`, size: sizes.base * 2 })]
                : []),
            ],
            spacing: { after: getSpacingTwips(2), line: lineSpacingTwips },
          }),
        );
      }

      const websitePara = createItemWebsiteParagraph(edu.website);
      if (websitePara) {
        children.push(websitePara);
      }

      if (hasContent(edu.description)) {
        children.push(...renderDescription(edu.description, sizes.base, lineSpacingTwips));
      }

      children.push(new Paragraph({ spacing: { after: getSpacingTwips(12) } }));
    });
  };

  const renderProjects = () => {
    const visibleItems = sections.projects.items.filter(
      (i) => i.visible && (i.name || hasContent(i.description)),
    );
    if (!sections.projects.visible || visibleItems.length === 0) return;

    children.push(...createSectionTitle(sections.projects.name));

    visibleItems.forEach((proj) => {
      children.push(
        new Paragraph({
          keepNext: true,
          children: [
            new TextRun({ text: proj.name || 'Project', bold: true, size: sizes.base * 2 }),
            new TextRun({ text: `\t${proj.period}`, size: sizes.base * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10300 }],
          spacing: { after: getSpacingTwips(2), line: lineSpacingTwips },
        }),
      );

      const websitePara = createItemWebsiteParagraph(proj.website);
      if (websitePara) {
        children.push(websitePara);
      }

      if (hasContent(proj.description)) {
        children.push(...renderDescription(proj.description, sizes.base, lineSpacingTwips));
      }

      if (proj.keywords && proj.keywords.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Technologies: ', bold: true, size: sizes.base * 2 }),
              new TextRun({ text: proj.keywords.join(', '), size: sizes.base * 2 }),
            ],
            spacing: { after: getSpacingTwips(4), line: lineSpacingTwips },
          }),
        );
      }

      children.push(new Paragraph({ spacing: { after: getSpacingTwips(12) } }));
    });
  };

  const renderSkills = () => {
    const visibleItems = sections.skills.items.filter(
      (i) => i.visible && i.name && (i.keywords.length > 0 || hasContent(i.description)),
    );
    if (!sections.skills.visible || visibleItems.length === 0) return;

    children.push(...createSectionTitle(sections.skills.name));

    visibleItems.forEach((skill) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${skill.name || 'Category'}: `,
              bold: true,
              size: sizes.base * 2,
            }),
            new TextRun({
              text:
                skill.keywords && skill.keywords.length > 0
                  ? skill.keywords.join(', ')
                  : stripHtml(skill.description || ''),
              size: sizes.base * 2,
            }),
          ],
          spacing: { after: getSpacingTwips(4), line: lineSpacingTwips },
        }),
      );
    });
  };

  const renderLanguages = () => {
    const visibleItems = sections.languages.items.filter((i) => i.visible && i.name);
    if (!sections.languages.visible || visibleItems.length === 0) return;

    children.push(...createSectionTitle(sections.languages.name));

    const paragraphChildren: any[] = [];
    visibleItems.forEach((lang, index) => {
      paragraphChildren.push(new TextRun({ text: lang.name, bold: true, size: sizes.base * 2 }));
      if (lang.description) {
        paragraphChildren.push(
          new TextRun({
            text: ` (${lang.description})`,
            size: sizes.base * 2,
            color: '555555',
          }),
        );
      }
      if (index < visibleItems.length - 1) {
        paragraphChildren.push(
          new TextRun({
            text: ', ',
            size: sizes.base * 2,
          }),
        );
      }
    });

    children.push(
      new Paragraph({
        children: paragraphChildren,
        spacing: { after: getSpacingTwips(12), line: lineSpacingTwips },
      }),
    );
  };

  const renderInterests = () => {
    const visibleItems = sections.interests.items.filter((i) => i.visible && i.name);
    if (!sections.interests.visible || visibleItems.length === 0) return;

    children.push(...createSectionTitle(sections.interests.name));

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: visibleItems
              .map((i) => i.name + (i.keywords.length > 0 ? ` (${i.keywords.join(', ')})` : ''))
              .join(', '),
            size: sizes.base * 2,
          }),
        ],
        spacing: { after: getSpacingTwips(12), line: lineSpacingTwips },
      }),
    );
  };

  const renderAwards = () => {
    const visibleItems = sections.awards.items.filter(
      (i) => i.visible && (i.title || hasContent(i.description)),
    );
    if (!sections.awards.visible || visibleItems.length === 0) return;

    children.push(...createSectionTitle(sections.awards.name));

    visibleItems.forEach((award) => {
      children.push(
        new Paragraph({
          keepNext: true,
          children: [
            new TextRun({ text: award.title, bold: true, size: sizes.base * 2 }),
            new TextRun({ text: `\t${award.date}`, size: sizes.base * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10300 }],
          spacing: { after: getSpacingTwips(2), line: lineSpacingTwips },
        }),
      );

      children.push(
        new Paragraph({
          children: [new TextRun({ text: award.awarder, size: sizes.base * 2 })],
          spacing: { after: getSpacingTwips(4), line: lineSpacingTwips },
        }),
      );

      if (hasContent(award.description)) {
        children.push(...renderDescription(award.description, sizes.base, lineSpacingTwips));
      }

      children.push(new Paragraph({ spacing: { after: getSpacingTwips(12) } }));
    });
  };

  const renderCertifications = () => {
    const visibleItems = sections.certifications.items.filter(
      (i) => i.visible && (i.name || hasContent(i.description)),
    );
    if (!sections.certifications.visible || visibleItems.length === 0) return;

    children.push(...createSectionTitle(sections.certifications.name));

    visibleItems.forEach((cert) => {
      children.push(
        new Paragraph({
          keepNext: true,
          children: [
            new TextRun({ text: cert.name, bold: true, size: sizes.base * 2 }),
            new TextRun({ text: `\t${cert.date}`, size: sizes.base * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10300 }],
          spacing: { after: getSpacingTwips(2), line: lineSpacingTwips },
        }),
      );

      children.push(
        new Paragraph({
          children: [new TextRun({ text: cert.issuer, size: sizes.base * 2 })],
          spacing: { after: getSpacingTwips(2), line: lineSpacingTwips },
        }),
      );

      const websitePara = createItemWebsiteParagraph(cert.website);
      if (websitePara) {
        children.push(websitePara);
      }

      if (hasContent(cert.description)) {
        children.push(...renderDescription(cert.description, sizes.base, lineSpacingTwips));
      }

      children.push(new Paragraph({ spacing: { after: getSpacingTwips(12) } }));
    });
  };

  const renderVolunteer = () => {
    const visibleItems = sections.volunteer.items.filter(
      (i) => i.visible && (i.organization || i.position || hasContent(i.description)),
    );
    if (!sections.volunteer.visible || visibleItems.length === 0) return;

    children.push(...createSectionTitle(sections.volunteer.name));

    visibleItems.forEach((vol) => {
      children.push(
        new Paragraph({
          keepNext: true,
          children: [
            new TextRun({ text: vol.position, bold: true, size: sizes.base * 2 }),
            new TextRun({ text: `\t${vol.period}`, size: sizes.base * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10300 }],
          spacing: { after: getSpacingTwips(2), line: lineSpacingTwips },
        }),
      );

      children.push(
        new Paragraph({
          children: [new TextRun({ text: vol.organization, size: sizes.base * 2 })],
          spacing: { after: getSpacingTwips(2), line: lineSpacingTwips },
        }),
      );

      const websitePara = createItemWebsiteParagraph(vol.website);
      if (websitePara) {
        children.push(websitePara);
      }

      if (hasContent(vol.description)) {
        children.push(...renderDescription(vol.description, sizes.base, lineSpacingTwips));
      }

      children.push(new Paragraph({ spacing: { after: getSpacingTwips(12) } }));
    });
  };

  const renderPublications = () => {
    const visibleItems = sections.publications.items.filter(
      (i) => i.visible && (i.name || hasContent(i.description)),
    );
    if (!sections.publications.visible || visibleItems.length === 0) return;

    children.push(...createSectionTitle(sections.publications.name));

    visibleItems.forEach((pub) => {
      children.push(
        new Paragraph({
          keepNext: true,
          children: [
            new TextRun({ text: pub.name, bold: true, size: sizes.base * 2 }),
            new TextRun({ text: `\t${pub.date}`, size: sizes.base * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10300 }],
          spacing: { after: getSpacingTwips(2), line: lineSpacingTwips },
        }),
      );

      children.push(
        new Paragraph({
          children: [new TextRun({ text: pub.publisher, size: sizes.base * 2 })],
          spacing: { after: getSpacingTwips(2), line: lineSpacingTwips },
        }),
      );

      const websitePara = createItemWebsiteParagraph(pub.website);
      if (websitePara) {
        children.push(websitePara);
      }

      if (hasContent(pub.description)) {
        children.push(...renderDescription(pub.description, sizes.base, lineSpacingTwips));
      }

      children.push(new Paragraph({ spacing: { after: getSpacingTwips(12) } }));
    });
  };

  const renderReferences = () => {
    const visibleItems = sections.references.items.filter((i) => i.visible && i.name);
    if (!sections.references.visible || visibleItems.length === 0) return;

    children.push(...createSectionTitle(sections.references.name));

    visibleItems.forEach((ref) => {
      children.push(
        new Paragraph({
          keepNext: true,
          children: [
            new TextRun({ text: ref.name, bold: true, size: sizes.base * 2 }),
            new TextRun({ text: `\t${ref.position}`, size: sizes.base * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10300 }],
          spacing: { after: getSpacingTwips(2), line: lineSpacingTwips },
        }),
      );

      const contactDetails: string[] = [];
      if (ref.email) contactDetails.push(ref.email);
      if (ref.phone) contactDetails.push(ref.phone);

      if (contactDetails.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: contactDetails.join(' | '),
                size: (sizes.base - 1) * 2,
                color: '666666',
              }),
            ],
            spacing: { after: getSpacingTwips(12), line: lineSpacingTwips },
          }),
        );
      }
    });
  };

  const sectionRenderers: Record<string, () => void> = {
    summary: renderSummary,
    experience: renderExperience,
    education: renderEducation,
    projects: renderProjects,
    skills: renderSkills,
    profiles: () => {}, // Handled in header
    languages: renderLanguages,
    interests: renderInterests,
    awards: renderAwards,
    certifications: renderCertifications,
    publications: renderPublications,
    volunteer: renderVolunteer,
    references: renderReferences,
  };

  // ── Summary — pinned to top, not reorderable ──────────────────────────────
  renderSummary();

  // ── Dynamic Body ──────────────────────────────────────────────────────────
  sectionOrder.forEach((key) => {
    if (key === 'summary') return;
    const renderer = sectionRenderers[key];
    if (renderer) renderer();
  });

  // ── Custom Sections ──────────────────────────────────────────────────────
  customSections.forEach((section) => {
    const visibleItems = section.items.filter(
      (item: any) => item.visible && (item.title || hasContent(item.description)),
    );
    if (!section.visible || visibleItems.length === 0) return;

    children.push(...createSectionTitle(section.name));

    visibleItems.forEach((item: any) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: item.title, bold: true, size: sizes.base * 2 })],
          spacing: { after: getSpacingTwips(4), line: lineSpacingTwips },
        }),
      );

      if (hasContent(item.description)) {
        children.push(...renderDescription(item.description, sizes.base, lineSpacingTwips));
      }

      children.push(new Paragraph({ spacing: { after: getSpacingTwips(12) } }));
    });
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: fontFamily,
            size: sizes.base * 2,
            color: '000000',
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 800,
              right: 800,
              bottom: 800,
              left: 800,
            },
          },
        },
        children: children,
      },
    ],
  });

  return await Packer.toBlob(doc);
};
