import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { AIWriterButton } from "@/components/ui/AIWriterButton";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { useEffect, useState } from "react";
import { getGeoLocation, formatLocation } from "@/lib/geolocation";
import { getCountryByCode } from "@/lib/countries";

export const PersonalInfoForm = () => {
  const { resumeData, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = resumeData;
  const [geoDetected, setGeoDetected] = useState(false);

  // Auto-detect location and country code on first load
  useEffect(() => {
    const detectLocation = async () => {
      // Only auto-detect if location and phone are empty (first time)
      if (!personalInfo.location && !personalInfo.phone && !geoDetected) {
        const geo = await getGeoLocation();
        if (geo) {
          // Auto-fill location
          const formattedLocation = formatLocation(geo);
          if (formattedLocation) {
            updatePersonalInfo({ location: formattedLocation });
          }

          // Auto-select country code for phone
          const country = getCountryByCode(geo.countryCode);
          if (country) {
            updatePersonalInfo({ phoneCountryCode: geo.countryCode });
          }

          setGeoDetected(true);
        }
      }
    };

    detectLocation();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg border p-6 space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={personalInfo.name}
            onChange={(e) => updatePersonalInfo({ name: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <PhoneInput
            value={personalInfo.phone}
            onChange={(value) => updatePersonalInfo({ phone: value })}
            countryCode={personalInfo.phoneCountryCode || 'US'}
            onCountryCodeChange={(code) => updatePersonalInfo({ phoneCountryCode: code })}
            placeholder="Phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <div className="relative">
            <Input
              id="location"
              value={personalInfo.location}
              onChange={(e) => updatePersonalInfo({ location: e.target.value })}
              placeholder="City, Country"
              className="pr-8"
            />
            <MapPin className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={personalInfo.website}
            onChange={(e) => updatePersonalInfo({ website: e.target.value })}
            placeholder="johndoe.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <AIWriterButton
            fieldName="summary"
            fieldLabel="Summary"
            fieldValue={personalInfo.summary || ''}
            onUpdate={(newText) => updatePersonalInfo({ summary: newText })}
          />
        </div>
        <Textarea
          id="summary"
          value={personalInfo.summary}
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
          placeholder="A brief summary of your professional background and career goals..."
          rows={4}
        />
      </div>
    </motion.div>
  );
};
