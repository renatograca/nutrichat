package com.mequi.controller.dto;

import lombok.Builder;

@Builder
public record AuthResponse(
  String message,
  String token
) {
}