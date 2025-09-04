import React, { useEffect, useState } from 'react';
import Collab from '@/Collab.jsx';
import { useAuth } from '@/App.jsx';

function storageKey(uid){ return `cn_projects_${uid}`; }

export default function Dashboard(){
  const {user} = useAuth();
  const [projects,setProjects] = useState([]);
  const [name,setName] = useState('');
  useEffect(()=> {
    if(!user) return;
    const raw = localStorage.getItem(storageKey(user.uid));
    setProjects(raw ? JSON.parse(raw) : []);
  },[user]);
  function create(){
    if(!name) return;
    const id = Math.random().toString(36).slice(2,9);
    const p = { id, name, created: Date.now() };
    const next = [...projects, p];
    setProjects(next);
    localStorage.setItem(storageKey(user.uid), JSON.stringify(next));
    setName('');
  }
  return (
    <div>
      <div className='card mb-4'>
        <h3 className='text-lg font-semibold'>Your Projects</h3>
        <div className='mt-2 flex gap-2'>
          <input className='border p-2 rounded flex-1' placeholder='New project name' value={name} onChange={e=>setName(e.target.value)} />
          <button className='btn' onClick={create}>Create</button>
        </div>
        <div className='mt-4 grid gap-3'>
          {projects.length===0 && <div className='text-sm opacity-70'>No projects yet.</div>}
          {projects.map(p=>(
            <div key={p.id} className='p-3 rounded border flex items-center justify-between'>
              <div>
                <div className='font-medium'>{p.name}</div>
                <div className='text-xs opacity-60'>ID: {p.id}</div>
              </div>
              <div className='flex gap-2'>
                <a className='btn' href={`#project=${p.id}`}>Open</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Collab />
    </div>
  );
}
