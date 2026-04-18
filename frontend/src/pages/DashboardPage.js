import React, { useEffect, useState } from 'react';
import { Layout } from '../components';
import { useAuth } from '../context/AuthContext';
import { userAPI, formationAPI, inscriptionAPI, certificatAPI } from '../services/api';
import { Users, BookOpen, UserCheck, Award, FolderOpen, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAdmin, isResp } = useAuth();
  const [stats, setStats] = useState({ users:0, formations:0, inscriptions:0, certificats:0, terminees:0, enCours:0 });
  const [myFormations, setMyFormations] = useState([]);

  useEffect(() => {
    if (isAdmin()) {
      Promise.all([userAPI.getAll(), formationAPI.getAll(), certificatAPI.getAll()])
        .then(([u, f, c]) => {
          const formations = f.data;
          setStats({
            users: u.data.length,
            formations: formations.length,
            inscriptions: 0,
            certificats: c.data.length,
            terminees: formations.filter(x=>x.statut==='TERMINEE').length,
            enCours: formations.filter(x=>x.statut==='EN_COURS').length,
          });
          setMyFormations(formations.slice(0,3));
        }).catch(()=>{});
    } else if (isResp()) {
      formationAPI.getAll().then(f => {
        setMyFormations(f.data.slice(0,4));
        setStats(s => ({...s, formations:f.data.length, terminees:f.data.filter(x=>x.statut==='TERMINEE').length, enCours:f.data.filter(x=>x.statut==='EN_COURS').length}));
      }).catch(()=>{});
    } else {
      inscriptionAPI.getByEmploye(user.id).then(r => {
        setMyFormations(r.data.slice(0,4));
        setStats(s => ({...s, inscriptions: r.data.length}));
      }).catch(()=>{});
      certificatAPI.getByEmploye(user.id).then(r => setStats(s=>({...s,certificats:r.data.length}))).catch(()=>{});
    }
  }, []);

  const STATUT_COLOR = { PLANIFIEE:'var(--info)', EN_COURS:'var(--warning)', TERMINEE:'var(--success)', ANNULEE:'var(--danger)' };
  const greet = () => { const h=new Date().getHours(); return h<12?'Bonjour':h<18?'Bon après-midi':'Bonsoir'; };

  return (
    <Layout title="Tableau de bord" subtitle="Vue d'ensemble du système de formation">
      <div className="page-header">
        <div>
          <h1>{greet()}, {user?.username?.split(' ')[0]} 👋</h1>
          <p>Bienvenue sur la plateforme de gestion des formations SEBN</p>
        </div>
      </div>

      <div className="stats-grid">
        {isAdmin() && <div className="stat-card"><div className="stat-icon blue"><Users size={22}/></div><div><div className="stat-value">{stats.users}</div><div className="stat-label">Utilisateurs</div></div></div>}
        {(isAdmin()||isResp()) && <div className="stat-card"><div className="stat-icon gold"><BookOpen size={22}/></div><div><div className="stat-value">{stats.formations}</div><div className="stat-label">Formations</div></div></div>}
        {(isAdmin()||isResp()) && <div className="stat-card"><div className="stat-icon green"><TrendingUp size={22}/></div><div><div className="stat-value">{stats.terminees}</div><div className="stat-label">Terminées</div></div></div>}
        {(isAdmin()||isResp()) && <div className="stat-card"><div className="stat-icon navy"><BookOpen size={22}/></div><div><div className="stat-value">{stats.enCours}</div><div className="stat-label">En cours</div></div></div>}
        {!isResp() && <div className="stat-card"><div className="stat-icon blue"><UserCheck size={22}/></div><div><div className="stat-value">{stats.inscriptions}</div><div className="stat-label">Mes inscriptions</div></div></div>}
        <div className="stat-card"><div className="stat-icon purple"><Award size={22}/></div><div><div className="stat-value">{stats.certificats}</div><div className="stat-label">Certificats</div></div></div>
      </div>

      <div className="card">
        <div className="card-header"><h2>{isResp()?'Formations récentes':'Mes formations'}</h2></div>
        <div className="card-body">
          {myFormations.length === 0
            ? <div className="empty-state"><BookOpen size={40}/><p>Aucune formation</p></div>
            : <table><thead><tr><th>Titre</th><th>Date début</th><th>Statut</th>{isResp()&&<th>Participants</th>}</tr></thead>
              <tbody>{myFormations.map(f=>(
                <tr key={f.id||f.formationId}>
                  <td><strong>{f.formationTitre||f.titre}</strong></td>
                  <td style={{color:'var(--gray-500)'}}>{f.dateDebut||f.dateInscription||'—'}</td>
                  <td><span className={`badge badge-${f.statut==='TERMINEE'?'success':f.statut==='EN_COURS'?'warning':f.statut==='ANNULEE'?'danger':'info'}`}>{f.statut||f.statut}</span></td>
                  {isResp()&&<td>{f.nbParticipants||0}</td>}
                </tr>
              ))}</tbody></table>
          }
        </div>
      </div>

      <div className="card section-gap">
        <div className="card-header"><h2>À propos de SEBN</h2></div>
        <div style={{padding:20,display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          {[['Entreprise','Sumitomo Electric Bordnetze Tunisia'],['Localisation',"Zone industrielle d'Irtiyah Bella Rejia, Jendouba"],['Secteur','Fabrication de faisceaux de câblage automobile'],['Effectif','3 000 collaborateurs qualifiés']].map(([k,v])=>(
            <div key={k} style={{padding:14,background:'var(--off-white)',borderRadius:10}}>
              <div style={{fontSize:'.72rem',color:'var(--gray-500)',fontWeight:600,marginBottom:3}}>{k}</div>
              <div style={{fontSize:'.86rem',fontWeight:500}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
