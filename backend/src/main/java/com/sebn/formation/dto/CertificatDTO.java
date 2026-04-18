package com.sebn.formation.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class CertificatDTO {
    private Long id;
    private String numeroCertificat;
    private Long employeId;
    private String employeNom;
    private Long formationId;
    private String formationTitre;
    private LocalDate dateEmission;
    private Double tauxPresence;
    private String statut;
}
