package com.bodyteam.nutrichat.service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class VectorStore {

  private final Map<String, Map<String, float[]>> store = new HashMap<>();
  private final Map<String, Map<String, String>> texts = new HashMap<>();

  public void upsert(String documentId, String chunkId, float[] vector, String text) {
    store.computeIfAbsent(documentId, k -> new HashMap<>()).put(chunkId, vector);
    texts.computeIfAbsent(documentId, k -> new HashMap<>()).put(chunkId, text);
  }

  public List<String> query(String documentId, float[] queryVec, int topK) {
    Map<String, float[]> vectors = store.get(documentId);
    if (vectors == null) return List.of();

    return vectors.entrySet().stream()
        .sorted(Comparator.comparingDouble(e -> -similarity(queryVec, e.getValue())))
        .limit(topK)
        .map(e -> texts.get(documentId).get(e.getKey()))
        .collect(Collectors.toList());
  }

  private double similarity(float[] a, float[] b) {
    double dot = 0, normA = 0, normB = 0;
    for (int i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

