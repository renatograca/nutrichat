package com.bodyteam.nutrichat.service;

import com.bodyteam.nutrichat.model.Chunk;
import com.bodyteam.nutrichat.model.Document;
import com.bodyteam.nutrichat.util.TextChunker;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class DocumentService {

  private final VectorStore vectorStore;
  private final EmbeddingClient embeddingClient;
  private final Tika tika = new Tika();

  public DocumentService(VectorStore vectorStore, EmbeddingClient embeddingClient) {
    this.vectorStore = vectorStore;
    this.embeddingClient = embeddingClient;
  }

  public UUID storeAndIndex(MultipartFile file, String userId) {
    try {
      String text = tika.parseToString(file.getInputStream());
      UUID documentId = UUID.randomUUID();
      Document document = new Document(documentId, userId, file.getOriginalFilename(), text);

      List<Chunk> chunks = TextChunker.splitText(document);
      for (Chunk chunk : chunks) {
        float[] embedding = embeddingClient.embed(chunk.getText());
        vectorStore.upsert(documentId.toString(), chunk.getId(), embedding, chunk.getText());
      }

      System.out.println("✅ Documento indexado com sucesso: " + documentId);
      return documentId;

    } catch (IOException e) {
      throw new RuntimeException("Erro ao processar o documento", e);
    } catch (TikaException e) {
      throw new RuntimeException(e);
    }
  }
}

