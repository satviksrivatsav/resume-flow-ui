import {
  AlignmentType,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';

import { ResumeData } from '@/types/resume';
import { stripHtml } from '@/lib/utils';
import { getCountryByCode, cleanPhoneNumber } from '@/lib/countries';


export const generateDocx = async (resumeData: ResumeData): Promise<Blob> => {
  const sections: any[] = [];

  // Basics Section
  sections.push({
    properties: {},
    children: [
      new Paragraph({
        text: resumeData.basics.name || 'Resume',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `${resumeData.basics.email}${
              resumeData.basics.phone 
                ? ` | ${
                    resumeData.basics.countryCode 
                      ? getCountryByCode(resumeData.basics.countryCode)?.dialCode + ' ' 
                      : ''
                  }${cleanPhoneNumber(resumeData.basics.phone, resumeData.basics.countryCode)}` 
                : ''
            }${resumeData.basics.location ? ` | ${resumeData.basics.location}` : ''}`,
          }),
        ],
      }),
      ...(resumeData.basics.url?.href
        ? [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ExternalHyperlink({
                  children: [
                    new TextRun({
                      text: resumeData.basics.url.label || resumeData.basics.url.href,
                      style: 'Hyperlink',
                    }),
                  ],
                  link: resumeData.basics.url.href,
                }),
              ],
            }),
          ]
        : []),
      new Paragraph({ text: '', spacing: { after: 200 } }),
    ],
  });

  // Summary Section
  if (resumeData.summary.visible && resumeData.summary.content) {
    sections[0].children.push(
      new Paragraph({
        text: 'Professional Summary',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        text: stripHtml(resumeData.summary.content),
        spacing: { after: 200 },
      }),

    );
  }

  // Experience Section
  if (resumeData.sections.experience.visible && resumeData.sections.experience.items.length > 0) {
    sections[0].children.push(
      new Paragraph({
        text: 'Work Experience',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
    );

    resumeData.sections.experience.items.forEach((item) => {
      if (!item.visible) return;

      sections[0].children.push(
        new Paragraph({
          children: [
            new TextRun({ text: item.company, bold: true }),
            new TextRun({ text: ` | ${item.position}`, italics: true }),
            new TextRun({ text: `\t${item.period}`, bold: false }),
          ],
          tabStops: [
            {
              type: AlignmentType.RIGHT,
              position: 9000,
            },
          ],
        }),
        new Paragraph({
          text: stripHtml(item.description),
          spacing: { after: 120 },
        }),

      );

      if (item.roles && item.roles.length > 0) {
        item.roles.forEach((role) => {
          sections[0].children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `  • ${role.position}`, bold: true }),
                new TextRun({ text: ` (${role.period})` }),
              ],
            }),
            new Paragraph({
              text: stripHtml(role.description),
              spacing: { after: 120 },
            }),

          );
        });
      }
    });
  }

  // Education Section
  if (resumeData.sections.education.visible && resumeData.sections.education.items.length > 0) {
    sections[0].children.push(
      new Paragraph({
        text: 'Education',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
    );

    resumeData.sections.education.items.forEach((item) => {
      if (!item.visible) return;

      sections[0].children.push(
        new Paragraph({
          children: [
            new TextRun({ text: item.school, bold: true }),
            new TextRun({ text: `\t${item.period}`, bold: false }),
          ],
          tabStops: [
            {
              type: AlignmentType.RIGHT,
              position: 9000,
            },
          ],
        }),
        new Paragraph({
          text: `${item.degree}${item.area ? ` in ${item.area}` : ''}${item.grade ? ` (Grade: ${item.grade})` : ''}`,
          spacing: { after: 120 },
        }),
      );
    });
  }

  // Skills Section
  if (resumeData.sections.skills.visible && resumeData.sections.skills.items.length > 0) {
    sections[0].children.push(
      new Paragraph({
        text: 'Skills',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
    );

    const skillsText = resumeData.sections.skills.items
      .filter((item) => item.visible)
      .map((item) => `${item.name}${item.description ? ` (${item.description})` : ''}`)
      .join(', ');

    sections[0].children.push(
      new Paragraph({
        text: skillsText,
        spacing: { after: 200 },
      }),
    );
  }

  const doc = new Document({
    sections: sections,
  });

  return await Packer.toBlob(doc);
};
