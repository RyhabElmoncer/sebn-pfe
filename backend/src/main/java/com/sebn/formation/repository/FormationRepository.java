package com.sebn.formation.repository;
import com.sebn.formation.entity.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface FormationRepository extends JpaRepository<Formation,Long> {
    List<Formation> findByResponsableId(Long responsableId);
    List<Formation> findByFormateurId(Long formateurId);
}
