import { Github, Globe, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { createContext, forwardRef, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { cleanPhoneNumber, getCountryByCode } from '@/shared/lib/countries';
import { cleanProfileDisplay, sanitizeResumeData } from '@/shared/lib/utils';
import { useResumeStore } from '@/shared/stores/resumeStore';
import { DEFAULT_SECTION_ORDER } from '@/shared/types/resume';

// A4 size: 210mm × 297mm = 794px × 1123px at 96 DPI
const A4_WIDTH = '794px';

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '100%', minWidth: 0 }}>
    {children}
  </div>
);

const DescriptionRenderer = ({
  text,
  style,
  idPrefix = 'desc',
}: {
  text?: string;
  style?: React.CSSProperties;
  idPrefix?: string;
}) => {
  if (!text) return null;

  // Clean the text by replacing non-breaking spaces with standard space characters.
  // This allows the browser to wrap lines at standard word boundaries naturally.
  const cleanedText = text.replace(/\u00A0/g, ' ').replace(/&nbsp;/g, ' ');

  // If it's HTML (contains tags), render it directly
  if (cleanedText.includes('<') && cleanedText.includes('>')) {
    return (
      <div
        className="description-content"
        style={{
          ...style,
          overflowWrap: 'break-word',
          wordBreak: 'normal',
        }}
        dangerouslySetInnerHTML={{ __html: cleanedText }}
      />
    );
  }

  // Fallback for plain text with manual bullets
  const lines = cleanedText.split('\n');
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
            <PageBreakWrapper key={i} id={`${idPrefix}-line-${i}`}>
              <div
                style={{ display: 'flex', marginBottom: '2px', alignItems: 'flex-start' }}
              >
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
            </PageBreakWrapper>
          );
        }

        return (
          <PageBreakWrapper key={i} id={`${idPrefix}-line-${i}`}>
            <div style={{ minHeight: '1.2em' }}>{line}</div>
          </PageBreakWrapper>
        );
      })}
    </div>
  );
};

const PageBreakContext = createContext<{
  breaks: Record<string, number>;
  disabled?: boolean;
}>({ breaks: {} });

