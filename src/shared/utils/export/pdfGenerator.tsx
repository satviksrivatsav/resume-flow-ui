// src/utils/export/pdfGenerator.tsx
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

import { cleanPhoneNumber, getCountryByCode } from '@/shared/lib/countries';
import { cleanProfileDisplay, hasContent, stripHtml } from '@/shared/lib/utils';
import { DEFAULT_SECTION_ORDER, ResumeData } from '@/shared/types/resume';

interface PDFGeneratorProps {
  resumeData: ResumeData;
}

// Register fonts from public/fonts folder
Font.registerHyphenationCallback((word) => {
  if (word.length > 12) {
    const parts = [];
    for (let i = 0; i < word.length; i += 6) {
      parts.push(word.substring(i, i + 6));
    }
    return parts;
  }
  return [word];
});

// Registering all available fonts matching the FONT_FAMILIES of the application
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

Font.register({
  family: 'Lato',
  fonts: [
    { src: '/fonts/Lato-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Lato-Bold.ttf', fontWeight: 700 },
  ],
});

Font.register({
  family: 'Montserrat',
  fonts: [
    { src: '/fonts/Montserrat-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Montserrat-Bold.ttf', fontWeight: 700 },
  ],
});

Font.register({
  family: 'Raleway',
  fonts: [
    { src: '/fonts/Raleway-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Raleway-Bold.ttf', fontWeight: 700 },
  ],
});

Font.register({
  family: 'Caladea',
  fonts: [
    { src: '/fonts/Caladea-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Caladea-Bold.ttf', fontWeight: 700 },
  ],
});

Font.register({
  family: 'Lora',
  fonts: [
    { src: '/fonts/Lora-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Lora-Bold.ttf', fontWeight: 700 },
  ],
});

Font.register({
  family: 'Roboto Slab',
  fonts: [
    { src: '/fonts/RobotoSlab-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/RobotoSlab-Bold.ttf', fontWeight: 700 },
  ],
});

Font.register({
  family: 'Playfair Display',
  fonts: [
    { src: '/fonts/PlayfairDisplay-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/PlayfairDisplay-Bold.ttf', fontWeight: 700 },
  ],
});

Font.register({
  family: 'Merriweather',
  fonts: [
    { src: '/fonts/Merriweather-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Merriweather-Bold.ttf', fontWeight: 700 },
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

const GithubIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Path
      d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
      stroke="#000"
      strokeWidth={2}
      fill="none"
    />
    <Path d="M9 18c-4.51 2-5-2-7-2" stroke="#000" strokeWidth={2} fill="none" />
  </Svg>
);

const LinkedinIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Path
      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
      stroke="#000"
      strokeWidth={2}
      fill="none"
    />
    <Rect x="2" y="9" width="4" height="12" stroke="#000" strokeWidth={2} fill="none" />
    <Circle cx="4" cy="4" r="2" stroke="#000" strokeWidth={2} fill="none" />
  </Svg>
);

const getProfileIcon = (network: string) => {
  const n = network.toLowerCase();
  if (n.includes('github')) return <GithubIcon />;
  if (n.includes('linkedin')) return <LinkedinIcon />;
  return <WebsiteIcon />;
};

// Prevents text from overflowing its container horizontally
const safeTextStyle = {
  minWidth: 0,
  maxWidth: '100%',
  flexShrink: 1,
};

const PDFDescriptionRenderer = ({
  text,
  style,
  titleElement,
  headerElement,
}: {
  text?: string;
  style?: any;
  titleElement?: React.ReactNode;
  headerElement?: React.ReactNode;
}) => {
  if (!text && !titleElement && !headerElement) return null;

  const processedText = stripHtml(text || '');
  const lines = processedText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '');

  // Each line is individually atomic (wrap={false}) so a single line
  // never splits across pages. If it doesn't fit, the whole line moves.
  const renderLine = (line: string, index: number) => {
    const bulletMatch = /^•\s*(.*)/.exec(line);
    if (bulletMatch) {
      return (
        <View key={index} style={{ flexDirection: 'row', width: '100%', marginBottom: 2 }} wrap={false}>
          <Text style={{ ...style, ...safeTextStyle, width: 12, flexShrink: 0 }}>•</Text>
          <Text style={{ ...style, ...safeTextStyle, flex: 1 }}>{bulletMatch[1]}</Text>
        </View>
      );
    }
    return (
      <Text key={index} style={{ ...style, ...safeTextStyle, marginBottom: 2, width: '100%' }} wrap={false}>
        {line}
      </Text>
    );
  };

  return (
    <View style={{ width: '100%' }}>
      {/* Title with minPresenceAhead: ensures at least 30pt of content
          follows the title on the same page. If there isn't enough room,
          the title moves to the next page instead of being orphaned. */}
      {titleElement && (
        <View minPresenceAhead={30} style={{ width: '100%' }}>
          {titleElement}
        </View>
      )}

      {/* Header (item title/subtitle/date row) with minPresenceAhead:
          ensures at least the first description line follows on same page. */}
      {headerElement && (
        <View minPresenceAhead={16} style={{ width: '100%' }}>
          {headerElement}
        </View>
      )}

      {/* Each line breaks atomically — a line either fits or moves entirely */}
      {lines.map((line, i) => renderLine(line, i))}
    </View>
  );
};

