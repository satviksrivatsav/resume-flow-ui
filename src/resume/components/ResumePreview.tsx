import { pdf } from '@react-pdf/renderer';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { sanitizeResumeData } from '@/shared/lib/utils';
import { useResumeStore } from '@/shared/stores/resumeStore';
import { PDFGenerator } from '@/shared/utils/export/pdfGenerator';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface ResumePreviewHandle {
  captureThumbnail: () => Promise<Blob | null>;
}

interface PdfLayer {
  id: string;
  blobUrl: string;
  numPages: number;
  phase: 'active' | 'exiting' | 'staged';
  renderedPages: number[];
}

export const ResumePreview = forwardRef<
  ResumePreviewHandle,
  { data?: any; onPageCountChange?: (count: number) => void }
>((props, ref) => {
  const { resumeData: storeData } = useResumeStore();
  const rawData = props.data || storeData;

  const resumeData = useMemo(() => sanitizeResumeData(rawData), [rawData]);
  const [layers, setLayers] = useState<PdfLayer[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const layerIdRef = useRef(0);

  useImperativeHandle(ref, () => ({
    captureThumbnail: async () => {
      let attempts = 0;
      const maxAttempts = 10;
      
      const findCanvas = () => {
        // Find all canvases and pick the first one from a resume sheet in the ACTIVE layer
        const canvases = document.querySelectorAll('.pdf-layer-active .resume-page-sheet canvas');
        return canvases[0] as HTMLCanvasElement | undefined;
      };

      let canvas = findCanvas();
      
      // Wait for canvas to be available and have content
      while ((!canvas || canvas.width === 0) && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        canvas = findCanvas();
        attempts++;
      }

      if (!canvas || canvas.width === 0) {
        console.warn('Thumbnail capture failed: Canvas not found or empty after', attempts, 'attempts');
        return null;
      }

      return new Promise((resolve) => {
        try {
          canvas!.toBlob((blob) => {
            if (!blob) {
              console.warn('Canvas.toBlob returned null');
            }
            resolve(blob);
          }, 'image/webp', 0.8);
        } catch (err) {
          console.error('Error during canvas.toBlob:', err);
          resolve(null);
        }
      });
    },
  }));

  useEffect(() => {
    let isMounted = true;
    setIsGenerating(true);
    
    const timeoutId = setTimeout(async () => {
      try {
        const asPdf = pdf(<PDFGenerator resumeData={resumeData} />);
        const blob = await asPdf.toBlob();
        const url = URL.createObjectURL(blob);
        
        if (isMounted) {
          setLayers((prev) => {
            const id = `layer_${layerIdRef.current++}`;
            const nextLayer: PdfLayer = {
              id,
              blobUrl: url,
              numPages: 0,
              phase: prev.length === 0 ? 'active' : 'staged',
              renderedPages: [],
            };

            // If it's the first layer, just return it
            if (prev.length === 0) return [nextLayer];
            
            // Otherwise, keep existing active layer and add the staged one
            const active = prev.filter(l => l.phase === 'active');
            return [...active, nextLayer];
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

  // Clean up object URLs when layers are removed
  const cleanupLayer = (layerId: string) => {
    setLayers((prev) => {
      const layer = prev.find(l => l.id === layerId);
      if (layer) {
        URL.revokeObjectURL(layer.blobUrl);
      }
      return prev.filter(l => l.id !== layerId);
    });
  };

  const handlePageRenderSuccess = (layerId: string, pageNumber: number) => {
    setLayers((prev) => {
      const layer = prev.find(l => l.id === layerId);
      if (!layer || layer.renderedPages.includes(pageNumber)) return prev;

      const updatedRenderedPages = [...layer.renderedPages, pageNumber];
      
      // If all pages in a staged layer are rendered, promote it to active
      if (layer.phase === 'staged' && updatedRenderedPages.length >= layer.numPages && layer.numPages > 0) {
        return prev.map(l => {
          if (l.id === layerId) return { ...l, phase: 'active', renderedPages: updatedRenderedPages };
          if (l.phase === 'active') return { ...l, phase: 'exiting' };
          return l;
        });
      }

      return prev.map(l => l.id === layerId ? { ...l, renderedPages: updatedRenderedPages } : l);
    });
  };

  const handleDocumentLoadSuccess = (layerId: string, numPages: number) => {
    setLayers((prev) => {
      const layer = prev.find(l => l.id === layerId);
      if (!layer) return prev;

      if (props.onPageCountChange && layer.phase === 'active') {
        props.onPageCountChange(numPages);
      }

      return prev.map(l => l.id === layerId ? { ...l, numPages } : l);
    });
  };

  const PAGE_WIDTH = 794;

  return (
    <div className="flex flex-col items-center gap-6 w-full select-none origin-top relative min-h-[1123px]">
      {layers.length === 0 && (
        <div 
          className="flex flex-col items-center justify-center w-full bg-white shadow-2xl border border-border/10 rounded-sm"
          style={{ height: '1123px', maxWidth: PAGE_WIDTH }}
        >
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">Initializing preview...</p>
        </div>
      )}

      <AnimatePresence initial={false}>
        {layers.map((layer) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: layer.phase === 'active' ? 1 : 0 }}
            animate={{ opacity: layer.phase === 'active' ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onAnimationComplete={() => {
              if (layer.phase === 'exiting') {
                cleanupLayer(layer.id);
              }
            }}
            className={`pdf-layer pdf-layer-${layer.phase} w-full flex flex-col items-center ${
              layer.phase !== 'active' ? 'absolute inset-0 pointer-events-none' : ''
            }`}
          >
            <Document
              file={layer.blobUrl}
              onLoadSuccess={({ numPages }) => handleDocumentLoadSuccess(layer.id, numPages)}
              loading={null} // Hide loader to keep previous layer visible
            >
              {Array.from(new Array(layer.numPages), (el, index) => (
                <div
                  key={`${layer.id}_page_${index + 1}`}
                  className="resume-page-sheet shadow-2xl relative bg-white border border-border/10 rounded-sm overflow-hidden mb-6"
                >
                  <Page
                    pageNumber={index + 1}
                    width={PAGE_WIDTH}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    onRenderSuccess={() => handlePageRenderSuccess(layer.id, index + 1)}
                    loading={null}
                  />
                  <div className="absolute bottom-3 right-4 text-[9px] font-semibold text-muted-foreground/30 uppercase tracking-widest pointer-events-none select-none z-30">
                    Page {index + 1} of {layer.numPages}
                  </div>
                </div>
              ))}
            </Document>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
