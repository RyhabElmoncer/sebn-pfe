package com.sebn.formation.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity @Table(name="certificats") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Certificat {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,unique=true) private String numeroCertificat;
    @ManyToOne @JoinColumn(name="employe_id") private User employe;
    @ManyToOne @JoinColumn(name="formation_id") private Formation formation;
    private LocalDate dateEmission;
    private Double tauxPresence;
    @Builder.Default private String statut="VALIDE";
}
