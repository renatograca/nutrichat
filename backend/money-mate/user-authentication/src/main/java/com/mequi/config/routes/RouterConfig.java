package com.mequi.config.routes;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.mequi.routes.Routers;
import io.javalin.Javalin;
import java.util.Set;
import lombok.RequiredArgsConstructor;

@Singleton
@RequiredArgsConstructor(onConstructor_ = @__(@Inject))
public class RouterConfig {

  private final Set<Routers> routes;

  public void configureRouters(Javalin app) {
    routes.forEach(router -> router.addRoutes(app));
  }
}
