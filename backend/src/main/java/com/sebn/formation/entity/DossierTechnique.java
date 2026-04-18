package com.sebn.formation.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity @Table(name="dossiers_techniques") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DossierTechnique {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String numeroDossier;
    @Column(nullable=false) private String titre;
    @Column(length=2000) private String description;
    @Column(length=2000) private String objectifs;
    @Column(length=1000) private String supportsPedagogiques;
    private LocalDate dateCreation;
    @Builder.Default private String statut="ACTIF";
    @ManyToOne @JoinColumn(name="formation_id") private Formation formation;
    @ManyToOne @JoinColumn(name="createur_id") private User createur;
}
