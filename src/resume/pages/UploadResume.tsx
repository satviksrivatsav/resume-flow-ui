import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  CloudUpload,
  FileText,
  ServerCrash,
  Timer,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DashboardLayout } from '@/dashboard/components/DashboardLayout';
import { AILoadingModal } from '@/shared/components/ui/AILoadingModal';
import { Button } from '@/shared/components/ui/button';
import { parseResume } from '@/shared/lib/parseResumeApi';
import { useResumeStore } from '@/shared/stores/resumeStore';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'text/plain',
];

export default function UploadResume() {
  const navigate = useNavigate();
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const setResumeData = useResumeStore((state) => state.setResumeData);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setUploadState('idle');
  }, []);

  const handleTryAgain = useCallback(() => {
    setUploadState('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file || !ALLOWED_TYPES.includes(file.type)) {
        setError('Please upload a valid file (PDF, DOCX, Image, or TXT)');
        setUploadState('error');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('File too large (max 10MB)');
        setUploadState('error');
        return;
      }

      setUploadState('uploading');
      setError(null);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const timeoutId = setTimeout(() => {
        abortController.abort(new Error('TimeoutError'));
      }, 45000); // 45 second timeout for multi-format parsing (OCR can be slow)

      try {
        const parsedData = await parseResume(file, abortController.signal);

        clearTimeout(timeoutId);
        setResumeData(parsedData);
        setUploadState('success');

        // Navigate to builder after short delay
        setTimeout(() => {
          navigate('/resume-builder');
        }, 1000);
      } catch (err: unknown) {
        clearTimeout(timeoutId);

        if (err instanceof Error && err.message === 'TimeoutError') {
          setError('Parsing took too long. Please try again.');
          setUploadState('error');
          return;
        }

        if (err instanceof Error && err.name === 'AbortError') {
          // Ignore regular manual aborts if any
          return;
        }

        const isNetworkError =
          !navigator.onLine ||
          (err instanceof TypeError && err.message.toLowerCase().includes('fetch'));

        setError(
          isNetworkError
            ? 'A network error occurred. Please check your connection and try again.'
            : err instanceof Error
              ? err.message
              : 'Failed to parse resume',
        );
        setUploadState('error');
      }
    },
    [setResumeData, navigate],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
      // Clear the input value so the same file can be selected again
      e.target.value = '';
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col w-full relative">
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-full hover:bg-accent transition-all group px-4 h-10"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-semibold">Back</span>
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 relative">
          <div className="max-w-xl w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-8">
              Upload Your Resume
            </h1>

            {/* Upload Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300 cursor-pointer
                ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'}
                ${uploadState === 'success' ? 'border-success bg-success text-success-foreground' : ''}
                ${uploadState === 'error' ? 'border-destructive bg-destructive text-destructive-foreground' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.png,.jpg,.jpeg,.txt"
                onChange={handleInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploadState === 'uploading'}
              />

              <AnimatePresence mode="wait">
                {uploadState === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <CloudUpload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium text-foreground mb-1">
                      Drop your resume here
                    </p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                  </motion.div>
                )}

                {uploadState === 'uploading' && (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center"
                  >
                    <p className="text-lg font-medium text-foreground mb-1">Upload initiated...</p>
                    <p className="text-sm text-muted-foreground">Preparing to parse your resume</p>
                  </motion.div>
                )}

                {uploadState === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <CheckCircle className="w-12 h-12 text-success-foreground mb-4" />
                    <p className="text-lg font-medium text-success-foreground">
                      Resume parsed successfully!
                    </p>
                    <p className="text-sm text-success-foreground/80">Redirecting to builder...</p>
                  </motion.div>
                )}

                {uploadState === 'error' && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center"
                  >
                    {error?.toLowerCase().includes('too long') ? (
                      <Timer className="w-12 h-12 text-destructive-foreground mb-4" />
                    ) : error?.toLowerCase().includes('server') ||
                      error?.toLowerCase().includes('500') ||
                      error?.toLowerCase().includes('failed to fetch') ? (
                      <ServerCrash className="w-12 h-12 text-destructive-foreground mb-4" />
                    ) : (
                      <AlertCircle className="w-12 h-12 text-destructive-foreground mb-4" />
                    )}
                    <p className="text-lg font-medium text-destructive-foreground mb-1">
                      Failed to parse resume
                    </p>
                    <p className="text-sm text-destructive-foreground/80 mb-4">{error}</p>
                    <Button
                      variant="secondary"
                      onClick={handleTryAgain}
                      className="bg-white text-destructive hover:bg-white/90"
                    >
                      Try Again
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Supported formats */}
            <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground text-sm">
              <FileText className="w-4 h-4" />
              <span>Supported: PDF, DOCX, Images, TXT (max 10MB)</span>
            </div>
          </div>
        </div>

        <AILoadingModal
          isOpen={uploadState === 'uploading'}
          onCancel={handleCancel}
          message="Parsing your resume content with AI..."
          title="Resume Parser"
        />
      </div>
    </DashboardLayout>
  );
}
