import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, ArrowLeft, Timer, ServerCrash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { parseResumeFromPdf } from '@/lib/parseResumeApi';
import { useResumeStore } from '@/stores/resumeStore';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

export default function UploadResume() {
    const navigate = useNavigate();
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const setResumeData = useResumeStore((state) => state.setResumeData);

    const handleFile = useCallback(async (file: File) => {
        if (!file || file.type !== 'application/pdf') {
            setError('Please upload a PDF file');
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
        const timeoutId = setTimeout(() => {
            abortController.abort(new Error('TimeoutError'));
        }, 30000); // 30 second timeout for parsing

        try {
            const parsedData = await parseResumeFromPdf(file, abortController.signal);
            
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
                setError("Parsing took too long. Please try again.");
                setUploadState('error');
                return;
            }

            if (err instanceof Error && err.name === 'AbortError') {
                // Ignore regular manual aborts if any
                return;
            }

            setError(err instanceof Error ? err.message : 'Failed to parse resume');
            setUploadState('error');
        }
    }, [setResumeData, navigate]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => setDragActive(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            {/* Back Button */}
            <Button
                variant="ghost"
                className="absolute top-6 left-6 text-muted-foreground hover:text-foreground"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

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
            relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer
            ${dragActive ? 'border-white bg-white/10' : 'border-border hover:border-muted-foreground'}
            ${uploadState === 'success' ? 'border-green-500 bg-green-500/10' : ''}
            ${uploadState === 'error' ? 'border-red-500 bg-red-500/10' : ''}
          `}
                >
                    <input
                        type="file"
                        accept=".pdf"
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
                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-lg font-medium text-foreground mb-1">
                                    Drop your PDF resume here
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    or click to browse
                                </p>
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
                                <Loader2 className="w-12 h-12 text-zinc-500 animate-spin mb-4" />
                                <p className="text-lg font-medium text-foreground mb-1">
                                    Parsing your resume...
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    This may take a few seconds
                                </p>
                            </motion.div>
                        )}

                        {uploadState === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center"
                            >
                                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                                <p className="text-lg font-medium text-green-500 dark:text-green-400">
                                    Resume parsed successfully!
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Redirecting to builder...
                                </p>
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
                                    <Timer className="w-12 h-12 text-red-500 mb-4" />
                                ) : error?.toLowerCase().includes('server') || error?.toLowerCase().includes('500') || error?.toLowerCase().includes('failed to fetch') ? (
                                    <ServerCrash className="w-12 h-12 text-red-500 mb-4" />
                                ) : (
                                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                                )}
                                <p className="text-lg font-medium text-red-500 dark:text-red-400 mb-1">
                                    Failed to parse resume
                                </p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {error}
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => setUploadState('idle')}
                                    className="border-border"
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
                    <span>Supported format: PDF (max 10MB)</span>
                </div>
            </div>
        </div>
    );
}
