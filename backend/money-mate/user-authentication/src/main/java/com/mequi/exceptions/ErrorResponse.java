package com.mequi.exceptions;

import lombok.Builder;

@Builder
public record ErrorResponse(
    String message,
    Throwable exception
) {
}
