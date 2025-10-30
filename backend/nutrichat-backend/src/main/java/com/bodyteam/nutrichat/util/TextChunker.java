package com.bodyteam.nutrichat.util;

import com.bodyteam.nutrichat.model.Chunk;
import com.bodyteam.nutrichat.model.Document;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class TextChunker {

  public static List<Chunk> splitText(Document doc) {
    String[] paragraphs = doc.getText().split("\\n\\n");
    List<Chunk> chunks = new ArrayList<>();

    int i = 1;
    for (String para : paragraphs) {
      if (para.trim().isEmpty()) continue;
      chunks.add(new Chunk(UUID.randomUUID().toString(), doc.getId().toString(), para.trim(), i++));
    }
    return chunks;
  }
}
