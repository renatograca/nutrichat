package unit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mequi.exceptions.ApiException;
import com.mequi.exceptions.UserNotFoundException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mequi.config.context.user.UserContext;
import com.mequi.config.context.user.UserContextService;
import com.mequi.controller.UserController;
import com.mequi.service.user.UserService;
import com.mequi.service.user.dto.UserDTO;
import java.sql.SQLException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import java.util.Optional;
import org.mockito.MockitoAnnotations;

class UserControllerTest {

  @Mock
  private UserContextService userContextService;

  @Mock
  private UserService service;

  @Mock
  private Context context;

  @InjectMocks
  private UserController userController;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this); // Inicializa os mocks
  }
  @Test
  public void testGetUser_UserFound() throws UserNotFoundException {
    // Arrange
    Long userId = 1L;
    final var name = "John Doe";
    final var email = "john.doe@example.com";
    final var userDto = UserDTO.builder().fullName(name).email(email).build();

    when(context.pathParam("user_id")).thenReturn(userId.toString());
    when(service.findById(userId)).thenReturn(Optional.of(userDto));

    // Act
    userController.getUser(context);

    // Assert
    verify(context).json(userDto);
    verify(context).status(HttpStatus.OK);
  }

  @Test
  void testCreateUser() throws SQLException, JsonProcessingException, ApiException {
    // Arrange
    final var userContext = new UserContext("/users", "", context);
    when(userContextService.apply(context)).thenReturn(userContext);
    when(service.create(any())).thenReturn(UserDTO.builder().build());

    // Act
    userController.createUser(context);

    // Assert
    verify(service).create(userContext);
    verify(context).json(any(UserDTO.class));
    verify(context).status(HttpStatus.CREATED);
  }
}
