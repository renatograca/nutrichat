import * as pdfjs from 'pdfjs-dist';

async function extractTextFromPdf(fileBytes: any) {
  try {
    const data = new Uint8Array(fileBytes);

    const loadingTask = pdfjs.getDocument({
      data,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdf = await loadingTask.promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');

      text += pageText + '\n';
    }

    return text.trim();
  } catch (error: any) {
    console.error("Erro técnico PDF.js:", error);
    throw new Error(`Erro ao extrair texto do PDF: ${error.message}`);
  }
}

export { extractTextFromPdf };