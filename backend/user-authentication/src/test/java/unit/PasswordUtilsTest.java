package unit;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.mequi.config.context.auth.dto.AuthContext;
import com.mequi.repository.user.entity.UserEntity;
import com.mequi.service.auth.dto.UserAuthData;
import com.mequi.utils.PasswordUtils;
import org.junit.jupiter.api.Test;

public class PasswordUtilsTest {

  @Test
  void testHash() {
    // Arrange
    final var password = "mySecurePassword123";

    // Act
    final var hashedPassword = PasswordUtils.hash(password);

    // Assert
    assertNotNull(hashedPassword);
    assertTrue(hashedPassword.startsWith("$2a$"));
  }

  @Test
  void testVerifyPasswordCorrect() {
    // Arrange
    final var password = "mySecurePassword123";
    final var hashedPassword = PasswordUtils.hash(password);

    // Act
    boolean isPasswordCorrect = PasswordUtils.verifyPassword(password, hashedPassword);

    // Assert
    assertTrue(isPasswordCorrect);
  }

  @Test
  void testVerifyPasswordIncorrect() {
    // Arrange
    final var correctPassword = "mySecurePassword123";
    final var incorrectPassword = "wrongPassword";
    final var hashedPassword = PasswordUtils.hash(correctPassword);

    // Act
    boolean isPasswordCorrect = PasswordUtils.verifyPassword(incorrectPassword, hashedPassword);

    // Assert
    assertFalse(isPasswordCorrect);
  }

  @Test
  void testVerifyPasswordWithNullInput() {
    // Arrange
    final var password = "mySecurePassword123";
    final var hashedPassword = PasswordUtils.hash(password);

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> PasswordUtils.verifyPassword(null, hashedPassword));
    assertThrows(IllegalArgumentException.class, () -> PasswordUtils.verifyPassword(password, null));
    assertThrows(IllegalArgumentException.class, () -> PasswordUtils.verifyPassword(null, null));
  }

  @Test
  void testHashWithNullInput() {
    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> PasswordUtils.hash(null));
  }

  @Test
  void testVerifyLogin_Success() {
    // Arrange
    final var password = "correctPassword";
    final var  authContext = AuthContext.builder()
        .user(UserAuthData.builder().password(password).build())
        .build();
    final var hashedPassword = PasswordUtils.hash(password);

    final var userEntity = UserEntity.builder().passwordHash(hashedPassword).build();

    // Act & Assert
    assertTrue(PasswordUtils.verifyLogin(authContext, userEntity));
  }

  @Test
  void testVerifyLogin_Failure() {
    // Arrange
    final var correctPassword = "mySecurePassword123";
    final var incorrectPassword = "wrongPassword";
    final var hashedPassword = PasswordUtils.hash(correctPassword);
    final var  authContext = AuthContext.builder()
        .user(UserAuthData.builder().password(incorrectPassword).build())
        .build();
    final var userEntity = UserEntity.builder().passwordHash(hashedPassword).build();

    // Act & Assert
    assertFalse(PasswordUtils.verifyLogin(authContext, userEntity));
  }
}