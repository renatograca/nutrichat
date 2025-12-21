package com.mequi.controller.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

@Builder
public record AuthResponse(
  String message,
  String token,
  @JsonProperty("user_id")
  Long userId
) {
}