package com.sebn.formation.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;
@Entity @Table(name="formations") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Formation {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String titre;
    @Column(length=1000) private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String lieu;
    private Integer dureeHeures;
    @Enumerated(EnumType.STRING)
    @Builder.Default private StatutFormation statut = StatutFormation.PLANIFIEE;
    @ManyToOne @JoinColumn(name="responsable_id") private User responsable;
    @ManyToOne @JoinColumn(name="formateur_id") private User formateur;
    @OneToMany(mappedBy="formation",cascade=CascadeType.ALL,fetch=FetchType.LAZY)
    private List<SessionFormation> sessions;
    @OneToMany(mappedBy="formation",cascade=CascadeType.ALL,fetch=FetchType.LAZY)
    private List<DossierTechnique> dossiers;
    public enum StatutFormation { PLANIFIEE, EN_COURS, TERMINEE, ANNULEE }
}
