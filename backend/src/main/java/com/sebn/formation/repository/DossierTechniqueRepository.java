package com.sebn.formation.repository;
import com.sebn.formation.entity.DossierTechnique;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface DossierTechniqueRepository extends JpaRepository<DossierTechnique,Long> {
    List<DossierTechnique> findByFormationId(Long formationId);
}
