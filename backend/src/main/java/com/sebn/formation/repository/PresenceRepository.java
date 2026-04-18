package com.sebn.formation.repository;
import com.sebn.formation.entity.Presence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;
public interface PresenceRepository extends JpaRepository<Presence,Long> {
    List<Presence> findBySessionId(Long sessionId);
    List<Presence> findByEmployeId(Long employeId);
    Optional<Presence> findByEmployeIdAndSessionId(Long employeId, Long sessionId);
    @Query("SELECT COUNT(p) FROM Presence p WHERE p.employe.id=:eid AND p.session.formation.id=:fid AND p.present=true")
    long countPresentsForFormation(Long eid, Long fid);
    @Query("SELECT COUNT(p) FROM Presence p WHERE p.session.formation.id=:fid AND p.employe.id=:eid")
    long countTotalSessionsForFormation(Long fid, Long eid);
}
