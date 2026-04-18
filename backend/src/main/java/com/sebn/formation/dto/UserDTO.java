package com.sebn.formation.dto;
import lombok.Data;
@Data public class UserDTO { private Long id; private String username; private String email; private String password; private Long roleId; private String roleName; private Boolean active; }
