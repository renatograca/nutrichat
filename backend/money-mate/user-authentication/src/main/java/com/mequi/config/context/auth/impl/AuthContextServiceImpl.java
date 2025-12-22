package com.mequi.config.context.auth.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.Inject;
import com.mequi.config.context.auth.AuthContextService;
import com.mequi.config.context.auth.dto.AuthContext;
import com.mequi.service.auth.dto.UserAuthData;
import io.javalin.http.Context;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(onConstructor_ = @__(@Inject))
public class AuthContextServiceImpl implements AuthContextService {

  private final ObjectMapper mapper;

  @Override
  public AuthContext apply(Context context) {

    try {
      final var userAuthData = mapper.readValue(context.body(), UserAuthData.class);

      return AuthContext.builder()
          .path(context.path())
          .userId(userAuthData.id())
          .user(userAuthData)
          .build();
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error Json");
    }
  }
}
