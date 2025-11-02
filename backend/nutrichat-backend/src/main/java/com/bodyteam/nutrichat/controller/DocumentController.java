package com.bodyteam.nutrichat.controller;

import com.bodyteam.nutrichat.dto.ChatRequest;
import com.bodyteam.nutrichat.dto.ChatResponse;
import com.bodyteam.nutrichat.dto.UploadResponse;
import com.bodyteam.nutrichat.service.DocumentService;
import java.util.Collections;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DocumentController {

  private final DocumentService documentService;


  @PostMapping("/documents/upload")
  public ResponseEntity<UploadResponse> uploadDocument(@RequestParam("file") MultipartFile file) {
    return ResponseEntity.ok(new UploadResponse("docId.toString()", "indexing"));
  }

  @GetMapping("/document/{document_id}")
  public ResponseEntity<Map<String, String>> getDocument(@PathVariable("document_id") String documentId) {
    return ResponseEntity.ok(Collections.emptyMap());
  }
}
