package com.mequi.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.mequi.config.context.user.UserContextService;


import com.mequi.exceptions.ApiException;
import com.mequi.exceptions.UserNotFoundException;
import com.mequi.service.user.UserService;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import java.sql.SQLException;
import lombok.RequiredArgsConstructor;

@Singleton
@RequiredArgsConstructor(onConstructor_ = @__(@Inject))
public class UserController implements Controller {

  private final UserContextService userContextService;
  private final UserService service;


  public void getUser(Context context) throws UserNotFoundException {
    final var id = Long.valueOf(context.pathParam("user_id"));
    final var userOptional = service.findById(id);
    if (userOptional.isEmpty()) {
      throw new UserNotFoundException("User not found");
    }
    context.status(HttpStatus.OK);
    context.json(userOptional.get());
  }

  public void createUser(Context context) throws ApiException, SQLException, JsonProcessingException {
    final var userContext = userContextService.apply(context);
    final var newUser = service.create(userContext);
    context.status(HttpStatus.CREATED);
    context.json(newUser);
  }

  public void updateUser(Context context) throws ApiException, SQLException, JsonProcessingException {
    final var userContext = userContextService.apply(context);
    service.update(userContext);
    context.status(HttpStatus.OK);
    context.json("{\"message\": \"updated user\"}");
  }

  public void deleteUser(Context context) throws ApiException, SQLException, JsonProcessingException {
    final var userContext = userContextService.apply(context);
    service.delete(userContext);
    context.status(HttpStatus.NO_CONTENT);
  }
}
