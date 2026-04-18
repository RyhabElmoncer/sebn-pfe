package com.sebn.formation.dto;
import lombok.*;
@Data @AllArgsConstructor
public class AuthResponse { private String token; private String email; private String username; private String role; private Long userId; }
