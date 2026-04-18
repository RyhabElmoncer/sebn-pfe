import React, { useState, useEffect } from 'react';
import { Layout, Spinner } from '../components';
import { certificatAPI, inscriptionAPI, formationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Award, Download, Plus } from 'lucide-react';

export default function CertificatsPage() {
  const { user, isResp, isAdmin } = useAuth();
  const [certificats, setCertificats] = useState([]); const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const [selForm, setSelForm] = useState(''); const [formations, setFormations] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      if(isAdmin()||isResp()) {
        const [c,f] = await Promise.all([certificatAPI.getAll(), formationAPI.getAll()]);
        setCertificats(c.data); setFormations(f.data);
      } else {
        const [c,i] = await Promise.all([certificatAPI.getByEmploye(user.id), inscriptionAPI.getByEmploye(user.id)]);
        setCertificats(c.data); setInscriptions(i.data);
      }
    } catch{toast.error('Erreur');} finally{setLoading(false);}
  };
  useEffect(()=>{load();},[]);

  const generer = async (employeId, formationId) => {
    setSaving(true);
    try { await certificatAPI.generer(employeId, formationId); toast.success('Certificat généré !'); load(); }
    catch(err){toast.error(err.response?.data||'Erreur');} finally{setSaving(false);}
  };

  const printCert = (c) => {
    const w = window.open('','_blank');
    w.document.write(`<!DOCTYPE html><html><head><title>Certificat</title><style>
      body{font-family:'Times New Roman',serif;margin:0;padding:40px;background:#fff;color:#1a1a1a}
      .border{border:12px solid #0f1f3d;padding:60px;min-height:90vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative}
      .inner{border:3px solid #00a8e8;padding:40px;width:100%}
      h1{font-size:3rem;color:#0f1f3d;margin:0 0 8px;letter-spacing:.1em;text-transform:uppercase}
      .sub{font-size:.9rem;letter-spacing:.3em;color:#7a8aaa;text-transform:uppercase;margin-bottom:40px}
      .certifie{font-size:1.1rem;color:#555;margin-bottom:16px}
      .name{font-size:2.4rem;color:#0f1f3d;font-weight:bold;border-bottom:2px solid #00a8e8;display:inline-block;padding-bottom:4px;margin:12px 0 20px}
      .formation{font-size:1.2rem;color:#333;margin:8px 0 4px}
      .formation strong{color:#0f1f3d;font-size:1.4rem}
      .details{font-size:.88rem;color:#7a8aaa;margin-top:4px}
      .taux{background:#00a8e8;color:#fff;padding:10px 30px;border-radius:30px;display:inline-block;font-size:1rem;font-weight:bold;margin:24px 0}
      .footer{margin-top:50px;display:flex;justify-content:space-around;width:100%}
      .sig{text-align:center}.sig-line{width:160px;border-top:2px solid #333;margin:0 auto 6px}.sig-label{font-size:.78rem;color:#7a8aaa}
      .num{position:absolute;bottom:20px;right:40px;font-size:.7rem;color:#aaa}
      @media print{body{padding:0}}
    </style></head><body>
    <div class="border"><div class="inner">
      <h1>SEBN TN</h1>
      <div class="sub">Sumitomo Electric Bordnetze Tunisia</div>
      <div class="certifie">Certifie que</div>
      <div class="name">${c.employeNom}</div>
      <div class="formation">a suivi et validé la formation</div>
      <div class="formation"><strong>${c.formationTitre}</strong></div>
      <div class="details">Émis le ${c.dateEmission} &nbsp;|&nbsp; N° ${c.numeroCertificat}</div>
      <div class="taux">Taux de présence : ${c.tauxPresence}%</div>
      <div class="footer">
        <div class="sig"><div class="sig-line"></div><div class="sig-label">Responsable Formation</div></div>
        <div class="sig"><div class="sig-line"></div><div class="sig-label">Directeur Général</div></div>
      </div>
    </div></div>
    <div class="num">${c.numeroCertificat}</div>
    </body></html>`);
    w.document.close(); w.print();
  };

  const filtered = certificats.filter(c=>!selForm||String(c.formationId)===selForm);

  return (
    <Layout title="Certificats" subtitle={`${certificats.length} certificat(s)`}>
      <div className="page-header">
        <div><h1>Certificats de formation</h1><p>{isResp()?'Générer et gérer les certificats':'Consulter et télécharger vos certificats'}</p></div>
      </div>

      {(isAdmin()||isResp()) && (
        <div className="card" style={{marginBottom:20}}>
          <div className="card-header"><h2>Générer un certificat</h2></div>
          <div style={{padding:20}}>
            <div style={{marginBottom:12,fontSize:'.86rem',color:'var(--gray-500)'}}>Sélectionnez une formation pour voir les participants éligibles et générer leurs certificats.</div>
            <select className="form-control" style={{maxWidth:360}} value={selForm} onChange={e=>setSelForm(e.target.value)}>
              <option value="">Toutes les formations</option>
              {formations.map(f=><option key={f.id} value={f.id}>{f.titre}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header"><h2>{isResp()?'Tous les certificats':'Mes certificats'}</h2></div>
        <div className="card-body table-wrapper">
          {loading ? <Spinner/> : filtered.length===0
            ? <div className="empty-state"><Award size={40}/><p>Aucun certificat{!isResp()?' — Complétez vos formations pour obtenir des certificats':''}</p></div>
            : <table>
                <thead><tr><th>N° Certificat</th><th>Employé</th><th>Formation</th><th>Date émission</th><th>Taux présence</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>{filtered.map(c=>(
                  <tr key={c.id}>
                    <td><span style={{fontFamily:'monospace',fontSize:'.74rem',background:'var(--gray-100)',padding:'2px 7px',borderRadius:5}}>{c.numeroCertificat?.slice(-12)}</span></td>
                    <td><strong>{c.employeNom}</strong></td>
                    <td style={{fontSize:'.83rem'}}>{c.formationTitre}</td>
                    <td style={{fontSize:'.82rem',color:'var(--gray-500)'}}>{c.dateEmission}</td>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div className="progress-bar" style={{width:80}}><div className="progress-fill" style={{width:`${c.tauxPresence||0}%`,background:c.tauxPresence>=75?'var(--success)':'var(--warning)'}}/></div>
                        <span style={{fontSize:'.82rem',fontWeight:600}}>{c.tauxPresence}%</span>
                      </div>
                    </td>
                    <td><span className="badge badge-success">{c.statut}</span></td>
                    <td><button className="btn btn-primary btn-sm" onClick={()=>printCert(c)}><Download size={13}/> Télécharger</button></td>
                  </tr>
                ))}</tbody>
              </table>
          }
        </div>
      </div>

      {(isAdmin()||isResp()) && selForm && (
        <div className="card section-gap">
          <div className="card-header"><h2>Générer pour les participants</h2></div>
          <GenerateurCertificats formationId={Number(selForm)} onGenere={load} saving={saving} generer={generer} certificats={certificats}/>
        </div>
      )}
    </Layout>
  );
}

function GenerateurCertificats({ formationId, onGenere, saving, generer, certificats }) {
  const [inscs, setInscs] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(()=>{ setLoading(true); inscriptionAPI.getByFormation(formationId).then(r=>setInscs(r.data)).catch(()=>{}).finally(()=>setLoading(false)); },[formationId]);
  if(loading) return <div style={{padding:20}}><span className="spinner-dark"/></div>;
  if(inscs.length===0) return <div className="empty-state" style={{padding:30}}><p>Aucun participant pour cette formation</p></div>;
  return (
    <div className="card-body table-wrapper">
      <table>
        <thead><tr><th>Employé</th><th>Statut inscription</th><th>Certificat</th></tr></thead>
        <tbody>{inscs.map(ins=>{
          const hasCert = certificats.some(c=>c.employeId===ins.employeId&&c.formationId===formationId);
          return (
            <tr key={ins.id}>
              <td><strong>{ins.employeNom}</strong></td>
              <td><span className={`badge ${ins.statut==='COMPLETE'?'badge-success':'badge-info'}`}>{ins.statut}</span></td>
              <td>{hasCert
                ? <span className="badge badge-success">✓ Généré</span>
                : <button className="btn btn-primary btn-sm" onClick={()=>generer(ins.employeId,formationId)} disabled={saving}><Plus size={13}/> Générer</button>}
              </td>
            </tr>
          );
        })}</tbody>
      </table>
    </div>
  );
}
