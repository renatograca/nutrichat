package com.mequi.repository.user;

import com.mequi.exceptions.UserNotFoundException;
import com.mequi.repository.user.entity.UserEntity;
import com.mequi.repository.user.entity.UserPhone;
import java.sql.SQLException;
import java.util.Optional;

public interface UserRepository {
  Optional<UserEntity> findById(Long id) throws UserNotFoundException;
  Optional<UserEntity> findByEmail(String email);
  Optional<UserEntity> findByPhone(String phone);
  Optional<UserPhone> findUserPhoneByPhone(String phone);
  UserEntity create(UserEntity userData) throws SQLException;
  UserPhone createUserPhone(UserPhone userPhone) throws SQLException;
  void update(UserEntity userData) throws SQLException;
  void delete(Long userId) throws SQLException;
}