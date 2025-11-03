package com.bodyteam.nutrichat.controller;

import com.bodyteam.nutrichat.service.DocumentService;
import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

  private final ChatModel chatModel;
  private final VectorStore vectorStore;
  private final DocumentService documentService;


  // Endpoint para fazer a ingestão de um PDF
  @PostMapping("/ingest")
  public String ingestDocument(@RequestParam("file") MultipartFile file) throws IOException {
    final var start = System.currentTimeMillis();
    log.info("iniciou o uplaod");

    if (file.isEmpty() || !Objects.requireNonNull(file.getOriginalFilename()).toLowerCase(Locale.ROOT).endsWith(".pdf")) {
      return "Por favor, selecione um arquivo PDF válido.";
    }
    final var result = System.currentTimeMillis() - start;
    log.info("finalizou em {}", result);
    return documentService.ingestPdf(file);
  }

  // Endpoint principal para perguntas RAG
  @GetMapping("/pergunta")
  public Map<String, String> generateResponse(@RequestParam(value = "message", defaultValue = "Qual a importância das proteínas?") String message) {

    final var start = System.currentTimeMillis();
    log.info("Startando sua duvida.");
    // 1. Retrieval (Busca): Busca os documentos mais relevantes no PgVector
    List<Document> similarDocuments = vectorStore.similaritySearch(message);

    // 2. Montagem do Contexto: Compila o conteúdo dos documentos
    String context = similarDocuments.stream()
        .map(Document::getContent)
        .collect(Collectors.joining(System.lineSeparator()));

    SystemPromptTemplate systemPrompt = getSystemPromptTemplate();
    UserMessage userMessage = new UserMessage(message);

    Prompt prompt = new Prompt(List.of(systemPrompt.createMessage(Map.of("context", context)), userMessage));

    String response = chatModel.call(prompt).toString();

    final var result = System.currentTimeMillis() - start;
    log.info("finalizou em {}", result);
    return Map.of("pergunta", message, "resposta", response);
  }

  private static SystemPromptTemplate getSystemPromptTemplate() {
    String systemTemplate = """
            Você é um assistente de nutrição amigável e informativo chamado NutriChat.\s
            Sua resposta deve ser baseada EXCLUSIVAMENTE no CONTEXTO fornecido abaixo.
            Se a pergunta não puder ser respondida com o CONTEXTO fornecido, diga 'Não tenho informações sobre isso no meu banco de dados nutricional.'

            CONTEXTO:
            {context}
           \s""";

    return new SystemPromptTemplate(systemTemplate);
  }
}
