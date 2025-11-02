package com.bodyteam.nutrichat.config;

import javax.sql.DataSource;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.OllamaEmbeddingModel;
import org.springframework.ai.ollama.api.OllamaApi;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.PgVectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;

@Profile("!local")
@Configuration
public class ConfigLocal {
  @Bean
  public JdbcTemplate jdbcTemplate(DataSource dataSource) {
    return new JdbcTemplate(dataSource);
  }

  // 1. Criação do Bean Concreto de ChatClient (resolve o erro)
  @Bean
  public ChatClient chatClient(OllamaChatModel model) {
    return ChatClient.builder(model).build();
  }

  // 2. Criação do Bean Concreto de EmbeddingModel (garante a injeção PgVector)
  @Bean
  public EmbeddingModel embeddingModel(OllamaApi ollamaApi) {
    // Usa o OllamaEmbeddingModel concreto.
    return new OllamaEmbeddingModel(ollamaApi, OllamaOptions.create().withModel("phi"));
  }

  // === VECTOR STORE ===

  // 3. Criação do PgVectorStore (agora depende do JdbcTemplate e do EmbeddingModel criados acima)
  @Bean
  public PgVectorStore vectorStore(JdbcTemplate jdbcTemplate, EmbeddingModel embeddingModel) {
    // O Spring AI aplicará as configurações PgVector do .yml automaticamente
    return new PgVectorStore(jdbcTemplate, embeddingModel);
  }

  @Bean
  public TokenTextSplitter tokenTextSplitter() {
    return new TokenTextSplitter();
  }
}
