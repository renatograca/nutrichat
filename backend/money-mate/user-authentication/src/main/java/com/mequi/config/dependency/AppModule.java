package com.mequi.config.dependency;

import com.google.inject.AbstractModule;
import com.google.inject.Singleton;
import com.google.inject.multibindings.Multibinder;
import com.mequi.config.context.auth.AuthContextService;
import com.mequi.config.context.auth.impl.AuthContextServiceImpl;
import com.mequi.config.context.user.UserContextService;
import com.mequi.config.context.user.UserContextServiceImpl;
import com.mequi.config.data_base.connection.DataBaseConfig;
import com.mequi.config.middleware.AuthMiddleware;
import com.mequi.config.middleware.impl.AuthMiddlewareImpl;
import com.mequi.mapper.UserMapper;
import com.mequi.mapper.UserMapperImpl;
import com.mequi.repository.user.UserRepository;
import com.mequi.repository.user.impl.UserRepositoryImpl;
import com.mequi.routes.AuthRoutes;
import com.mequi.routes.ExceptionHandlerRoutes;
import com.mequi.routes.Routers;
import com.mequi.routes.UserRoutes;
import com.mequi.service.auth.AuthService;
import com.mequi.service.auth.impl.AuthServiceImpl;
import com.mequi.service.user.UserService;
import com.mequi.service.user.impl.UserServiceImpl;
import javax.sql.DataSource;

public class AppModule extends AbstractModule {

  @Override
  protected void configure() {
    userModule();
    dataBaseConfig();
    authBaseConfig();
    routesBaseConfig();
  }

  private void userModule() {
    bind(UserMapper.class).to(UserMapperImpl.class).in(Singleton.class);
    bind(UserContextService.class).to(UserContextServiceImpl.class).in(Singleton.class);
    bind(UserService.class).to(UserServiceImpl.class).in(Singleton.class);
  }

  private void dataBaseConfig() {
    bind(DataSource.class).toInstance(DataBaseConfig.getDataSource());
    bind(UserRepository.class).to(UserRepositoryImpl.class).in(Singleton.class);
  }

  private void authBaseConfig() {
    bind(AuthService.class).to(AuthServiceImpl.class).in(Singleton.class);
    bind(AuthContextService.class).to(AuthContextServiceImpl.class).in(Singleton.class);
    bind(AuthMiddleware.class).to(AuthMiddlewareImpl.class).in(Singleton.class);
  }

  private void routesBaseConfig() {
    final var routes = Multibinder.newSetBinder(binder(), Routers.class);
    routes.addBinding().to(AuthRoutes.class);
    routes.addBinding().to(UserRoutes.class);
    routes.addBinding().to(ExceptionHandlerRoutes.class);
  }
}
