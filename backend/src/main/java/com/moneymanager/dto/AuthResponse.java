package com.moneymanager.dto;

public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private String authProvider;
    private Long userId;
    private String profileImageUrl;

    public AuthResponse() {}

    public AuthResponse(String token, String email, String name, String authProvider, Long userId) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.authProvider = authProvider;
        this.userId = userId;
    }

    public AuthResponse(String token, String email, String name, String authProvider, Long userId, String profileImageUrl) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.authProvider = authProvider;
        this.userId = userId;
        this.profileImageUrl = profileImageUrl;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAuthProvider() { return authProvider; }
    public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
}