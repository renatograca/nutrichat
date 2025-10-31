package com.bodyteam.nutrichat.service;

import com.bodyteam.nutrichat.model.Chunk;
import com.bodyteam.nutrichat.model.Document;
import com.bodyteam.nutrichat.util.TextChunker;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Serviço responsável por receber PDFs, extrair o texto, gerar embeddings e armazená-los.
 */
@Service
@RequiredArgsConstructor
public class DocumentService {

  private final VectorStore vectorStore;
  private final EmbeddingClient embeddingClient;
  private final Tika tika = new Tika();

  /**
   * Recebe um arquivo PDF (MultipartFile), extrai seu texto e indexa os vetores.
   */
  public UUID storeAndIndex(MultipartFile file, String userId) {
    try (InputStream inputStream = file.getInputStream()) {

      // 1️⃣ Extrair texto do PDF (usando Tika com fallback para PDFBox)
      String text = extractText(inputStream);

      // 2️⃣ Criar entidade Document
      UUID documentId = UUID.randomUUID();
      Document document = new Document(documentId, userId, file.getOriginalFilename(), text);

      // 3️⃣ Dividir o texto em chunks menores
      List<Chunk> chunks = TextChunker.splitText(document);

      // 4️⃣ Gerar embeddings e armazenar cada chunk no VectorStore
      for (Chunk chunk : chunks) {
        float[] embedding = embeddingClient.embed(chunk.getText());
        vectorStore.upsert(documentId.toString(), chunk.getId(), embedding, chunk.getText());
      }

      System.out.println("✅ Documento indexado com sucesso: " + documentId);
      return documentId;

    } catch (IOException e) {
      throw new RuntimeException("Erro ao processar o documento: " + e.getMessage(), e);
    }
  }

  /**
   * Extrai o texto do PDF usando Apache Tika, com fallback para PDFBox.
   */
  private String extractText(InputStream inputStream) {
    try {
      String text = tika.parseToString(inputStream);
      if (text == null || text.isBlank()) {
        throw new IOException("Texto vazio retornado pelo Tika");
      }
      return text;
    } catch (Exception e) {
      System.err.println("⚠️ Falha ao extrair texto com Tika, tentando com PDFBox...");
      return extractTextWithPdfBox(inputStream);
    }
  }

  /**
   * Fallback: usa PDFBox se Tika não conseguir ler o PDF.
   */
  private String extractTextWithPdfBox(InputStream inputStream) {
    try (PDDocument document = PDDocument.load(inputStream)) {
      PDFTextStripper stripper = new PDFTextStripper();
      return stripper.getText(document);
    } catch (IOException e) {
      throw new RuntimeException("Erro ao extrair texto com PDFBox", e);
    }
  }

  /**
   * Retorna todos os textos armazenados por documento.
   */
  public Map<String, String> getDocumentById(String documentId) {
    return vectorStore.getDocumentById(documentId);
  }
}
