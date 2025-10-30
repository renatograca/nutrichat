package com.bodyteam.nutrichat.service;

import org.springframework.stereotype.Component;

@Component
public class LLMClient {

  // Mock — aqui você chamaria o OpenAI ou outro modelo
  public String generate(String prompt) {
    if (prompt.toLowerCase().contains("salmão")) {
      return "De acordo com seu plano: o salmão deve ser assado com azeite de oliva e ervas finas.";
    }
    if (prompt.toLowerCase().contains("arroz integral")) {
      return "Seu plano permite trocar 50g de arroz integral por 100g de batata doce cozida.";
    }
    return "Não encontrei a informação no seu plano nutricional.";
  }
}
