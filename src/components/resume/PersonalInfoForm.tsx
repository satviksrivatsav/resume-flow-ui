import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, MapPin, Mail, Phone, Linkedin, Globe, Github } from "lucide-react";
import { motion } from "framer-motion";
import { AIWriterButton } from "@/components/ui/AIWriterButton";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { useEffect, useRef } from "react";
import { detectCountryFromTimezone } from "@/lib/geolocation";
import { getCountryByCode } from "@/lib/countries";
import { FieldTip } from "@/components/ui/FieldTip";

export const PersonalInfoForm = () => {
  const { resumeData, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = resumeData;
  const hasDetected = useRef(false);

  // Auto-detect country code from timezone on first load
  useEffect(() => {
    if (hasDetected.current) return;
    hasDetected.current = true;

    // Only auto-detect if phone country code is empty
    if (!personalInfo.phoneCountryCode) {
      const detectedCountryCode = detectCountryFromTimezone();
      if (detectedCountryCode) {
        const country = getCountryByCode(detectedCountryCode);
        if (country) {
          updatePersonalInfo({ phoneCountryCode: detectedCountryCode });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={personalInfo.name}
            onChange={(e) => updatePersonalInfo({ name: e.target.value })}
            placeholder="John Doe"
            className="focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
            Phone <span className="text-red-500">*</span>
          </Label>
          <PhoneInput
            value={personalInfo.phone}
            onChange={(value) => updatePersonalInfo({ phone: value })}
            countryCode={personalInfo.phoneCountryCode || 'US'}
            onCountryCodeChange={(code) => updatePersonalInfo({ phoneCountryCode: code })}
            placeholder="Phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            Location
          </Label>
          <Input
            id="location"
            value={personalInfo.location}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
            placeholder="City, Country"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <Linkedin className="w-3.5 h-3.5 text-muted-foreground" />
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            value={personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github" className="flex items-center gap-2">
            <Github className="w-3.5 h-3.5 text-muted-foreground" />
            GitHub
          </Label>
          <Input
            id="github"
            value={personalInfo.github || ''}
            onChange={(e) => updatePersonalInfo({ github: e.target.value })}
            placeholder="github.com/johndoe"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            Portfolio Website
          </Label>
          <Input
            id="website"
            value={personalInfo.website}
            onChange={(e) => updatePersonalInfo({ website: e.target.value })}
            placeholder="johndoe.com"
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary" className="text-base font-semibold">Professional Summary</Label>
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
          className="min-h-[120px] resize-y"
          rows={4}
        />
        <FieldTip>
          Keep it concise (2–4 sentences). Lead with your title, highlight your top skills, and end with what you're looking for. Use the ✨ AI Writer to generate a strong draft.
        </FieldTip>
      </div>
    </motion.div>
  );
};

