package com.mequi.service.user.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.Inject;
import com.mequi.config.context.user.UserContext;
import com.mequi.exceptions.ApiException;
import com.mequi.exceptions.UserNotFoundException;
import com.mequi.mapper.UserMapper;
import com.mequi.repository.user.UserRepository;
import com.mequi.repository.user.entity.UserEntity;
import com.mequi.service.user.UserService;
import com.mequi.service.user.dto.UserDTO;
import com.mequi.service.user.dto.UserData;
import java.sql.SQLException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor(onConstructor_ = @__(@Inject))
public class UserServiceImpl implements UserService {

  private final ObjectMapper mapper;
  private final UserMapper userMapper;
  private final UserRepository userRepository;

  @Override
  public Optional<UserEntity> getUserEntityById(Long id) throws UserNotFoundException {
    return userRepository.findById(id);
  }

  @Override
  public Optional<UserEntity> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  @Override
  public Optional<UserDTO> findById(Long id) throws UserNotFoundException {
     final var userEntity = userRepository.findById(id);
     return userEntity.map(userMapper::toUserDTO);
  }

  @Override
  public UserDTO create(UserContext context) throws ApiException, JsonProcessingException, SQLException {
    final var userData = mapper.readValue(context.context().body(), UserData.class);
    final var userOptional = userRepository.findByEmail(userData.email());

    if (userOptional.isPresent()) {
      log.warn("Email de usuario já cadastrado");
      throw new ApiException("email already registered.");
    }

    final var userEntity = userMapper.toUserEntity(userData);
    final var newUser = userRepository.create(userEntity);
    return userMapper.toUserDTO(newUser);
  }

  @Override
  public void update(UserContext context) throws SQLException, JsonProcessingException, ApiException {
    final var userData = mapper.readValue(context.context().body(), UserDTO.class);
    final var userOptional = userRepository.findByEmail(userData.email());

    if (userOptional.isPresent()) {
      log.warn("Email de usuario já cadastrado");
      throw new ApiException("email already registered.");
    }

    final var userEntity = userMapper.toUserEntity(userData);
    userRepository.update(userEntity);
  }

  @Override
  public void delete(UserContext context) throws SQLException, ApiException {
    if (context.userId().isEmpty()) {
      throw new ApiException("user_id is null or invalid");
    }
    userRepository.delete(Long.parseLong(context.userId()));
  }
}
