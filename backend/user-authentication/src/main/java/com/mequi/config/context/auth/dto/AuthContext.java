package com.mequi.config.context.auth.dto;

import com.mequi.service.auth.dto.UserAuthData;
import io.javalin.http.Context;
import lombok.Builder;

@Builder
public record AuthContext(
    String path,
    Long userId,
    String phone,
    UserAuthData user,
    Context context
) {
}