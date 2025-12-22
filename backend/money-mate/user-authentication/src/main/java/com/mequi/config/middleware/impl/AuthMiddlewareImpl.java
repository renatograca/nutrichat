package com.mequi.config.middleware.impl;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.mequi.config.middleware.AuthMiddleware;
import com.mequi.service.auth.AuthService;
import io.javalin.http.Context;
import io.javalin.http.UnauthorizedResponse;
import lombok.RequiredArgsConstructor;
import org.eclipse.jetty.util.StringUtil;

@Singleton
@RequiredArgsConstructor(onConstructor_ = @__(@Inject))
public class AuthMiddlewareImpl implements AuthMiddleware {

  private final AuthService authService;

  @Override
  public void handle(Context ctx) {
    String token = ctx.header("Authorization");
    if (StringUtil.isBlank(token)) {
      throw new UnauthorizedResponse("Token not found");
    }

    try {
      authService.validateToken(token);
    } catch (Exception e) {
      throw new UnauthorizedResponse("Token inválido");
    }
  }
}
