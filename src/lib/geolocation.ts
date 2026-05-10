// Local timezone-based country detection (no external API needed)

// Mapping of IANA timezones to country codes
// Covers all countries in the COUNTRIES list
const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  // India
  'Asia/Kolkata': 'IN',
  'Asia/Calcutta': 'IN',

  // United States
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Anchorage': 'US',
  'America/Phoenix': 'US',
  'America/Detroit': 'US',
  'America/Indiana/Indianapolis': 'US',
  'America/Boise': 'US',
  'Pacific/Honolulu': 'US',

  // United Kingdom
  'Europe/London': 'GB',

  // Canada
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Edmonton': 'CA',
  'America/Winnipeg': 'CA',
  'America/Halifax': 'CA',
  'America/Montreal': 'CA',

  // Australia
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
  'Australia/Brisbane': 'AU',
  'Australia/Perth': 'AU',
  'Australia/Adelaide': 'AU',
  'Australia/Hobart': 'AU',

  // Germany
  'Europe/Berlin': 'DE',

  // France
  'Europe/Paris': 'FR',

  // Japan
  'Asia/Tokyo': 'JP',

  // China
  'Asia/Shanghai': 'CN',
  'Asia/Hong_Kong': 'CN',

  // Brazil
  'America/Sao_Paulo': 'BR',
  'America/Rio_Branco': 'BR',
  'America/Fortaleza': 'BR',

  // Mexico
  'America/Mexico_City': 'MX',
  'America/Tijuana': 'MX',
  'America/Cancun': 'MX',

  // Spain
  'Europe/Madrid': 'ES',

  // Italy
  'Europe/Rome': 'IT',

  // Netherlands
  'Europe/Amsterdam': 'NL',

  // Russia
  'Europe/Moscow': 'RU',
  'Asia/Vladivostok': 'RU',
  'Asia/Yekaterinburg': 'RU',

  // South Korea
  'Asia/Seoul': 'KR',

  // Singapore
  'Asia/Singapore': 'SG',

  // UAE
  'Asia/Dubai': 'AE',

  // Saudi Arabia
  'Asia/Riyadh': 'SA',

  // South Africa
  'Africa/Johannesburg': 'ZA',

  // Nigeria
  'Africa/Lagos': 'NG',

  // Egypt
  'Africa/Cairo': 'EG',

  // Pakistan
  'Asia/Karachi': 'PK',

  // Bangladesh
  'Asia/Dhaka': 'BD',

  // Indonesia
  'Asia/Jakarta': 'ID',
  'Asia/Makassar': 'ID',

  // Malaysia
  'Asia/Kuala_Lumpur': 'MY',

  // Philippines
  'Asia/Manila': 'PH',

  // Thailand
  'Asia/Bangkok': 'TH',

  // Vietnam
  'Asia/Ho_Chi_Minh': 'VN',
  'Asia/Saigon': 'VN',

  // Israel
  'Asia/Jerusalem': 'IL',
  'Asia/Tel_Aviv': 'IL',

  // Turkey
  'Europe/Istanbul': 'TR',

  // Poland
  'Europe/Warsaw': 'PL',

  // Sweden
  'Europe/Stockholm': 'SE',

  // Norway
  'Europe/Oslo': 'NO',

  // Denmark
  'Europe/Copenhagen': 'DK',

  // Finland
  'Europe/Helsinki': 'FI',

  // Switzerland
  'Europe/Zurich': 'CH',

  // Austria
  'Europe/Vienna': 'AT',

  // Belgium
  'Europe/Brussels': 'BE',

  // Ireland
  'Europe/Dublin': 'IE',

  // New Zealand
  'Pacific/Auckland': 'NZ',
  'Pacific/Chatham': 'NZ',

  // Argentina
  'America/Argentina/Buenos_Aires': 'AR',
  'America/Buenos_Aires': 'AR',

  // Chile
  'America/Santiago': 'CL',

  // Colombia
  'America/Bogota': 'CO',

  // Peru
  'America/Lima': 'PE',

  // Kenya
  'Africa/Nairobi': 'KE',

  // Ghana
  'Africa/Accra': 'GH',

  // Morocco
  'Africa/Casablanca': 'MA',

  // Sri Lanka
  'Asia/Colombo': 'LK',

  // Nepal
  'Asia/Kathmandu': 'NP',
  'Asia/Katmandu': 'NP',
};

/**
 * Detects the user's country code based on their browser's timezone.
 * This is a local detection method that doesn't require any API calls.
 * @returns The ISO 2-letter country code, or null if detection fails
 */
export const detectCountryFromTimezone = (): string | null => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (timezone && TIMEZONE_TO_COUNTRY[timezone]) {
      return TIMEZONE_TO_COUNTRY[timezone];
    }

    // Fallback: try to match partial timezone
    // Some browsers might report slightly different timezone names
    for (const [tz, country] of Object.entries(TIMEZONE_TO_COUNTRY)) {
      if (timezone.includes(tz.split('/')[1]) || tz.includes(timezone.split('/')[1])) {
        return country;
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to detect country from timezone:', error);
    return null;
  }
};
