package com.mequi.config.context.user;

import io.javalin.http.Context;
import java.util.Objects;
import java.util.Optional;

public class UserContextServiceImpl implements UserContextService {

  private static final String PATH_PARAM_USER_ID = "user_id";
  @Override
  public UserContext apply(Context context) {
    final var user_id = new StringBuilder();
    final var pathParamMap = context.pathParamMap();
    if (pathParamMap.containsKey(PATH_PARAM_USER_ID)) {
      user_id.append(pathParamMap.get(PATH_PARAM_USER_ID));
    }
    return UserContext.builder()
        .Path(context.path())
        .userId(user_id.toString())
        .context(context)
        .build();
  }
}
