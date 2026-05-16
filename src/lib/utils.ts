import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeResumeData(data: any): any {
  if (!data) return data;

  const PLACEHOLDER_ID = '4f4e4f4e-4f4e-4f4e-4f4e-4f4e4f4e4f4e';

  const walkAndSanitize = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map((item) => walkAndSanitize(item));
    }

    if (obj !== null && typeof obj === 'object') {
      const newObj: any = {};
      
      // If it's an object that SHOULD have an ID but doesn't, or has the placeholder
      // We check if it's likely an item in a list (has some content but the ID is the placeholder)
      if (obj.id === PLACEHOLDER_ID || (obj.id === undefined && (obj.name || obj.title || obj.school || obj.company || obj.network))) {
        newObj.id = uuidv4();
      }

      Object.keys(obj).forEach((key) => {
        if (key === 'id' && newObj.id) return; // Already handled
        newObj[key] = walkAndSanitize(obj[key]);
      });

      // Special case: Ensure nested roles in experience also get sanitized
      if (newObj.roles && Array.isArray(newObj.roles)) {
        newObj.roles = newObj.roles.map((role: any) => walkAndSanitize(role));
      }

      return newObj;
    }

    return obj;
  };

  const sanitizedData = walkAndSanitize(data);

  // Ensure standard sections have the items array sanitized even if they were empty/missing
  if (sanitizedData.sections) {
    Object.keys(sanitizedData.sections).forEach((key) => {
      if (sanitizedData.sections[key] && sanitizedData.sections[key].items) {
        sanitizedData.sections[key].items = sanitizedData.sections[key].items.map((item: any) => {
          if (typeof item === 'object' && item !== null && (!item.id || item.id === PLACEHOLDER_ID)) {
            return { ...item, id: uuidv4() };
          }
          return item;
        });
      }
    });
  }

  return sanitizedData;
}
export function stripHtml(html: string): string {
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
    .replace(/&quot;/g, '"')
    .replace(/'/g, "'")
    .trim();
}
export function cleanProfileDisplay(input: string): string {
  if (!input) return '';
  if (!input.includes('/') && !input.includes('.')) return input.replace(/^@/, '');

  try {
    const urlString = input.startsWith('http') ? input : `https://${input}`;
    const url = new URL(urlString);
    const segments = url.pathname.split('/').filter(Boolean);
    
    // For LinkedIn, usually it's /in/username
    if (url.hostname.includes('linkedin.com') && segments[0] === 'in' && segments[1]) {
      return segments[1];
    }
    
    return segments[segments.length - 1] || input;
  } catch (e) {
    return input.split('/').filter(Boolean).pop() || input;
  }
}
