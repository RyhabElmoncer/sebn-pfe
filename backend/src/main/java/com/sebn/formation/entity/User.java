package com.sebn.formation.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="utilisateurs") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String username;
    @Column(nullable=false,unique=true) private String email;
    @Column(nullable=false) private String password;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="role_id") private Role role;
    @Builder.Default private Boolean active=true;
}
