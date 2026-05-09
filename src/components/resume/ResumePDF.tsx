// src/components/resume/ResumePDF.tsx
// Using local font files from public/fonts folder

import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Link,
  Svg,
  Path,
  Circle,
  Rect,
} from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';
import { getCountryByCode } from '@/lib/countries';

interface ResumePDFProps {
  resumeData: ResumeData;
}

// Register fonts from public/fonts folder
Font.registerHyphenationCallback(word => [word]);

// Roboto
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 700 },
  ]
});

// Lato
Font.register({
  family: 'Lato',
  fonts: [
    { src: '/fonts/Lato-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Lato-Bold.ttf', fontWeight: 700 },
  ]
});

// Montserrat
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: '/fonts/Montserrat-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Montserrat-Bold.ttf', fontWeight: 700 },
  ]
});

// Open Sans
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: '/fonts/OpenSans-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/OpenSans-Bold.ttf', fontWeight: 700 },
  ]
});

// Raleway
Font.register({
  family: 'Raleway',
  fonts: [
    { src: '/fonts/Raleway-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Raleway-Bold.ttf', fontWeight: 700 },
  ]
});

// Roboto Slab
Font.register({
  family: 'Roboto Slab',
  fonts: [
    { src: '/fonts/RobotoSlab-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/RobotoSlab-Bold.ttf', fontWeight: 700 },
  ]
});

// Lora
Font.register({
  family: 'Lora',
  fonts: [
    { src: '/fonts/Lora-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Lora-Bold.ttf', fontWeight: 700 },
  ]
});

// Merriweather
Font.register({
  family: 'Merriweather',
  fonts: [
    { src: '/fonts/Merriweather-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Merriweather-Bold.ttf', fontWeight: 700 },
  ]
});

// Caladea
Font.register({
  family: 'Caladea',
  fonts: [
    { src: '/fonts/Caladea-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Caladea-Bold.ttf', fontWeight: 700 },
  ]
});

// Playfair Display
Font.register({
  family: 'Playfair Display',
  fonts: [
    { src: '/fonts/PlayfairDisplay-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/PlayfairDisplay-Bold.ttf', fontWeight: 700 },
  ]
});

const fontSizeMap = {
  compact: { base: 9, heading: 11, name: 18 },
  standard: { base: 11, heading: 13, name: 22 },
  large: { base: 13, heading: 15, name: 26 },
};

const MailIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Rect x="2" y="4" width="20" height="16" rx="2" stroke="#000" strokeWidth={2} fill="none" />
    <Path d="m22 7-10 7L2 7" stroke="#000" strokeWidth={2} fill="none" />
  </Svg>
);

const PhoneIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#000" strokeWidth={2} fill="none" />
  </Svg>
);

const MapPinIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" stroke="#000" strokeWidth={2} fill="none" />
    <Circle cx="12" cy="10" r="3" stroke="#000" strokeWidth={2} fill="none" />
  </Svg>
);

const LinkedInIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="#000" strokeWidth={2} fill="none" />
    <Rect x="2" y="9" width="4" height="12" stroke="#000" strokeWidth={2} fill="none" />
    <Circle cx="4" cy="4" r="2" stroke="#000" strokeWidth={2} fill="none" />
  </Svg>
);

const WebsiteIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Circle cx="12" cy="12" r="10" stroke="#000" strokeWidth={2} fill="none" />
    <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#000" strokeWidth={2} fill="none" />
  </Svg>
);

const GitHubIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
    <Path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="#000" strokeWidth={2} fill="none" />
  </Svg>
);

const stripHtml = (html: string) => {
  if (!html) return '';
  // Basic HTML stripping: remove tags and replace some common entities
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<li>/gi, '\n• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n\s*\n/g, '\n') // Remove extra newlines
    .trim();
};

