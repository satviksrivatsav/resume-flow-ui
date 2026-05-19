import { AlignmentType, BorderStyle, Document, Packer, Paragraph, TextRun } from 'docx';

import { cleanPhoneNumber, getCountryByCode } from '@/shared/lib/countries';
import { cleanProfileDisplay, hasContent, stripHtml } from '@/shared/lib/utils';
import { DEFAULT_SECTION_ORDER, ResumeData } from '@/shared/types/resume';

const renderDescription = (text: string, fontSize: number): Paragraph[] => {
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
            left: (indent ? indent.length * 4 : 0) + 240,
            hanging: 240,
          },
          spacing: { after: 40, line: 360 }, // 360 twips = 1.5 line spacing
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
          spacing: { after: line.trim() === '' ? 80 : 40, line: 360 },
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
  const primaryColor = (metadata.theme.primary || '#1f2937').replace('#', '');
  const sectionOrder = metadata.sectionOrder ?? DEFAULT_SECTION_ORDER;

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
        spacing: { after: 160 },
      }),
    );
  }

  const country = basics.countryCode ? getCountryByCode(basics.countryCode) : null;
  const dialCode = country?.dialCode || '';
  const localPhone = cleanPhoneNumber(basics.phone, basics.countryCode);
  const formattedPhone = dialCode ? `${dialCode} ${localPhone}` : localPhone;

  const contactInfo = [basics.email, formattedPhone, basics.location, basics.url.href].filter(
    (v) => v && v.trim(),
  );

  const profiles = sections.profiles.items
    .filter((p) => p.visible && (p.network || p.username))
    .map((p) => `${p.network}: ${cleanProfileDisplay(p.username)}`);

  const allContact = [...contactInfo, ...profiles];

  if (allContact.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: allContact
          .map((item, idx) => [
            new TextRun({
              text: item,
              size: (sizes.base - 1) * 2,
            }),
            ...(idx < allContact.length - 1
              ? [
                  new TextRun({
                    text: '  |  ',
                    size: (sizes.base - 1) * 2,
                  }),
                ]
              : []),
          ])
          .flat(),
        spacing: { after: 320 },
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
        spacing: { before: 280, after: 200 },
      }),
    ];
  };

  // ── Section Renderers ──────────────────────────────────────────────────────
  const renderSummary = () => {
    if (hasContent(summary.content) && summary.visible) {
      children.push(...createSectionTitle('Summary'));
      children.push(...renderDescription(summary.content, sizes.base));
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
          children: [
            new TextRun({ text: exp.position || 'Position', bold: true, size: sizes.base * 2 }),
            ...(exp.company
              ? [new TextRun({ text: `, ${exp.company}`, size: sizes.base * 2 })]
              : []),
            new TextRun({ text: `\t${exp.period}`, size: sizes.base * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10000 }],
        }),
      );

      if (exp.location) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: exp.location, size: (sizes.base - 1) * 2, color: '666666' }),
            ],
            spacing: { after: 80 },
          }),
        );
      }

      if (hasContent(exp.description)) {
        children.push(...renderDescription(exp.description, sizes.base));
      }

      children.push(new Paragraph({ spacing: { after: 200 } }));
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
          children: [
            new TextRun({ text: edu.degree || 'Degree', bold: true, size: sizes.base * 2 }),
            ...(edu.area ? [new TextRun({ text: ` in ${edu.area}`, size: sizes.base * 2 })] : []),
            new TextRun({ text: `\t${edu.period}`, size: sizes.base * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10000 }],
        }),
      );

      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.school || 'School', size: sizes.base * 2 }),
            ...(edu.grade ? [new TextRun({ text: ` • ${edu.grade}`, size: sizes.base * 2 })] : []),
          ],
          spacing: { after: 80 },
        }),
      );

      if (hasContent(edu.description)) {
        children.push(...renderDescription(edu.description, sizes.base));
      }

      children.push(new Paragraph({ spacing: { after: 200 } }));
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
          children: [
            new TextRun({ text: proj.name || 'Project', bold: true, size: sizes.base * 2 }),
            new TextRun({ text: `\t${proj.period}`, size: (sizes.base - 1) * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10000 }],
        }),
      );

      if (proj.website.href) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: proj.website.label || proj.website.href,
                size: (sizes.base - 1) * 2,
                color: primaryColor,
              }),
            ],
          }),
        );
      }

      if (hasContent(proj.description)) {
        children.push(...renderDescription(proj.description, sizes.base));
      }

      if (proj.keywords && proj.keywords.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Technologies: ', bold: true, size: sizes.base * 2 }),
              new TextRun({ text: proj.keywords.join(', '), size: sizes.base * 2 }),
            ],
            spacing: { after: 80 },
          }),
        );
      }

      children.push(new Paragraph({ spacing: { after: 200 } }));
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
          spacing: { after: 80 },
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
            size: (sizes.base - 1) * 2,
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
        spacing: { after: 120 },
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
          children: [
            new TextRun({ text: award.title, bold: true, size: sizes.base * 2 }),
            new TextRun({ text: `\t${award.date}`, size: (sizes.base - 1) * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10000 }],
        }),
      );

      children.push(
        new Paragraph({
          children: [new TextRun({ text: award.awarder, size: sizes.base * 2 })],
        }),
      );

      if (hasContent(award.description)) {
        children.push(...renderDescription(award.description, sizes.base));
      }

      children.push(new Paragraph({ spacing: { after: 200 } }));
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
          children: [
            new TextRun({ text: cert.name, bold: true, size: sizes.base * 2 }),
            new TextRun({ text: `\t${cert.date}`, size: (sizes.base - 1) * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10000 }],
        }),
      );

      children.push(
        new Paragraph({
          children: [new TextRun({ text: cert.issuer, size: sizes.base * 2 })],
        }),
      );

      if (cert.website.href) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cert.website.label || cert.website.href,
                size: (sizes.base - 1) * 2,
                color: primaryColor,
              }),
            ],
          }),
        );
      }

      if (hasContent(cert.description)) {
        children.push(...renderDescription(cert.description, sizes.base));
      }

      children.push(new Paragraph({ spacing: { after: 200 } }));
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
          children: [
            new TextRun({ text: vol.position, bold: true, size: sizes.base * 2 }),
            new TextRun({ text: `\t${vol.period}`, size: (sizes.base - 1) * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10000 }],
        }),
      );

      children.push(
        new Paragraph({
          children: [new TextRun({ text: vol.organization, size: sizes.base * 2 })],
        }),
      );

      if (hasContent(vol.description)) {
        children.push(...renderDescription(vol.description, sizes.base));
      }

      children.push(new Paragraph({ spacing: { after: 200 } }));
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
          children: [
            new TextRun({ text: pub.name, bold: true, size: sizes.base * 2 }),
            new TextRun({ text: `\t${pub.date}`, size: (sizes.base - 1) * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10000 }],
        }),
      );

      children.push(
        new Paragraph({
          children: [new TextRun({ text: pub.publisher, size: sizes.base * 2 })],
        }),
      );

      if (hasContent(pub.description)) {
        children.push(...renderDescription(pub.description, sizes.base));
      }

      children.push(new Paragraph({ spacing: { after: 200 } }));
    });
  };

  const renderReferences = () => {
    const visibleItems = sections.references.items.filter((i) => i.visible && i.name);
    if (!sections.references.visible || visibleItems.length === 0) return;

    children.push(...createSectionTitle(sections.references.name));

    visibleItems.forEach((ref) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: ref.name, bold: true, size: sizes.base * 2 }),
            new TextRun({ text: `\t${ref.position}`, size: (sizes.base - 1) * 2 }),
          ],
          tabStops: [{ type: AlignmentType.RIGHT, position: 10000 }],
        }),
      );

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${ref.email}${ref.phone ? ` | ${ref.phone}` : ''}`,
              size: (sizes.base - 2) * 2,
              color: '666666',
            }),
          ],
          spacing: { after: 120 },
        }),
      );
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
        }),
      );

      if (hasContent(item.description)) {
        children.push(...renderDescription(item.description, sizes.base));
      }

      children.push(new Paragraph({ spacing: { after: 200 } }));
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: children,
      },
    ],
  });

  return await Packer.toBlob(doc);
};
