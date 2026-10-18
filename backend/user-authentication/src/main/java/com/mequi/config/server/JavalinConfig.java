package com.mequi.config.server;

import com.mequi.config.AppConfig;
import io.javalin.Javalin;

public class JavalinConfig {
  public static Javalin create() {
    final int port = Integer.parseInt(AppConfig.get("server.port"));
    final var server = Javalin.create(config -> {
      config.bundledPlugins.enableCors(cors -> {
        cors.addRule(it -> {
          it.reflectClientOrigin = true;
          it.allowCredentials = true;
        });
      });
    });
    server.start(port);
    System.out.println("Server start in port " + port);
    return server;
  }
}
