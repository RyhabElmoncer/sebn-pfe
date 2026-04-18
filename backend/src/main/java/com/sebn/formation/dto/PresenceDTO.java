package com.sebn.formation.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class PresenceDTO {
    private Long id;
    private Long employeId;
    private String employeNom;
    private Long sessionId;
    private String sessionTitre;
    private LocalDate datePresence;
    private Boolean present;
    private String justification;
}
