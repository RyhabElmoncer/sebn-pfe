package com.sebn.formation.service;
import com.sebn.formation.dto.DossierTechniqueDTO;
import com.sebn.formation.entity.*;
import com.sebn.formation.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class DossierTechniqueService {
    @Autowired private DossierTechniqueRepository repo;
    @Autowired private FormationRepository formRepo;
    @Autowired private UserRepository userRepo;

    public List<DossierTechniqueDTO> getAll() { return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList()); }
    public List<DossierTechniqueDTO> getByFormation(Long fid) { return repo.findByFormationId(fid).stream().map(this::toDTO).collect(Collectors.toList()); }
    public DossierTechniqueDTO getById(Long id) { return toDTO(repo.findById(id).orElseThrow()); }

    public DossierTechniqueDTO create(DossierTechniqueDTO dto) {
        DossierTechnique d = DossierTechnique.builder()
            .numeroDossier(dto.getNumeroDossier()!=null?dto.getNumeroDossier():"DOS-"+System.currentTimeMillis())
            .titre(dto.getTitre()).description(dto.getDescription())
            .objectifs(dto.getObjectifs()).supportsPedagogiques(dto.getSupportsPedagogiques())
            .dateCreation(dto.getDateCreation()!=null?dto.getDateCreation():LocalDate.now())
            .statut(dto.getStatut()!=null?dto.getStatut():"ACTIF")
            .formation(dto.getFormationId()!=null?formRepo.findById(dto.getFormationId()).orElse(null):null)
            .createur(dto.getCreateurId()!=null?userRepo.findById(dto.getCreateurId()).orElse(null):null)
            .build();
        return toDTO(repo.save(d));
    }

    public DossierTechniqueDTO update(Long id, DossierTechniqueDTO dto) {
        DossierTechnique d = repo.findById(id).orElseThrow();
        d.setTitre(dto.getTitre()); d.setDescription(dto.getDescription());
        d.setObjectifs(dto.getObjectifs()); d.setSupportsPedagogiques(dto.getSupportsPedagogiques());
        if (dto.getStatut()!=null) d.setStatut(dto.getStatut());
        if (dto.getFormationId()!=null) d.setFormation(formRepo.findById(dto.getFormationId()).orElse(null));
        return toDTO(repo.save(d));
    }

    public void delete(Long id) { repo.deleteById(id); }

    private DossierTechniqueDTO toDTO(DossierTechnique d) {
        DossierTechniqueDTO dto = new DossierTechniqueDTO();
        dto.setId(d.getId()); dto.setNumeroDossier(d.getNumeroDossier());
        dto.setTitre(d.getTitre()); dto.setDescription(d.getDescription());
        dto.setObjectifs(d.getObjectifs()); dto.setSupportsPedagogiques(d.getSupportsPedagogiques());
        dto.setDateCreation(d.getDateCreation()); dto.setStatut(d.getStatut());
        if (d.getFormation()!=null) { dto.setFormationId(d.getFormation().getId()); dto.setFormationTitre(d.getFormation().getTitre()); }
        if (d.getCreateur()!=null) { dto.setCreateurId(d.getCreateur().getId()); dto.setCreateurNom(d.getCreateur().getUsername()); }
        return dto;
    }
}
