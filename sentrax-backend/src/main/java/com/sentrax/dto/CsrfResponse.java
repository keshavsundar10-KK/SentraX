package com.sentrax.dto;

public record CsrfResponse(
        String token,
        String headerName,
        String parameterName
) {}

