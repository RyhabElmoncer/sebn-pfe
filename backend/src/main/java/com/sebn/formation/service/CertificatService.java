package com.sebn.formation.service;
import com.sebn.formation.dto.CertificatDTO;
import com.sebn.formation.entity.*;
import com.sebn.formation.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class CertificatService {
    @Autowired private CertificatRepository repo;
    @Autowired private UserRepository userRepo;
    @Autowired private FormationRepository formRepo;
    @Autowired private PresenceService presenceService;

    public List<CertificatDTO> getAll() { return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList()); }
    public List<CertificatDTO> getByEmploye(Long eid) { return repo.findByEmployeId(eid).stream().map(this::toDTO).collect(Collectors.toList()); }
    public List<CertificatDTO> getByFormation(Long fid) { return repo.findByFormationId(fid).stream().map(this::toDTO).collect(Collectors.toList()); }

    public CertificatDTO generer(Long employeId, Long formationId) {
        if (repo.findByEmployeIdAndFormationId(employeId, formationId).isPresent())
            throw new RuntimeException("Certificat déjà généré pour cet employé");
        User emp = userRepo.findById(employeId).orElseThrow(()->new RuntimeException("Employé non trouvé"));
        Formation form = formRepo.findById(formationId).orElseThrow(()->new RuntimeException("Formation non trouvée"));
        double taux = presenceService.getTauxPresence(employeId, formationId);
        String num = "CERT-SEBN-" + formationId + "-" + employeId + "-" + System.currentTimeMillis();
        Certificat c = repo.save(Certificat.builder()
            .numeroCertificat(num).employe(emp).formation(form)
            .dateEmission(LocalDate.now()).tauxPresence(taux).statut("VALIDE").build());
        return toDTO(c);
    }

    public CertificatDTO getById(Long id) { return toDTO(repo.findById(id).orElseThrow()); }

    private CertificatDTO toDTO(Certificat c) {
        CertificatDTO dto = new CertificatDTO();
        dto.setId(c.getId()); dto.setNumeroCertificat(c.getNumeroCertificat());
        dto.setDateEmission(c.getDateEmission()); dto.setTauxPresence(c.getTauxPresence()); dto.setStatut(c.getStatut());
        if (c.getEmploye()!=null) { dto.setEmployeId(c.getEmploye().getId()); dto.setEmployeNom(c.getEmploye().getUsername()); }
        if (c.getFormation()!=null) { dto.setFormationId(c.getFormation().getId()); dto.setFormationTitre(c.getFormation().getTitre()); }
        return dto;
    }
}
