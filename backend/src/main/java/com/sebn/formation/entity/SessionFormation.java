package com.sebn.formation.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;
@Entity @Table(name="sessions_formation") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SessionFormation {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String titre;
    private LocalDate date;
    private String heureDebut;
    private String heureFin;
    private String salle;
    @ManyToOne @JoinColumn(name="formation_id") private Formation formation;
    @OneToMany(mappedBy="session",cascade=CascadeType.ALL,fetch=FetchType.LAZY)
    private List<Presence> presences;
}
