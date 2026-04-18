package com.sebn.formation.dto;
import lombok.Data;
import java.time.LocalDate;

@Data
public class InscriptionDTO {
    private Long id;
    private Long employeId;
    private String employeNom;
    private String employeEmail;
    private Long formationId;
    private String formationTitre;
    private LocalDate dateInscription;
    private String statut;
}
