package com.mequi.routes;

import com.google.inject.Inject;
import static com.mequi.config.routes.ResourceConfig.UserPaths.USER_ID_PATH;
import static com.mequi.config.routes.ResourceConfig.UserPaths.ROOT_PATH;
import com.mequi.controller.UserController;
import io.javalin.Javalin;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(onConstructor_ = @__(@Inject))
public class UserRoutes implements Routers {


  private final UserController userController;

  @Override
  public void addRoutes(Javalin server) {
    server.get(USER_ID_PATH, userController::getUser);
    server.post(ROOT_PATH, userController::createUser);
    server.put(ROOT_PATH, userController::updateUser);
    server.delete(USER_ID_PATH, userController::deleteUser);
  }
}
