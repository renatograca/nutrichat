package com.bodyteam.nutrichat.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Chunk {
  private String id;
  private String documentId;
  private String text;
  private int page;
}
