package com.mequi.config.routes;

public class ResourceConfig {
  public static class UserPaths {
    public static final String ROOT_PATH = "/users";
    public static final String USER_ID_PATH = ROOT_PATH + "/{user_id}";
  }
  public static class AuthPaths {
    public static final String ROOT_PATH = "/auth";
    public static final String LOGIN_PATH = ROOT_PATH + "/login";
    public static final String VALIDATE_TOKEN_PATH = ROOT_PATH + "/validate";
  }
}
