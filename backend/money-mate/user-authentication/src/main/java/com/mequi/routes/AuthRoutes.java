package com.mequi.routes;

import static com.mequi.config.routes.ResourceConfig.AuthPaths.LOGIN_PATH;
import static com.mequi.config.routes.ResourceConfig.AuthPaths.VALIDATE_TOKEN_PATH;

import com.google.inject.Inject;
import com.mequi.controller.AuthController;
import io.javalin.Javalin;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(onConstructor_ = @__(@Inject))
public class AuthRoutes implements Routers {
  private final AuthController authController;

  @Override
  public void addRoutes(Javalin server) {
    server.post(LOGIN_PATH, authController::login);
    server.get(VALIDATE_TOKEN_PATH, authController::validateToken);
  }
}
