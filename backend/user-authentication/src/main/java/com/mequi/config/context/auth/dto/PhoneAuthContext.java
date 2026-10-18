package com.mequi.config.context.auth.dto;

import com.mequi.service.auth.dto.PhoneAuthData;
import io.javalin.http.Context;
import lombok.Builder;

@Builder
public record PhoneAuthContext(
    String path,
    PhoneAuthData phone,
    Context context
) {
}