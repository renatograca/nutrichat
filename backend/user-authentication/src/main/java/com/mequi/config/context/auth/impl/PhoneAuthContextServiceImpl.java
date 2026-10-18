package com.mequi.config.context.auth.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.Inject;
import com.mequi.config.context.auth.PhoneAuthContextService;
import com.mequi.config.context.auth.dto.PhoneAuthContext;
import com.mequi.service.auth.dto.PhoneAuthData;
import io.javalin.http.Context;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(onConstructor_ = @Inject)
public class PhoneAuthContextServiceImpl implements PhoneAuthContextService {

  private final ObjectMapper mapper;

  @Override
  public PhoneAuthContext apply(Context context) {
    try {
      final var phoneAuthData = mapper.readValue(context.body(), PhoneAuthData.class);
      return PhoneAuthContext.builder()
          .path(context.path())
          .phone(phoneAuthData)
          .build();
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error Json");
    }
  }
}