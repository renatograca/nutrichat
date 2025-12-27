import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

async function extractTextFromPdf(fileBytes: any) {
  try {
    const data = new Uint8Array(fileBytes);

    // No Node.js com a versão legacy, podemos carregar o worker manualmente
    // @ts-ignore
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
       // @ts-ignore
       const worker = await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
       // @ts-ignore
       pdfjs.GlobalWorkerOptions.workerSrc = worker.default || worker;
    }

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