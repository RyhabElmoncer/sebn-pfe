package com.sebn.formation.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity @Table(name="inscriptions") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Inscription {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="employe_id") private User employe;
    @ManyToOne @JoinColumn(name="formation_id") private Formation formation;
    private LocalDate dateInscription;
    @Builder.Default private String statut="INSCRIT"; // INSCRIT, COMPLETE, ABANDONNE
}
