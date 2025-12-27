import { getDocument } from 'pdfjs-dist';

async function extractTextFromPdf(fileBytes: any) {
  try {
    const data = new Uint8Array(fileBytes);
    const pdf = await getDocument({ data }).promise;
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

