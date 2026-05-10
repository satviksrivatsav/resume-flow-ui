// src/components/resume/ResumePDF.tsx
// Using local font files from public/fonts folder

import {
  Circle,
  Document,
  Font,
  Link,
  Page,
  Path,
  Rect,
  StyleSheet,
  Svg,
  Text,
  View,
} from '@react-pdf/renderer';
import React from 'react';

import { ResumeData } from '@/types/resume';

interface ResumePDFProps {
  resumeData: ResumeData;
}

// Register fonts from public/fonts folder
Font.registerHyphenationCallback((word) => [word]);

// Registering default fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 700 },
  ],
});

Font.register({
  family: 'Open Sans',
  fonts: [
    { src: '/fonts/OpenSans-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/OpenSans-Bold.ttf', fontWeight: 700 },
  ],
});

const MailIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Rect x="2" y="4" width="20" height="16" rx="2" stroke="#000" strokeWidth={2} fill="none" />
    <Path d="m22 7-10 7L2 7" stroke="#000" strokeWidth={2} fill="none" />
  </Svg>
);

const PhoneIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      stroke="#000"
      strokeWidth={2}
      fill="none"
    />
  </Svg>
);

const MapPinIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Path
      d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
      stroke="#000"
      strokeWidth={2}
      fill="none"
    />
    <Circle cx="12" cy="10" r="3" stroke="#000" strokeWidth={2} fill="none" />
  </Svg>
);

const WebsiteIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Circle cx="12" cy="12" r="10" stroke="#000" strokeWidth={2} fill="none" />
    <Path
      d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      stroke="#000"
      strokeWidth={2}
      fill="none"
    />
  </Svg>
);

const stripHtml = (html: string) => {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<li>/gi, '\n• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n\s*\n/g, '\n')
    .trim();
};

const PDFDescriptionRenderer = ({ text, style }: { text?: string; style?: any }) => {
  if (!text) return null;

  const processedText = stripHtml(text);
  const lines = processedText.split('\n');

  return (
    <View style={style}>
      {lines.map((line, i) => {
        const bulletMatch = line.match(/^(\s*)([•\-\*·\u2022\u2023\u2043\u204c\u204d\u2219])\s+(.*)/);

        if (bulletMatch) {
          const indent = bulletMatch[1];
          const bulletChar = bulletMatch[2];
          const content = bulletMatch[3];

          return (
            <View
              key={i}
              style={{ flexDirection: 'row', marginBottom: 2, alignItems: 'flex-start' }}
            >
              <Text
                style={{ width: 12, flexShrink: 0, marginLeft: indent ? indent.length * 4 : 0 }}
              >
                {bulletChar}
              </Text>
              <Text style={{ flex: 1, hyphens: 'none' }}>{content}</Text>
            </View>
          );
        }

        return (
          <Text key={i} style={{ marginBottom: line.trim() === '' ? 4 : 2, hyphens: 'none' }}>
            {line}
          </Text>
        );
      })}
    </View>
  );
};