export const PDFGenerator: React.FC<PDFGeneratorProps> = ({ resumeData }) => {
  const { basics, summary, sections, customSections, metadata } = resumeData;

  const baseSize = metadata.typography.fontSize || 11;
  const sizes = {
    base: baseSize,
    heading: baseSize + 2,
    name: baseSize * 2,
  };
  const fontFamily = metadata.typography.fontFamily || 'Roboto';

  const baseLineHeight = metadata.typography.lineHeight || 1.5;
  const effectiveLineHeight = Math.max(1.0, baseLineHeight);
  const spacingScale = baseLineHeight / 1.5;

  const getSpacing = (base: number) => base * spacingScale;

  const PAGE_MARGINS = 40;

  const styles = StyleSheet.create({
    page: {
      fontFamily: fontFamily,
      fontSize: sizes.base,
      color: '#000000',
      padding: PAGE_MARGINS,
      backgroundColor: '#ffffff',
    },
    contentBox: {
      flexDirection: 'column',
      width: '100%',
    },
    header: {
      marginBottom: getSpacing(20),
      alignItems: 'center',
      width: '100%',
    },
    name: {
      fontSize: sizes.name,
      fontWeight: 700,
      color: metadata.theme.primary || '#1f2937',
      marginBottom: getSpacing(6),
      textAlign: 'center',
      width: '100%',
      lineHeight: 1.1,
    },
    headline: {
      fontSize: sizes.heading,
      color: '#444444',
      marginBottom: getSpacing(10),
      textAlign: 'center',
      width: '100%',
      lineHeight: 1.2,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      fontSize: sizes.base - 1,
      color: '#000000',
      justifyContent: 'center',
      width: '100%',
    },
    contactItem: {
      marginRight: 10,
      flexShrink: 1,
      lineHeight: 1.3,
    },
    section: {
      marginBottom: getSpacing(18),
      width: '100%',
      flexDirection: 'column',
    },
    sectionTitleContainer: {
      paddingBottom: getSpacing(10),
      width: '100%',
    },
    sectionTitleUnderline: {
      borderBottomWidth: 1,
      borderBottomColor: metadata.theme.primary || '#1f2937',
      paddingBottom: getSpacing(4),
      width: '100%',
    },
    sectionTitle: {
      fontSize: sizes.heading,
      fontWeight: 700,
      color: metadata.theme.primary || '#1f2937',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      lineHeight: 1.1,
    },
    itemContainer: {
      marginBottom: getSpacing(12),
      width: '100%',
      flexDirection: 'column',
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: getSpacing(4),
      alignItems: 'flex-start',
      width: '100%',
    },
    itemHeaderLeft: {
      flex: 1,
      paddingRight: 12,
    },
    itemTitle: {
      fontSize: sizes.base,
      fontWeight: 700,
      color: '#000000',
      marginBottom: getSpacing(2),
      lineHeight: effectiveLineHeight,
    },
    itemSubtitle: {
      fontSize: sizes.base,
      color: '#000000',
      lineHeight: effectiveLineHeight,
    },
    itemDate: {
      fontSize: sizes.base - 1,
      color: '#000000',
      lineHeight: effectiveLineHeight,
      flexShrink: 0,
    },
    itemLocation: {
      fontSize: sizes.base - 1,
      color: '#000000',
      marginBottom: getSpacing(4),
      lineHeight: effectiveLineHeight,
      width: '100%',
    },
    itemDescription: {
      fontSize: sizes.base,
      color: '#000000',
      lineHeight: effectiveLineHeight,
      width: '100%',
    },
    skillsContainer: {
      flexDirection: 'column',
      width: '100%',
    },
    skillRow: {
      marginBottom: getSpacing(4),
      width: '100%',
    },
    skillName: {
      fontWeight: 700,
      fontSize: sizes.base,
      color: '#000000',
      lineHeight: effectiveLineHeight,
    },
    skillItems: {
      fontSize: sizes.base,
      color: '#000000',
      lineHeight: effectiveLineHeight,
    },
    link: {
      fontSize: sizes.base - 1,
      color: metadata.theme.primary || '#1f2937',
      textDecoration: 'none',
      lineHeight: effectiveLineHeight,
    },
  });

  const country = basics.countryCode ? getCountryByCode(basics.countryCode) : null;
  const dialCode = country?.dialCode || '';
  const localPhone = cleanPhoneNumber(basics.phone, basics.countryCode);
  const formattedPhone = dialCode ? `${dialCode} ${localPhone}` : localPhone;

  const contactInfo = [
    { value: basics.email, Icon: MailIcon, isLink: true, prefix: 'mailto:' },
    { value: formattedPhone, Icon: PhoneIcon },
    { value: basics.location, Icon: MapPinIcon },
    { value: basics.url.href, Icon: WebsiteIcon, isLink: true, prefix: '' },
  ].filter((item) => item.value && item.value.trim());

  const sectionOrder: string[] = metadata.sectionOrder ?? DEFAULT_SECTION_ORDER;

  const renderItemWebsite = (website?: { label?: string; href?: string }) => {
    if (!website?.href || !website.href.trim()) return null;
    const displayText = website.label?.trim() || website.href.trim();
    return (
      <View style={{ marginTop: 2 }}>
        <Link
          src={website.href}
          style={{
            fontSize: sizes.base - 1,
            color: metadata.theme.primary || '#1f2937',
            textDecoration: 'underline',
            lineHeight: effectiveLineHeight,
          }}
        >
          <Text>{displayText}</Text>
        </Link>
      </View>
    );
  };

  const renderSummary = () =>
    hasContent(summary.content) && summary.visible ? (
      <View key="summary" style={styles.section}>
        <PDFDescriptionRenderer
          text={summary.content}
          style={styles.itemDescription}
          titleElement={
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionTitleUnderline}>
                <Text style={styles.sectionTitle}>Summary</Text>
              </View>
            </View>
          }
        />
      </View>
    ) : null;

  const renderExperience = () => {
    const visibleItems = sections.experience.items.filter(
      (i) => i.visible && (i.company || i.position || hasContent(i.description)),
    );
    if (!sections.experience.visible || visibleItems.length === 0) return null;

    return (
      <View key="experience" style={styles.section}>
        {visibleItems.map((exp, index) => (
          <View key={exp.id} style={{ marginBottom: getSpacing(12), width: '100%' }}>
            <PDFDescriptionRenderer
              text={exp.description}
              style={styles.itemDescription}
              titleElement={
                index === 0 ? (
                  <View style={styles.sectionTitleContainer}>
                    <View style={styles.sectionTitleUnderline}>
                      <Text style={styles.sectionTitle}>{sections.experience.name}</Text>
                    </View>
                  </View>
                ) : null
              }
              headerElement={
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderLeft}>
                    <Text style={{ ...styles.itemTitle, color: '#000' }}>
                      <Text style={{ fontWeight: 700 }}>{exp.position}</Text>
                      {exp.company ? <Text style={{ fontWeight: 400 }}>, {exp.company}</Text> : null}
                    </Text>
                    {renderItemWebsite(exp.website)}
                  </View>
                  <Text style={styles.itemDate}>{exp.period}</Text>
                </View>
              }
            />
          </View>
        ))}
      </View>
    );
  };

  const renderEducation = () => {
    const visibleItems = sections.education.items.filter(
      (i) => i.visible && (i.school || i.degree || hasContent(i.description)),
    );
    if (!sections.education.visible || visibleItems.length === 0) return null;

    return (
      <View key="education" style={styles.section}>
        {visibleItems.map((edu, index) => (
          <View key={edu.id} style={{ marginBottom: getSpacing(12), width: '100%' }}>
            <PDFDescriptionRenderer
              text={edu.description}
              style={styles.itemDescription}
              titleElement={
                index === 0 ? (
                  <View style={styles.sectionTitleContainer}>
                    <View style={styles.sectionTitleUnderline}>
                      <Text style={styles.sectionTitle}>{sections.education.name}</Text>
                    </View>
                  </View>
                ) : null
              }
              headerElement={
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderLeft}>
                    <Text style={{ ...styles.itemTitle, color: '#000' }}>
                      <Text style={{ fontWeight: 700 }}>{edu.degree}</Text>
                      {edu.area ? <Text style={{ fontWeight: 400 }}> in {edu.area}</Text> : null}
                    </Text>
                    {edu.school ? (
                      <Text style={styles.itemSubtitle}>
                        <Text style={{ fontWeight: 700 }}>{edu.school}</Text>
                        {edu.grade ? <Text style={{ fontWeight: 400 }}> • {edu.grade}</Text> : null}
                      </Text>
                    ) : null}
                    {renderItemWebsite(edu.website)}
                  </View>
                  <Text style={styles.itemDate}>{edu.period}</Text>
                </View>
              }
            />
          </View>
        ))}
      </View>
    );
  };

  const renderProjects = () => {
    const visibleItems = sections.projects.items.filter(
      (i) => i.visible && (i.name || hasContent(i.description)),
    );
    if (!sections.projects.visible || visibleItems.length === 0) return null;

    return (
      <View key="projects" style={styles.section}>
        {visibleItems.map((proj, index) => (
          <View key={proj.id} style={{ marginBottom: getSpacing(12), width: '100%' }}>
            <PDFDescriptionRenderer
              text={proj.description}
              style={styles.itemDescription}
              titleElement={
                index === 0 ? (
                  <View style={styles.sectionTitleContainer}>
                    <View style={styles.sectionTitleUnderline}>
                      <Text style={styles.sectionTitle}>{sections.projects.name}</Text>
                    </View>
                  </View>
                ) : null
              }
              headerElement={
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderLeft}>
                    <Text style={styles.itemTitle}>{proj.name || 'Project'}</Text>
                    {renderItemWebsite(proj.website)}
                  </View>
                  <Text style={styles.itemDate}>{proj.period}</Text>
                </View>
              }
            />
          </View>
        ))}
      </View>
    );
  };

  const renderSkills = () => {
    const visibleItems = sections.skills.items.filter(
      (i) => i.visible && i.name && (i.keywords.length > 0 || hasContent(i.description)),
    );
    if (!sections.skills.visible || visibleItems.length === 0) return null;

    return (
      <View key="skills" style={styles.section}>
        <View minPresenceAhead={30} style={{ width: '100%' }}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionTitleUnderline}>
              <Text style={styles.sectionTitle}>{sections.skills.name}</Text>
            </View>
          </View>
        </View>
        <View style={styles.skillsContainer}>
          {visibleItems.map((skill) => (
            <View
              key={skill.id}
              style={{ ...styles.skillRow, marginBottom: getSpacing(4), width: '100%' }}
              wrap={false}
            >
              <Text style={{ ...styles.skillItems, ...safeTextStyle }}>
                <Text style={styles.skillName}>{skill.name || 'Category'}:</Text>{' '}
                {skill.keywords && skill.keywords.length > 0
                  ? skill.keywords.join(', ')
                  : stripHtml(skill.description || '')}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderLanguages = () => {
    const visibleItems = sections.languages.items.filter((i) => i.visible && i.name);
    if (!sections.languages.visible || visibleItems.length === 0) return null;

    return (
      <View key="languages" style={styles.section}>
        <View minPresenceAhead={30} style={{ width: '100%' }}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionTitleUnderline}>
              <Text style={styles.sectionTitle}>{sections.languages.name}</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
          {visibleItems.map((lang, index) => (
            <View
              key={lang.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 8,
                marginBottom: getSpacing(4),
              }}
              wrap={false}
            >
              <Text style={{ ...safeTextStyle, fontWeight: 700 }}>{lang.name}</Text>
              {lang.description ? (
                <Text style={{ ...safeTextStyle, color: '#555', marginLeft: 4 }}>({lang.description})</Text>
              ) : null}
              {index < visibleItems.length - 1 ? <Text style={{ marginLeft: 2 }}>,</Text> : null}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderInterests = () => {
    const visibleItems = sections.interests.items.filter((i) => i.visible && i.name);
    if (!sections.interests.visible || visibleItems.length === 0) return null;

    const content = visibleItems
      .map((i) => i.name + (i.keywords.length > 0 ? ` (${i.keywords.join(', ')})` : ''))
      .join(', ');

    return (
      <View key="interests" style={styles.section}>
        <PDFDescriptionRenderer
          text={content}
          style={styles.itemDescription}
          titleElement={
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionTitleUnderline}>
                <Text style={styles.sectionTitle}>{sections.interests.name}</Text>
              </View>
            </View>
          }
        />
      </View>
    );
  };

  const renderAwards = () => {
    const visibleItems = sections.awards.items.filter(
      (i) => i.visible && (i.title || hasContent(i.description)),
    );
    if (!sections.awards.visible || visibleItems.length === 0) return null;

    return (
      <View key="awards" style={styles.section}>
        {visibleItems.map((award, index) => (
          <View key={award.id} style={{ marginBottom: getSpacing(12), width: '100%' }}>
            <PDFDescriptionRenderer
              text={award.description}
              style={styles.itemDescription}
              titleElement={
                index === 0 ? (
                  <View style={styles.sectionTitleContainer}>
                    <View style={styles.sectionTitleUnderline}>
                      <Text style={styles.sectionTitle}>{sections.awards.name}</Text>
                    </View>
                  </View>
                ) : null
              }
              headerElement={
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderLeft}>
                    <Text style={styles.itemTitle}>{award.title}</Text>
                    <Text style={styles.itemSubtitle}>{award.awarder}</Text>
                  </View>
                  <Text style={styles.itemDate}>{award.date}</Text>
                </View>
              }
            />
          </View>
        ))}
      </View>
    );
  };

  const renderCertifications = () => {
    const visibleItems = sections.certifications.items.filter(
      (i) => i.visible && (i.name || hasContent(i.description)),
    );
    if (!sections.certifications.visible || visibleItems.length === 0) return null;

    return (
      <View key="certifications" style={styles.section}>
        {visibleItems.map((cert, index) => (
          <View key={cert.id} style={{ marginBottom: getSpacing(12), width: '100%' }}>
            <PDFDescriptionRenderer
              text={cert.description}
              style={styles.itemDescription}
              titleElement={
                index === 0 ? (
                  <View style={styles.sectionTitleContainer}>
                    <View style={styles.sectionTitleUnderline}>
                      <Text style={styles.sectionTitle}>{sections.certifications.name}</Text>
                    </View>
                  </View>
                ) : null
              }
              headerElement={
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderLeft}>
                    <Text style={styles.itemTitle}>{cert.name}</Text>
                    <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
                    {renderItemWebsite(cert.website)}
                  </View>
                  <Text style={styles.itemDate}>{cert.date}</Text>
                </View>
              }
            />
          </View>
        ))}
      </View>
    );
  };

  const renderVolunteer = () => {
    const visibleItems = sections.volunteer.items.filter(
      (i) => i.visible && (i.organization || i.position || hasContent(i.description)),
    );
    if (!sections.volunteer.visible || visibleItems.length === 0) return null;

    return (
      <View key="volunteer" style={styles.section}>
        {visibleItems.map((vol, index) => (
          <View key={vol.id} style={{ marginBottom: getSpacing(12), width: '100%' }}>
            <PDFDescriptionRenderer
              text={vol.description}
              style={styles.itemDescription}
              titleElement={
                index === 0 ? (
                  <View style={styles.sectionTitleContainer}>
                    <View style={styles.sectionTitleUnderline}>
                      <Text style={styles.sectionTitle}>{sections.volunteer.name}</Text>
                    </View>
                  </View>
                ) : null
              }
              headerElement={
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderLeft}>
                    <Text style={styles.itemTitle}>{vol.position}</Text>
                    <Text style={styles.itemSubtitle}>{vol.organization}</Text>
                    {renderItemWebsite(vol.website)}
                  </View>
                  <Text style={styles.itemDate}>{vol.period}</Text>
                </View>
              }
            />
          </View>
        ))}
      </View>
    );
  };

  const renderPublications = () => {
    const visibleItems = sections.publications.items.filter(
      (i) => i.visible && (i.name || hasContent(i.description)),
    );
    if (!sections.publications.visible || visibleItems.length === 0) return null;

    return (
      <View key="publications" style={styles.section}>
        {visibleItems.map((pub, index) => (
          <View key={pub.id} style={{ marginBottom: getSpacing(12), width: '100%' }}>
            <PDFDescriptionRenderer
              text={pub.description}
              style={styles.itemDescription}
              titleElement={
                index === 0 ? (
                  <View style={styles.sectionTitleContainer}>
                    <View style={styles.sectionTitleUnderline}>
                      <Text style={styles.sectionTitle}>{sections.publications.name}</Text>
                    </View>
                  </View>
                ) : null
              }
              headerElement={
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderLeft}>
                    <Text style={styles.itemTitle}>{pub.name}</Text>
                    <Text style={styles.itemSubtitle}>{pub.publisher}</Text>
                    {renderItemWebsite(pub.website)}
                  </View>
                  <Text style={styles.itemDate}>{pub.date}</Text>
                </View>
              }
            />
          </View>
        ))}
      </View>
    );
  };

  const renderReferences = () => {
    const visibleItems = sections.references.items.filter((i) => i.visible && i.name);
    if (!sections.references.visible || visibleItems.length === 0) return null;

    return (
      <View key="references" style={styles.section}>
        <View minPresenceAhead={30} style={{ width: '100%' }}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionTitleUnderline}>
              <Text style={styles.sectionTitle}>{sections.references.name}</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
          {visibleItems.map((ref) => (
            <View key={ref.id} style={{ width: '45%', marginBottom: getSpacing(12), marginRight: 15 }} wrap={false}>
              <Text style={{ ...safeTextStyle, fontWeight: 700 }}>{ref.name}</Text>
              <Text style={{ ...safeTextStyle, fontSize: sizes.base - 1 }}>{ref.position}</Text>
              <Text style={{ ...safeTextStyle, fontSize: sizes.base - 2, color: '#666' }}>
                {ref.email} {ref.phone ? `| ${ref.phone}` : ''}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: renderSummary,
    experience: renderExperience,
    education: renderEducation,
    projects: renderProjects,
    skills: renderSkills,
    profiles: () => null,
    languages: renderLanguages,
    interests: renderInterests,
    awards: renderAwards,
    certifications: renderCertifications,
    publications: renderPublications,
    volunteer: renderVolunteer,
    references: renderReferences,
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.contentBox}>
          <View style={styles.header} wrap={false}>
            <Text style={styles.name}>{basics.name || 'Your Name'}</Text>
            {basics.headline ? <Text style={styles.headline}>{basics.headline}</Text> : null}
            <View style={styles.contactRow}>
              {contactInfo.map((item: any, index) => (
                <View
                  key={index}
                  style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12, maxWidth: '100%' }}
                >
                  <item.Icon />
                  {item.isLink ? (
                    <Link
                      src={item.prefix + item.value}
                      style={{
                        ...styles.contactItem,
                        color: metadata.theme.primary || '#1f2937',
                        textDecoration: 'underline',
                      }}
                    >
                      <Text>{item.value}</Text>
                    </Link>
                  ) : (
                    <Text style={styles.contactItem}>{item.value}</Text>
                  )}
                </View>
              ))}
            </View>
            {sections.profiles.items.filter(
              (p: any) => p.visible && (p.network || p.username || p.website?.href),
            ).length > 0 ? (
              <View style={{ ...styles.contactRow, marginTop: 4 }}>
                {sections.profiles.items
                  .filter((p: any) => p.visible && (p.network || p.username || p.website?.href))
                  .map((profile: any, index: number) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 12,
                        maxWidth: '100%',
                      }}
                    >
                      {getProfileIcon(profile.network)}
                      {profile.website?.href ? (
                        <Link
                          src={profile.website.href}
                          style={{
                            ...styles.contactItem,
                            color: metadata.theme.primary || '#1f2937',
                            textDecoration: 'underline',
                          }}
                        >
                          <Text>{profile.website.href}</Text>
                        </Link>
                      ) : (
                        <Text style={styles.contactItem}>
                          {profile.network}
                          {profile.username ? `: ${profile.username}` : ''}
                        </Text>
                      )}
                    </View>
                  ))}
              </View>
            ) : null}
          </View>

          {renderSummary()}

          {sectionOrder
            .filter((key) => key !== 'summary')
            .map((key) => {
              const renderer = sectionRenderers[key];
              return renderer ? renderer() : null;
            })}

          {customSections
            .filter((s) => s.visible && s.items.length > 0)
            .map((section) => {
              const visibleItems = section.items.filter(
                (item: any) => item.visible && (item.title || hasContent(item.description)),
              );
              if (visibleItems.length === 0) return null;

              return (
                <View key={section.id} style={styles.section}>
                  {visibleItems.map((item: any, index: number) => (
                    <View key={item.id} style={{ marginBottom: getSpacing(12), width: '100%' }}>
                      <PDFDescriptionRenderer
                        text={item.description}
                        style={styles.itemDescription}
                        titleElement={
                          index === 0 ? (
                            <View style={styles.sectionTitleContainer}>
                              <View style={styles.sectionTitleUnderline}>
                                <Text style={styles.sectionTitle}>{section.name}</Text>
                              </View>
                            </View>
                          ) : null
                        }
                        headerElement={<Text style={styles.itemTitle}>{item.title}</Text>}
                      />
                    </View>
                  ))}
                </View>
              );
            })}
        </View>
      </Page>
    </Document>
  );
};
