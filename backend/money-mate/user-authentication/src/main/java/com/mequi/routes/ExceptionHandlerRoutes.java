package com.mequi.routes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.mequi.exceptions.ApiException;
import com.mequi.exceptions.ErrorResponse;
import com.mequi.exceptions.InvalidPasswordException;
import com.mequi.exceptions.UserNotFoundException;
import io.javalin.Javalin;
import io.javalin.http.HttpStatus;
import java.sql.SQLException;
import lombok.RequiredArgsConstructor;

@Singleton
@RequiredArgsConstructor(onConstructor_ = @__(@Inject))
public class ExceptionHandlerRoutes implements Routers {

  @Override
  public void addRoutes(Javalin server) {
    server.exception(UserNotFoundException.class, (e, context) -> {
      context.status(HttpStatus.NOT_FOUND);
      context.json(ErrorResponse.builder().message(e.getMessage()).build());
    });

    server.exception(InvalidPasswordException.class, (e, context) -> {
      context.status(HttpStatus.UNAUTHORIZED);
      context.json(ErrorResponse.builder().message(e.getMessage()).exception(e.getCause()).build());
    });

    server.exception(ApiException.class, (e, context) -> {
      context.status(HttpStatus.BAD_REQUEST);
      context.json(ErrorResponse.builder().message(e.getMessage()).build());
    });

    server.exception(JsonProcessingException.class, (e, context) -> {
      context.status(HttpStatus.BAD_REQUEST);
      context.json(ErrorResponse.builder().message(e.getMessage()).build());
    });

    server.exception(SQLException.class, (e, context) -> {
      context.status(HttpStatus.BAD_REQUEST);
      context.json(ErrorResponse.builder().message(e.getMessage()).build());
    });

    server.exception(Exception.class, (e, context) -> {
      context.status(HttpStatus.INTERNAL_SERVER_ERROR);
      context.json(ErrorResponse.builder().message("An unexpected error occurred").build());
    });
  }
}
