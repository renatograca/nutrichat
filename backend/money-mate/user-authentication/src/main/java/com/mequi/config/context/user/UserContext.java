package com.mequi.config.context.user;

import io.javalin.http.Context;
import java.util.Optional;
import lombok.Builder;

@Builder
public record UserContext(
    String Path,
    String userId,
    Context context
) {}
