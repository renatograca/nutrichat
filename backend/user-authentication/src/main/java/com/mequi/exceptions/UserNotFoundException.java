package com.mequi.exceptions;

public class UserNotFoundException extends Exception {
  public UserNotFoundException(String message) {
    super(message);
  }

  public UserNotFoundException(String message, Throwable e) {
    super(message, e);
  }
}
