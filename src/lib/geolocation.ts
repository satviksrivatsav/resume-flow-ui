// Geolocation service using free IP geolocation API

export interface GeoLocationData {
    countryCode: string;
    country: string;
    city: string;
    region: string;
}

export const getGeoLocation = async (): Promise<GeoLocationData | null> => {
    try {
        // Using ip-api.com free tier (no API key needed, 45 requests/minute limit)
        const response = await fetch('http://ip-api.com/json/?fields=status,country,countryCode,region,city');
        const data = await response.json();

        if (data.status === 'success') {
            return {
                countryCode: data.countryCode,
                country: data.country,
                city: data.city,
                region: data.region,
            };
        }
        return null;
    } catch (error) {
        console.error('Failed to get geolocation:', error);
        return null;
    }
};

export const formatLocation = (geo: GeoLocationData): string => {
    if (geo.city && geo.country) {
        return `${geo.city}, ${geo.country}`;
    }
    return geo.country || '';
};
