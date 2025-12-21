package com.mequi.repository.user.impl;

import com.google.inject.Inject;
import com.mequi.exceptions.UserNotFoundException;
import com.mequi.repository.user.UserRepository;
import com.mequi.repository.user.entity.UserEntity;
import com.mequi.service.user.dto.AccountStatus;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Objects;
import java.util.Optional;
import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor(onConstructor_ = @__(@Inject))
public class UserRepositoryImpl implements UserRepository {
  private static final String ID = "id";
  private static final String FULL_NAME = "full_name";
  private static final String PASSWORD_HASH = "password_hash";
  private static final String EMAIL = "email";
  private static final String DATE_OF_BIRTH = "date_of_birth";
  private static final String PHONE = "phone";
  private static final String ACCOUNT_STATUS = "account_status";
  private final DataSource dataSource;

  @Override
  public Optional<UserEntity> findById(Long id) throws UserNotFoundException {
    final var data = buildDataString(ID, FULL_NAME, PASSWORD_HASH, EMAIL, DATE_OF_BIRTH, PHONE, ACCOUNT_STATUS);
    final var query = "SELECT " + data + " FROM users WHERE id = ? and account_status != 'DELETED'";
    try(
        final var conn = dataSource.getConnection();
        final var stmt = conn.prepareStatement(query)
    ) {
      stmt.setLong(1, id);
      final var resultSet = stmt.executeQuery();
      if (resultSet.next()) {
        return Optional.of(mapUserEntity(resultSet));
      }
    } catch (SQLException e) {
      log.error("Error ao encontrar o usuário {}", id);
      throw new UserNotFoundException("User not found", e);
    }
    return Optional.empty();
  }

  @Override
  public Optional<UserEntity> findByEmail(String email) {
    final var data = buildDataString(ID, FULL_NAME, PASSWORD_HASH, EMAIL, DATE_OF_BIRTH, PHONE, ACCOUNT_STATUS);

    final var query = "SELECT " + data + " FROM users WHERE email = ?";
    try(
        final var conn = dataSource.getConnection();
        final var stmt = conn.prepareStatement(query)
    ) {
      stmt.setString(1, email);
      final var resultSet = stmt.executeQuery();
      if (resultSet.next()) {
        return Optional.of(mapUserEntity(resultSet));
      }
    } catch (SQLException ignored) {
    }
    return Optional.empty();
  }

  @Override
  public UserEntity create(UserEntity userData) throws SQLException {
    final var data = "("
        + buildDataString(FULL_NAME, PASSWORD_HASH, EMAIL, DATE_OF_BIRTH, PHONE, ACCOUNT_STATUS)
        + ")";
    final var query = "INSERT INTO users " + data + " VALUES (?, ?, ?, ?, ?, ?) RETURNING *";
    try(
        final var conn = dataSource.getConnection();
        final var stmt = conn.prepareStatement(query)
    ) {
      stmt.setString(1, userData.fullName());
      stmt.setString(2, userData.passwordHash());
      stmt.setString(3, userData.email());
      stmt.setDate(4, userData.dateOfBirth());
      stmt.setLong(5, userData.phone());
      stmt.setString(6, userData.accountStatus().name());
      final var resultSet = stmt.executeQuery();

      if (resultSet.next()) {
        return mapUserEntity(resultSet);
      }
      throw new SQLException("Erro ao obter o usuário criado.");
    } catch (SQLException e) {
      log.error("Erro ao criar usuario");
      throw e;
    }
  }

  @Override
  public void update(UserEntity userData) throws SQLException {
    final var query = buildUpdateQuery(userData);
    try(
        final var conn = dataSource.getConnection();
        final var stmt = conn.prepareStatement(query)
    ) {

      stmt.executeUpdate();
    } catch (SQLException e) {
      log.error("Erro ao atualizar usuario");
      throw e;
    }
  }

  @Override
  public void delete(Long userId) throws SQLException {
  final var query = "UPDATE users SET "
      + updateValue(ACCOUNT_STATUS, AccountStatus.DELETED.name())
      + " WHERE id = " + userId;

    try(
        final var conn = dataSource.getConnection();
        final var stmt = conn.prepareStatement(query)
    ) {

      stmt.executeUpdate();
    } catch (SQLException e) {
      log.error("Erro ao deletar usuario");
      throw e;
    }
  }

  private String buildUpdateQuery(UserEntity user) {
    final var query = new StringBuilder("UPDATE users SET ");
    final var updates = new ArrayList<String>();

    if (Objects.nonNull(user.fullName())) {
      updates.add(updateValue(FULL_NAME, user.fullName()));
    }

    if (Objects.nonNull(user.dateOfBirth())) {
      updates.add(updateValue(DATE_OF_BIRTH, String.valueOf(user.dateOfBirth())));
    }

    if (Objects.nonNull(user.email())) {
      updates.add(updateValue(EMAIL, user.email()));
    }

    if (Objects.nonNull(user.phone())) {
      updates.add(updateValue(PHONE, String.valueOf(user.phone())));
    }

    query.append(String.join(", ", updates));
    query.append(" WHERE id = ").append(user.id());

    return query.toString();
  }

  private String updateValue(String filed, String value) {
    return filed + " = " + "'" + value + "'";
  }

  private UserEntity mapUserEntity(ResultSet r) throws SQLException {
    return UserEntity.builder()
        .id(r.getLong(ID))
        .fullName(r.getString(FULL_NAME))
        .passwordHash(r.getString(PASSWORD_HASH))
        .email(r.getString(EMAIL))
        .dateOfBirth(r.getDate(DATE_OF_BIRTH))
        .phone(r.getLong(PHONE))
        .accountStatus(AccountStatus.getAccountStatus(r.getString(ACCOUNT_STATUS)))
        .build();
  }

  private String buildDataString(String ...strings) {
    return String.join(", ", strings);
  }
}
