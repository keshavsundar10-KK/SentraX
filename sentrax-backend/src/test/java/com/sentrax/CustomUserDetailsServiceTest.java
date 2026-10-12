package com.sentrax;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private AppUserRepository userRepository;

    private CustomUserDetailsService userDetailsService;

    @BeforeEach
    void setUp() {
        userDetailsService = new CustomUserDetailsService(userRepository);
    }

    @Test
    void loadUserByUsername_whenUserExists_returnsUserDetails() {
        AppUser user = new AppUser();
        user.setEmail("user@example.com");
        user.setPasswordHash("$2a$10$hashedpassword");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        UserDetails details = userDetailsService.loadUserByUsername("USER@EXAMPLE.COM");

        assertNotNull(details);
        assertEquals("user@example.com", details.getUsername());
        assertEquals("$2a$10$hashedpassword", details.getPassword());
        assertTrue(details.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
    }

    @Test
    void loadUserByUsername_whenUserDoesNotExist_throwsException() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () ->
                userDetailsService.loadUserByUsername("unknown@example.com"));
    }

    @Test
    void loadUserByUsername_whenEmailBlank_throwsException() {
        assertThrows(UsernameNotFoundException.class, () ->
                userDetailsService.loadUserByUsername("   "));
    }
}

