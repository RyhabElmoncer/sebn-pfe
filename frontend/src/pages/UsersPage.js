import React, { useState, useEffect } from 'react';
import { Layout, Modal, ConfirmModal, RoleBadge, Spinner } from '../components';
import { userAPI, roleAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';

const empty = { username:'', email:'', password:'', roleId:'', active:true };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [delModal, setDelModal] = useState(false);
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => { setLoading(true); try { const [u,r]=await Promise.all([userAPI.getAll(),roleAPI.getAll()]); setUsers(u.data); setRoles(r.data); } catch{toast.error('Erreur de chargement');} finally{setLoading(false);} };
  useEffect(()=>{load();},[]);

  const openAdd = () => { setSel(null); setForm(empty); setModal(true); };
  const openEdit = u => { setSel(u); setForm({username:u.username,email:u.email,password:'',roleId:u.roleId||'',active:u.active}); setModal(true); };
  const openDel = u => { setSel(u); setDelModal(true); };

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const p = {...form, roleId: form.roleId?Number(form.roleId):null};
      if(sel) { await userAPI.update(sel.id,p); toast.success('Utilisateur modifié'); }
      else { await userAPI.create(p); toast.success('Utilisateur créé'); }
      setModal(false); load();
    } catch(err){toast.error(err.response?.data||'Erreur');} finally{setSaving(false);}
  };

  const del = async () => { setSaving(true); try { await userAPI.delete(sel.id); toast.success('Supprimé'); setDelModal(false); load(); } catch{toast.error('Erreur suppression');} finally{setSaving(false);} };

  const filtered = users.filter(u => [u.username,u.email,u.roleName].some(v=>v?.toLowerCase().includes(search.toLowerCase())));

  return (
    <Layout title="Utilisateurs" subtitle={`${users.length} utilisateur(s)`}>
      <div className="page-header">
        <div><h1>Gestion des utilisateurs</h1><p>Créer, modifier et supprimer les comptes</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15}/> Ajouter</button>
      </div>
      <div className="card">
        <div className="card-header">
          <h2>Liste des utilisateurs</h2>
          <input className="form-control" style={{width:200}} placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="card-body table-wrapper">
          {loading ? <Spinner/> : filtered.length===0 ? <div className="empty-state"><Users size={40}/><p>Aucun utilisateur</p></div> : (
            <table>
              <thead><tr><th>#</th><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr></thead>
              <tbody>{filtered.map((u,i)=>(
                <tr key={u.id}>
                  <td style={{color:'var(--gray-500)',fontWeight:600}}>{i+1}</td>
                  <td><div style={{display:'flex',alignItems:'center',gap:9}}><div className="user-avatar" style={{width:30,height:30,fontSize:'.78rem'}}>{u.username?.[0]?.toUpperCase()}</div><strong>{u.username}</strong></div></td>
                  <td style={{color:'var(--gray-700)'}}>{u.email}</td>
                  <td>{u.roleName ? <RoleBadge role={u.roleName}/> : '—'}</td>
                  <td><span className={`badge ${u.active?'badge-success':'badge-danger'}`}>{u.active?'Actif':'Inactif'}</span></td>
                  <td><div className="flex-gap">
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>openEdit(u)}><Pencil size={14}/></button>
                    <button className="btn btn-danger btn-sm btn-icon" onClick={()=>openDel(u)}><Trash2 size={14}/></button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title={sel?'Modifier utilisateur':'Ajouter utilisateur'}
        footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?<><span className="spinner-sm"/> Sauvegarde...</>:'Enregistrer'}</button></>}>
        <form onSubmit={save}>
          <div className="form-group"><label className="form-label">Nom complet *</label><input className="form-control" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required/></div>
          <div className="form-group"><label className="form-label">Email *</label><input type="email" className="form-control" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></div>
          <div className="form-group"><label className="form-label">{sel?'Nouveau mot de passe (optionnel)':'Mot de passe *'}</label><input type="password" className="form-control" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required={!sel}/></div>
          <div className="form-group"><label className="form-label">Rôle</label>
            <select className="form-control" value={form.roleId} onChange={e=>setForm({...form,roleId:e.target.value})}>
              <option value="">Sélectionner...</option>{roles.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          {sel&&<div className="form-group" style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" id="active" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})}/><label htmlFor="active" className="form-label" style={{marginBottom:0}}>Compte actif</label></div>}
        </form>
      </Modal>

      <ConfirmModal open={delModal} onClose={()=>setDelModal(false)} onConfirm={del} saving={saving}
        title="Supprimer l'utilisateur ?" message={`Voulez-vous supprimer ${sel?.username} ? Cette action est irréversible.`}/>
    </Layout>
  );
}
