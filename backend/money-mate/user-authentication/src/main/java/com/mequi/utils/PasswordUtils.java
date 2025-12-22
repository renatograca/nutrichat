package com.mequi.utils;

import com.mequi.config.context.auth.dto.AuthContext;
import com.mequi.repository.user.entity.UserEntity;
import org.eclipse.jetty.util.StringUtil;
import org.mindrot.jbcrypt.BCrypt;

public final class PasswordUtils {

  public static String hash(String password) throws IllegalArgumentException {
    if (StringUtil.isBlank(password)) {
      throw new IllegalArgumentException("password is null or empty");
    }
    return BCrypt.hashpw(password, BCrypt.gensalt());
  }

  public static boolean verifyPassword(String password, String passwordHash) {
    if (StringUtil.isBlank(password) || StringUtil.isBlank(passwordHash)) {
      throw new IllegalArgumentException("password or passwordHash is null or empty");
    }
    return BCrypt.checkpw(password, passwordHash);
  }

  public static boolean verifyLogin(AuthContext authContext, UserEntity user) {
    return verifyPassword(authContext.user().password(), user.passwordHash());
  }

}
