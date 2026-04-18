import React from 'react';
import Sidebar from './Sidebar';
import { X } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout({ children, title, subtitle }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div>
            <div className="topbar-title">{title}</div>
            {subtitle && <div className="topbar-sub">{subtitle}</div>}
          </div>
          <span className="topbar-sub">Sumitomo Electric Bordnetze Tunisia</span>
        </header>
        <main className="page-body page-animate">{children}</main>
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer, large }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal${large ? ' modal-lg' : ''}`}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}><X size={15}/></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function ProtectedRoute({ children, adminOnly, respOnly }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"/><p>Chargement...</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  if (respOnly && !['ADMIN','RESPONSABLE_FORMATION'].includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

export function Spinner() { return <div style={{textAlign:'center',padding:'40px'}}><div className="spinner" style={{margin:'0 auto'}}/></div>; }

export function StatutBadge({ statut }) {
  const map = {
    PLANIFIEE: ['badge-info','Planifiée'],
    EN_COURS: ['badge-warning','En cours'],
    TERMINEE: ['badge-success','Terminée'],
    ANNULEE: ['badge-danger','Annulée'],
    ACTIF: ['badge-success','Actif'],
    INACTIF: ['badge-danger','Inactif'],
    INSCRIT: ['badge-info','Inscrit'],
    COMPLETE: ['badge-success','Complété'],
    ABANDONNE: ['badge-danger','Abandonné'],
    VALIDE: ['badge-success','Valide'],
  };
  const [cls, label] = map[statut] || ['badge-gray', statut];
  return <span className={`badge ${cls}`}>{label}</span>;
}

export function RoleBadge({ role }) {
  const map = { ADMIN:'badge-admin', RESPONSABLE_FORMATION:'badge-responsable', FORMATEUR:'badge-formateur', EMPLOYE:'badge-employe' };
  return <span className={`badge ${map[role]||''}`}>{role}</span>;
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, saving }) {
  const { AlertTriangle } = require('lucide-react');
  return (
    <Modal open={open} onClose={onClose} title="Confirmation"
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={saving}>
          {saving ? <><span className="spinner-sm"/> Suppression...</> : 'Confirmer'}
        </button>
      </>}>
      <div className="confirm-icon"><AlertTriangle size={48} color="#ef4444"/></div>
      <div className="confirm-title">{title}</div>
      <div className="confirm-msg">{message}</div>
    </Modal>
  );
}
