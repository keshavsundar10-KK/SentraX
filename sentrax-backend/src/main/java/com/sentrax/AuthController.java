package com.sentrax;

import com.sentrax.dto.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final UserDetailsService userDetailsService;

    public AuthController(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            SecurityContextRepository securityContextRepository,
            UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email address already exists");
        }

        AppUser user = new AppUser();
        user.setName(request.name().trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.password()));

        AppUser savedUser = userRepository.save(user);

        // Establish session authentication upon successful registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.password())
        );
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, httpRequest, httpResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.fromEntity(savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.password())
            );

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, httpRequest, httpResponse);

            AppUser user = userRepository.findByEmail(normalizedEmail)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            return ResponseEntity.ok(UserResponse.fromEntity(user));
        } catch (BadCredentialsException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        SecurityContextHolder.clearContext();
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        securityContextRepository.saveContext(context, httpRequest, httpResponse);

        return ResponseEntity.ok(new MessageResponse("Successfully logged out"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        Authentication auth = resolveAuthentication(authentication);
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        String email = auth.getName().toLowerCase(Locale.ROOT);
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return ResponseEntity.ok(UserResponse.fromEntity(user));
    }

    @GetMapping("/csrf")
    public ResponseEntity<CsrfResponse> getCsrf(HttpServletRequest httpRequest) {
        CsrfToken token = (CsrfToken) httpRequest.getAttribute(CsrfToken.class.getName());
        if (token == null) {
            token = (CsrfToken) httpRequest.getAttribute("_csrf");
        }

        if (token != null) {
            return ResponseEntity.ok(new CsrfResponse(token.getToken(), token.getHeaderName(), token.getParameterName()));
        }

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        Authentication auth = resolveAuthentication(authentication);
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        String currentEmail = auth.getName().toLowerCase(Locale.ROOT);
        AppUser user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String newEmail = request.email().trim().toLowerCase(Locale.ROOT);
        String newName = request.name().trim();

        if (!newEmail.equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(newEmail)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email address is already in use by another account");
            }
            user.setEmail(newEmail);
        }
        user.setName(newName);

        AppUser updated = userRepository.save(user);

        // If email changed, refresh the session Authentication with the new username
        if (!newEmail.equalsIgnoreCase(currentEmail)) {
            UserDetails newDetails = userDetailsService.loadUserByUsername(newEmail);
            Authentication newAuth = new UsernamePasswordAuthenticationToken(
                    newDetails,
                    auth.getCredentials(),
                    newDetails.getAuthorities()
            );
            SecurityContext newContext = SecurityContextHolder.createEmptyContext();
            newContext.setAuthentication(newAuth);
            SecurityContextHolder.setContext(newContext);
            securityContextRepository.saveContext(newContext, httpRequest, httpResponse);
        }

        return ResponseEntity.ok(UserResponse.fromEntity(updated));
    }

    @PutMapping("/password")
    public ResponseEntity<MessageResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        Authentication auth = resolveAuthentication(authentication);
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        String email = auth.getName().toLowerCase(Locale.ROOT);
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password cannot be identical to the current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Password updated successfully"));
    }

    private Authentication resolveAuthentication(Authentication authentication) {
        if (authentication != null) {
            return authentication;
        }
        return SecurityContextHolder.getContext().getAuthentication();
    }
}

