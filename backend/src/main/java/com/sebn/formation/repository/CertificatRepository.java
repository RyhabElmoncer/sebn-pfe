package com.sebn.formation.repository;
import com.sebn.formation.entity.Certificat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface CertificatRepository extends JpaRepository<Certificat,Long> {
    List<Certificat> findByEmployeId(Long employeId);
    List<Certificat> findByFormationId(Long formationId);
    Optional<Certificat> findByEmployeIdAndFormationId(Long employeId, Long formationId);
}
