import { motion } from 'framer-motion';
import { Github, Globe, Linkedin, Mail, MapPin, Phone, User } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { AIWriterButton } from '@/components/ui/AIWriterButton';
import { FieldTip } from '@/components/ui/FieldTip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { getCountryByCode } from '@/lib/countries';
import { detectCountryFromTimezone } from '@/lib/geolocation';
import { useResumeStore } from '@/stores/resumeStore';

export const PersonalInfoForm = () => {
  const { resumeData, updateBasics, updateSummary, updateProfileByNetwork } = useResumeStore();
  const { basics, summary, sections } = resumeData;
  const hasDetected = useRef(false);

  // Auto-detect country code from timezone on first load
  useEffect(() => {
    if (hasDetected.current) return;
    hasDetected.current = true;

    // Only auto-detect if phone is empty
    if (!basics.phone) {
      const detectedCountryCode = detectCountryFromTimezone();
      if (detectedCountryCode) {
        const country = getCountryByCode(detectedCountryCode);
        if (country) {
          // In the new schema, we don't have a separate country code field in basics
          // But we can keep it in the PhoneInput state if needed.
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProfileUsername = (network: string) => {
    return (
      sections.profiles.items.find((p) => p.network.toLowerCase() === network.toLowerCase())
        ?.username || ''
    );
  };

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
            value={basics.name}
            onChange={(e) => updateBasics({ name: e.target.value })}
            placeholder="John Doe"
            className="focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="headline" className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            Headline
          </Label>
          <Input
            id="headline"
            value={basics.headline}
            onChange={(e) => updateBasics({ headline: e.target.value })}
            placeholder="Software Engineer"
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
            value={basics.email}
            onChange={(e) => updateBasics({ email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
            Phone <span className="text-red-500">*</span>
          </Label>
          <PhoneInput
            value={basics.phone}
            onChange={(value) => updateBasics({ phone: value })}
            countryCode="US" // Default to US for now
            onCountryCodeChange={() => {}}
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
            value={basics.location}
            onChange={(e) => updateBasics({ location: e.target.value })}
            placeholder="City, Country"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            Portfolio Website
          </Label>
          <Input
            id="website"
            value={basics.url.href}
            onChange={(e) => updateBasics({ url: { ...basics.url, href: e.target.value } })}
            placeholder="johndoe.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <Linkedin className="w-3.5 h-3.5 text-muted-foreground" />
            LinkedIn Username
          </Label>
          <Input
            id="linkedin"
            value={getProfileUsername('linkedin')}
            onChange={(e) => updateProfileByNetwork('LinkedIn', e.target.value)}
            placeholder="johndoe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github" className="flex items-center gap-2">
            <Github className="w-3.5 h-3.5 text-muted-foreground" />
            GitHub Username
          </Label>
          <Input
            id="github"
            value={getProfileUsername('github')}
            onChange={(e) => updateProfileByNetwork('GitHub', e.target.value)}
            placeholder="johndoe"
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary" className="text-base font-semibold">
            Professional Summary
          </Label>
          <AIWriterButton
            fieldName="summary"
            fieldLabel="Summary"
            fieldValue={summary.content || ''}
            onUpdate={(newText) => updateSummary({ content: newText })}
          />
        </div>
        <RichTextEditor
          value={summary.content}
          onChange={(value) => updateSummary({ content: value })}
          placeholder="A brief summary of your professional background and career goals..."
          className="min-h-[120px]"
        />
        <FieldTip>
          Keep it concise (2–4 sentences). Lead with your title, highlight your top skills, and end
          with what you're looking for. Use the ✨ AI Writer to generate a strong draft.
        </FieldTip>
      </div>
    </motion.div>
  );
};
