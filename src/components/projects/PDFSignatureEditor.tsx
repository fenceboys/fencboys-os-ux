import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SignatureField } from '../../types';

interface PDFSignatureEditorProps {
  pdfData: string;
  signatureField?: SignatureField;
  onSignatureFieldChange: (field: SignatureField | undefined) => void;
  onClose: () => void;
  onSave: () => void;
}

export const PDFSignatureEditor: React.FC<PDFSignatureEditorProps> = ({
  pdfData,
  signatureField,
  onSignatureFieldChange,
  onClose,
  onSave,
}) => {
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<false | 'top-left' | 'bottom-right'>(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [localField, setLocalField] = useState<SignatureField | undefined>(signatureField);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // PDF dimensions (standard US Letter)
  const PDF_WIDTH = 612;
  const PDF_HEIGHT = 792;
  const SCALE = 1;
  const RENDER_WIDTH = PDF_WIDTH * SCALE;
  const RENDER_HEIGHT = PDF_HEIGHT * SCALE;

  const DEFAULT_FIELD: SignatureField = {
    page: 1,
    x: 50,
    y: 650,
    width: 200,
    height: 60,
  };

  // Load PDF using pdf.js directly
  useEffect(() => {
    let cancelled = false;

    const loadPdf = async () => {
      try {
        setPdfLoaded(false);

        // Clear canvas immediately
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }

        // Dynamically import pdfjs-dist
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const loadingTask = pdfjsLib.getDocument(pdfData);
        const pdf = await loadingTask.promise;

        if (cancelled) return;

        setNumPages(pdf.numPages);

        // Render current page
        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale: SCALE });

        if (cancelled) return;

        if (canvas) {
          const context = canvas.getContext('2d');
          if (context) {
            // Clear canvas again before render
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            context.clearRect(0, 0, canvas.width, canvas.height);

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
              canvas: canvas,
            };
            await page.render(renderContext as any).promise;

            if (!cancelled) {
              setPdfLoaded(true);
            }
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading PDF:', error);
        }
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
    };
  }, [pdfData, currentPage, SCALE]);

  const handleAddSignatureField = () => {
    const newField = { ...DEFAULT_FIELD, page: currentPage };
    setLocalField(newField);
    onSignatureFieldChange(newField);
  };

  const handleRemoveSignatureField = () => {
    setLocalField(undefined);
    onSignatureFieldChange(undefined);
  };

  const getRelativePosition = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!localField || localField.page !== currentPage) return;
    e.preventDefault();
    const pos = getRelativePosition(e);

    // Check if clicking on resize handle (top-left corner)
    const isNearTopLeftResize =
      pos.x >= localField.x - 5 &&
      pos.x <= localField.x + 15 &&
      pos.y >= localField.y - 5 &&
      pos.y <= localField.y + 15;

    // Check if clicking on resize handle (bottom-right corner)
    const fieldRight = localField.x + localField.width;
    const fieldBottom = localField.y + localField.height;
    const isNearBottomRightResize =
      pos.x >= fieldRight - 15 &&
      pos.x <= fieldRight + 5 &&
      pos.y >= fieldBottom - 15 &&
      pos.y <= fieldBottom + 5;

    if (isNearTopLeftResize) {
      setIsResizing('top-left');
    } else if (isNearBottomRightResize) {
      setIsResizing('bottom-right');
    } else if (
      pos.x >= localField.x &&
      pos.x <= localField.x + localField.width &&
      pos.y >= localField.y &&
      pos.y <= localField.y + localField.height
    ) {
      setIsDragging(true);
      setDragOffset({
        x: pos.x - localField.x,
        y: pos.y - localField.y,
      });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!localField || (!isDragging && !isResizing)) return;

    const pos = getRelativePosition(e);

    if (isDragging) {
      const newX = Math.max(0, Math.min(pos.x - dragOffset.x, RENDER_WIDTH - localField.width));
      const newY = Math.max(0, Math.min(pos.y - dragOffset.y, RENDER_HEIGHT - localField.height));

      const updatedField = { ...localField, x: newX, y: newY };
      setLocalField(updatedField);
      onSignatureFieldChange(updatedField);
    } else if (isResizing === 'bottom-right') {
      const newWidth = Math.max(60, Math.min(pos.x - localField.x, RENDER_WIDTH - localField.x));
      const newHeight = Math.max(25, Math.min(pos.y - localField.y, RENDER_HEIGHT - localField.y));

      const updatedField = { ...localField, width: newWidth, height: newHeight };
      setLocalField(updatedField);
      onSignatureFieldChange(updatedField);
    } else if (isResizing === 'top-left') {
      // When resizing from top-left, the bottom-right corner stays fixed
      const fixedRight = localField.x + localField.width;
      const fixedBottom = localField.y + localField.height;

      const newX = Math.max(0, Math.min(pos.x, fixedRight - 60));
      const newY = Math.max(0, Math.min(pos.y, fixedBottom - 25));
      const newWidth = fixedRight - newX;
      const newHeight = fixedBottom - newY;

      const updatedField = { ...localField, x: newX, y: newY, width: newWidth, height: newHeight };
      setLocalField(updatedField);
      onSignatureFieldChange(updatedField);
    }
  }, [isDragging, isResizing, localField, dragOffset, RENDER_WIDTH, RENDER_HEIGHT, getRelativePosition, onSignatureFieldChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const showFieldOnCurrentPage = localField && localField.page === currentPage;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full mx-4 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Place Signature Field</h3>
            <p className="text-sm text-gray-500">Drag the signature block to where customers should sign</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {!localField ? (
              <button
                onClick={handleAddSignatureField}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Add Signature Field
              </button>
            ) : (
              <button
                onClick={handleRemoveSignatureField}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove Signature Field
              </button>
            )}

            {localField && (
              <span className="text-sm text-gray-600 bg-white px-3 py-1.5 rounded border border-gray-200">
                Signature on Page {localField.page}
              </span>
            )}
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm text-gray-600 min-w-[80px] text-center">
              Page {currentPage} of {numPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
              disabled={currentPage === numPages}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto bg-gray-200 p-6 flex justify-center">
          <div
            ref={containerRef}
            className="relative bg-white shadow-lg"
            onMouseDown={handleMouseDown}
            style={{
              cursor: isDragging ? 'grabbing' : isResizing === 'top-left' ? 'nwse-resize' : isResizing === 'bottom-right' ? 'nwse-resize' : 'default',
              width: RENDER_WIDTH,
              height: RENDER_HEIGHT,
            }}
          >
            {/* PDF Canvas */}
            <canvas
              ref={canvasRef}
              style={{ display: 'block' }}
            />

            {/* Loading Indicator */}
            {!pdfLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Signature Field Overlay */}
            {showFieldOnCurrentPage && pdfLoaded && (
              <div
                className="absolute border-2 border-dashed border-blue-500 bg-blue-100 bg-opacity-30 cursor-grab flex items-center justify-center"
                style={{
                  left: localField.x,
                  top: localField.y,
                  width: localField.width,
                  height: localField.height,
                }}
              >
                <div className="text-center pointer-events-none">
                  <svg className="w-6 h-6 text-blue-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span className="text-xs text-blue-700 font-medium">Customer Signature</span>
                </div>

                {/* Resize Handle - Top Left */}
                <div
                  className="absolute top-0 left-0 w-4 h-4 bg-blue-500 cursor-nwse-resize"
                  style={{ borderBottomRightRadius: '4px' }}
                />

                {/* Resize Handle - Bottom Right */}
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-nwse-resize"
                  style={{ borderTopLeftRadius: '4px' }}
                />
              </div>
            )}

            {/* Show indicator if signature is on different page */}
            {localField && localField.page !== currentPage && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 text-yellow-800 text-sm pointer-events-auto">
                  Signature field is on page {localField.page}
                  <button
                    onClick={() => setCurrentPage(localField.page)}
                    className="ml-2 underline hover:no-underline"
                  >
                    Go to page
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            {localField
              ? 'Drag the signature box to reposition. Drag either corner to resize.'
              : 'Click "Add Signature Field" to place where customers will sign.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!localField}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
