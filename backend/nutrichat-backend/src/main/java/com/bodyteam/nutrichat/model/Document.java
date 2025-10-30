package com.bodyteam.nutrichat.model;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@AllArgsConstructor
public class Document {
  private UUID id;
  private String userId;
  private String fileName;
  private String text;
}