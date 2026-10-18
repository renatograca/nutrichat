package com.mequi.service.user.dto;

public enum AccountStatus {
  ACTIVE,
  INACTIVE,
  DELETED;


  public static AccountStatus getAccountStatus(String statusString) {
    if (statusString == null || statusString.trim().isEmpty()) {
      return null;
    }
    try {
      return AccountStatus.valueOf(statusString.toUpperCase());
    } catch (IllegalArgumentException e) {

      return null;
    }
  }
}
