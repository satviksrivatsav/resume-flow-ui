import { motion } from 'framer-motion';
import { Briefcase, CloudUpload, Database, X } from 'lucide-react';
import { useRef, useState } from 'react';


import { AILoadingModal } from '@/components/ui/AILoadingModal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAtsStore } from '@/stores/atsStore';
import { ResumeSelectionModal } from './ResumeSelectionModal';

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

  const {
    resumeFile,
    resumeId,
    resumeName,
    jdText,
    jdFile,
    setResumeFile,
    setResumeId,
    setJdText,
    setJdFile,
  } = useAtsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && ALLOWED_TYPES.includes(file.type)) {
      setResumeFile(file);
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
    }
  };

  const handleJdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setJdFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile && !resumeId) return;
    await onAnalyze(resumeFile, jdText);
  };

  const handleClearResume = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearJdFile = () => {
    setJdFile(null);
  };

  const handleSelectResume = (id: string, name: string) => {
    setResumeId(id, name);
    setIsSelectModalOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl mx-auto w-full space-y-6"
      >
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight mb-0.5">ATS Check</h1>
          <p className="text-[13px] text-muted-foreground/80">
            Compare your resume with a job description.
          </p>
        </div>
 
        {/* Zone 1: Resume Input */}
        <div className="space-y-3">
          {resumeFile || resumeId ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border/50 rounded-[2rem] p-5 px-8 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-bold text-foreground text-sm truncate max-w-[240px]">
                      {resumeName}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                      {resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB` : 'Linked'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearResume}
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive transition-colors"
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
                relative border-2 border-dashed rounded-[2rem] p-10 text-center cursor-pointer transition-all duration-300
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
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3 mx-auto">
                <CloudUpload className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground mb-0.5">Drop your resume</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
              <p className="text-[10px] text-muted-foreground/50 mt-4 uppercase font-bold tracking-tight">
                PDF, DOCX, Images, TXT (MAX 10MB)
              </p>
            </div>
          )}
 
          <Button
            variant="outline"
            onClick={() => setIsSelectModalOpen(true)}
            className="w-full rounded-full h-12 text-xs font-bold uppercase tracking-wider gap-2 border-border/50 bg-background/50 hover:bg-primary/5 transition-all"
          >
            <Database className="w-4 h-4" />
            Load from saved
          </Button>
        </div>
 
        {/* Zone 2: Job Description Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-bold flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Job Description
            </label>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
              {jdFile ? 'File Uploaded' : 'Optional'}
            </span>
          </div>
 
          <div className="relative">
            <Textarea
              placeholder={
                jdFile ? 'Remove uploaded file to type manually...' : 'Paste the job description here...'
              }
              className={`min-h-[160px] resize-none bg-background border-border/50 rounded-[2rem] p-6 focus:ring-primary/20 transition-all text-sm leading-relaxed scrollbar-hide ${
                jdFile ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              disabled={!!jdFile}
            />
            {jdFile && (
              <div className="absolute inset-0 bg-background/5 rounded-[2rem] pointer-events-none" />
            )}
          </div>
 
          <div className="flex items-center gap-3 h-10">
            <label
              htmlFor="jd-file-upload"
              className={`inline-flex items-center gap-2 px-5 h-full bg-background border border-border/50 rounded-full text-[11px] font-bold text-muted-foreground transition-all uppercase tracking-wider ${
                jdFile ? 'opacity-50 cursor-not-allowed' : 'hover:text-foreground hover:border-primary/30 cursor-pointer active:scale-[0.98]'
              }`}
            >
              <CloudUpload className="w-3.5 h-3.5" />
              Upload JD File
            </label>
            <input
              id="jd-file-upload"
              type="file"
              accept=".txt,.pdf,.docx"
              className="hidden"
              onChange={handleJdFileUpload}
              disabled={!!jdFile}
            />
            {jdFile && (
              <div className="bg-card border border-border/50 rounded-full px-4 h-full flex items-center gap-3 shadow-sm max-w-[200px]">
                <p className="font-bold text-foreground text-[10px] truncate">
                  {jdFile.name}
                </p>
                <button
                  onClick={handleClearJdFile}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
 
        {/* Analyze Button */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            size="lg"
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!resumeFile && !resumeId) || (!jdText && !jdFile)}
            className="w-full rounded-full h-12 font-bold text-sm shadow-none transition-all active:scale-[0.98]"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
          </Button>
 
          {hasExistingReport && (
            <Button
              variant="ghost"
              onClick={onViewExistingReport}
              className="w-full rounded-full h-10 font-bold text-xs text-muted-foreground hover:text-primary transition-all"
            >
              View Latest Report
            </Button>
          )}
        </div>
      </motion.div>
 
      <ResumeSelectionModal
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        onSelect={handleSelectResume}
      />
 
      <AILoadingModal
        isOpen={isAnalyzing}
        onCancel={onCancel}
        message="Analyzing your resume against the JD..."
        title="ATS Analysis"
      />
    </>
  );
}
