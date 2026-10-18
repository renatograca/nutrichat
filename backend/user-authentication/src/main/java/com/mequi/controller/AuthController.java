package com.mequi.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.mequi.config.context.auth.AuthContextService;
import com.mequi.config.context.auth.PhoneAuthContextService;
import com.mequi.config.context.auth.dto.PhoneAuthContext;
import com.mequi.controller.dto.AuthResponse;
import com.mequi.exceptions.ApiException;
import com.mequi.exceptions.BadRequestException;
import com.mequi.exceptions.InvalidPasswordException;
import com.mequi.exceptions.UserNotFoundException;
import com.mequi.service.auth.AuthService;
import com.mequi.service.auth.dto.PhoneAuthData;
import com.mequi.service.user.UserService;
import com.mequi.utils.PasswordUtils;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import lombok.RequiredArgsConstructor;

import java.sql.SQLException;

import org.eclipse.jetty.util.StringUtil;

@Singleton
@RequiredArgsConstructor(onConstructor_ = @Inject)
public class AuthController implements Controller {

  private final AuthContextService authContextService;
  private final PhoneAuthContextService phoneAuthContextService;
  private final AuthService authService;
  private final UserService userService;

  public void login(Context context) throws BadRequestException, UserNotFoundException, InvalidPasswordException {
    final var authContext = authContextService.apply(context);

    if (authContext.user() == null) {
      throw new BadRequestException("User is Null or Invalid");
    }

    if (StringUtil.isBlank(authContext.user().email())) {
      throw new BadRequestException("Email is Null or Invalid");
    }

    final var userEntity = userService.findByEmail(authContext.user().email()).orElse(null);

    if (userEntity == null) {
      throw new UserNotFoundException("User not found");
    }

    if (!PasswordUtils.verifyLogin(authContext, userEntity)) {
      throw new InvalidPasswordException("Invalid password");
    }

    String token = authService.generateToken(userEntity.id());
    sendSuccessResponse(context, token, userEntity.id());
  }

  public void loginWithPhone(Context context) throws BadRequestException, UserNotFoundException, JsonProcessingException, ApiException, SQLException {
    final var phoneAuthContext = phoneAuthContextService.apply(context);
    final var phoneAuthData = phoneAuthContext.phone();

    if (phoneAuthData == null || phoneAuthData.phone() == null || !phoneAuthData.phone().matches("\\d{10,11}")) {
      throw new BadRequestException("Phone is Null or Invalid");
    }

    final var phone = userService.findOrCreateByUserPhone(phoneAuthData.phone());

    if (phone == null) {
      throw new UserNotFoundException("User not found");
    }

    String token = authService.generateToken(phoneAuthData.phone());
    sendSuccessResponseForPhone(context, token, phoneAuthData.phone());
  }

  public void validateToken(Context context) {
    String token = context.header("Authorization");
    if (token != null && token.startsWith("Bearer ")) {
      token = token.substring(7);
    }

    try {
      String userId = authService.validateToken(token);
      sendSuccessResponse(context, token, Long.parseLong(userId));
    } catch (Exception e) {
      context.status(HttpStatus.UNAUTHORIZED).json(AuthResponse.builder().message("Token is invalid").build());
    }
  }

  private void sendSuccessResponse(Context context, String token, Long userId) {
    final var authResponse = AuthResponse.builder()
        .message("Authentication successful")
        .token(token)
        .userId(userId)
        .build();

    context.status(HttpStatus.OK);
    context.json(authResponse);
  }

  private void sendSuccessResponseForPhone(Context context, String token, String phone) {
    final var authResponse = AuthResponse.builder()
        .message("Authentication successful")
        .token(token)
        .userPhone(phone)
        .build();

    context.status(HttpStatus.OK);
    context.json(authResponse);
  }
}