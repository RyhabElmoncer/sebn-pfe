import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, roleAPI } from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ username:'', email:'', password:'', roleId:'' });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { roleAPI.getAll().then(r=>setRoles(r.data)).catch(()=>{}); }, []);

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const r = await authAPI.register({...form, roleId: form.roleId ? Number(form.roleId) : null});
      login(r.data); navigate('/dashboard');
    } catch (err) { setError(err.response?.data || 'Erreur inscription'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg"/>
      <div className="auth-card">
        <div className="auth-logo">
          <h1><span>SEBN</span> TN</h1>
          <p>Sumitomo Electric Bordnetze Tunisia</p>
        </div>
        <h2 className="auth-title">Créer un compte</h2>
        <p className="auth-sub">Rejoignez la plateforme formation SEBN</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <input className="form-control" placeholder="Prénom Nom"
              value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required/>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="email@sebn.tn"
              value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input type="password" className="form-control" placeholder="••••••••"
              value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
          </div>
          <div className="form-group">
            <label className="form-label">Rôle</label>
            <select className="form-control" value={form.roleId} onChange={e=>setForm({...form,roleId:e.target.value})}>
              <option value="">Sélectionner un rôle</option>
              {roles.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? <><span className="spinner-sm"/> Inscription...</> : "S'inscrire"}
          </button>
        </form>
        <div className="auth-footer">Déjà un compte ? <Link to="/login">Se connecter</Link></div>
      </div>
    </div>
  );
}
