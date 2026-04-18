package com.sebn.formation.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class SessionDTO {
    private Long id;
    private String titre;
    private LocalDate date;
    private String heureDebut;
    private String heureFin;
    private String salle;
    private Long formationId;
    private String formationTitre;
}
