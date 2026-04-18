package com.sebn.formation.service;
import com.sebn.formation.dto.InscriptionDTO;
import com.sebn.formation.entity.*;
import com.sebn.formation.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class InscriptionService {
    @Autowired private InscriptionRepository repo;
    @Autowired private UserRepository userRepo;
    @Autowired private FormationRepository formRepo;

    public List<InscriptionDTO> getAll() { return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList()); }
    public List<InscriptionDTO> getByEmploye(Long eid) { return repo.findByEmployeId(eid).stream().map(this::toDTO).collect(Collectors.toList()); }
    public List<InscriptionDTO> getByFormation(Long fid) { return repo.findByFormationId(fid).stream().map(this::toDTO).collect(Collectors.toList()); }

    public InscriptionDTO inscrire(Long employeId, Long formationId) {
        if (repo.existsByEmployeIdAndFormationId(employeId, formationId))
            throw new RuntimeException("Employé déjà inscrit à cette formation");
        User emp = userRepo.findById(employeId).orElseThrow(()->new RuntimeException("Employé non trouvé"));
        Formation form = formRepo.findById(formationId).orElseThrow(()->new RuntimeException("Formation non trouvée"));
        Inscription i = repo.save(Inscription.builder().employe(emp).formation(form)
                .dateInscription(LocalDate.now()).statut("INSCRIT").build());
        return toDTO(i);
    }

    public InscriptionDTO updateStatut(Long id, String statut) {
        Inscription i = repo.findById(id).orElseThrow();
        i.setStatut(statut);
        return toDTO(repo.save(i));
    }

    public void delete(Long id) { repo.deleteById(id); }

    private InscriptionDTO toDTO(Inscription i) {
        InscriptionDTO dto = new InscriptionDTO();
        dto.setId(i.getId()); dto.setDateInscription(i.getDateInscription()); dto.setStatut(i.getStatut());
        if (i.getEmploye()!=null) { dto.setEmployeId(i.getEmploye().getId()); dto.setEmployeNom(i.getEmploye().getUsername()); dto.setEmployeEmail(i.getEmploye().getEmail()); }
        if (i.getFormation()!=null) { dto.setFormationId(i.getFormation().getId()); dto.setFormationTitre(i.getFormation().getTitre()); }
        return dto;
    }
}