interface PageBreakWrapperProps {
  id: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const PageBreakWrapper = ({ id, children, style }: PageBreakWrapperProps) => {
  const { breaks, disabled } = useContext(PageBreakContext);
  const spacerHeight = !disabled ? breaks[id] || 0 : 0;

  return (
    <div data-page-break-id={id} style={style}>
      {spacerHeight > 0 && (
        <div
          className="page-break-spacer bg-transparent pointer-events-none select-none"
          style={{ height: `${spacerHeight}px` }}
        />
      )}
      {children}
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

const SectionHeader = ({
  title,
  color,
  sizes,
  id,
}: {
  title: string;
  color: string;
  sizes: any;
  id?: string;
}) => {
  const content = (
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

  if (id) {
    return <PageBreakWrapper id={id}>{content}</PageBreakWrapper>;
  }
  return content;
};

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

  // Helper to check if content actually exists (ignoring empty HTML tags)
  const hasContent = (html: string | undefined | null) => {
    if (!html) return false;
    const stripped = html.replace(/<[^>]*>/g, '').trim();
    return stripped.length > 0;
  };

  // ── Section renderers ────────────────────────────────────────────────────────

  const renderSummary = () => {
    if (!summary.visible || !hasContent(summary.content)) return null;
    return (
      <PageBreakWrapper id="summary" style={{ marginBottom: '16px' }}>
        <SectionHeader title="Summary" color={themeColor} sizes={sizes} />
        <DescriptionRenderer
          text={summary.content}
          style={{ color: '#000', lineHeight: '1.5', margin: 0 }}
          idPrefix="summary"
        />
      </PageBreakWrapper>
    );
  };

  const renderExperience = () => {
    const visibleItems = sections.experience.items.filter(
      (i: any) => i.visible && (i.company || i.position || hasContent(i.description)),
    );
    if (!sections.experience.visible || visibleItems.length === 0) return null;

    return (
      <div key="experience" style={{ marginBottom: '16px' }}>
        <SectionHeader
          title={sections.experience.name}
          color={themeColor}
          sizes={sizes}
          id="header-experience"
        />
        {visibleItems.map((exp: any) => (
          <PageBreakWrapper key={exp.id} id={exp.id} style={{ marginBottom: '12px' }}>
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
            {hasContent(exp.description) && (
              <DescriptionRenderer
                text={exp.description}
                style={{ color: '#000', lineHeight: '1.5' }}
                idPrefix={exp.id}
              />
            )}
          </PageBreakWrapper>
        ))}
      </div>
    );
  };

  const renderEducation = () => {
    const visibleItems = sections.education.items.filter(
      (i: any) => i.visible && (i.school || i.degree || hasContent(i.description)),
    );
    if (!sections.education.visible || visibleItems.length === 0) return null;

    return (
      <div key="education" style={{ marginBottom: '16px' }}>
        <SectionHeader
          title={sections.education.name}
          color={themeColor}
          sizes={sizes}
          id="header-education"
        />
        {visibleItems.map((edu: any) => (
          <PageBreakWrapper key={edu.id} id={edu.id} style={{ marginBottom: '12px' }}>
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
            {hasContent(edu.description) && (
              <DescriptionRenderer
                text={edu.description}
                style={{ color: '#000', lineHeight: '1.5', marginTop: '2px' }}
                idPrefix={edu.id}
              />
            )}
          </PageBreakWrapper>
        ))}
      </div>
    );
  };

  const renderProjects = () => {
    const visibleItems = sections.projects.items.filter(
      (i: any) => i.visible && (i.name || hasContent(i.description)),
    );
    if (!sections.projects.visible || visibleItems.length === 0) return null;

    return (
      <div key="projects" style={{ marginBottom: '16px' }}>
        <SectionHeader
          title={sections.projects.name}
          color={themeColor}
          sizes={sizes}
          id="header-projects"
        />
        {visibleItems.map((proj: any) => (
          <PageBreakWrapper key={proj.id} id={proj.id} style={{ marginBottom: '12px' }}>
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
            {hasContent(proj.description) && (
              <DescriptionRenderer
                text={proj.description}
                style={{ color: '#000', lineHeight: '1.5' }}
                idPrefix={proj.id}
              />
            )}
            {proj.keywords && proj.keywords.length > 0 && (
              <div style={{ fontSize: '0.8em', color: '#666', marginTop: '4px' }}>
                <strong>Tech:</strong> {proj.keywords.join(', ')}
              </div>
            )}
          </PageBreakWrapper>
        ))}
      </div>
    );
  };

  const renderSkills = () => {
    const visibleItems = sections.skills.items.filter(
      (i: any) => i.visible && i.name && i.keywords.length > 0,
    );
    if (!sections.skills.visible || visibleItems.length === 0) return null;

    return (
      <div key="skills" style={{ marginBottom: '16px' }}>
        <SectionHeader
          title={sections.skills.name}
          color={themeColor}
          sizes={sizes}
          id="header-skills"
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {visibleItems.map((skill: any) => (
            <PageBreakWrapper
              key={skill.id}
              id={skill.id}
              style={{ marginBottom: '4px', width: '100%' }}
            >
              <strong style={{ color: '#000' }}>{skill.name}:</strong> {skill.keywords.join(', ')}
            </PageBreakWrapper>
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
    const visibleItems = sections.languages.items.filter((i: any) => i.visible && i.name);
    if (!sections.languages.visible || visibleItems.length === 0) return null;

    return (
      <PageBreakWrapper id="languages" style={{ marginBottom: '16px' }}>
        <SectionHeader title={sections.languages.name} color={themeColor} sizes={sizes} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px', fontSize: sizes.base }}>
          {visibleItems.map((lang: any, index: number) => (
            <span key={lang.id}>
              <strong style={{ color: '#000' }}>{lang.name}</strong>
              {lang.description && <span style={{ color: '#555' }}> ({lang.description})</span>}
              {index < visibleItems.length - 1 && <span style={{ marginRight: '4px' }}>,</span>}
            </span>
          ))}
        </div>
      </PageBreakWrapper>
    );
  };

  const renderInterests = () => {
    const visibleItems = sections.interests.items.filter((i: any) => i.visible && i.name);
    if (!sections.interests.visible || visibleItems.length === 0) return null;

    return (
      <PageBreakWrapper id="interests" style={{ marginBottom: '16px' }}>
        <SectionHeader title={sections.interests.name} color={themeColor} sizes={sizes} />
        <div style={{ fontSize: sizes.base, color: '#000', lineHeight: '1.5' }}>
          {visibleItems
            .map((interest: any) => {
              const kwString =
                interest.keywords && interest.keywords.length > 0
                  ? ` (${interest.keywords.join(', ')})`
                  : '';
              return interest.name + kwString;
            })
            .join(', ')}
        </div>
      </PageBreakWrapper>
    );
  };

  const renderAwards = () => {
    const visibleItems = sections.awards.items.filter(
      (i: any) => i.visible && (i.title || hasContent(i.description)),
    );
    if (!sections.awards.visible || visibleItems.length === 0) return null;

    return (
      <div key="awards" style={{ marginBottom: '16px' }}>
        <SectionHeader
          title={sections.awards.name}
          color={themeColor}
          sizes={sizes}
          id="header-awards"
        />
        {visibleItems.map((award: any) => (
          <PageBreakWrapper key={award.id} id={award.id} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <strong style={{ color: '#000' }}>{award.title}</strong>
              <span>{award.date}</span>
            </div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>{award.awarder}</div>
            {hasContent(award.description) && (
              <DescriptionRenderer
                text={award.description}
                style={{ fontSize: sizes.base, color: '#000' }}
                idPrefix={award.id}
              />
            )}
          </PageBreakWrapper>
        ))}
      </div>
    );
  };

  const renderCertifications = () => {
    const visibleItems = sections.certifications.items.filter(
      (i: any) => i.visible && (i.name || hasContent(i.description)),
    );
    if (!sections.certifications.visible || visibleItems.length === 0) return null;

    return (
      <div key="certifications" style={{ marginBottom: '16px' }}>
        <SectionHeader
          title={sections.certifications.name}
          color={themeColor}
          sizes={sizes}
          id="header-certifications"
        />
        {visibleItems.map((cert: any) => (
          <PageBreakWrapper key={cert.id} id={cert.id} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <strong style={{ color: '#000' }}>{cert.name}</strong>
              <span>{cert.date}</span>
            </div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>{cert.issuer}</div>
            {cert.website?.href && (
              <div style={{ fontSize: '0.9em', marginTop: '2px' }}>
                <a
                  href={cert.website.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: themeColor,
                    textDecoration: 'none',
                  }}
                >
                  {cert.website.label || cert.website.href}
                </a>
              </div>
            )}
            {hasContent(cert.description) && (
              <DescriptionRenderer
                text={cert.description}
                style={{ fontSize: sizes.base, color: '#000', marginTop: '2px' }}
                idPrefix={cert.id}
              />
            )}
          </PageBreakWrapper>
        ))}
      </div>
    );
  };

  const renderPublications = () => {
    const visibleItems = sections.publications.items.filter(
      (i: any) => i.visible && (i.name || hasContent(i.description)),
    );
    if (!sections.publications.visible || visibleItems.length === 0) return null;

    return (
      <div key="publications" style={{ marginBottom: '16px' }}>
        <SectionHeader
          title={sections.publications.name}
          color={themeColor}
          sizes={sizes}
          id="header-publications"
        />
        {visibleItems.map((pub: any) => (
          <PageBreakWrapper key={pub.id} id={pub.id} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <strong style={{ color: '#000' }}>{pub.name}</strong>
              <span>{pub.date}</span>
            </div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>{pub.publisher}</div>
            {hasContent(pub.description) && (
              <DescriptionRenderer
                text={pub.description}
                style={{ fontSize: sizes.base, color: '#000' }}
                idPrefix={pub.id}
              />
            )}
          </PageBreakWrapper>
        ))}
      </div>
    );
  };

  const renderVolunteer = () => {
    const visibleItems = sections.volunteer.items.filter(
      (i: any) => i.visible && (i.organization || i.position || hasContent(i.description)),
    );
    if (!sections.volunteer.visible || visibleItems.length === 0) return null;

    return (
      <div key="volunteer" style={{ marginBottom: '16px' }}>
        <SectionHeader
          title={sections.volunteer.name}
          color={themeColor}
          sizes={sizes}
          id="header-volunteer"
        />
        {visibleItems.map((vol: any) => (
          <PageBreakWrapper key={vol.id} id={vol.id} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <strong style={{ color: '#000' }}>{vol.position}</strong>
              <span>{vol.period}</span>
            </div>
            <div style={{ fontStyle: 'italic' }}>{vol.organization}</div>
            {hasContent(vol.description) && (
              <DescriptionRenderer
                text={vol.description}
                style={{ color: '#000', lineHeight: '1.4' }}
                idPrefix={vol.id}
              />
            )}
          </PageBreakWrapper>
        ))}
      </div>
    );
  };

  const renderReferences = () => {
    const visibleItems = sections.references.items.filter((i: any) => i.visible && i.name);
    if (!sections.references.visible || visibleItems.length === 0) return null;

    return (
      <div key="references" style={{ marginBottom: '16px' }}>
        <SectionHeader
          title={sections.references.name}
          color={themeColor}
          sizes={sizes}
          id="header-references"
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {visibleItems.map((ref: any) => (
            <PageBreakWrapper key={ref.id} id={ref.id} style={{ fontSize: sizes.base }}>
              <div style={{ fontWeight: 'bold' }}>{ref.name}</div>
              <div>{ref.position}</div>
              <div style={{ color: '#666' }}>
                {ref.email} {ref.phone && `| ${ref.phone}`}
              </div>
            </PageBreakWrapper>
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
  const staticIds = DEFAULT_SECTION_ORDER.filter((id) => id !== 'summary');
  const customIds = customSections.map((s) => s.id);
  const allIds = [...staticIds, ...customIds];

  const orderedAllIds = [
    ...storedOrder.filter((id) => allIds.includes(id)),
    ...allIds.filter((id) => !storedOrder.includes(id)),
  ];

  return (
    <>
      {/* Header — always first */}
      <PageBreakWrapper
        id="header"
        style={{
          marginBottom: '20px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <h1
          style={{
            fontSize: sizes.name,
            fontWeight: 'bold',
            color: themeColor,
            margin: '0 0 4px 0',
            overflowWrap: 'break-word',
            wordBreak: 'normal',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {basics.name}
        </h1>
        {basics.headline && (
          <p
            style={{
              fontSize: sizes.heading,
              color: '#444',
              margin: '0 0 8px 0',
              overflowWrap: 'break-word',
              wordBreak: 'normal',
              width: '100%',
              maxWidth: '100%',
            }}
          >
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
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {basics.email && (
            <IconWrapper>
              <Mail size={12} />
              <span style={{ overflowWrap: 'break-word', wordBreak: 'normal', maxWidth: '100%' }}>
                {basics.email}
              </span>
            </IconWrapper>
          )}
          {basics.phone && (
            <IconWrapper>
              <Phone size={12} />
              <span style={{ overflowWrap: 'break-word', wordBreak: 'normal', maxWidth: '100%' }}>
                {basics.countryCode && `${getCountryByCode(basics.countryCode)?.dialCode} `}
                {cleanPhoneNumber(basics.phone, basics.countryCode)}
              </span>
            </IconWrapper>
          )}
          {basics.location && (
            <IconWrapper>
              <MapPin size={12} />
              <span style={{ overflowWrap: 'break-word', wordBreak: 'normal', maxWidth: '100%' }}>
                {basics.location}
              </span>
            </IconWrapper>
          )}
          {basics.url.href && (
            <IconWrapper>
              <Globe size={12} />
              <span style={{ overflowWrap: 'break-word', wordBreak: 'normal', maxWidth: '100%' }}>
                {basics.url.label || basics.url.href}
              </span>
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
              width: '100%',
              maxWidth: '100%',
            }}
          >
            {sections.profiles.items
              .filter((p: any) => p.visible && (p.network || p.username))
              .map((p: any) => (
                <IconWrapper key={p.id}>
                  {getNetworkIcon(p.network)}
                  {p.website?.href ? (
                    <a
                      href={p.website.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'inherit',
                        textDecoration: 'none',
                        overflowWrap: 'break-word',
                        wordBreak: 'normal',
                        maxWidth: '100%',
                      }}
                    >
                      {cleanProfileDisplay(p.username)}
                    </a>
                  ) : (
                    <span
                      style={{
                        overflowWrap: 'break-word',
                        wordBreak: 'normal',
                        maxWidth: '100%',
                      }}
                    >
                      {cleanProfileDisplay(p.username)}
                    </span>
                  )}
                </IconWrapper>
              ))}
          </div>
        )}
      </PageBreakWrapper>

      {/* Summary — pinned to top, not reorderable */}
      {renderSummary()}

      {/* Dynamic section body — respects orderedAllIds */}
      {orderedAllIds.map((key) => {
        const renderer = sectionRenderers[key];
        if (renderer) return renderer();

        const customSection = customSections.find((s) => s.id === key);
        if (customSection?.visible) {
          const visibleItems = customSection.items.filter(
            (item: any) => item.visible && (item.title || hasContent(item.description)),
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={customSection.id} style={{ marginBottom: '16px' }}>
              <SectionHeader
                title={customSection.name}
                color={themeColor}
                sizes={sizes}
                id={`header-${customSection.id}`}
              />
              {visibleItems.map((item: any) => (
                <PageBreakWrapper key={item.id} id={item.id} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                  {hasContent(item.description) && (
                    <DescriptionRenderer
                      text={item.description}
                      style={{ color: '#000' }}
                      idPrefix={item.id}
                    />
                  )}
                </PageBreakWrapper>
              ))}
            </div>
          );
        }

        return null;
      })}
    </>
  );
};

export const ResumePreview = forwardRef<
  HTMLDivElement,
  { data?: any; onPageCountChange?: (count: number) => void }
>((props, ref) => {
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
  const pageHeight = 1123; // base A4 height in pixels
  const pageMargin = '0.5in';
  const paddingY = 48; // 48px is exactly 0.5in top/bottom padding at 96 DPI
  const contentPageHeight = pageHeight - paddingY * 2; // 1027px

  const [pageBreaks, setPageBreaks] = useState<Record<string, number>>({});
  const [totalPages, setTotalPages] = useState(1);
  const measurerRef = useRef<HTMLDivElement>(null);

  const onPageCountChangeRef = useRef(props.onPageCountChange);
  useEffect(() => {
    onPageCountChangeRef.current = props.onPageCountChange;
  });

  useEffect(() => {
    if (!measurerRef.current) return;

    const observer = new ResizeObserver(() => {
      const measurer = measurerRef.current;
      if (!measurer) return;

      // The measurer is rendered with PageBreakContext.Provider disabled: true
      // So all elements have spacerHeight = 0.
      const elements = Array.from(measurer.querySelectorAll('[data-page-break-id]'));
      const measurerRect = measurer.getBoundingClientRect();

      const newPageBreaks: Record<string, number> = {};
      let cumulativeSpacer = 0;
      const limit = 1027; // contentPageHeight

      elements.forEach((el) => {
        const id = el.getAttribute('data-page-break-id');
        if (!id) return;

        const rect = el.getBoundingClientRect();
        const height = rect.bottom - rect.top;
        const cleanTop = rect.top - measurerRect.top;

        const actualTop = cleanTop + cumulativeSpacer;
        const pageIndex = Math.floor(actualTop / limit);
        const pageEnd = (pageIndex + 1) * limit;

        // Protection for headers and specific sections
        const isHeader =
          id.startsWith('header-') ||
          id === 'summary' ||
          id === 'languages' ||
          id === 'interests';
        const threshold = isHeader ? 40 : 2;

        if (actualTop + height > pageEnd - threshold) {
          // If it doesn't fit, and it's not already at the top of a page
          const offsetOnPage = actualTop % limit;
          if (offsetOnPage > 1) {
            const spacerNeeded = limit - offsetOnPage;
            newPageBreaks[id] = spacerNeeded;
            cumulativeSpacer += spacerNeeded;
          } else {
            newPageBreaks[id] = 0;
          }
        } else {
          newPageBreaks[id] = 0;
        }
      });

      setPageBreaks((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(newPageBreaks)) {
          return newPageBreaks;
        }
        return prev;
      });

      const totalHeight = measurer.scrollHeight;
      const pages = Math.ceil((totalHeight + cumulativeSpacer) / 1123);
      const nextPages = Math.max(1, pages);
      setTotalPages(nextPages);
      onPageCountChangeRef.current?.(nextPages);
    });

    observer.observe(measurerRef.current);

    return () => observer.disconnect();
  }, [resumeData]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-6 w-full select-none origin-top">
      {/* 1. Measurer: Invisible off-screen element to calculate height WITHOUT spacers first */}
      <PageBreakContext.Provider value={{ breaks: {}, disabled: true }}>
        <div
          ref={measurerRef}
          style={{
            width: pageWidth,
            height: 'auto',
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            opacity: 0,
            pointerEvents: 'none',
            fontFamily: metadata.typography.fontFamily,
            fontSize: sizes.base,
            paddingLeft: pageMargin,
            paddingRight: pageMargin,
            paddingTop: 0,
            paddingBottom: 0,
            lineHeight: '1.5',
            backgroundColor: 'white',
            color: '#000',
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
      </PageBreakContext.Provider>

      {/* 2. Visual Clean Page Splits WITH spacers */}
      <PageBreakContext.Provider value={{ breaks: pageBreaks }}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className="resume-page-sheet shadow-2xl relative bg-white border border-border/10 rounded-sm overflow-hidden animate-in fade-in duration-300"
            style={{
              width: pageWidth,
              height: `${pageHeight}px`,
            }}
          >
            {/* Strict Content Box Container: exactly matches the A4 content zone */}
            <div
              style={{
                position: 'absolute',
                left: pageMargin,
                right: pageMargin,
                top: `${paddingY}px`,
                bottom: `${paddingY}px`,
                overflow: 'hidden',
              }}
            >
              {/* Inner content wrapper, shifted up by page index */}
              <div
                style={{
                  fontFamily: metadata.typography.fontFamily,
                  fontSize: sizes.base,
                  color: '#000',
                  transform: `translateY(-${index * contentPageHeight}px)`,
                  height: 'auto',
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
            </div>

            {/* Subtle page indicator at bottom right of each page sheet */}
            <div className="absolute bottom-3 right-4 text-[9px] font-semibold text-muted-foreground/30 uppercase tracking-widest pointer-events-none select-none z-30">
              Page {index + 1} of {totalPages}
            </div>
          </div>
        ))}
      </PageBreakContext.Provider>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
