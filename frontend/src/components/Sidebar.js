import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, ShieldCheck, BookOpen, FolderOpen, UserCheck, Award, LogOut, ClipboardList } from 'lucide-react';

const ROLE_LABEL = { ADMIN:'Administrateur', RESPONSABLE_FORMATION:'Resp. Formation', FORMATEUR:'Formateur', EMPLOYE:'Employé' };

export default function Sidebar() {
  const { user, logout, isAdmin, isResp, isFormateur } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const active = (p) => loc.pathname === p ? ' active' : '';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1><span>SEBN</span> TN</h1>
        <p>Gestion Formation</p>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">Navigation</div>
        <button className={`nav-item${active('/dashboard')}`} onClick={() => navigate('/dashboard')}>
          <LayoutDashboard size={16}/> Tableau de bord
        </button>

        {isAdmin() && <>
          <div className="nav-group">Administration</div>
          <button className={`nav-item${active('/users')}`} onClick={() => navigate('/users')}>
            <Users size={16}/> Utilisateurs
          </button>
          <button className={`nav-item${active('/roles')}`} onClick={() => navigate('/roles')}>
            <ShieldCheck size={16}/> Rôles
          </button>
        </>}

        {isResp() && <>
          <div className="nav-group">Formation</div>
          <button className={`nav-item${active('/formations')}`} onClick={() => navigate('/formations')}>
            <BookOpen size={16}/> Formations
          </button>
          <button className={`nav-item${active('/dossiers')}`} onClick={() => navigate('/dossiers')}>
            <FolderOpen size={16}/> Dossiers techniques
          </button>
          <button className={`nav-item${active('/inscriptions')}`} onClick={() => navigate('/inscriptions')}>
            <UserCheck size={16}/> Inscriptions
          </button>
        </>}

        {isFormateur() && !isResp() && <>
          <div className="nav-group">Mes sessions</div>
          <button className={`nav-item${active('/formations')}`} onClick={() => navigate('/formations')}>
            <BookOpen size={16}/> Formations
          </button>
        </>}

        <div className="nav-group">Suivi</div>
        {isFormateur() && (
          <button className={`nav-item${active('/presences')}`} onClick={() => navigate('/presences')}>
            <ClipboardList size={16}/> Présences
          </button>
        )}
        <button className={`nav-item${active('/certificats')}`} onClick={() => navigate('/certificats')}>
          <Award size={16}/> Certificats
        </button>

        {!isResp() && (
          <button className={`nav-item${active('/mes-formations')}`} onClick={() => navigate('/mes-formations')}>
            <BookOpen size={16}/> Mes formations
          </button>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <p>{user?.username}</p>
            <span>{ROLE_LABEL[user?.role] || user?.role}</span>
          </div>
        </div>
        <button className="nav-item" style={{color:'#ef4444'}} onClick={handleLogout}>
          <LogOut size={16}/> Se déconnecter
        </button>
      </div>
    </aside>
  );
}
