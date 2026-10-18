package com.mequi.repository.user.entity;

import lombok.Builder;

@Builder
public record UserPhone(
    Long id,
    String phone
) {
}
