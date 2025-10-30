package com.bodyteam.nutrichat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UploadResponse {
  private String documentId;
  private String status;
}

