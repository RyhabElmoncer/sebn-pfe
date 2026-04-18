package com.sebn.formation.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity @Table(name="presences") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Presence {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="employe_id") private User employe;
    @ManyToOne @JoinColumn(name="session_id") private SessionFormation session;
    private LocalDate datePresence;
    @Builder.Default private Boolean present=false;
    private String justification;
}
