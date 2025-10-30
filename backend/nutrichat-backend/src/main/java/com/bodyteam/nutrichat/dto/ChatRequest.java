package com.bodyteam.nutrichat.dto;

import lombok.Data;

@Data
public class ChatRequest {
  private String documentId;
  private String question;
}

