import { motion } from 'framer-motion';
import { FileText, UploadCloud, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AILoadingModal } from '@/components/ui/AILoadingModal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAtsStore } from '@/stores/atsStore';

interface AtsSetupProps {
  onAnalyze: (file: File | null, jdText: string) => Promise<void>;
  onCancel: () => void;
  isAnalyzing: boolean;
  hasExistingReport?: boolean;
  onViewExistingReport?: () => void;
}

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'text/plain',
];

export function AtsSetup({
  onAnalyze,
  onCancel,
  isAnalyzing,
  hasExistingReport,
  onViewExistingReport,
}: AtsSetupProps) {
  const navigate = useNavigate();
  const { resumeFile, resumeId, jdText, setResumeFile, setResumeId, setJdText } = useAtsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [jdFileName, setJdFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && ALLOWED_TYPES.includes(file.type)) {
      setResumeFile(file);
      setFileName(file.name);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setFileName(file.name);
    }
  };

  const handleJdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setJdText(event.target?.result as string);
        setJdFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile && !resumeId) return;
    await onAnalyze(resumeFile, jdText);
  };

  const handleClearResume = () => {
    setResumeFile(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Zone 1: Resume Input */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resume
          </h2>

          {resumeFile || resumeId ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-muted/50 rounded-2xl p-4 border border-border"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {resumeId ? `Resume #${resumeId.slice(0, 8)}...` : fileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {resumeFile
                        ? `${(resumeFile.size / 1024).toFixed(1)} KB`
                        : 'Loaded from dashboard'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearResume}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
                ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground hover:bg-muted/5'}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_TYPES.join(',')}
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 mx-auto">
                <UploadCloud className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground mb-1">Drop your resume here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
              <p className="text-xs text-muted-foreground/60 mt-2">
                PDF, DOCX, Images, TXT (max 10MB)
              </p>
            </div>
          )}

          {/* Load from Dashboard */}
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard?tab=resumes')}
              className="w-full"
            >
              Load from Dashboard
            </Button>
          </div>
        </div>

        {/* Zone 2: Job Description Input */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Job Description{' '}
            <span className="text-sm font-normal text-muted-foreground">(optional)</span>
          </h2>

          <div className="space-y-3">
            <Textarea
              placeholder="Paste the job description here to check ATS match..."
              className="min-h-[200px] resize-none"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />

            {/* JD File Upload */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="jd-file-upload"
                className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-muted-foreground cursor-pointer transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
                Upload JD File
              </label>
              <input
                id="jd-file-upload"
                type="file"
                accept=".txt,.pdf,.docx"
                className="hidden"
                onChange={handleJdFileUpload}
              />
              {jdFileName && (
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {jdFileName}
                </span>
              )}
            </div>

            {jdText && (
              <p className="text-xs text-muted-foreground">
                {jdText.split(/\s+/).length} words · {jdText.length} characters
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="mt-8 flex justify-end gap-3">
        {hasExistingReport && (
          <Button
            variant="outline"
            size="lg"
            onClick={onViewExistingReport}
            className="px-8 border-primary/30 hover:border-primary/50 text-primary"
          >
            View Latest Report
          </Button>
        )}
        <Button
          size="lg"
          onClick={handleAnalyze}
          disabled={isAnalyzing || (!resumeFile && !resumeId)}
          className="px-8"
        >
          Analyze Resume
        </Button>
      </div>

      <AILoadingModal
        isOpen={isAnalyzing}
        onCancel={onCancel}
        message="Analyzing your resume against the JD..."
        title="ATS Analysis"
      />
    </motion.div>
  );
}
