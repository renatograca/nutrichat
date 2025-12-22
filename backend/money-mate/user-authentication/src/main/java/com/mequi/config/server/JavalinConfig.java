package com.mequi.config.server;

import io.javalin.Javalin;

public class JavalinConfig {
  private static final int PORT = 8080;

  public static Javalin create() {
    final var server = Javalin.create(config -> {
      config.bundledPlugins.enableCors(cors -> {
        cors.addRule(it -> {
          it.reflectClientOrigin = true; // Permite o origin do cliente
          it.allowCredentials = true;
        });
      });
    });
    server.start(PORT);
    System.out.println("Server start in port " + PORT);
    return server;
  }
}
