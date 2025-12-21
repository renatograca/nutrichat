package unit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.mequi.service.auth.impl.AuthServiceImpl;
import java.time.Instant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

  @InjectMocks
  private AuthServiceImpl authService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testGenerateToken() {
    Long userId = 123L;

    String token = authService.generateToken(userId);

    assertNotNull(token, "O token não deve ser nulo");

    String subject = authService.validateToken(token);
    assertEquals(userId.toString(), subject, "O subject do token deve ser o ID do usuário");
  }

  @Test
  void testValidateToken_ValidToken() {
    Long userId = 123L;
    String token = authService.generateToken(userId);

    String subject = authService.validateToken(token);

    assertEquals(userId.toString(), subject, "O subject do token deve ser o ID do usuário");
  }

  @Test
  void testValidateToken_InvalidToken() {
    String invalidToken = "invalid.token.here";

    assertThrows(JWTVerificationException.class, () ->
      authService.validateToken(invalidToken)
    , "Deve lançar JWTVerificationException para um token inválido");
  }

  @Test
  void testValidateToken_ExpiredToken() {
    long userId = 123L;
    String token = JWT.create()
        .withSubject(Long.toString(userId))
        .withExpiresAt(Instant.now().minusMillis(1000))
        .sign(Algorithm.HMAC256("mySecretKey"));

    assertThrows(JWTVerificationException.class, () ->
      authService.validateToken(token)
    , "Deve lançar JWTVerificationException para um token expirado");
  }
}