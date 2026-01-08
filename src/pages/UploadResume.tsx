import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
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

        try {
            const parsedData = await parseResumeFromPdf(file);
            setResumeData(parsedData);
            setUploadState('success');

            // Navigate to builder after short delay
            setTimeout(() => {
                navigate('/resume-builder');
            }, 1000);
        } catch (err) {
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
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            {/* Back Button */}
            <Button
                variant="ghost"
                className="absolute top-6 left-6 text-neutral-400 hover:text-white"
                onClick={() => navigate('/')}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            <div className="max-w-xl w-full">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
                    Upload Your Resume
                </h1>

                {/* Upload Zone */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
            relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer
            ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-neutral-700 hover:border-neutral-500'}
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
                                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                                    <Upload className="w-8 h-8 text-neutral-400" />
                                </div>
                                <p className="text-lg font-medium text-white mb-1">
                                    Drop your PDF resume here
                                </p>
                                <p className="text-sm text-neutral-500">
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
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                                <p className="text-lg font-medium text-white mb-1">
                                    Parsing your resume...
                                </p>
                                <p className="text-sm text-neutral-500">
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
                                <p className="text-lg font-medium text-green-400">
                                    Resume parsed successfully!
                                </p>
                                <p className="text-sm text-neutral-500">
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
                                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                                <p className="text-lg font-medium text-red-400 mb-1">
                                    Failed to parse resume
                                </p>
                                <p className="text-sm text-neutral-500 mb-4">
                                    {error}
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => setUploadState('idle')}
                                    className="border-neutral-700"
                                >
                                    Try Again
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Supported formats */}
                <div className="flex items-center justify-center gap-2 mt-6 text-neutral-500 text-sm">
                    <FileText className="w-4 h-4" />
                    <span>Supported format: PDF (max 10MB)</span>
                </div>
            </div>
        </div>
    );
}
