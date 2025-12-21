package com.mequi.service.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mequi.config.context.user.UserContext;
import com.mequi.exceptions.ApiException;
import com.mequi.exceptions.UserNotFoundException;
import com.mequi.repository.user.entity.UserEntity;
import com.mequi.service.user.dto.UserDTO;
import java.sql.SQLException;
import java.util.Optional;

public interface UserService {
  Optional<UserEntity> getUserEntityById(Long id) throws UserNotFoundException;
  Optional<UserEntity> findByEmail(String email);
  Optional<UserDTO> findById(Long id) throws UserNotFoundException;
  UserDTO create(UserContext context) throws ApiException, JsonProcessingException, SQLException;
  void update(UserContext context) throws SQLException, JsonProcessingException, ApiException;
  void delete(UserContext context) throws SQLException, ApiException;
}
