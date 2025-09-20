"use client";
import { useEffect, useState } from 'react';
import { AdminAPI } from '../../lib/adminApi';

export default function ServicesAdminClient(){
  const [cats, setCats] = useState([]);
  const [catForm, setCatForm] = useState({ name:'', slug:'', description:'', sortOrder:0, active:true });
  const [svcForm, setSvcForm] = useState({ categoryId:'', name:'', slug:'', description:'', isRemote:false, isOnsite:false, isWeb:false, payFirst:false, appointmentRequired:false, quoteRequired:false, sortOrder:0, active:true });
  const [priceForm, setPriceForm] = useState({ serviceId:'', label:'', amount:'', currency:'INR', active:true, badge:'' });
  async function load(){ const r = await AdminAPI.catalog(); setCats(r); }
  useEffect(()=>{ load(); }, []);
  const ucf = (k,v)=>setCatForm(s=>({...s,[k]:v}));
  const usf = (k,v)=>setSvcForm(s=>({...s,[k]:v}));
  const upf = (k,v)=>setPriceForm(s=>({...s,[k]:v}));
  async function saveCat(e){ e.preventDefault(); await AdminAPI.upsertCategory(catForm); setCatForm({ name:'', slug:'', description:'', sortOrder:0, active:true }); await load(); }
  async function saveSvc(e){ e.preventDefault(); await AdminAPI.upsertService({ ...svcForm, categoryId: Number(svcForm.categoryId)||null }); setSvcForm({ categoryId:'', name:'', slug:'', description:'', isRemote:false, isOnsite:false, isWeb:false, payFirst:false, appointmentRequired:false, quoteRequired:false, sortOrder:0, active:true }); await load(); }
  async function savePrice(e){ e.preventDefault(); await AdminAPI.upsertPrice({ ...priceForm, amount: priceForm.amount }); setPriceForm({ serviceId:'', label:'', amount:'', currency:'INR', active:true, badge:'' }); await load(); }
  return (
    <section className="section">
      <h1>Service Catalog</h1>
      <div className="grid" style={{marginBottom:'.75rem'}}>
        <div className="card">
          <h3>New Category</h3>
          <form onSubmit={saveCat}>
            <div className="field"><label>Name</label><input value={catForm.name} onChange={e=>ucf('name', e.target.value)} required /></div>
            <div className="field"><label>Slug</label><input value={catForm.slug} onChange={e=>ucf('slug', e.target.value)} required /></div>
            <div className="field"><label>Description</label><input value={catForm.description} onChange={e=>ucf('description', e.target.value)} /></div>
            <div className="field"><label>Sort</label><input type="number" value={catForm.sortOrder} onChange={e=>ucf('sortOrder', Number(e.target.value))} /></div>
            <div className="field"><label><input type="checkbox" checked={catForm.active} onChange={e=>ucf('active', e.target.checked)} /> Active</label></div>
            <button type="submit">Save Category</button>
          </form>
        </div>
        <div className="card">
          <h3>New Service</h3>
          <form onSubmit={saveSvc}>
            <div className="field"><label>Category</label>
              <select value={svcForm.categoryId} onChange={e=>usf('categoryId', e.target.value)}>
                <option value="">—</option>
                {cats.map(c=>(<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div className="field"><label>Name</label><input value={svcForm.name} onChange={e=>usf('name', e.target.value)} required /></div>
            <div className="field"><label>Slug</label><input value={svcForm.slug} onChange={e=>usf('slug', e.target.value)} required /></div>
            <div className="field"><label>Description</label><input value={svcForm.description} onChange={e=>usf('description', e.target.value)} /></div>
            <div className="badges" style={{margin:'.5rem 0'}}>
              <label className="badge"><input type="checkbox" checked={svcForm.isRemote} onChange={e=>usf('isRemote', e.target.checked)} /> Remote</label>
              <label className="badge"><input type="checkbox" checked={svcForm.isOnsite} onChange={e=>usf('isOnsite', e.target.checked)} /> Onsite</label>
              <label className="badge"><input type="checkbox" checked={svcForm.isWeb} onChange={e=>usf('isWeb', e.target.checked)} /> Web</label>
              <label className="badge"><input type="checkbox" checked={svcForm.payFirst} onChange={e=>usf('payFirst', e.target.checked)} /> Pay‑first</label>
              <label className="badge"><input type="checkbox" checked={svcForm.appointmentRequired} onChange={e=>usf('appointmentRequired', e.target.checked)} /> Appointment</label>
              <label className="badge"><input type="checkbox" checked={svcForm.quoteRequired} onChange={e=>usf('quoteRequired', e.target.checked)} /> Quote</label>
              <label className="badge"><input type="checkbox" checked={svcForm.active} onChange={e=>usf('active', e.target.checked)} /> Active</label>
            </div>
            <div className="field"><label>Sort</label><input type="number" value={svcForm.sortOrder} onChange={e=>usf('sortOrder', Number(e.target.value))} /></div>
            <button type="submit">Save Service</button>
          </form>
        </div>
        <div className="card">
          <h3>New Price</h3>
          <form onSubmit={savePrice}>
            <div className="field"><label>Service</label>
              <select value={priceForm.serviceId} onChange={e=>upf('serviceId', e.target.value)}>
                <option value="">—</option>
                {cats.flatMap(c=>c.services).map(s=>(<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
            </div>
            <div className="field"><label>Label</label><input value={priceForm.label} onChange={e=>upf('label', e.target.value)} required /></div>
            <div className="field"><label>Amount</label><input value={priceForm.amount} onChange={e=>upf('amount', e.target.value)} required /></div>
            <div className="field"><label>Badge</label><input value={priceForm.badge} onChange={e=>upf('badge', e.target.value)} /></div>
            <div className="field"><label><input type="checkbox" checked={priceForm.active} onChange={e=>upf('active', e.target.checked)} /> Active</label></div>
            <button type="submit">Save Price</button>
          </form>
        </div>
      </div>
      <div className="card">
        <h3>Current Catalog</h3>
        <div className="grid">
          {cats.map(c => (
            <div key={c.id} className="card">
              <strong>{c.name}</strong> <span className="badge">{c.active?'Active':'Hidden'}</span>
              {(c.services||[]).map(s => (
                <div key={s.id} className="card" style={{marginTop:'.5rem'}}>
                  <div><strong>{s.name}</strong> {(s.isRemote||s.isOnsite||s.isWeb) && <span className="muted">[{[s.isRemote?'Remote':null,s.isOnsite?'Onsite':null,s.isWeb?'Web':null].filter(Boolean).join(', ')}]</span>}</div>
                  <div className="muted">{s.description}</div>
                  {(s.prices||[]).map(p => (<div key={p.id} className="muted">• {p.label}: ₹{Number(p.amount).toFixed(2)} {p.badge?`(${p.badge})`:''}</div>))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

