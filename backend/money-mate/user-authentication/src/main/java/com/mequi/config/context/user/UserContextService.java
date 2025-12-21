package com.mequi.config.context.user;

import io.javalin.http.Context;
import java.util.function.Function;

public interface UserContextService extends Function<Context, UserContext> {
}
