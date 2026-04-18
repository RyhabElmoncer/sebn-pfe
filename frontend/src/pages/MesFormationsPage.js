import React, { useState, useEffect } from 'react';
import { Layout, Spinner } from '../components';
import { inscriptionAPI, presenceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Calendar, MapPin, Clock } from 'lucide-react';

export default function MesFormationsPage() {
  const { user } = useAuth();
  const [inscriptions, setInscriptions] = useState([]);
  const [taux, setTaux] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inscriptionAPI.getByEmploye(user.id)
      .then(async r => {
        setInscriptions(r.data);
        const tauxMap = {};
        await Promise.all(r.data.map(async ins => {
          try { const t = await presenceAPI.getTaux(user.id, ins.formationId); tauxMap[ins.formationId] = t.data.taux; }
          catch { tauxMap[ins.formationId] = 0; }
        }));
        setTaux(tauxMap);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <Layout title="Mes formations" subtitle="Formations auxquelles vous êtes inscrit(e)">
      <div className="page-header">
        <div><h1>Mes formations</h1><p>{inscriptions.length} formation(s) inscrite(s)</p></div>
      </div>

      {loading ? <Spinner/> : inscriptions.length === 0
        ? <div className="empty-state" style={{paddingTop:60}}><BookOpen size={48}/><p>Vous n'êtes inscrit(e) à aucune formation pour le moment.</p></div>
        : <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:18}}>
            {inscriptions.map(ins => {
              const t = taux[ins.formationId] || 0;
              return (
                <div key={ins.id} className="card" style={{padding:22}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
                    <div style={{width:44,height:44,borderRadius:12,background:'rgba(0,168,232,.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--accent)'}}><BookOpen size={22}/></div>
                    <span className={`badge ${ins.statut==='COMPLETE'?'badge-success':ins.statut==='ABANDONNE'?'badge-danger':'badge-info'}`}>{ins.statut}</span>
                  </div>
                  <div style={{fontWeight:700,fontSize:'1rem',color:'var(--navy)',marginBottom:8}}>{ins.formationTitre}</div>
                  <div style={{fontSize:'.8rem',color:'var(--gray-500)',marginBottom:4,display:'flex',alignItems:'center',gap:5}}><Calendar size={13}/> Inscrit le {ins.dateInscription}</div>

                  {t > 0 && <>
                    <div style={{marginTop:14,marginBottom:6,display:'flex',justifyContent:'space-between',fontSize:'.8rem'}}>
                      <span style={{color:'var(--gray-500)'}}>Taux de présence</span>
                      <span style={{fontWeight:700,color:t>=75?'var(--success)':'var(--warning)'}}>{t}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{width:`${t}%`,background:t>=75?'var(--success)':'var(--warning)'}}/></div>
                  </>}
                </div>
              );
            })}
          </div>
      }
    </Layout>
  );
}
