import React, { useState, useEffect } from 'react';
import { Layout, Spinner } from '../components';
import { formationAPI, sessionAPI, inscriptionAPI, presenceAPI } from '../services/api';
import { toast } from 'react-toastify';
import { ClipboardList, Plus, Check, X } from 'lucide-react';

export default function PresencesPage() {
  const [formations, setFormations] = useState([]); const [sessions, setSessions] = useState([]);
  const [inscriptions, setInscriptions] = useState([]); const [presences, setPresences] = useState([]);
  const [selForm, setSelForm] = useState(''); const [selSession, setSelSession] = useState('');
  const [loading, setLoading] = useState(false); const [saving, setSaving] = useState(false);
  const [newSession, setNewSession] = useState({ titre:'', date:'', heureDebut:'', heureFin:'', salle:'' });
  const [showAddSession, setShowAddSession] = useState(false);

  useEffect(()=>{ formationAPI.getAll().then(r=>setFormations(r.data)).catch(()=>{}); },[]);
  useEffect(()=>{
    if(!selForm){setSessions([]);setSelSession('');setInscriptions([]);setPresences([]);return;}
    sessionAPI.getByFormation(selForm).then(r=>setSessions(r.data)).catch(()=>{});
    inscriptionAPI.getByFormation(selForm).then(r=>setInscriptions(r.data)).catch(()=>{});
  },[selForm]);
  useEffect(()=>{
    if(!selSession){setPresences([]);return;}
    setLoading(true);
    presenceAPI.getBySession(selSession).then(r=>setPresences(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  },[selSession]);

  const getPresence = (empId) => presences.find(p=>p.employeId===empId);

  const marquer = async (empId, present) => {
    setSaving(true);
    try {
      await presenceAPI.marquer({employeId:empId, sessionId:Number(selSession), present, justification:null});
      const r = await presenceAPI.getBySession(selSession); setPresences(r.data);
      toast.success(present?'Présence marquée':'Absence marquée');
    } catch(err){toast.error(err.response?.data||'Erreur');} finally{setSaving(false);}
  };

  const addSession = async e => {
    e.preventDefault(); setSaving(true);
    try {
      await sessionAPI.create({...newSession, formationId:Number(selForm)});
      toast.success('Session ajoutée');
      const r = await sessionAPI.getByFormation(selForm); setSessions(r.data);
      setShowAddSession(false); setNewSession({titre:'',date:'',heureDebut:'',heureFin:'',salle:''});
    } catch(err){toast.error(err.response?.data||'Erreur');} finally{setSaving(false);}
  };

  const presentsCount = presences.filter(p=>p.present).length;
  const totalInscrit = inscriptions.length;

  return (
    <Layout title="Présences" subtitle="Marquer les présences par session">
      <div className="page-header">
        <div><h1>Gestion des présences</h1><p>Enregistrer la présence des participants</p></div>
      </div>

      <div className="card" style={{marginBottom:20}}>
        <div className="card-header"><h2>Sélectionner une session</h2></div>
        <div style={{padding:20,display:'flex',gap:14,flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:200}}>
            <label className="form-label">Formation</label>
            <select className="form-control" value={selForm} onChange={e=>{setSelForm(e.target.value);setSelSession('');}}>
              <option value="">Choisir une formation...</option>
              {formations.map(f=><option key={f.id} value={f.id}>{f.titre}</option>)}
            </select>
          </div>
          <div style={{flex:1,minWidth:200}}>
            <label className="form-label">Session</label>
            <select className="form-control" value={selSession} onChange={e=>setSelSession(e.target.value)} disabled={!selForm}>
              <option value="">Choisir une session...</option>
              {sessions.map(s=><option key={s.id} value={s.id}>{s.titre} — {s.date}</option>)}
            </select>
          </div>
          {selForm && <div style={{display:'flex',alignItems:'flex-end'}}>
            <button className="btn btn-ghost" onClick={()=>setShowAddSession(!showAddSession)}><Plus size={14}/> Session</button>
          </div>}
        </div>
        {showAddSession && (
          <form onSubmit={addSession} style={{padding:'0 20px 20px'}}>
            <div style={{background:'var(--off-white)',borderRadius:10,padding:16}}>
              <div style={{fontWeight:700,fontSize:'.88rem',marginBottom:12}}>Ajouter une session</div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Titre *</label><input className="form-control" value={newSession.titre} onChange={e=>setNewSession({...newSession,titre:e.target.value})} required/></div>
                <div className="form-group"><label className="form-label">Date *</label><input type="date" className="form-control" value={newSession.date} onChange={e=>setNewSession({...newSession,date:e.target.value})} required/></div>
              </div>
              <div className="form-row-3">
                <div className="form-group"><label className="form-label">Heure début</label><input type="time" className="form-control" value={newSession.heureDebut} onChange={e=>setNewSession({...newSession,heureDebut:e.target.value})}/></div>
                <div className="form-group"><label className="form-label">Heure fin</label><input type="time" className="form-control" value={newSession.heureFin} onChange={e=>setNewSession({...newSession,heureFin:e.target.value})}/></div>
                <div className="form-group"><label className="form-label">Salle</label><input className="form-control" value={newSession.salle} onChange={e=>setNewSession({...newSession,salle:e.target.value})}/></div>
              </div>
              <div className="flex-gap"><button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving?<span className="spinner-sm"/>:'Ajouter'}</button><button type="button" className="btn btn-ghost btn-sm" onClick={()=>setShowAddSession(false)}>Annuler</button></div>
            </div>
          </form>
        )}
      </div>

      {selSession && (
        <div className="card">
          <div className="card-header">
            <h2>Feuille de présence</h2>
            {selSession && <div style={{fontSize:'.82rem',color:'var(--gray-500)'}}>{presentsCount}/{totalInscrit} présents</div>}
          </div>
          {selSession && <div style={{padding:'8px 22px',background:'var(--off-white)',borderBottom:'1px solid var(--gray-100)'}}>
            <div className="progress-bar"><div className="progress-fill" style={{width:`${totalInscrit?presentsCount/totalInscrit*100:0}%`,background:'var(--success)'}}/></div>
          </div>}
          <div className="card-body table-wrapper">
            {loading ? <Spinner/> : inscriptions.length===0 ? <div className="empty-state"><ClipboardList size={40}/><p>Aucun participant inscrit</p></div> : (
              <table>
                <thead><tr><th>#</th><th>Participant</th><th>Email</th><th>Présence</th><th>Actions</th></tr></thead>
                <tbody>{inscriptions.map((ins,i)=>{
                  const p = getPresence(ins.employeId);
                  return (
                    <tr key={ins.id}>
                      <td style={{color:'var(--gray-500)',fontWeight:600}}>{i+1}</td>
                      <td><strong>{ins.employeNom}</strong></td>
                      <td style={{color:'var(--gray-700)',fontSize:'.83rem'}}>{ins.employeEmail}</td>
                      <td>{p ? <span className={`badge ${p.present?'badge-success':'badge-danger'}`}>{p.present?'Présent':'Absent'}</span> : <span className="badge badge-gray">Non marqué</span>}</td>
                      <td><div className="flex-gap">
                        <button className="btn btn-success btn-sm" onClick={()=>marquer(ins.employeId,true)} disabled={saving}><Check size={14}/> Présent</button>
                        <button className="btn btn-danger btn-sm" onClick={()=>marquer(ins.employeId,false)} disabled={saving}><X size={14}/> Absent</button>
                      </div></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            )}
          </div>
        </div>
      )}
      {!selSession && selForm && <div className="empty-state" style={{paddingTop:40}}><ClipboardList size={40}/><p>Sélectionnez une session pour marquer les présences</p></div>}
      {!selForm && <div className="empty-state" style={{paddingTop:40}}><ClipboardList size={40}/><p>Sélectionnez une formation pour commencer</p></div>}
    </Layout>
  );
}
