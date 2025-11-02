package com.bodyteam.nutrichat.util;

import java.util.function.BiConsumer;
import java.util.List;
import jdk.jfr.Category;
import lombok.experimental.UtilityClass;
import org.springframework.ai.document.Document;
import org.springframework.stereotype.Component;

@Component
public class FileNameMetadataTransformer implements BiConsumer<List<Document>, String> {


  @Override
  public void accept(List<Document> documents, String s) {
      documents.forEach(doc -> {
        doc.getMetadata().put("file_name", s);
      });
  }
}
