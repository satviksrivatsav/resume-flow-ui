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
} from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';
import { getCountryByCode } from '@/lib/countries';

interface ResumePDFProps {
  resumeData: ResumeData;
}

// Register fonts from public/fonts folder
// IMPORTANT: Adjust these paths based on your actual font file names

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

export const ResumePDF: React.FC<ResumePDFProps> = ({ resumeData }) => {
  const {
    personalInfo,
    education,
    workExperience,
    projects,
    skills,
    customSections,
    settings,
  } = resumeData;

  const sizes = fontSizeMap[settings.fontSize] || fontSizeMap.standard;
  const fontFamily = settings.fontFamily || 'Roboto';

  // Filter entries to only show ones with mandatory content
  const validWork = workExperience.filter((exp) => exp.position || exp.company);
  const validEducation = education.filter((edu) => edu.school || edu.degree);
  const validProjects = projects.filter((proj) => proj.name);
  const validSkills = skills.filter((skill) => skill.category || skill.items);
  const validCustom = customSections.filter((section) => 
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
      color: '#374151',
      padding: 36,
      backgroundColor: '#ffffff',
    },
    header: {
      marginBottom: 16,
      borderBottomWidth: 2,
      borderBottomColor: settings.themeColor || '#ef4444',
      paddingBottom: 12,
    },
    name: {
      fontSize: sizes.name,
      fontWeight: 700,
      color: settings.themeColor || '#ef4444',
      marginBottom: 8,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      fontSize: sizes.base - 1,
      color: '#6b7280',
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
    sectionTitle: {
      fontSize: sizes.heading,
      fontWeight: 700,
      color: settings.themeColor || '#ef4444',
      marginBottom: 8,
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
      color: '#111827',
      marginBottom: 2,
    },
    itemSubtitle: {
      fontSize: sizes.base,
      color: '#4b5563',
    },
    itemDate: {
      fontSize: sizes.base - 1,
      color: '#6b7280',
    },
    itemLocation: {
      fontSize: sizes.base - 1,
      color: '#6b7280',
      marginBottom: 4,
    },
    itemDescription: {
      fontSize: sizes.base,
      color: '#4b5563',
      lineHeight: 1.5,
    },
    skillsContainer: {
      flexDirection: 'column',
    },
    skillRow: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    skillCategory: {
      fontWeight: 700,
      fontSize: sizes.base,
      color: '#111827',
      width: 100,
    },
    skillItems: {
      fontSize: sizes.base,
      color: '#4b5563',
      flex: 1,
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

  const contactItems = [
    personalInfo.email,
    phoneWithCode,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.website,
    personalInfo.github,
  ].filter((item) => item && item.trim());

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
            {contactItems.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.contactItem}>{item}</Text>
                {index < contactItems.length - 1 && (
                  <Text style={styles.bullet}>•</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Professional Summary */}
        {personalInfo.summary && personalInfo.summary.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.itemDescription}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Work Experience */}
        {validWork && validWork.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {validWork.map((exp) => (
              <View key={exp.id} style={styles.itemContainer}>
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
                  <Text style={styles.itemDescription}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {validEducation && validEducation.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {validEducation.map((edu) => (
              <View key={edu.id} style={styles.itemContainer}>
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
                  <Text style={styles.itemDescription}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {validProjects && validProjects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {validProjects.map((proj) => (
              <View key={proj.id} style={styles.itemContainer}>
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
                  <Text style={styles.itemDescription}>{proj.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {validSkills && validSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {validSkills.map((skill) => (
                <View key={skill.id} style={styles.skillRow}>
                  <Text style={styles.skillCategory}>
                    {skill.category || 'Category'}:
                  </Text>
                  <Text style={styles.skillItems}>{skill.items || ''}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Custom Sections */}
        {validCustom &&
          validCustom.length > 0 &&
          validCustom.map((section) => (
            <View key={section.id} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {section.title || 'Section'}
              </Text>
              <Text style={styles.itemDescription}>
                {section.description || ''}
              </Text>
            </View>
          ))}
      </Page>
    </Document>
  );
};