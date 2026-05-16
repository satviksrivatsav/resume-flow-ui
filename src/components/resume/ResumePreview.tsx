import { Github, Globe, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { forwardRef, useMemo } from 'react';

import { useResumeStore } from '@/stores/resumeStore';
import { cleanProfileDisplay, sanitizeResumeData } from '@/lib/utils';
import { DEFAULT_SECTION_ORDER } from '@/types/resume';
import { getCountryByCode, cleanPhoneNumber } from '@/lib/countries';

// A4 size: 210mm × 297mm = 794px × 1123px at 96 DPI
const A4_WIDTH = '794px';
const A4_HEIGHT = '1123px';

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{children}</div>
);

const DescriptionRenderer = ({ text, style }: { text?: string; style?: React.CSSProperties }) => {
  if (!text) return null;

  // If it's HTML (contains tags), render it directly
  if (text.includes('<') && text.includes('>')) {
    return (
      <div 
        className="description-content"
        style={{
          ...style,
          wordBreak: 'break-word',
        }}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }

  // Fallback for plain text with manual bullets
  const lines = text.split('\n');
  return (
    <div style={style}>
      {lines.map((line, i) => {
        const bulletMatch = /^(\s*)([•\-\*·\u2022\u2023\u2043\u204c\u204d\u2219])\s+(.*)/.exec(
          line,
        );

        if (bulletMatch) {
          const indent = bulletMatch[1];
          const bulletChar = bulletMatch[2];
          const content = bulletMatch[3];

          return (
            <div key={i} style={{ display: 'flex', marginBottom: '2px', alignItems: 'flex-start' }}>
              <span
                style={{
                  width: '1.2em',
                  flexShrink: 0,
                  marginLeft: indent ? `${indent.length * 8}px` : 0,
                }}
              >
                {bulletChar}
              </span>
              <span style={{ flex: 1 }}>{content}</span>
            </div>
          );
        }

        return (
          <div key={i} style={{ minHeight: '1.2em' }}>
            {line}
          </div>
        );
      })}
    </div>
  );
};

interface ResumeContentProps {
  basics: any;
  summary: any;
  sections: any;
  customSections: any[];
  metadata: any;
  sizes: { base: string; heading: string; name: string };
}

const SectionHeader = ({ title, color, sizes }: { title: string; color: string; sizes: any }) => (
  <div
    style={{
      borderBottom: `1px solid ${color}`,
      paddingBottom: '2px',
      marginBottom: '10px',
      pageBreakAfter: 'avoid',
    }}
  >
    <h2 style={{ fontSize: sizes.heading, fontWeight: 'bold', color: color, margin: 0 }}>
      {title.toUpperCase()}
    </h2>
  </div>
);

const ResumeContent = ({
  basics,
  summary,
  sections,
  customSections,
  metadata,
  sizes,
}: ResumeContentProps) => {
  const themeColor = metadata.theme.primary;

  const getNetworkIcon = (network: string) => {
    const n = network.toLowerCase();
    if (n.includes('github')) return <Github size={12} />;
    if (n.includes('linkedin')) return <Linkedin size={12} />;
    if (n.includes('twitter') || n.includes('x')) return <Twitter size={12} />;
    return <Globe size={12} />;
  };

  // ── Section renderers ────────────────────────────────────────────────────────

  const renderSummary = () => {
    if (!summary.content || !summary.visible) return null;
    return (
      <div key="summary" style={{ marginBottom: '16px' }}>
        <SectionHeader title="Summary" color={themeColor} sizes={sizes} />
        <DescriptionRenderer
          text={summary.content}
          style={{ color: '#000', lineHeight: '1.5', margin: 0 }}
        />
      </div>
    );
  };

  const renderExperience = () => {
    if (!sections.experience.visible || sections.experience.items.length === 0) return null;
    return (
      <div key="experience" style={{ marginBottom: '16px' }}>
        <SectionHeader title={sections.experience.name} color={themeColor} sizes={sizes} />
        {sections.experience.items
          .filter((i: any) => i.visible)
          .map((exp: any) => (
            <div key={exp.id} style={{ marginBottom: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '2px',
                }}
              >
                <div>
                  <strong style={{ color: '#000' }}>{exp.position}</strong>
                  {exp.company && <span style={{ color: '#000' }}>, {exp.company}</span>}
                </div>
                <span style={{ fontSize: sizes.base, color: '#000', whiteSpace: 'nowrap' }}>
                  {exp.period}
                </span>
              </div>
              {exp.location && (
                <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '4px' }}>
                  {exp.location}
                </div>
              )}
              {exp.description && (
                <DescriptionRenderer
                  text={exp.description}
                  style={{ color: '#000', lineHeight: '1.5' }}
                />
              )}
            </div>
          ))}
      </div>
    );
  };

  const renderEducation = () => {
    if (!sections.education.visible || sections.education.items.length === 0) return null;
    return (
      <div key="education" style={{ marginBottom: '16px' }}>
        <SectionHeader title={sections.education.name} color={themeColor} sizes={sizes} />
        {sections.education.items
          .filter((i: any) => i.visible)
          .map((edu: any) => (
            <div key={edu.id} style={{ marginBottom: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '2px',
                }}
              >
                <div>
                  <strong style={{ color: '#000' }}>{edu.degree}</strong>
                  {edu.area && <span style={{ color: '#000' }}> in {edu.area}</span>}
                </div>
                <span style={{ fontSize: sizes.base, color: '#000', whiteSpace: 'nowrap' }}>
                  {edu.period}
                </span>
              </div>
              <div style={{ color: '#000' }}>
                {edu.school}
                {edu.grade && <span> • {edu.grade}</span>}
              </div>
              {edu.description && (
                <DescriptionRenderer
                  text={edu.description}
                  style={{ color: '#000', lineHeight: '1.5', marginTop: '2px' }}
                />
              )}
            </div>
          ))}
      </div>
    );
  };

  const renderProjects = () => {
    if (!sections.projects.visible || sections.projects.items.length === 0) return null;
    return (
      <div key="projects" style={{ marginBottom: '16px' }}>
        <SectionHeader title={sections.projects.name} color={themeColor} sizes={sizes} />
        {sections.projects.items
          .filter((i: any) => i.visible)
          .map((proj: any) => (
            <div key={proj.id} style={{ marginBottom: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '2px',
                }}
              >
                <strong style={{ color: '#000' }}>{proj.name}</strong>
                {proj.period && (
                  <span style={{ fontSize: sizes.base, color: '#000', whiteSpace: 'nowrap' }}>
                    {proj.period}
                  </span>
                )}
              </div>
              {proj.website.href && (
                <div style={{ fontSize: '0.9em', color: themeColor, marginBottom: '4px' }}>
                  {proj.website.label || proj.website.href}
                </div>
              )}
              {proj.description && (
                <DescriptionRenderer
                  text={proj.description}
                  style={{ color: '#000', lineHeight: '1.5' }}
                />
              )}
              {proj.keywords && proj.keywords.length > 0 && (
                <div style={{ fontSize: '0.8em', color: '#666', marginTop: '4px' }}>
                  <strong>Tech:</strong> {proj.keywords.join(', ')}
                </div>
              )}
            </div>
          ))}
      </div>
    );
  };

  const renderSkills = () => {
    if (!sections.skills.visible || sections.skills.items.length === 0) return null;
    return (
      <div key="skills" style={{ marginBottom: '16px' }}>
        <SectionHeader title={sections.skills.name} color={themeColor} sizes={sizes} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {sections.skills.items
            .filter((i: any) => i.visible)
            .map((skill: any) => (
              <div key={skill.id} style={{ marginBottom: '4px', width: '100%' }}>
                <strong style={{ color: '#000' }}>{skill.name}:</strong> {skill.keywords.join(', ')}
              </div>
            ))}
        </div>
      </div>
    );
  };

  const renderProfiles = () => {
    // Profiles are rendered in the header; skip in body
    return null;
  };

  const renderLanguages = () => {
    if (!sections.languages.visible || sections.languages.items.length === 0) return null;
    return (
      <div key="languages" style={{ marginBottom: '16px' }}>
        <SectionHeader title={sections.languages.name} color={themeColor} sizes={sizes} />
        {sections.languages.items
          .filter((i: any) => i.visible)
          .map((lang: any) => (
            <div
              key={lang.id}
              style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}
            >
              <span style={{ fontWeight: 'bold' }}>{lang.name}</span>
              <span style={{ fontSize: '0.9em', color: '#666' }}>{lang.description}</span>
            </div>
          ))}
      </div>
    );
  };

  const renderInterests = () => {
    if (!sections.interests.visible || sections.interests.items.length === 0) return null;
    return (
      <div key="interests" style={{ marginBottom: '16px' }}>
        <SectionHeader title={sections.interests.name} color={themeColor} sizes={sizes} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {sections.interests.items
            .filter((i: any) => i.visible)
            .map((interest: any) => (
              <span key={interest.id} style={{ fontSize: sizes.base }}>
                {interest.name}
                {interest.keywords.length > 0 ? ` (${interest.keywords.join(', ')})` : ''}
              </span>
            ))}
        </div>
      </div>
    );
  };

  const renderAwards = () => {
    if (!sections.awards.visible || sections.awards.items.length === 0) return null;
    return (
      <div key="awards" style={{ marginBottom: '16px' }}>
        <SectionHeader title={sections.awards.name} color={themeColor} sizes={sizes} />
        {sections.awards.items
          .filter((i: any) => i.visible)
          .map((award: any) => (
            <div key={award.id} style={{ marginBottom: '8px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}
              >
                <strong style={{ color: '#000' }}>{award.title}</strong>
                <span>{award.date}</span>
              </div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>{award.awarder}</div>
              {award.description && (
                <DescriptionRenderer
                  text={award.description}
                  style={{ fontSize: sizes.base, color: '#000' }}
                />
              )}
            </div>
          ))}
      </div>
    );
  };

  const renderCertifications = () => {
    if (!sections.certifications.visible || sections.certifications.items.length === 0) return null;
    return (
      <div key="certifications" style={{ marginBottom: '16px' }}>
        <SectionHeader title={sections.certifications.name} color={themeColor} sizes={sizes} />
        {sections.certifications.items
          .filter((i: any) => i.visible)
          .map((cert: any) => (
            <div key={cert.id} style={{ marginBottom: '8px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}
              >
                <strong style={{ color: '#000' }}>{cert.name}</strong>
                <span>{cert.date}</span>
              </div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>{cert.issuer}</div>
              {cert.description && (
                <DescriptionRenderer
                  text={cert.description}
                  style={{ fontSize: sizes.base, color: '#000', marginTop: '2px' }}
                />
              )}
            </div>
          ))}
      </div>
    );
  };

  const renderPublications = () => {
    if (!sections.publications.visible || sections.publications.items.length === 0) return null;
    return (
      <div key="publications" style={{ marginBottom: '16px' }}>
        <SectionHeader title={sections.publications.name} color={themeColor} sizes={sizes} />
        {sections.publications.items
          .filter((i: any) => i.visible)
          .map((pub: any) => (
            <div key={pub.id} style={{ marginBottom: '8px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}
              >
                <strong style={{ color: '#000' }}>{pub.name}</strong>
                <span>{pub.date}</span>
              </div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>{pub.publisher}</div>
              {pub.description && (
                <DescriptionRenderer
                  text={pub.description}
                  style={{ fontSize: sizes.base, color: '#000' }}
                />
              )}
            </div>
          ))}
      </div>
    );
  };

  const renderVolunteer = () => {
    if (!sections.volunteer.visible || sections.volunteer.items.length === 0) return null;
    return (
      <div key="volunteer" style={{ marginBottom: '16px' }}>
        <SectionHeader title={sections.volunteer.name} color={themeColor} sizes={sizes} />
        {sections.volunteer.items
          .filter((i: any) => i.visible)
          .map((vol: any) => (
            <div key={vol.id} style={{ marginBottom: '10px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}
              >
                <strong style={{ color: '#000' }}>{vol.position}</strong>
                <span>{vol.period}</span>
              </div>
              <div style={{ fontStyle: 'italic' }}>{vol.organization}</div>
              {vol.description && (
                <DescriptionRenderer
                  text={vol.description}
                  style={{ color: '#000', lineHeight: '1.4' }}
                />
              )}
            </div>
          ))}
      </div>
    );
  };

  const renderReferences = () => {
    if (!sections.references.visible || sections.references.items.length === 0) return null;
    return (
      <div key="references" style={{ marginBottom: '16px' }}>
        <SectionHeader title={sections.references.name} color={themeColor} sizes={sizes} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {sections.references.items
            .filter((i: any) => i.visible)
            .map((ref: any) => (
              <div key={ref.id} style={{ fontSize: sizes.base }}>
                <div style={{ fontWeight: 'bold' }}>{ref.name}</div>
                <div>{ref.position}</div>
                <div style={{ color: '#666' }}>
                  {ref.email} {ref.phone && `| ${ref.phone}`}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  // Map from section key → render function
  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: renderSummary,
    experience: renderExperience,
    education: renderEducation,
    projects: renderProjects,
    skills: renderSkills,
    profiles: renderProfiles,
    languages: renderLanguages,
    interests: renderInterests,
    awards: renderAwards,
    certifications: renderCertifications,
    publications: renderPublications,
    volunteer: renderVolunteer,
    references: renderReferences,
  };

  // Determine render order
  const storedOrder: string[] = metadata.sectionOrder ?? DEFAULT_SECTION_ORDER;
  const staticIds = DEFAULT_SECTION_ORDER;
  const customIds = customSections.map((s) => s.id);
  const allIds = [...staticIds, ...customIds];

  const orderedAllIds = [
    ...storedOrder.filter((id) => allIds.includes(id)),
    ...allIds.filter((id) => !storedOrder.includes(id)),
  ];

  return (
    <>
      {/* Header — always first */}
      <div
        style={{
          marginBottom: '20px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: sizes.name,
            fontWeight: 'bold',
            color: themeColor,
            margin: '0 0 4px 0',
          }}
        >
          {basics.name || 'Your Name'}
        </h1>
        {basics.headline && (
          <p style={{ fontSize: sizes.heading, color: '#444', margin: '0 0 8px 0' }}>
            {basics.headline}
          </p>
        )}
        <div
          style={{
            fontSize: sizes.base,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px 16px',
            color: '#000',
            justifyContent: 'center',
          }}
        >
          {basics.email && (
            <IconWrapper>
              <Mail size={12} />
              <span>{basics.email}</span>
            </IconWrapper>
          )}
          {basics.phone && (
            <IconWrapper>
              <Phone size={12} />
              <span>
                {basics.countryCode && `${getCountryByCode(basics.countryCode)?.dialCode} `}
                {cleanPhoneNumber(basics.phone, basics.countryCode)}
              </span>
            </IconWrapper>
          )}
          {basics.location && (
            <IconWrapper>
              <MapPin size={12} />
              <span>{basics.location}</span>
            </IconWrapper>
          )}
          {basics.url.href && (
            <IconWrapper>
              <Globe size={12} />
              <span>{basics.url.label || basics.url.href}</span>
            </IconWrapper>
          )}
        </div>

        {/* Social Profiles */}
        {sections.profiles.items.length > 0 && sections.profiles.visible && (
          <div
            style={{
              fontSize: sizes.base,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px 16px',
              color: '#000',
              justifyContent: 'center',
              marginTop: '4px',
            }}
          >
            {sections.profiles.items
              .filter((p: any) => p.visible)
              .map((p: any) => (
                <IconWrapper key={p.id}>
                  {getNetworkIcon(p.network)}
                  {p.website?.href ? (
                    <a
                      href={p.website.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {cleanProfileDisplay(p.username)}
                    </a>
                  ) : (
                    <span>{cleanProfileDisplay(p.username)}</span>
                  )}
                </IconWrapper>
              ))}
          </div>
        )}
      </div>

      {/* Dynamic section body — respects orderedAllIds */}
      {orderedAllIds.map((key) => {
        const renderer = sectionRenderers[key];
        if (renderer) return renderer();

        const customSection = customSections.find((s) => s.id === key);
        if (customSection && customSection.visible && customSection.items.length > 0) {
          return (
            <div key={customSection.id} style={{ marginBottom: '16px' }}>
              <SectionHeader title={customSection.name} color={themeColor} sizes={sizes} />
              {customSection.items.map((item: any) => (
                <div key={item.id} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                  <DescriptionRenderer text={item.description} style={{ color: '#000' }} />
                </div>
              ))}
            </div>
          );
        }

        return null;
      })}
    </>
  );
};

export const ResumePreview = forwardRef<HTMLDivElement, { data?: any }>((props, ref) => {
  const { resumeData: storeData } = useResumeStore();
  const rawData = props.data || storeData;

  const resumeData = useMemo(() => sanitizeResumeData(rawData), [rawData]);

  const { basics, summary, sections, customSections, metadata } = resumeData;

  const baseSize = metadata.typography.fontSize || 11;
  const sizes = {
    base: `${baseSize}pt`,
    heading: `${baseSize + 2}pt`,
    name: `${baseSize * 2}pt`,
  };

  const pageWidth = A4_WIDTH;
  const pageHeight = A4_HEIGHT;
  const pageMargin = '0.5in';

  return (
    <div
      ref={ref}
      className="resume-preview-content"
      style={{
        width: pageWidth,
        minHeight: pageHeight,
        overflow: 'hidden',
        fontFamily: metadata.typography.fontFamily,
        fontSize: sizes.base,
        backgroundColor: 'white',
        color: '#000',
        padding: pageMargin,
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      }}
    >
      <ResumeContent
        basics={basics}
        summary={summary}
        sections={sections}
        customSections={customSections}
        metadata={metadata}
        sizes={sizes}
      />
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
