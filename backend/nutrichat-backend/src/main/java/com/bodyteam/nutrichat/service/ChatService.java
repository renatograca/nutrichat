package com.bodyteam.nutrichat.service;

import com.bodyteam.nutrichat.dto.ChatResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

  private final VectorStore vectorStore;
  private final EmbeddingClient embeddingClient;
  private final LLMClient llmClient;

  public ChatService(VectorStore vectorStore, EmbeddingClient embeddingClient, LLMClient llmClient) {
    this.vectorStore = vectorStore;
    this.embeddingClient = embeddingClient;
    this.llmClient = llmClient;
  }

  public ChatResponse answerQuestion(String userId, String documentId, String question) {
    float[] queryEmbedding = embeddingClient.embed(question);
    List<String> relevantChunks = vectorStore.query(documentId, queryEmbedding, 3);

    if (relevantChunks.isEmpty()) {
      return new ChatResponse("Não encontrei a informação no seu plano nutricional.", List.of());
    }

    String context = String.join("\n\n", relevantChunks);
    String prompt = """
                Você é um assistente nutricional pessoal. 
                Responda somente com base nas informações do plano abaixo:
                """ + "\n\n" + context + "\n\nPergunta: " + question;

    String answer = llmClient.generate(prompt);
    return new ChatResponse(answer, relevantChunks);
  }
}

