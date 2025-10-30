package com.bodyteam.nutrichat.service;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class EmbeddingClient {

  // Mock: gera vetor aleatório
  public float[] embed(String text) {
    Random rand = new Random();
    float[] vector = new float[10];
    for (int i = 0; i < 10; i++) {
      vector[i] = rand.nextFloat();
    }
    return vector;
  }
}
