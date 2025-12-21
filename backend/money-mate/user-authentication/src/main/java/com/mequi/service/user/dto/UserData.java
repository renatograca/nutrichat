package com.mequi.service.user.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;

import java.util.Date;

@Builder
public record UserData(
    String fullName,
    String email,
    String password,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    Date dateOfBirth,
    long phone,
    AccountStatus accountStatus
) {
    public UserData {
        if (accountStatus == null) {
            accountStatus = AccountStatus.ACTIVE;
        }
    }
}
