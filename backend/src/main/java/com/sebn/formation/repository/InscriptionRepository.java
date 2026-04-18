package com.sebn.formation.repository;
import com.sebn.formation.entity.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface InscriptionRepository extends JpaRepository<Inscription,Long> {
    List<Inscription> findByEmployeId(Long employeId);
    List<Inscription> findByFormationId(Long formationId);
    Optional<Inscription> findByEmployeIdAndFormationId(Long employeId, Long formationId);
    boolean existsByEmployeIdAndFormationId(Long employeId, Long formationId);
}
