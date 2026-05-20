import { pdf } from '@react-pdf/renderer';
import { Loader2 } from 'lucide-react';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { sanitizeResumeData } from '@/shared/lib/utils';
import { useResumeStore } from '@/shared/stores/resumeStore';
import { PDFGenerator } from '@/shared/utils/export/pdfGenerator';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const ResumePreview = forwardRef<
  HTMLDivElement,
  { data?: any; onPageCountChange?: (count: number) => void }
>((props, ref) => {
  const { resumeData: storeData } = useResumeStore();
  const rawData = props.data || storeData;

  const resumeData = useMemo(() => sanitizeResumeData(rawData), [rawData]);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsGenerating(true);
    
    // Use setTimeout to debounce the expensive PDF generation and keep the UI responsive
    const timeoutId = setTimeout(async () => {
      try {
        const asPdf = pdf(<PDFGenerator resumeData={resumeData} />);
        const blob = await asPdf.toBlob();
        
        if (isMounted) {
          setBlobUrl((prevBlobUrl) => {
            if (prevBlobUrl) {
              URL.revokeObjectURL(prevBlobUrl);
            }
            return URL.createObjectURL(blob);
          });
        }
      } catch (error) {
        console.error('Failed to generate PDF preview:', error);
      } finally {
        if (isMounted) {
          setIsGenerating(false);
        }
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [resumeData]);

  // Clean up object URLs when the component unmounts
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, []); // Only run on unmount

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    if (props.onPageCountChange) {
      props.onPageCountChange(numPages);
    }
  }

  // A4 ratio width matching the previous HTML preview
  const PAGE_WIDTH = 794;

  return (
    <div ref={ref} className="flex flex-col items-center gap-6 w-full select-none origin-top relative">
      {isGenerating && (
         <div className="absolute top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm animate-in fade-in zoom-in-95">
           <Loader2 className="w-3 h-3 animate-spin" />
           <span className="text-xs font-medium">Updating...</span>
         </div>
      )}
      
      {!blobUrl ? (
        <div 
          className="flex flex-col items-center justify-center w-full bg-white shadow-2xl border border-border/10 rounded-sm"
          style={{ height: '1123px', maxWidth: PAGE_WIDTH }}
        >
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">Generating live preview...</p>
        </div>
      ) : (
        <Document
          file={blobUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div 
              className="flex flex-col items-center justify-center w-full bg-white shadow-2xl border border-border/10 rounded-sm"
              style={{ height: '1123px', maxWidth: PAGE_WIDTH }}
            >
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">Rendering document...</p>
            </div>
          }
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div
              key={`page_${index + 1}`}
              className="resume-page-sheet shadow-2xl relative bg-white border border-border/10 rounded-sm overflow-hidden mb-6"
            >
              <Page
                pageNumber={index + 1}
                width={PAGE_WIDTH}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                loading={
                   <div 
                     className="flex items-center justify-center bg-white"
                     style={{ width: PAGE_WIDTH, height: 1123 }}
                   >
                     <Loader2 className="w-6 h-6 animate-spin text-muted-foreground/30" />
                   </div>
                }
              />
              {/* Subtle page indicator at bottom right of each page sheet */}
              <div className="absolute bottom-3 right-4 text-[9px] font-semibold text-muted-foreground/30 uppercase tracking-widest pointer-events-none select-none z-30">
                Page {index + 1} of {numPages}
              </div>
            </div>
          ))}
        </Document>
      )}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
