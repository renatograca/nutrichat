package com.mequi.service.auth;

public interface AuthService {
  String generateToken(Long userId);
  String validateToken(String token);
}
