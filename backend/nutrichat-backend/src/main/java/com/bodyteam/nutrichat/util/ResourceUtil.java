package com.bodyteam.nutrichat.util;

import java.io.IOException;
import java.util.List;
import lombok.experimental.UtilityClass;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;


@UtilityClass
public class ResourceUtil {

  public static InputStreamResource createPdfResource(MultipartFile file) throws IOException {
    return new InputStreamResource(file.getInputStream()) {
      @Override
      public String getFilename() {
        return file.getOriginalFilename();
      }
    };
  }

  public static PagePdfDocumentReader createPdf(Resource resource) {
    return new PagePdfDocumentReader(resource);
  }

  public static List<Document> getDocuments(MultipartFile file) throws IOException {
    return createPdf(
        createPdfResource(file)
    ).get();
  }
}
