'use client';

import React from 'react';
import { createRoot } from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Helper 1 – take an existing DOM element and turn it into a PDF.
 * Still works with a ref to a hidden report node if you ever need it.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  fileName: string
) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#020617', // dark navy to match site theme
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'pt', 'a4');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const ratio = Math.min(
    pageWidth / canvas.width,
    pageHeight / canvas.height
  );

  const imgWidth = canvas.width * ratio;
  const imgHeight = canvas.height * ratio;

  const x = (pageWidth - imgWidth) / 2;
  const y = (pageHeight - imgHeight) / 2;

  pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
  pdf.save(fileName);
}

/**
 * Helper 2 – render a React report component off-screen, grab the
 * `.pdf-page` node inside it, and export that as a PDF.
 *
 * Usage example:
 *
 *   await downloadComponentPdf(PdfReport, props, 'Goal_plan.pdf');
 */
export async function downloadComponentPdf<
  P extends Record<string, any>
>(
  Component: React.ComponentType<P>,
  props: P,
  fileName: string
) {
  if (typeof document === 'undefined') return;

  // 1. Create an off-screen container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '-9999px';
  container.style.width = '794px'; // ≈ A4 width at 96dpi
  container.style.background = '#020617';
  container.style.zIndex = '-1';
  document.body.appendChild(container);

  // 2. Render <Component {...props} /> into it (no JSX in .ts)
  const root = createRoot(container);
  root.render(React.createElement(Component, props));

  // 3. Let React paint
  await new Promise<void>((resolve) => setTimeout(resolve, 50));

  // 4. Find the page node to capture
  const pageNode =
    container.querySelector<HTMLElement>('.pdf-page') ??
    (container.firstElementChild as HTMLElement | null);

  if (!pageNode) {
    console.error(
      'downloadComponentPdf: no elements found for PDF rendering'
    );
    root.unmount();
    document.body.removeChild(container);
    return;
  }

  // 5. Reuse the element-based helper
  await downloadElementAsPdf(pageNode, fileName);

  // 6. Clean up
  root.unmount();
  document.body.removeChild(container);
}
