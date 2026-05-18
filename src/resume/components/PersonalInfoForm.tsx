import { motion } from 'framer-motion';
import { Github, Globe, Linkedin, Mail, MapPin, Phone, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { AIWriterButton } from '@/shared/components/ui/AIWriterButton';
import { FieldTip } from '@/shared/components/ui/FieldTip';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { PhoneInput } from '@/shared/components/ui/PhoneInput';
import { RichTextEditor } from '@/shared/components/ui/RichTextEditor';
import { cleanPhoneNumber, getCountryByCode } from '@/shared/lib/countries';
import { useResumeStore } from '@/shared/stores/resumeStore';

export const PersonalInfoForm = () => {
  const { resumeData, updateBasics, updateSummary, updateProfileByNetwork } = useResumeStore();
  const { basics, summary, sections } = resumeData;
  const [countryCode, setCountryCode] = useState('US');

  // Auto-sync local state and clean store when data loads
  useEffect(() => {
    if (basics.countryCode && getCountryByCode(basics.countryCode.toUpperCase())) {
      setCountryCode(basics.countryCode.toUpperCase());
    }

    // Proactively clean the phone number if it contains the dial code
    const cleanedPhone = cleanPhoneNumber(basics.phone, basics.countryCode || countryCode);
    if (cleanedPhone !== basics.phone) {
      updateBasics({ phone: cleanedPhone });
    }
  }, [basics.countryCode, basics.phone]);

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
        <div className="space-y-2 min-w-0">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={basics.name}
            onChange={(e) => updateBasics({ name: e.target.value })}
            placeholder="John Doe"
            className="focus-visible:ring-primary w-full"
          />
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="headline" className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            Headline
          </Label>
          <Input
            id="headline"
            value={basics.headline}
            onChange={(e) => updateBasics({ headline: e.target.value })}
            placeholder="Software Engineer"
            className="w-full"
          />
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={basics.email}
            onChange={(e) => updateBasics({ email: e.target.value })}
            placeholder="john@example.com"
            className="w-full"
          />
        </div>
        <div className="space-y-2 min-w-0">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
            Phone <span className="text-destructive">*</span>
          </Label>
          <PhoneInput
            value={basics.phone}
            onChange={(value) => updateBasics({ phone: value })}
            countryCode={countryCode}
            onCountryCodeChange={(code) => {
              setCountryCode(code);
              updateBasics({ countryCode: code });
            }}
            placeholder="Phone number"
          />
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            Location
          </Label>
          <Input
            id="location"
            value={basics.location}
            onChange={(e) => updateBasics({ location: e.target.value })}
            placeholder="City, Country"
            className="w-full"
          />
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            Portfolio Website
          </Label>
          <Input
            id="website"
            value={basics.url.href}
            onChange={(e) => updateBasics({ url: { ...basics.url, href: e.target.value } })}
            placeholder="johndoe.com"
            className="w-full"
          />
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <Linkedin className="w-3.5 h-3.5 text-muted-foreground" />
            LinkedIn Profile
          </Label>
          <Input
            id="linkedin"
            value={getProfileUsername('linkedin')}
            onChange={(e) => updateProfileByNetwork('LinkedIn', e.target.value)}
            placeholder="linkedin.com/in/johndoe"
            className="w-full"
          />
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="github" className="flex items-center gap-2">
            <Github className="w-3.5 h-3.5 text-muted-foreground" />
            GitHub Profile
          </Label>
          <Input
            id="github"
            value={getProfileUsername('github')}
            onChange={(e) => updateProfileByNetwork('GitHub', e.target.value)}
            placeholder="github.com/johndoe"
            className="w-full"
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
