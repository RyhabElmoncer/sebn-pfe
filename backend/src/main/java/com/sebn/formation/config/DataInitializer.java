package com.sebn.formation.config;
import com.sebn.formation.entity.*;
import com.sebn.formation.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired private RoleRepository roleRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private FormationRepository formationRepo;
    @Autowired private DossierTechniqueRepository dossierRepo;
    @Autowired private InscriptionRepository inscriptionRepo;
    @Autowired private PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        // Roles
        Role admin = getOrCreateRole("ADMIN","Administrateur système");
        Role resp  = getOrCreateRole("RESPONSABLE_FORMATION","Responsable du département formation");
        Role form  = getOrCreateRole("FORMATEUR","Formateur interne ou externe");
        Role empl  = getOrCreateRole("EMPLOYE","Employé participant aux formations");

        // Users
        User adminUser = getOrCreateUser("Administrateur SEBN","admin@sebn.tn","admin123",admin);
        User respUser  = getOrCreateUser("Werghui Wael","resp@sebn.tn","resp123",resp);
        User formUser  = getOrCreateUser("Hanen Jouini","formateur@sebn.tn","form123",form);
        User emp1      = getOrCreateUser("Farah Houimli","farah@sebn.tn","emp123",empl);
        User emp2      = getOrCreateUser("Henda Nefzi","henda@sebn.tn","emp123",empl);
        User emp3      = getOrCreateUser("Mayar Jouini","mayar@sebn.tn","emp123",empl);

        // Formations
        if (formationRepo.count()==0) {
            Formation f1 = formationRepo.save(Formation.builder()
                .titre("Sécurité au travail - Câblage électrique")
                .description("Formation sur les normes de sécurité dans la fabrication des faisceaux électriques automobiles.")
                .dateDebut(LocalDate.now().plusDays(5)).dateFin(LocalDate.now().plusDays(7))
                .lieu("Salle A - Usine 1").dureeHeures(16)
                .statut(Formation.StatutFormation.PLANIFIEE)
                .responsable(respUser).formateur(formUser).build());

            Formation f2 = formationRepo.save(Formation.builder()
                .titre("Qualité ISO/TS 16949 - Automobile")
                .description("Maîtrise des exigences qualité spécifiques à l'industrie automobile.")
                .dateDebut(LocalDate.now().minusDays(10)).dateFin(LocalDate.now().minusDays(8))
                .lieu("Salle B - Administration").dureeHeures(24)
                .statut(Formation.StatutFormation.TERMINEE)
                .responsable(respUser).formateur(formUser).build());

            Formation f3 = formationRepo.save(Formation.builder()
                .titre("Lean Manufacturing & 5S")
                .description("Optimisation des processus de production selon les principes Lean et 5S.")
                .dateDebut(LocalDate.now()).dateFin(LocalDate.now().plusDays(2))
                .lieu("Salle C - Production").dureeHeures(8)
                .statut(Formation.StatutFormation.EN_COURS)
                .responsable(respUser).formateur(formUser).build());

            // Dossiers techniques
            dossierRepo.save(DossierTechnique.builder()
                .numeroDossier("DOS-2025-001").titre("Guide sécurité câblage")
                .description("Documentation complète des procédures de sécurité pour la fabrication des faisceaux.")
                .objectifs("Réduire les accidents de travail de 30%. Maîtriser les EPI requis.")
                .supportsPedagogiques("Présentations PPT, Vidéos, Fiches pratiques")
                .dateCreation(LocalDate.now().minusDays(15)).statut("ACTIF")
                .formation(f1).createur(respUser).build());

            dossierRepo.save(DossierTechnique.builder()
                .numeroDossier("DOS-2025-002").titre("Manuel qualité ISO TS16949")
                .description("Référentiel qualité automobile et procédures de contrôle.")
                .objectifs("Certifier les opérateurs sur les normes qualité. Réduire les non-conformités.")
                .supportsPedagogiques("Manuel qualité, Grilles d'audit, Cas pratiques")
                .dateCreation(LocalDate.now().minusDays(20)).statut("ACTIF")
                .formation(f2).createur(respUser).build());

            // Inscriptions
            if (!inscriptionRepo.existsByEmployeIdAndFormationId(emp1.getId(),f1.getId()))
                inscriptionRepo.save(Inscription.builder().employe(emp1).formation(f1).dateInscription(LocalDate.now().minusDays(3)).statut("INSCRIT").build());
            if (!inscriptionRepo.existsByEmployeIdAndFormationId(emp2.getId(),f1.getId()))
                inscriptionRepo.save(Inscription.builder().employe(emp2).formation(f1).dateInscription(LocalDate.now().minusDays(3)).statut("INSCRIT").build());
            if (!inscriptionRepo.existsByEmployeIdAndFormationId(emp1.getId(),f2.getId()))
                inscriptionRepo.save(Inscription.builder().employe(emp1).formation(f2).dateInscription(LocalDate.now().minusDays(12)).statut("COMPLETE").build());
            if (!inscriptionRepo.existsByEmployeIdAndFormationId(emp3.getId(),f2.getId()))
                inscriptionRepo.save(Inscription.builder().employe(emp3).formation(f2).dateInscription(LocalDate.now().minusDays(12)).statut("COMPLETE").build());

            System.out.println("✅ Données de démonstration initialisées");
        }
    }

    private Role getOrCreateRole(String name, String desc) {
        return roleRepo.findByName(name).orElseGet(() -> roleRepo.save(Role.builder().name(name).description(desc).build()));
    }
    private User getOrCreateUser(String username, String email, String password, Role role) {
        return userRepo.findByEmail(email).orElseGet(() -> {
            User u = User.builder().username(username).email(email).password(encoder.encode(password)).role(role).active(true).build();
            return userRepo.save(u);
        });
    }
}
