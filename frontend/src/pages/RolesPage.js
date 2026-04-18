import React, { useState, useEffect } from 'react';
import { Layout, Modal, ConfirmModal, Spinner } from '../components';
import { roleAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react';

const COLORS = { ADMIN:'#ef4444', RESPONSABLE_FORMATION:'#00a8e8', FORMATEUR:'#f0a500', EMPLOYE:'#22c55e' };
const empty = { name:'', description:'' };

export default function RolesPage() {
  const [roles, setRoles] = useState([]); const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false); const [delModal, setDelModal] = useState(false);
  const [sel, setSel] = useState(null); const [form, setForm] = useState(empty); const [saving, setSaving] = useState(false);

  const load = async () => { setLoading(true); try{const r=await roleAPI.getAll();setRoles(r.data);}catch{toast.error('Erreur');} finally{setLoading(false);} };
  useEffect(()=>{load();},[]);

  const openAdd = () => { setSel(null); setForm(empty); setModal(true); };
  const openEdit = r => { setSel(r); setForm({name:r.name,description:r.description||''}); setModal(true); };

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try { if(sel){await roleAPI.update(sel.id,form);toast.success('Rôle modifié');} else{await roleAPI.create(form);toast.success('Rôle créé');} setModal(false); load(); }
    catch(err){toast.error(err.response?.data||'Erreur');} finally{setSaving(false);}
  };
  const del = async () => { setSaving(true); try{await roleAPI.delete(sel.id);toast.success('Supprimé');setDelModal(false);load();}catch{toast.error('Impossible (utilisateurs liés)');} finally{setSaving(false);} };

  return (
    <Layout title="Rôles & Permissions" subtitle={`${roles.length} rôle(s)`}>
      <div className="page-header">
        <div><h1>Gestion des rôles</h1><p>Configurer les permissions du système</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15}/> Ajouter un rôle</button>
      </div>

      {loading ? <Spinner/> : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:16,marginBottom:24}}>
          {roles.map(r=>(
            <div key={r.id} className="card" style={{padding:20}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                <div style={{width:42,height:42,borderRadius:12,background:`${COLORS[r.name]||'#7a8aaa'}18`,display:'flex',alignItems:'center',justifyContent:'center',color:COLORS[r.name]||'#7a8aaa'}}><ShieldCheck size={20}/></div>
                <div className="flex-gap">
                  <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>openEdit(r)}><Pencil size={13}/></button>
                  <button className="btn btn-danger btn-sm btn-icon" onClick={()=>{setSel(r);setDelModal(true);}}><Trash2 size={13}/></button>
                </div>
              </div>
              <div style={{fontWeight:700,fontSize:'.95rem',color:'var(--navy)',marginBottom:4}}>{r.name}</div>
              <div style={{fontSize:'.8rem',color:'var(--gray-500)'}}>{r.description||'—'}</div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={()=>setModal(false)} title={sel?'Modifier rôle':'Ajouter un rôle'}
        footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?<><span className="spinner-sm"/> ...</>:'Enregistrer'}</button></>}>
        <form onSubmit={save}>
          <div className="form-group"><label className="form-label">Nom *</label><input className="form-control" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="ex: FORMATEUR" required/></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3}/></div>
        </form>
      </Modal>
      <ConfirmModal open={delModal} onClose={()=>setDelModal(false)} onConfirm={del} saving={saving} title="Supprimer le rôle ?" message={`Supprimer le rôle "${sel?.name}" ?`}/>
    </Layout>
  );
}
