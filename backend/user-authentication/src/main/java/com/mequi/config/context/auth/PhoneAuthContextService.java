package com.mequi.config.context.auth;

import com.mequi.config.context.auth.dto.PhoneAuthContext;
import io.javalin.http.Context;
import java.util.function.Function;

public interface PhoneAuthContextService extends Function<Context, PhoneAuthContext> {
}