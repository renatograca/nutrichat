package com.mequi.mapper;

import com.mequi.repository.user.entity.UserEntity;
import com.mequi.service.user.dto.UserDTO;
import com.mequi.service.user.dto.UserData;
import com.mequi.utils.PasswordUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(imports = PasswordUtils.class)
public interface UserMapper {

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "passwordHash", source = "password", qualifiedByName = "hash")
  UserEntity toUserEntity(UserData userData);

  @Mapping(target = "passwordHash", ignore = true)
  UserEntity toUserEntity(UserDTO userData);

  @Mapping(target = "password", ignore = true)
  UserData toUserData(UserEntity user);

  UserDTO toUserDTO(UserEntity user);

  @Named("hash")
  default String passwordHash(String password) {
    return PasswordUtils.hash(password);
  }
}
