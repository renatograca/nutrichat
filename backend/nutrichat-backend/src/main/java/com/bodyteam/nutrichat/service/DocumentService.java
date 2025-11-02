package com.bodyteam.nutrichat.service;

import static com.bodyteam.nutrichat.util.ResourceUtil.getDocuments;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentService {

  private final VectorStore vectorStore;
  private final TokenTextSplitter splitter;

  public String ingestPdf(MultipartFile file) throws IOException {
    String fileName = file.getOriginalFilename();
    log.info("Iniciando processamento do PDF: {}", fileName);

    List<Document> documents = extractDocuments(file);
    vectorStore.add(documents);

    log.info("Documento '{}' inserido com sucesso. Total de {} chunks.", fileName, documents.size());
    return String.format("Documento '%s' processado com sucesso (%d chunks).", fileName, documents.size());
  }

  private List<Document> extractDocuments(MultipartFile file) throws IOException {
    return splitter.apply(getDocuments(file));
  }
}
