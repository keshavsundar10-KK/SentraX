package com.sentrax.dto;

import com.sentrax.AppUser;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        LocalDateTime createdAt
) {
    public static UserResponse fromEntity(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }
}

