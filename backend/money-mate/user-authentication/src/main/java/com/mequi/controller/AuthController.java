package com.mequi.controller;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.mequi.config.context.auth.AuthContextService;
import com.mequi.controller.dto.AuthResponse;
import com.mequi.exceptions.InvalidPasswordException;
import com.mequi.exceptions.UserNotFoundException;
import com.mequi.service.auth.AuthService;
import com.mequi.service.user.UserService;
import com.mequi.utils.PasswordUtils;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import lombok.RequiredArgsConstructor;

@Singleton
@RequiredArgsConstructor(onConstructor_ = @__(@Inject))
public class AuthController implements Controller {

  private final AuthContextService authContextService;
  private final AuthService authService;
  private final UserService userService;

  public void login(Context context) throws UserNotFoundException, InvalidPasswordException {
    final var authContext = authContextService.apply(context);

    if (authContext.user() == null) {
      throw new UserNotFoundException("Invalid user");
    }

    if (authContext.user().email() == null) {
      throw new UserNotFoundException("Invalid email");
    }

    final var userEntity = userService.findByEmail(authContext.user().email()).orElse(null);

    if (userEntity == null) {
      throw new UserNotFoundException("User not found");
    }

    if (!PasswordUtils.verifyLogin(authContext, userEntity)) {
      throw new InvalidPasswordException("Invalid password");
    }

    String token = authService.generateToken(userEntity.id());
    sendSuccessResponse(context, token);
  }

  public void validateToken(Context context) {
    String token = context.header("Authorization");
    if (token != null && token.startsWith("Bearer ")) {
      token = token.substring(7);
    }

    try {
      authService.validateToken(token);
      context.status(HttpStatus.OK).json(AuthResponse.builder().message("Token is valid").build());
    } catch (Exception e) {
      context.status(HttpStatus.UNAUTHORIZED).json(AuthResponse.builder().message("Token is invalid").build());
    }
  }

  private void sendSuccessResponse(Context context, String token) {
    final var authResponse = AuthResponse.builder()
        .message("Authentication successful")
        .token(token)
        .build();

    context.status(HttpStatus.OK);
    context.json(authResponse);
  }
}
