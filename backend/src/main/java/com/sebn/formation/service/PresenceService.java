package com.sebn.formation.service;
import com.sebn.formation.dto.PresenceDTO;
import com.sebn.formation.entity.*;
import com.sebn.formation.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class PresenceService {
    @Autowired private PresenceRepository repo;
    @Autowired private UserRepository userRepo;
    @Autowired private SessionFormationRepository sessionRepo;

    public List<PresenceDTO> getBySession(Long sid) { return repo.findBySessionId(sid).stream().map(this::toDTO).collect(Collectors.toList()); }
    public List<PresenceDTO> getByEmploye(Long eid) { return repo.findByEmployeId(eid).stream().map(this::toDTO).collect(Collectors.toList()); }

    public PresenceDTO marquer(Long employeId, Long sessionId, boolean present, String justification) {
        Presence p = repo.findByEmployeIdAndSessionId(employeId, sessionId).orElseGet(() -> {
            User emp = userRepo.findById(employeId).orElseThrow(()->new RuntimeException("Employé non trouvé"));
            SessionFormation s = sessionRepo.findById(sessionId).orElseThrow(()->new RuntimeException("Session non trouvée"));
            return Presence.builder().employe(emp).session(s).datePresence(LocalDate.now()).build();
        });
        p.setPresent(present);
        p.setJustification(justification);
        p.setDatePresence(LocalDate.now());
        return toDTO(repo.save(p));
    }

    public double getTauxPresence(Long employeId, Long formationId) {
        long total = repo.countTotalSessionsForFormation(formationId, employeId);
        if (total == 0) return 0.0;
        long presents = repo.countPresentsForFormation(employeId, formationId);
        return Math.round((presents * 100.0 / total) * 10.0) / 10.0;
    }

    private PresenceDTO toDTO(Presence p) {
        PresenceDTO dto = new PresenceDTO();
        dto.setId(p.getId()); dto.setPresent(p.getPresent());
        dto.setDatePresence(p.getDatePresence()); dto.setJustification(p.getJustification());
        if (p.getEmploye()!=null) { dto.setEmployeId(p.getEmploye().getId()); dto.setEmployeNom(p.getEmploye().getUsername()); }
        if (p.getSession()!=null) { dto.setSessionId(p.getSession().getId()); dto.setSessionTitre(p.getSession().getTitre()); }
        return dto;
    }
}