const PDFDescriptionRenderer = ({ text, style, isHtml = false }: { text?: string; style?: any; isHtml?: boolean }) => {
  if (!text) return null;
  
  const processedText = isHtml ? stripHtml(text) : text;
  const lines = processedText.split('\n');
  
  return (
    <View style={style}>
      {lines.map((line, i) => {
        // Detect manual bullets: •, -, *, or similar with at least one space after
        const bulletMatch = line.match(/^(\s*)([•\-\*·\u2022\u2023\u2043\u204c\u204d\u2219])\s+(.*)/);
        
        if (bulletMatch) {
          const indent = bulletMatch[1];
          const bulletChar = bulletMatch[2];
          const content = bulletMatch[3];
          
          return (
            <View key={i} style={{ flexDirection: 'row', marginBottom: 2, alignItems: 'flex-start' }}>
              <Text style={{ width: 12, flexShrink: 0, marginLeft: indent ? indent.length * 4 : 0 }}>{bulletChar}</Text>
              <Text style={{ flex: 1, hyphens: 'none' }}>{content}</Text>
            </View>
          );
        }
        
        return <Text key={i} style={{ marginBottom: line.trim() === '' ? 4 : 2, hyphens: 'none' }}>{line}</Text>;
      })}
    </View>
  );
};

