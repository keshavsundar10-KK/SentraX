package com.sentrax;

import com.sentrax.dto.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AppUserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private SecurityContextRepository securityContextRepository;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private HttpServletRequest httpRequest;

    @Mock
    private HttpServletResponse httpResponse;

    @Mock
    private HttpSession httpSession;

    private AuthController authController;

    @BeforeEach
    void setUp() {
        authController = new AuthController(
                userRepository,
                passwordEncoder,
                authenticationManager,
                securityContextRepository,
                userDetailsService
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void register_success() {
        RegisterRequest request = new RegisterRequest("Alice", "alice@example.com", "securePassword123");

        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(passwordEncoder.encode("securePassword123")).thenReturn("$2a$10$encodedPassword");

        AppUser savedUser = new AppUser();
        savedUser.setName("Alice");
        savedUser.setEmail("alice@example.com");
        savedUser.setPasswordHash("$2a$10$encodedPassword");
        when(userRepository.save(any(AppUser.class))).thenReturn(savedUser);

        Authentication auth = new UsernamePasswordAuthenticationToken("alice@example.com", "securePassword123");
        when(authenticationManager.authenticate(any())).thenReturn(auth);

        ResponseEntity<UserResponse> response = authController.register(request, httpRequest, httpResponse);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Alice", response.getBody().name());
        assertEquals("alice@example.com", response.getBody().email());
        verify(securityContextRepository).saveContext(any(), eq(httpRequest), eq(httpResponse));
    }

    @Test
    void register_duplicateEmail_throwsConflict() {
        RegisterRequest request = new RegisterRequest("Alice", "alice@example.com", "securePassword123");

        when(userRepository.existsByEmail("alice@example.com")).thenReturn(true);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                authController.register(request, httpRequest, httpResponse));

        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_success() {
        LoginRequest request = new LoginRequest("alice@example.com", "securePassword123");

        Authentication auth = new UsernamePasswordAuthenticationToken("alice@example.com", "securePassword123");
        when(authenticationManager.authenticate(any())).thenReturn(auth);

        AppUser user = new AppUser();
        user.setName("Alice");
        user.setEmail("alice@example.com");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));

        ResponseEntity<UserResponse> response = authController.login(request, httpRequest, httpResponse);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("alice@example.com", response.getBody().email());
        verify(securityContextRepository).saveContext(any(), eq(httpRequest), eq(httpResponse));
    }

    @Test
    void login_invalidCredentials_throwsUnauthorized() {
        LoginRequest request = new LoginRequest("alice@example.com", "wrongPassword");

        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Bad credentials"));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                authController.login(request, httpRequest, httpResponse));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }

    @Test
    void logout_success() {
        when(httpRequest.getSession(false)).thenReturn(httpSession);

        ResponseEntity<MessageResponse> response = authController.logout(httpRequest, httpResponse);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(httpSession).invalidate();
        verify(securityContextRepository).saveContext(any(), eq(httpRequest), eq(httpResponse));
    }

    @Test
    void getCurrentUser_whenAuthenticated_returnsUser() {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                "alice@example.com", "credentials", List.of(new SimpleGrantedAuthority("ROLE_USER")));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        AppUser user = new AppUser();
        user.setName("Alice");
        user.setEmail("alice@example.com");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));

        ResponseEntity<UserResponse> response = authController.getCurrentUser(auth);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("alice@example.com", response.getBody().email());
    }

    @Test
    void getCurrentUser_whenNotAuthenticated_throwsUnauthorized() {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                authController.getCurrentUser(null));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }

    @Test
    void updateProfile_success() {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                "alice@example.com", "credentials", List.of(new SimpleGrantedAuthority("ROLE_USER")));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        AppUser existingUser = new AppUser();
        existingUser.setName("Alice");
        existingUser.setEmail("alice@example.com");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(existingUser));

        when(userRepository.existsByEmail("newalice@example.com")).thenReturn(false);

        AppUser updatedUser = new AppUser();
        updatedUser.setName("Alice New");
        updatedUser.setEmail("newalice@example.com");
        when(userRepository.save(any(AppUser.class))).thenReturn(updatedUser);

        when(userDetailsService.loadUserByUsername("newalice@example.com")).thenReturn(
                new User("newalice@example.com", "pwd", Collections.emptyList())
        );

        UpdateProfileRequest request = new UpdateProfileRequest("Alice New", "newalice@example.com");
        ResponseEntity<UserResponse> response = authController.updateProfile(request, auth, httpRequest, httpResponse);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Alice New", response.getBody().name());
        assertEquals("newalice@example.com", response.getBody().email());
    }

    @Test
    void updateProfile_emailAlreadyTaken_throwsConflict() {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                "alice@example.com", "credentials", List.of(new SimpleGrantedAuthority("ROLE_USER")));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        AppUser existingUser = new AppUser();
        existingUser.setName("Alice");
        existingUser.setEmail("alice@example.com");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(existingUser));

        when(userRepository.existsByEmail("bob@example.com")).thenReturn(true);

        UpdateProfileRequest request = new UpdateProfileRequest("Alice", "bob@example.com");
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                authController.updateProfile(request, auth, httpRequest, httpResponse));

        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        verify(userRepository, never()).save(any());
    }

    @Test
    void changePassword_success() {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                "alice@example.com", "credentials", List.of(new SimpleGrantedAuthority("ROLE_USER")));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        AppUser existingUser = new AppUser();
        existingUser.setEmail("alice@example.com");
        existingUser.setPasswordHash("$2a$10$currentEncoded");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(existingUser));

        when(passwordEncoder.matches("currentPassword123", "$2a$10$currentEncoded")).thenReturn(true);
        when(passwordEncoder.matches("newPassword456", "$2a$10$currentEncoded")).thenReturn(false);
        when(passwordEncoder.encode("newPassword456")).thenReturn("$2a$10$newEncoded");

        ChangePasswordRequest request = new ChangePasswordRequest("currentPassword123", "newPassword456");
        ResponseEntity<MessageResponse> response = authController.changePassword(request, auth);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password updated successfully", response.getBody().message());
        verify(userRepository).save(existingUser);
    }

    @Test
    void changePassword_wrongCurrentPassword_throwsBadRequest() {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                "alice@example.com", "credentials", List.of(new SimpleGrantedAuthority("ROLE_USER")));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        AppUser existingUser = new AppUser();
        existingUser.setEmail("alice@example.com");
        existingUser.setPasswordHash("$2a$10$currentEncoded");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(existingUser));

        when(passwordEncoder.matches("wrongPassword", "$2a$10$currentEncoded")).thenReturn(false);

        ChangePasswordRequest request = new ChangePasswordRequest("wrongPassword", "newPassword456");
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                authController.changePassword(request, auth));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        assertEquals("Current password is incorrect", ex.getReason());
        verify(userRepository, never()).save(any());
    }
}

