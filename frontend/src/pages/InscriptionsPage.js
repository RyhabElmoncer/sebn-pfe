import React, { useState, useEffect } from 'react';
import { Layout, Modal, ConfirmModal, Spinner } from '../components';
import { inscriptionAPI, formationAPI, userAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Trash2, UserCheck } from 'lucide-react';

export default function InscriptionsPage() {
  const [inscriptions, setInscriptions] = useState([]); const [formations, setFormations] = useState([]); const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true); const [modal, setModal] = useState(false);
  const [delModal, setDelModal] = useState(false); const [sel, setSel] = useState(null);
  const [form, setForm] = useState({ employeId:'', formationId:'' }); const [saving, setSaving] = useState(false);
  const [filterF, setFilterF] = useState('');

  const load = async () => { setLoading(true); try { const [i,f,u]=await Promise.all([inscriptionAPI.getAll(),formationAPI.getAll(),userAPI.getAll()]); setInscriptions(i.data); setFormations(f.data); setEmployes(u.data.filter(u=>u.roleName==='EMPLOYE')); } catch{toast.error('Erreur');} finally{setLoading(false);} };
  useEffect(()=>{load();},[]);

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try { await inscriptionAPI.inscrire(Number(form.employeId),Number(form.formationId)); toast.success('Inscrit avec succès'); setModal(false); load(); }
    catch(err){toast.error(err.response?.data||'Erreur');} finally{setSaving(false);}
  };
  const del = async () => { setSaving(true); try{await inscriptionAPI.delete(sel.id);toast.success('Inscription supprimée');setDelModal(false);load();}catch{toast.error('Erreur');} finally{setSaving(false);} };

  const filtered = inscriptions.filter(i=>!filterF||String(i.formationId)===filterF);

  return (
    <Layout title="Inscriptions" subtitle={`${inscriptions.length} inscription(s)`}>
      <div className="page-header">
        <div><h1>Gestion des inscriptions</h1><p>Affecter des employés aux formations</p></div>
        <button className="btn btn-primary" onClick={()=>{setForm({employeId:'',formationId:''});setModal(true);}}><Plus size={15}/> Inscrire un employé</button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Liste des inscriptions</h2>
          <select className="form-control" style={{width:220}} value={filterF} onChange={e=>setFilterF(e.target.value)}>
            <option value="">Toutes les formations</option>{formations.map(f=><option key={f.id} value={f.id}>{f.titre}</option>)}
          </select>
        </div>
        <div className="card-body table-wrapper">
          {loading ? <Spinner/> : filtered.length===0 ? <div className="empty-state"><UserCheck size={40}/><p>Aucune inscription</p></div> : (
            <table>
              <thead><tr><th>Employé</th><th>Email</th><th>Formation</th><th>Date inscription</th><th>Statut</th><th>Actions</th></tr></thead>
              <tbody>{filtered.map(i=>(
                <tr key={i.id}>
                  <td><strong>{i.employeNom}</strong></td>
                  <td style={{fontSize:'.82rem',color:'var(--gray-700)'}}>{i.employeEmail}</td>
                  <td style={{fontSize:'.83rem'}}>{i.formationTitre}</td>
                  <td style={{fontSize:'.82rem',color:'var(--gray-500)'}}>{i.dateInscription}</td>
                  <td><span className={`badge ${i.statut==='COMPLETE'?'badge-success':i.statut==='ABANDONNE'?'badge-danger':'badge-info'}`}>{i.statut}</span></td>
                  <td><button className="btn btn-danger btn-sm btn-icon" onClick={()=>{setSel(i);setDelModal(true);}}><Trash2 size={14}/></button></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title="Inscrire un employé"
        footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?<><span className="spinner-sm"/> ...</>:'Inscrire'}</button></>}>
        <form onSubmit={save}>
          <div className="form-group"><label className="form-label">Employé *</label>
            <select className="form-control" value={form.employeId} onChange={e=>setForm({...form,employeId:e.target.value})} required>
              <option value="">Sélectionner un employé</option>{employes.map(u=><option key={u.id} value={u.id}>{u.username} ({u.email})</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Formation *</label>
            <select className="form-control" value={form.formationId} onChange={e=>setForm({...form,formationId:e.target.value})} required>
              <option value="">Sélectionner une formation</option>{formations.map(f=><option key={f.id} value={f.id}>{f.titre}</option>)}
            </select>
          </div>
        </form>
      </Modal>
      <ConfirmModal open={delModal} onClose={()=>setDelModal(false)} onConfirm={del} saving={saving} title="Supprimer l'inscription ?" message={`Retirer ${sel?.employeNom} de "${sel?.formationTitre}" ?`}/>
    </Layout>
  );
}
