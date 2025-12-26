
import { useState } from 'react';
import html2canvas from 'html2canvas';

// @ts-ignore
import html2pdf from 'html2pdf.js';
import { ReportData } from '../types';

interface UsePDFGeneratorOptions {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}

export const usePDFGenerator = (options?: UsePDFGeneratorOptions) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const generatePDF = async (data: ReportData, elementId: string = 'report-preview-hidden') => {
        // Target the element
        const element = document.getElementById(elementId);
        if (!element) {
            console.error("Elemento de preview não encontrado");
            options?.onError?.(new Error("Elemento de preview não encontrado"));
            return;
        }

        const footerElement = element.querySelector('#report-footer') as HTMLElement;
        if (!footerElement) {
            console.error("Footer não encontrado");
            options?.onError?.(new Error("Footer não encontrado"));
            return;
        }

        setIsDownloading(true);
        const filename = `LAUDO_PROXXIMA_${data.model.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}_${new Date().toISOString().split('T')[0]}.pdf`;

        try {
            // 1. Capture the footer as an image
            const canvas = await html2canvas(footerElement, { scale: 2, useCORS: true });
            const footerImgData = canvas.toDataURL('image/png');

            // 2. Hide footer in the DOM content to avoid duplication (we will re-add it manually)
            const originalDisplay = footerElement.style.display;
            footerElement.style.display = 'none';

            // 3. Generate PDF with bottom margin for footer
            const opt = {
                margin: [0, 0, 40, 0], // Top, Right, Bottom, Left (mm). Added 40mm bottom for footer
                filename: filename,
                image: { type: 'jpeg', quality: 0.98 },
                enableLinks: true,
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // @ts-ignore
            await window.html2pdf().set(opt).from(element).toPdf().get('pdf').then((pdf: any) => {
                const totalPages = pdf.internal.getNumberOfPages();
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                // Desired footer height in mm
                const drawnFooterHeight = 45; // slightly less than margin (increased for better QR scan)
                const barHeight = 2.5; // ~8px

                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);

                    // Draw Top Bar (Pink Proxxima: #E32085)
                    pdf.setFillColor(227, 32, 133);
                    pdf.rect(0, 0, pageWidth, barHeight, 'F');

                    // Draw Bottom Bar (Blue Proxxima: #2B388C)
                    pdf.setFillColor(43, 56, 140);
                    pdf.rect(0, pageHeight - barHeight, pageWidth, barHeight, 'F');

                    // Add footer image at the bottom, just above the bottom bar
                    pdf.addImage(footerImgData, 'PNG', 0, pageHeight - drawnFooterHeight - barHeight, pageWidth, drawnFooterHeight);

                    // Add Clickable Link over the QR Code / Validation Text area
                    const linkUrl = `${window.location.origin}/?ref=${data.refId || data.id}`;
                    pdf.link(10, pageHeight - drawnFooterHeight - barHeight + 5, 80, 40, { url: linkUrl });
                }
            }).save();

            // 4. Restore footer visibility
            footerElement.style.display = originalDisplay;
            options?.onSuccess?.();

        } catch (error) {
            console.error("Erro PDF:", error);
            options?.onError?.(error);
        } finally {
            setIsDownloading(false);
        }
    };

    return { generatePDF, isDownloading };
};
