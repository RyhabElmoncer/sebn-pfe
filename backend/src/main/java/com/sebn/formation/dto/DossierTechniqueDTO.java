package com.sebn.formation.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class DossierTechniqueDTO {
    private Long id;
    private String numeroDossier;
    private String titre;
    private String description;
    private String objectifs;
    private String supportsPedagogiques;
    private LocalDate dateCreation;
    private String statut;
    private Long formationId;
    private String formationTitre;
    private Long createurId;
    private String createurNom;
}
