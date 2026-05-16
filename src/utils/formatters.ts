import { stripHtml } from '@/lib/utils';

/**

 * Formats a single structured resume item into human-readable text.
 */
export const formatItemContent = (id: string, item: any): string => {
  if (!item) return '';
  if (typeof item === 'string') return item;

  const parts: string[] = [];

  // Experience / Volunteer
  if (item.company || item.organization) parts.push(`${item.company || item.organization}`);
  if (item.position) parts.push(item.position);

  // Education
  if (item.school) parts.push(`${item.school}`);
  if (item.degree) {
    let edu = item.degree;
    if (item.area) edu += ` in ${item.area}`;
    parts.push(edu);
  }

  // Projects
  if (item.name && id === 'projects') parts.push(`${item.name}`);

  // Profiles
  if (item.network && item.username) parts.push(`${item.network}: ${item.username}`);

  // Awards / Certifications / Publications
  if (item.title) parts.push(`${item.title}`);
  if (item.name && (id === 'certifications' || id === 'publications'))
    parts.push(`${item.name}`);
  if (item.issuer || item.publisher || item.awarder)
    parts.push(item.issuer || item.publisher || item.awarder);

  // Dates
  if (item.date || item.period) parts.push(item.date || item.period);

  // General description/summary
  if (item.summary) parts.push(stripHtml(item.summary));
  if (item.description) parts.push(stripHtml(item.description));


  // Experience Roles (nested)
  if (item.roles && Array.isArray(item.roles)) {
    item.roles.forEach((role: any) => {
      if (role.position) parts.push(`- ${role.position}`);
      if (role.description) parts.push(stripHtml(role.description));

    });
  }

  // Bullet points (common in experience/projects)
  if (item.bullets && Array.isArray(item.bullets)) {
    parts.push(item.bullets.map((b: string) => `• ${b}`).join('\n'));
  }

  // Skills (keywords)
  if (item.keywords && Array.isArray(item.keywords)) {
    parts.push(`Keywords: ${item.keywords.join(', ')}`);
  }

  // Languages / Interests
  if (item.name && (id === 'languages' || id === 'interests')) {
    let str = item.name;
    if (item.description) str += ` (${item.description})`;
    if (item.level && item.level > 0) str += ` - Level ${item.level}`;
    parts.push(str);
  }

  return parts.filter(Boolean).join('\n');
};

/**
 * Formats structured resume sections into human-readable text for the diff viewer.
 */
export const formatSectionContent = (id: string, content: any): string => {
  if (!content) return '';
  if (typeof content === 'string') return content;

  // Summary
  if (id === 'summary') {
    return stripHtml(content.content || content || '');
  }


  // Handle section items (Experience, Education, Projects, etc.)
  if (content.items && Array.isArray(content.items)) {
    return content.items
      .map((item: any) => formatItemContent(id, item))
      .filter(Boolean)
      .join('\n\n' + '─'.repeat(20) + '\n\n');
  }

  // If it's a single item (flattened slides), format it directly
  if (typeof content === 'object') {
    return formatItemContent(id, content);
  }

  // Fallback to pretty JSON if we can't format it
  return JSON.stringify(content, null, 2);
};