export const ResumePDF: React.FC<ResumePDFProps> = ({ resumeData }) => {
  const {
    personalInfo,
    education,
    workExperience,
    projects,
    skills,
    additionalSections,
    settings,
  } = resumeData;

  const sizes = fontSizeMap[settings.fontSize] || fontSizeMap.standard;
  const fontFamily = settings.fontFamily || 'Roboto';

  // Filter entries to only show ones with mandatory content
  const validWork = workExperience.filter((exp) => exp.position || exp.company);
  const validEducation = education.filter((edu) => edu.school || edu.degree);
  const validProjects = projects.filter((proj) => proj.name);
  const validSkills = skills.filter((skill) => skill.category || skill.items);
  const validAdditional = additionalSections.filter((section) => 
    section && 
    section.title && 
    section.description && 
    section.description !== '<p><br></p>'
  );

  // Create styles dynamically based on settings
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
      color: settings.themeColor || '#ef4444',
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
    bullet: {
      marginHorizontal: 4,
    },
    section: {
      marginBottom: 14,
    },
    sectionTitleContainer: {
      borderBottomWidth: 1,
      borderBottomColor: settings.themeColor || '#ef4444',
      paddingBottom: 2,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: sizes.heading,
      fontWeight: 700,
      color: settings.themeColor || '#ef4444',
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
    skillCategory: {
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
      color: settings.themeColor || '#ef4444',
      textDecoration: 'none',
    },
  });

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const [year, month] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      return `${monthName} ${year}`;
    } catch {
      return dateStr;
    }
  };

  // Build contact info
  const phoneWithCode = personalInfo.phone
    ? `${getCountryByCode(personalInfo.phoneCountryCode)?.dialCode || ''} ${personalInfo.phone}`.trim()
    : '';

  const contactInfo = [
    { value: personalInfo.email, Icon: MailIcon },
    { value: phoneWithCode, Icon: PhoneIcon },
    { value: personalInfo.location, Icon: MapPinIcon },
    { value: personalInfo.linkedin, Icon: LinkedInIcon },
    { value: personalInfo.website, Icon: WebsiteIcon },
    { value: personalInfo.github, Icon: GitHubIcon },
  ].filter((item) => item.value && item.value.trim());

  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo.name || 'Your Name'}
          </Text>
          <View style={styles.contactRow}>
            {contactInfo.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
                <item.Icon />
                <Text style={styles.contactItem}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Professional Summary */}
        {personalInfo.summary && personalInfo.summary.trim() && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer} minPresenceAhead={100}>
              <Text style={styles.sectionTitle}>Professional Summary</Text>
            </View>
            <PDFDescriptionRenderer text={personalInfo.summary} style={styles.itemDescription} />
          </View>
        )}

        {/* Work Experience */}
        {validWork && validWork.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer} minPresenceAhead={150}>
              <Text style={styles.sectionTitle}>Work Experience</Text>
            </View>
            {validWork.map((exp) => (
              <View key={exp.id} style={styles.itemContainer} wrap={false}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderLeft}>
                    <Text style={styles.itemTitle}>
                      {exp.position || 'Position'}
                    </Text>
                    {exp.company && (
                      <Text style={styles.itemSubtitle}>{exp.company}</Text>
                    )}
                  </View>
                  <Text style={styles.itemDate}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </Text>
                </View>
                {exp.location && exp.location.trim() && (
                  <Text style={styles.itemLocation}>{exp.location}</Text>
                )}
                {exp.description && exp.description.trim() && (
                  <PDFDescriptionRenderer text={exp.description} style={styles.itemDescription} />
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {validEducation && validEducation.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer} minPresenceAhead={150}>
              <Text style={styles.sectionTitle}>Education</Text>
            </View>
            {validEducation.map((edu) => (
              <View key={edu.id} style={styles.itemContainer} wrap={false}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderLeft}>
                    <Text style={styles.itemTitle}>
                      {edu.degree || 'Degree'}
                      {edu.field && ` in ${edu.field}`}
                    </Text>
                    <Text style={styles.itemSubtitle}>
                      {edu.school || 'School'}
                      {edu.grade && ` • ${edu.grade}`}
                    </Text>
                  </View>
                  <Text style={styles.itemDate}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </Text>
                </View>
                {edu.description && edu.description.trim() && (
                  <PDFDescriptionRenderer text={edu.description} style={styles.itemDescription} />
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {validProjects && validProjects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer} minPresenceAhead={150}>
              <Text style={styles.sectionTitle}>Projects</Text>
            </View>
            {validProjects.map((proj) => (
              <View key={proj.id} style={styles.itemContainer} wrap={false}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderLeft}>
                    <Text style={styles.itemTitle}>{proj.name || 'Project'}</Text>
                  </View>
                  {(proj.startDate || proj.endDate || proj.ongoing) && (
                    <Text style={styles.itemDate}>
                      {formatDate(proj.startDate)} - {proj.ongoing ? 'Ongoing' : formatDate(proj.endDate)}
                    </Text>
                  )}
                </View>
                {proj.link && proj.link.trim() && (
                  <Link src={proj.link} style={styles.link}>
                    {proj.link}
                  </Link>
                )}
                {proj.role && proj.role.trim() && (
                  <Text style={styles.itemSubtitle}>
                    Role: {proj.role}
                  </Text>
                )}
                {proj.technologies && proj.technologies.length > 0 && (
                  <Text style={styles.itemSubtitle}>
                    Technologies: {proj.technologies.join(', ')}
                  </Text>
                )}
                {proj.description && proj.description.trim() && (
                  <PDFDescriptionRenderer text={proj.description} style={styles.itemDescription} />
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {validSkills && validSkills.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer} minPresenceAhead={100}>
              <Text style={styles.sectionTitle}>Skills</Text>
            </View>
            <View style={styles.skillsContainer}>
              {validSkills.map((skill) => (
                <View key={skill.id} style={styles.skillRow} wrap={false}>
                  <Text style={styles.skillItems}>
                    <Text style={styles.skillCategory}>
                      {skill.category || 'Category'}:
                    </Text>{' '}
                    {skill.items || ''}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Additional Sections */}
        {validAdditional &&
          validAdditional.length > 0 &&
          validAdditional.map((section) => (
            <View key={section.id} style={styles.section}>
              <View style={styles.sectionTitleContainer} minPresenceAhead={100}>
                <Text style={styles.sectionTitle}>
                  {section.title || 'Section'}
                </Text>
              </View>
              <PDFDescriptionRenderer
                text={section.description || ''}
                style={styles.itemDescription}
                isHtml={true}
              />
            </View>
          ))}
      </Page>
    </Document>
  );
};