export const ResumePDF: React.FC<ResumePDFProps> = ({ resumeData }) => {
  const { basics, summary, sections, customSections, metadata } = resumeData;

  const baseSize = metadata.typography.fontSize || 11;
  const sizes = {
    base: baseSize,
    heading: baseSize + 2,
    name: baseSize * 2,
  };
  const fontFamily = metadata.typography.fontFamily || 'Roboto';

  const styles = StyleSheet.create({
    page: {
      fontFamily: fontFamily,
      fontSize: sizes.base,
      color: '#000000',
      padding: 36,
      backgroundColor: '#ffffff',
    },
    header: {
      marginBottom: 16,
      alignItems: 'center',
    },
    name: {
      fontSize: sizes.name,
      fontWeight: 700,
      color: metadata.theme.primary || '#1f2937',
      marginBottom: 4,
      textAlign: 'center',
    },
    headline: {
      fontSize: sizes.heading,
      color: '#444444',
      marginBottom: 8,
      textAlign: 'center',
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      fontSize: sizes.base - 1,
      color: '#000000',
      justifyContent: 'center',
    },
    contactItem: {
      marginRight: 8,
    },
    section: {
      marginBottom: 14,
    },
    sectionTitleContainer: {
      borderBottomWidth: 1,
      borderBottomColor: metadata.theme.primary || '#1f2937',
      paddingBottom: 2,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: sizes.heading,
      fontWeight: 700,
      color: metadata.theme.primary || '#1f2937',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    itemContainer: {
      marginBottom: 10,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
      alignItems: 'flex-start',
    },
    itemHeaderLeft: {
      flex: 1,
      paddingRight: 12,
    },
    itemTitle: {
      fontSize: sizes.base,
      fontWeight: 700,
      color: '#000000',
      marginBottom: 2,
    },
    itemSubtitle: {
      fontSize: sizes.base,
      color: '#000000',
    },
    itemDate: {
      fontSize: sizes.base - 1,
      color: '#000000',
    },
    itemLocation: {
      fontSize: sizes.base - 1,
      color: '#000000',
      marginBottom: 4,
    },
    itemDescription: {
      fontSize: sizes.base,
      color: '#000000',
      lineHeight: 1.5,
      hyphens: 'none',
    },
    skillsContainer: {
      flexDirection: 'column',
    },
    skillRow: {
      marginBottom: 4,
    },
    skillName: {
      fontWeight: 700,
      fontSize: sizes.base,
      color: '#000000',
    },
    skillItems: {
      fontSize: sizes.base,
      color: '#000000',
    },
    link: {
      fontSize: sizes.base - 1,
      color: metadata.theme.primary || '#1f2937',
      textDecoration: 'none',
    },
    grid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 20,
    },
    gridCol: {
      flex: 1,
    },
  });

  const contactInfo = [
    { value: basics.email, Icon: MailIcon },
    { value: basics.phone, Icon: PhoneIcon },
    { value: basics.location, Icon: MapPinIcon },
    { value: basics.url.href, Icon: WebsiteIcon },
  ].filter((item) => item.value && item.value.trim());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{basics.name || 'Your Name'}</Text>
          {basics.headline && <Text style={styles.headline}>{basics.headline}</Text>}
          <View style={styles.contactRow}>
            {contactInfo.map((item, index) => (
              <View
                key={index}
                style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}
              >
                <item.Icon />
                <Text style={styles.contactItem}>{item.value}</Text>
              </View>
            ))}
            {sections.profiles.items
              .filter((p) => p.visible && (p.network || p.username))
              .map((profile, index) => (
                <View
                  key={index}
                  style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}
                >
                  <Text style={styles.contactItem}>
                    {profile.network}: {profile.username}
                  </Text>
                </View>
              ))}
          </View>
        </View>

        {/* Summary */}
        {summary.content && summary.visible && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer} minPresenceAhead={100}>
              <Text style={styles.sectionTitle}>Summary</Text>
            </View>
            <PDFDescriptionRenderer text={summary.content} style={styles.itemDescription} />
          </View>
        )}

        {/* Experience */}
        {sections.experience.visible && sections.experience.items.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer} minPresenceAhead={150}>
              <Text style={styles.sectionTitle}>{sections.experience.name}</Text>
            </View>
            {sections.experience.items
              .filter((i) => i.visible)
              .map((exp) => (
                <View key={exp.id} style={styles.itemContainer} wrap={false}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemHeaderLeft}>
                      <Text style={styles.itemTitle}>{exp.position || 'Position'}</Text>
                      {exp.company && <Text style={styles.itemSubtitle}>{exp.company}</Text>}
                    </View>
                    <Text style={styles.itemDate}>{exp.period}</Text>
                  </View>
                  {exp.location && <Text style={styles.itemLocation}>{exp.location}</Text>}
                  {exp.description && (
                    <PDFDescriptionRenderer text={exp.description} style={styles.itemDescription} />
                  )}
                </View>
              ))}
          </View>
        )}

        {/* Education */}
        {sections.education.visible && sections.education.items.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer} minPresenceAhead={150}>
              <Text style={styles.sectionTitle}>{sections.education.name}</Text>
            </View>
            {sections.education.items
              .filter((i) => i.visible)
              .map((edu) => (
                <View key={edu.id} style={styles.itemContainer} wrap={false}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemHeaderLeft}>
                      <Text style={styles.itemTitle}>
                        {edu.degree || 'Degree'}
                        {edu.area && ` in ${edu.area}`}
                      </Text>
                      <Text style={styles.itemSubtitle}>
                        {edu.school || 'School'}
                        {edu.grade && ` • ${edu.grade}`}
                      </Text>
                    </View>
                    <Text style={styles.itemDate}>{edu.period}</Text>
                  </View>
                  {edu.description && (
                    <PDFDescriptionRenderer text={edu.description} style={styles.itemDescription} />
                  )}
                </View>
              ))}
          </View>
        )}

        {/* Projects */}
        {sections.projects.visible && sections.projects.items.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer} minPresenceAhead={150}>
              <Text style={styles.sectionTitle}>{sections.projects.name}</Text>
            </View>
            {sections.projects.items
              .filter((i) => i.visible)
              .map((proj) => (
                <View key={proj.id} style={styles.itemContainer} wrap={false}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{proj.name || 'Project'}</Text>
                    <Text style={styles.itemDate}>{proj.period}</Text>
                  </View>
                  {proj.website.href && (
                    <Link src={proj.website.href} style={styles.link}>
                      {proj.website.label || proj.website.href}
                    </Link>
                  )}
                  {proj.description && (
                    <PDFDescriptionRenderer
                      text={proj.description}
                      style={styles.itemDescription}
                    />
                  )}
                  {proj.keywords && proj.keywords.length > 0 && (
                    <Text style={styles.itemSubtitle}>
                      Technologies: {proj.keywords.join(', ')}
                    </Text>
                  )}
                </View>
              ))}
          </View>
        )}

        {/* Skills */}
        {sections.skills.visible && sections.skills.items.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer} minPresenceAhead={100}>
              <Text style={styles.sectionTitle}>{sections.skills.name}</Text>
            </View>
            <View style={styles.skillsContainer}>
              {sections.skills.items
                .filter((i) => i.visible)
                .map((skill) => (
                  <View key={skill.id} style={styles.skillRow} wrap={false}>
                    <Text style={styles.skillItems}>
                      <Text style={styles.skillName}>{skill.name || 'Category'}:</Text>{' '}
                      {skill.keywords && skill.keywords.length > 0
                        ? skill.keywords.join(', ')
                        : skill.description || ''}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* Multi-column sections */}
        <View style={styles.grid}>
          {/* Languages */}
          {sections.languages.visible && sections.languages.items.length > 0 && (
            <View style={[styles.section, styles.gridCol]}>
              <View style={styles.sectionTitleContainer} minPresenceAhead={50}>
                <Text style={styles.sectionTitle}>{sections.languages.name}</Text>
              </View>
              {sections.languages.items
                .filter((i) => i.visible)
                .map((lang) => (
                  <View
                    key={lang.id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <Text style={{ fontWeight: 700 }}>{lang.name}</Text>
                    <Text style={{ fontSize: sizes.base - 1, color: '#666' }}>
                      {lang.description}
                    </Text>
                  </View>
                ))}
            </View>
          )}

          {/* Interests */}
          {sections.interests.visible && sections.interests.items.length > 0 && (
            <View style={[styles.section, styles.gridCol]}>
              <View style={styles.sectionTitleContainer} minPresenceAhead={50}>
                <Text style={styles.sectionTitle}>{sections.interests.name}</Text>
              </View>
              <Text style={styles.itemDescription}>
                {sections.interests.items
                  .filter((i) => i.visible)
                  .map((i) => i.name + (i.keywords.length > 0 ? ` (${i.keywords.join(', ')})` : ''))
                  .join(', ')}
              </Text>
            </View>
          )}
        </View>

        {/* Awards */}
        {sections.awards.visible && sections.awards.items.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer} minPresenceAhead={100}>
              <Text style={styles.sectionTitle}>{sections.awards.name}</Text>
            </View>
            {sections.awards.items
              .filter((i) => i.visible)
              .map((award) => (
                <View key={award.id} style={styles.itemContainer} wrap={false}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemHeaderLeft}>
                      <Text style={styles.itemTitle}>{award.title}</Text>
                      <Text style={styles.itemSubtitle}>{award.awarder}</Text>
                    </View>
                    <Text style={styles.itemDate}>{award.date}</Text>
                  </View>
                  {award.description && (
                    <Text style={styles.itemDescription}>{award.description}</Text>
                  )}
                </View>
              ))}
          </View>
        )}

        {/* Certifications */}
        {sections.certifications.visible && sections.certifications.items.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer} minPresenceAhead={100}>
              <Text style={styles.sectionTitle}>{sections.certifications.name}</Text>
            </View>
            {sections.certifications.items
              .filter((i) => i.visible)
              .map((cert) => (
                <View key={cert.id} style={styles.itemContainer} wrap={false}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemHeaderLeft}>
                      <Text style={styles.itemTitle}>{cert.name}</Text>
                      <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
                    </View>
                    <Text style={styles.itemDate}>{cert.date}</Text>
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* References */}
        {sections.references.visible && sections.references.items.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer} minPresenceAhead={100}>
              <Text style={styles.sectionTitle}>{sections.references.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15 }}>
              {sections.references.items
                .filter((i) => i.visible)
                .map((ref) => (
                  <View key={ref.id} style={{ width: '45%', marginBottom: 8 }}>
                    <Text style={{ fontWeight: 700 }}>{ref.name}</Text>
                    <Text style={{ fontSize: sizes.base - 1 }}>{ref.position}</Text>
                    <Text style={{ fontSize: sizes.base - 2, color: '#666' }}>
                      {ref.email} {ref.phone && `| ${ref.phone}`}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* Custom Sections */}
        {customSections
          .filter((s) => s.visible && s.items.length > 0)
          .map((section) => (
            <View key={section.id} style={styles.section}>
              <View style={styles.sectionTitleContainer} minPresenceAhead={100}>
                <Text style={styles.sectionTitle}>{section.name}</Text>
              </View>
              {section.items.map((item: any) => (
                <View key={item.id} style={styles.itemContainer} wrap={false}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.description && (
                    <PDFDescriptionRenderer
                      text={item.description}
                      style={styles.itemDescription}
                    />
                  )}
                </View>
              ))}
            </View>
          ))}
      </Page>
    </Document>
  );
};
