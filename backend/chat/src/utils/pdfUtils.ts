import * as pdfjs from 'pdfjs-dist';

const PDFJS_VERSION = '4.1.292';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.mjs`;

async function extractTextFromPdf(fileBytes: any) {
  try {
    const data = new Uint8Array(fileBytes);
    const loadingTask = pdfjs.getDocument({
      data,
      useSystemFonts: true,
      disableFontFace: true,
      isEvalSupported: false
    });
    
    const pdf = await loadingTask.promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      text += pageText + '\n';
    }

    return text.trim();
  } catch (error: any) {
    throw new Error(`Erro ao extrair texto do PDF: ${error.message}`);
  }
}

export { extractTextFromPdf };

