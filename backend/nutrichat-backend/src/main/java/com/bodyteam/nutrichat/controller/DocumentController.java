package com.bodyteam.nutrichat.controller;

import com.bodyteam.nutrichat.dto.ChatRequest;
import com.bodyteam.nutrichat.dto.ChatResponse;
import com.bodyteam.nutrichat.dto.UploadResponse;
import com.bodyteam.nutrichat.service.ChatService;
import com.bodyteam.nutrichat.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class DocumentController {

  private final DocumentService documentService;
  private final ChatService chatService;

  public DocumentController(DocumentService documentService, ChatService chatService) {
    this.documentService = documentService;
    this.chatService = chatService;
  }

  @PostMapping("/documents/upload")
  public ResponseEntity<UploadResponse> uploadDocument(@RequestParam("file") MultipartFile file) {
    // Simulação de userId estático (futuramente usar JWT)
    String userId = "user-123";
    UUID docId = documentService.storeAndIndex(file, userId);
    return ResponseEntity.ok(new UploadResponse(docId.toString(), "indexing"));
  }

  @PostMapping("/chat")
  public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest req) {
    String userId = "user-123";
    ChatResponse resp = chatService.answerQuestion(userId, req.getDocumentId(), req.getQuestion());
    return ResponseEntity.ok(resp);
  }
}
