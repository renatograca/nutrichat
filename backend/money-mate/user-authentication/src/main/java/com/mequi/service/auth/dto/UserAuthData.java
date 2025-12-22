package com.mequi.service.auth.dto;

import lombok.Builder;

@Builder
public record UserAuthData(
    long id,
    String email,
    String password
) {
}
