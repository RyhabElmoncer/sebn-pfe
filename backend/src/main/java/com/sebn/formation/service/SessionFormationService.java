package com.sebn.formation.service;
import com.sebn.formation.dto.SessionDTO;
import com.sebn.formation.entity.*;
import com.sebn.formation.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class SessionFormationService {
    @Autowired private SessionFormationRepository repo;
    @Autowired private FormationRepository formRepo;

    public List<SessionDTO> getByFormation(Long fid) { return repo.findByFormationId(fid).stream().map(this::toDTO).collect(Collectors.toList()); }
    public SessionDTO getById(Long id) { return toDTO(repo.findById(id).orElseThrow()); }

    public SessionDTO create(SessionDTO dto) {
        Formation f = formRepo.findById(dto.getFormationId()).orElseThrow(()->new RuntimeException("Formation non trouvée"));
        SessionFormation s = SessionFormation.builder()
            .titre(dto.getTitre()).date(dto.getDate())
            .heureDebut(dto.getHeureDebut()).heureFin(dto.getHeureFin())
            .salle(dto.getSalle()).formation(f).build();
        return toDTO(repo.save(s));
    }

    public SessionDTO update(Long id, SessionDTO dto) {
        SessionFormation s = repo.findById(id).orElseThrow();
        s.setTitre(dto.getTitre()); s.setDate(dto.getDate());
        s.setHeureDebut(dto.getHeureDebut()); s.setHeureFin(dto.getHeureFin());
        s.setSalle(dto.getSalle());
        return toDTO(repo.save(s));
    }

    public void delete(Long id) { repo.deleteById(id); }

    private SessionDTO toDTO(SessionFormation s) {
        SessionDTO dto = new SessionDTO();
        dto.setId(s.getId()); dto.setTitre(s.getTitre()); dto.setDate(s.getDate());
        dto.setHeureDebut(s.getHeureDebut()); dto.setHeureFin(s.getHeureFin()); dto.setSalle(s.getSalle());
        if (s.getFormation()!=null) { dto.setFormationId(s.getFormation().getId()); dto.setFormationTitre(s.getFormation().getTitre()); }
        return dto;
    }
}
