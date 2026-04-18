import React, { useState, useEffect } from 'react';
import { Layout, Modal, ConfirmModal, Spinner } from '../components';
import { dossierAPI, formationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';

const empty = { numeroDossier:'', titre:'', description:'', objectifs:'', supportsPedagogiques:'', statut:'ACTIF', formationId:'' };

export default function DossiersPage() {
  const { user } = useAuth();
  const [dossiers, setDossiers] = useState([]); const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true); const [modal, setModal] = useState(false);
  const [delModal, setDelModal] = useState(false); const [sel, setSel] = useState(null);
  const [form, setForm] = useState(empty); const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => { setLoading(true); try { const [d,f]=await Promise.all([dossierAPI.getAll(),formationAPI.getAll()]); setDossiers(d.data); setFormations(f.data); } catch{toast.error('Erreur');} finally{setLoading(false);} };
  useEffect(()=>{load();},[]);

  const openAdd = () => { setSel(null); setForm(empty); setModal(true); };
  const openEdit = d => { setSel(d); setForm({numeroDossier:d.numeroDossier,titre:d.titre,description:d.description||'',objectifs:d.objectifs||'',supportsPedagogiques:d.supportsPedagogiques||'',statut:d.statut,formationId:d.formationId||''}); setModal(true); };

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const p = {...form, formationId:form.formationId?Number(form.formationId):null, createurId:user.id};
      if(sel){await dossierAPI.update(sel.id,p);toast.success('Dossier modifié');}
      else{await dossierAPI.create(p);toast.success('Dossier créé');}
      setModal(false); load();
    } catch(err){toast.error(err.response?.data||'Erreur');} finally{setSaving(false);}
  };
  const del = async () => { setSaving(true); try{await dossierAPI.delete(sel.id);toast.success('Supprimé');setDelModal(false);load();}catch{toast.error('Erreur');} finally{setSaving(false);} };

  const filtered = dossiers.filter(d=>[d.numeroDossier,d.titre,d.formationTitre].some(v=>v?.toLowerCase().includes(search.toLowerCase())));

  return (
    <Layout title="Dossiers Techniques" subtitle={`${dossiers.length} dossier(s)`}>
      <div className="page-header">
        <div><h1>Dossiers techniques</h1><p>Gérer la documentation pédagogique des formations</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15}/> Nouveau dossier</button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Liste des dossiers</h2>
          <input className="form-control" style={{width:220}} placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="card-body table-wrapper">
          {loading ? <Spinner/> : filtered.length===0 ? <div className="empty-state"><FolderOpen size={40}/><p>Aucun dossier</p></div> : (
            <table>
              <thead><tr><th>N° Dossier</th><th>Titre</th><th>Formation</th><th>Objectifs</th><th>Statut</th><th>Actions</th></tr></thead>
              <tbody>{filtered.map(d=>(
                <tr key={d.id}>
                  <td><span style={{fontFamily:'monospace',fontSize:'.78rem',background:'var(--gray-100)',padding:'2px 7px',borderRadius:5}}>{d.numeroDossier}</span></td>
                  <td><strong>{d.titre}</strong><div style={{fontSize:'.74rem',color:'var(--gray-500)',marginTop:2}}>Créé le {d.dateCreation}</div></td>
                  <td style={{fontSize:'.83rem'}}>{d.formationTitre||'—'}</td>
                  <td style={{fontSize:'.8rem',color:'var(--gray-700)',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.objectifs||'—'}</td>
                  <td><span className={`badge ${d.statut==='ACTIF'?'badge-success':'badge-danger'}`}>{d.statut}</span></td>
                  <td><div className="flex-gap">
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>openEdit(d)}><Pencil size={14}/></button>
                    <button className="btn btn-danger btn-sm btn-icon" onClick={()=>{setSel(d);setDelModal(true);}}><Trash2 size={14}/></button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title={sel?'Modifier dossier':'Nouveau dossier technique'} large
        footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?<><span className="spinner-sm"/> ...</>:'Enregistrer'}</button></>}>
        <form onSubmit={save}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">N° Dossier</label><input className="form-control" value={form.numeroDossier} placeholder="DOS-2025-XXX" onChange={e=>setForm({...form,numeroDossier:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Statut</label><select className="form-control" value={form.statut} onChange={e=>setForm({...form,statut:e.target.value})}><option value="ACTIF">ACTIF</option><option value="ARCHIVE">ARCHIVÉ</option></select></div>
          </div>
          <div className="form-group"><label className="form-label">Titre *</label><input className="form-control" value={form.titre} onChange={e=>setForm({...form,titre:e.target.value})} required/></div>
          <div className="form-group"><label className="form-label">Formation associée</label>
            <select className="form-control" value={form.formationId} onChange={e=>setForm({...form,formationId:e.target.value})}>
              <option value="">Aucune</option>{formations.map(f=><option key={f.id} value={f.id}>{f.titre}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3}/></div>
          <div className="form-group"><label className="form-label">Objectifs pédagogiques</label><textarea className="form-control" value={form.objectifs} onChange={e=>setForm({...form,objectifs:e.target.value})} rows={3}/></div>
          <div className="form-group"><label className="form-label">Supports pédagogiques</label><input className="form-control" value={form.supportsPedagogiques} placeholder="PPT, Vidéos, Fiches..." onChange={e=>setForm({...form,supportsPedagogiques:e.target.value})}/></div>
        </form>
      </Modal>
      <ConfirmModal open={delModal} onClose={()=>setDelModal(false)} onConfirm={del} saving={saving} title="Supprimer le dossier ?" message={`Supprimer "${sel?.titre}" ?`}/>
    </Layout>
  );
}
