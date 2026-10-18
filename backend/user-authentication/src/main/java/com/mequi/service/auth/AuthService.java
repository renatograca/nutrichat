package com.mequi.service.auth;

public interface AuthService {
  String generateToken(Long userId);
  String generateToken(String phone);
  String validateToken(String token);
}
