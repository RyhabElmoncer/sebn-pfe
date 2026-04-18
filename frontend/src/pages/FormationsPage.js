import React, { useState, useEffect } from 'react';
import { Layout, Modal, ConfirmModal, StatutBadge, Spinner } from '../components';
import { formationAPI, userAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2, BookOpen, Calendar, Users, MapPin } from 'lucide-react';

const empty = { titre:'', description:'', dateDebut:'', dateFin:'', lieu:'', dureeHeures:'', statut:'PLANIFIEE', responsableId:'', formateurId:'' };

export default function FormationsPage() {
  const [formations, setFormations] = useState([]); const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); const [modal, setModal] = useState(false);
  const [delModal, setDelModal] = useState(false); const [sel, setSel] = useState(null);
  const [form, setForm] = useState(empty); const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState(''); const [filterStatut, setFilterStatut] = useState('');

  const load = async () => { setLoading(true); try { const [f,u]=await Promise.all([formationAPI.getAll(),userAPI.getAll()]); setFormations(f.data); setUsers(u.data); } catch{toast.error('Erreur');} finally{setLoading(false);} };
  useEffect(()=>{load();},[]);

  const openAdd = () => { setSel(null); setForm(empty); setModal(true); };
  const openEdit = f => { setSel(f); setForm({titre:f.titre,description:f.description||'',dateDebut:f.dateDebut||'',dateFin:f.dateFin||'',lieu:f.lieu||'',dureeHeures:f.dureeHeures||'',statut:f.statut,responsableId:f.responsableId||'',formateurId:f.formateurId||''}); setModal(true); };

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const p = {...form, dureeHeures:form.dureeHeures?Number(form.dureeHeures):null, responsableId:form.responsableId?Number(form.responsableId):null, formateurId:form.formateurId?Number(form.formateurId):null};
      if(sel){await formationAPI.update(sel.id,p);toast.success('Formation modifiée');}
      else{await formationAPI.create(p);toast.success('Formation créée');}
      setModal(false); load();
    } catch(err){toast.error(err.response?.data||'Erreur');} finally{setSaving(false);}
  };
  const del = async () => { setSaving(true); try{await formationAPI.delete(sel.id);toast.success('Supprimée');setDelModal(false);load();}catch{toast.error('Erreur');} finally{setSaving(false);} };

  const filtered = formations.filter(f=>{
    const matchSearch = [f.titre,f.lieu,f.responsableNom,f.formateurNom].some(v=>v?.toLowerCase().includes(search.toLowerCase()));
    const matchStatut = !filterStatut || f.statut===filterStatut;
    return matchSearch && matchStatut;
  });

  const resp = users.filter(u=>['ADMIN','RESPONSABLE_FORMATION'].includes(u.roleName));
  const form_ = users.filter(u=>u.roleName==='FORMATEUR');

  return (
    <Layout title="Formations" subtitle={`${formations.length} formation(s) enregistrée(s)`}>
      <div className="page-header">
        <div><h1>Gestion des formations</h1><p>Planifier, organiser et suivre les formations</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15}/> Nouvelle formation</button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Liste des formations</h2>
          <div className="flex-gap">
            <select className="form-control" style={{width:150}} value={filterStatut} onChange={e=>setFilterStatut(e.target.value)}>
              <option value="">Tous statuts</option>
              {['PLANIFIEE','EN_COURS','TERMINEE','ANNULEE'].map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <input className="form-control" style={{width:200}} placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>
        <div className="card-body table-wrapper">
          {loading ? <Spinner/> : filtered.length===0 ? <div className="empty-state"><BookOpen size={40}/><p>Aucune formation</p></div> : (
            <table>
              <thead><tr><th>Titre</th><th>Dates</th><th>Lieu</th><th>Formateur</th><th>Participants</th><th>Statut</th><th>Actions</th></tr></thead>
              <tbody>{filtered.map(f=>(
                <tr key={f.id}>
                  <td><strong>{f.titre}</strong><div style={{fontSize:'.75rem',color:'var(--gray-500)',marginTop:2}}>{f.dureeHeures}h</div></td>
                  <td style={{fontSize:'.82rem'}}><div style={{display:'flex',alignItems:'center',gap:5}}><Calendar size={13} color="var(--gray-500)"/>{f.dateDebut||'—'}</div><div style={{color:'var(--gray-500)'}}>→ {f.dateFin||'—'}</div></td>
                  <td style={{fontSize:'.82rem'}}><div style={{display:'flex',alignItems:'center',gap:5}}><MapPin size={13} color="var(--gray-500)"/>{f.lieu||'—'}</div></td>
                  <td style={{fontSize:'.82rem'}}>{f.formateurNom||'—'}</td>
                  <td><div style={{display:'flex',alignItems:'center',gap:5}}><Users size={13} color="var(--gray-500)"/>{f.nbParticipants}</div></td>
                  <td><StatutBadge statut={f.statut}/></td>
                  <td><div className="flex-gap">
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>openEdit(f)}><Pencil size={14}/></button>
                    <button className="btn btn-danger btn-sm btn-icon" onClick={()=>{setSel(f);setDelModal(true);}}><Trash2 size={14}/></button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title={sel?'Modifier formation':'Nouvelle formation'} large
        footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?<><span className="spinner-sm"/> ...</>:'Enregistrer'}</button></>}>
        <form onSubmit={save}>
          <div className="form-group"><label className="form-label">Titre *</label><input className="form-control" value={form.titre} onChange={e=>setForm({...form,titre:e.target.value})} required/></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3}/></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Date début</label><input type="date" className="form-control" value={form.dateDebut} onChange={e=>setForm({...form,dateDebut:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Date fin</label><input type="date" className="form-control" value={form.dateFin} onChange={e=>setForm({...form,dateFin:e.target.value})}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Lieu</label><input className="form-control" value={form.lieu} onChange={e=>setForm({...form,lieu:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Durée (heures)</label><input type="number" className="form-control" value={form.dureeHeures} onChange={e=>setForm({...form,dureeHeures:e.target.value})}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Statut</label>
              <select className="form-control" value={form.statut} onChange={e=>setForm({...form,statut:e.target.value})}>
                {['PLANIFIEE','EN_COURS','TERMINEE','ANNULEE'].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Formateur</label>
              <select className="form-control" value={form.formateurId} onChange={e=>setForm({...form,formateurId:e.target.value})}>
                <option value="">Sélectionner...</option>{form_.map(u=><option key={u.id} value={u.id}>{u.username}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group"><label className="form-label">Responsable</label>
            <select className="form-control" value={form.responsableId} onChange={e=>setForm({...form,responsableId:e.target.value})}>
              <option value="">Sélectionner...</option>{resp.map(u=><option key={u.id} value={u.id}>{u.username}</option>)}
            </select>
          </div>
        </form>
      </Modal>
      <ConfirmModal open={delModal} onClose={()=>setDelModal(false)} onConfirm={del} saving={saving} title="Supprimer la formation ?" message={`Supprimer "${sel?.titre}" ? Tous les dossiers et inscriptions liés seront supprimés.`}/>
    </Layout>
  );
}
