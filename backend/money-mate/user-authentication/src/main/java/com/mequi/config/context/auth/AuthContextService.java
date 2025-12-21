package com.mequi.config.context.auth;

import com.mequi.config.context.auth.dto.AuthContext;
import io.javalin.http.Context;
import java.util.function.Function;

public interface AuthContextService extends Function<Context, AuthContext> {
}
