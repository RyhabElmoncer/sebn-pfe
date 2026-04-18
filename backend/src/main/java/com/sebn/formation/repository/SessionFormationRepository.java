package com.sebn.formation.repository;
import com.sebn.formation.entity.SessionFormation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SessionFormationRepository extends JpaRepository<SessionFormation,Long> {
    List<SessionFormation> findByFormationId(Long formationId);
}
