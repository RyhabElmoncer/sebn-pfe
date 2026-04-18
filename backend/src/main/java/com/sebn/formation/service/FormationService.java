package com.sebn.formation.service;
import com.sebn.formation.dto.FormationDTO;
import com.sebn.formation.entity.*;
import com.sebn.formation.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class FormationService {
    @Autowired private FormationRepository repo;
    @Autowired private UserRepository userRepo;
    @Autowired private InscriptionRepository inscRepo;

    public List<FormationDTO> getAll() { return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList()); }
    public FormationDTO getById(Long id) { return toDTO(repo.findById(id).orElseThrow()); }

    public FormationDTO create(FormationDTO dto) {
        Formation f = Formation.builder()
            .titre(dto.getTitre()).description(dto.getDescription())
            .dateDebut(dto.getDateDebut()).dateFin(dto.getDateFin())
            .lieu(dto.getLieu()).dureeHeures(dto.getDureeHeures())
            .statut(Formation.StatutFormation.valueOf(dto.getStatut()!=null?dto.getStatut():"PLANIFIEE"))
            .responsable(dto.getResponsableId()!=null?userRepo.findById(dto.getResponsableId()).orElse(null):null)
            .formateur(dto.getFormateurId()!=null?userRepo.findById(dto.getFormateurId()).orElse(null):null)
            .build();
        return toDTO(repo.save(f));
    }

    public FormationDTO update(Long id, FormationDTO dto) {
        Formation f = repo.findById(id).orElseThrow();
        f.setTitre(dto.getTitre()); f.setDescription(dto.getDescription());
        f.setDateDebut(dto.getDateDebut()); f.setDateFin(dto.getDateFin());
        f.setLieu(dto.getLieu()); f.setDureeHeures(dto.getDureeHeures());
        if (dto.getStatut()!=null) f.setStatut(Formation.StatutFormation.valueOf(dto.getStatut()));
        if (dto.getResponsableId()!=null) f.setResponsable(userRepo.findById(dto.getResponsableId()).orElse(null));
        if (dto.getFormateurId()!=null) f.setFormateur(userRepo.findById(dto.getFormateurId()).orElse(null));
        return toDTO(repo.save(f));
    }

    public void delete(Long id) { repo.deleteById(id); }

    public FormationDTO toDTO(Formation f) {
        FormationDTO d = new FormationDTO();
        d.setId(f.getId()); d.setTitre(f.getTitre()); d.setDescription(f.getDescription());
        d.setDateDebut(f.getDateDebut()); d.setDateFin(f.getDateFin());
        d.setLieu(f.getLieu()); d.setDureeHeures(f.getDureeHeures());
        d.setStatut(f.getStatut()!=null?f.getStatut().name():"PLANIFIEE");
        if (f.getResponsable()!=null) { d.setResponsableId(f.getResponsable().getId()); d.setResponsableNom(f.getResponsable().getUsername()); }
        if (f.getFormateur()!=null) { d.setFormateurId(f.getFormateur().getId()); d.setFormateurNom(f.getFormateur().getUsername()); }
        d.setNbParticipants((int)inscRepo.findByFormationId(f.getId()).stream().count());
        return d;
    }
}
