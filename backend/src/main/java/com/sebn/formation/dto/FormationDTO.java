package com.sebn.formation.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class FormationDTO {
    private Long id;
    private String titre;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String lieu;
    private Integer dureeHeures;
    private String statut;
    private Long responsableId;
    private String responsableNom;
    private Long formateurId;
    private String formateurNom;
    private int nbParticipants;
}
