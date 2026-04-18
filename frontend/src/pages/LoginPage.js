import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try { const r = await authAPI.login(form); login(r.data); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data || 'Identifiants incorrects'); }
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
        <h2 className="auth-title">Connexion</h2>
        <p className="auth-sub">Accédez à votre espace formation</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={submit}>
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
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? <><span className="spinner-sm"/> Connexion...</> : 'Se connecter'}
          </button>
        </form>
        <div className="auth-footer">Pas de compte ? <Link to="/register">S'inscrire</Link></div>
        <div style={{marginTop:16,padding:12,background:'var(--off-white)',borderRadius:8,fontSize:'0.76rem',color:'var(--gray-500)'}}>
          <strong>Comptes démo :</strong><br/>
          admin@sebn.tn / admin123<br/>
          resp@sebn.tn / resp123<br/>
          formateur@sebn.tn / form123<br/>
          farah@sebn.tn / emp123
        </div>
      </div>
    </div>
  );
}
