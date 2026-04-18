# SEBN Formation — 

 
> **Titre :** Conception et développement d'un système de gestion des dossiers techniques du Département Formation

---

## 🏗 Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Spring Boot 3.2, Spring Security, JWT |
| Base de données | MySQL 8 |
| ORM | Spring Data JPA / Hibernate |
| Authentification | JWT (JSON Web Tokens) + BCrypt |
| Architecture | 3-Tiers + MVC + REST API |
| Méthode | Agile SCRUM (3 sprints) |

---

## 🚀 Démarrage rapide

### Prérequis
- Java 17+  |  Maven 3.8+  |  Node.js 18+  |  MySQL 8+

### 1. Base de données
```sql
-- MySQL crée automatiquement la base au démarrage grâce à createDatabaseIfNotExist=true
-- Ou manuellement :
CREATE DATABASE sebn_formation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend
```bash
cd backend
# Adapter les identifiants MySQL dans application.properties si besoin
# (par défaut : root / root)
mvn spring-boot:run
```
→ Démarre sur **http://localhost:8080**

### 3. Frontend
```bash
cd frontend
npm install
npm start
```
→ Démarre sur **http://localhost:3000**

---

## 👤 Comptes de démonstration

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@sebn.tn | admin123 | ADMIN |
| resp@sebn.tn | resp123 | RESPONSABLE_FORMATION |
| formateur@sebn.tn | form123 | FORMATEUR |
| farah@sebn.tn | emp123 | EMPLOYE |

---

## 📁 Structure du projet

```
sebn-pfe/
├── backend/
│   └── src/main/java/com/sebn/formation/
│       ├── config/         SecurityConfig, DataInitializer
│       ├── controller/     Auth, User, Role, Formation, Dossier,
│       │                   Inscription, Session, Presence, Certificat
│       ├── dto/            9 DTOs
│       ├── entity/         User, Role, Formation, DossierTechnique,
│       │                   SessionFormation, Inscription, Presence, Certificat
│       ├── repository/     8 repositories JPA
│       ├── security/       JwtUtil, JwtFilter, CustomUserDetailsService
│       └── service/        9 services métier
│
└── frontend/src/
    ├── context/            AuthContext (state global)
    ├── services/           api.js (tous les appels Axios)
    ├── components/         Sidebar, Layout, Modal, ProtectedRoute,
    │                       StatutBadge, RoleBadge, ConfirmModal, Spinner
    └── pages/              Login, Register, Dashboard, Users, Roles,
                            Formations, Dossiers, Inscriptions,
                            Presences, Certificats, MesFormations
```

---

## 🔌 API REST

### Auth (public)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/login | Connexion → JWT |
| POST | /api/auth/register | Inscription |

### Utilisateurs (ADMIN)
`GET/POST /api/users` · `GET/PUT/DELETE /api/users/{id}`

### Rôles (ADMIN)
`GET/POST /api/roles` · `GET/PUT/DELETE /api/roles/{id}`

### Formations
`GET/POST /api/formations` · `GET/PUT/DELETE /api/formations/{id}`

### Dossiers Techniques
`GET/POST /api/dossiers` · `GET /api/dossiers/formation/{fid}` · `PUT/DELETE /api/dossiers/{id}`

### Inscriptions
`GET /api/inscriptions` · `POST /api/inscriptions` · `GET /api/inscriptions/formation/{fid}` · `GET /api/inscriptions/employe/{eid}` · `DELETE /api/inscriptions/{id}`

### Sessions
`GET /api/sessions/formation/{fid}` · `POST /api/sessions` · `PUT/DELETE /api/sessions/{id}`

### Présences
`GET /api/presences/session/{sid}` · `GET /api/presences/employe/{eid}` · `GET /api/presences/taux/{eid}/{fid}` · `POST /api/presences/marquer`

### Certificats
`GET /api/certificats` · `GET /api/certificats/employe/{eid}` · `GET /api/certificats/formation/{fid}` · `POST /api/certificats/generer`

---

## 📋 Sprints SCRUM

### ✅ Sprint 1 — Authentification & Gestion des utilisateurs
- Inscription / Connexion avec JWT
- Gestion CRUD des utilisateurs
- Gestion CRUD des rôles
- Contrôle d'accès par rôle

### ✅ Sprint 2 — Formations & Dossiers techniques
- Création et planification des formations
- Gestion des dossiers techniques (CRUD complet)
- Affectation des participants (inscriptions)

### ✅ Sprint 3 — Présences & Certificats
- Création de sessions de formation
- Marquage des présences par session
- Calcul automatique du taux de présence
- Génération de certificats PDF imprimables

---

## 🔐 Permissions par rôle

| Fonctionnalité | ADMIN | RESP. FORM. | FORMATEUR | EMPLOYE |
|---------------|:-----:|:-----------:|:---------:|:-------:|
| Gérer utilisateurs | ✅ | ❌ | ❌ | ❌ |
| Gérer rôles | ✅ | ❌ | ❌ | ❌ |
| Gérer formations | ✅ | ✅ | ❌ | ❌ |
| Gérer dossiers | ✅ | ✅ | ❌ | ❌ |
| Gérer inscriptions | ✅ | ✅ | ❌ | ❌ |
| Marquer présences | ✅ | ✅ | ✅ | ❌ |
| Générer certificats | ✅ | ✅ | ❌ | ❌ |
| Voir mes formations | ✅ | ✅ | ✅ | ✅ |
| Télécharger certificats | ✅ | ✅ | ✅ | ✅ |
