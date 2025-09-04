import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/firebase.js';

export default function Register(){
  const [email,setEmail]=useState(''); const [pw,setPw]=useState(''); const [name,setName]=useState(''); const [err,setErr]=useState('');
  async function onSubmit(e){
    e.preventDefault();
    try{
      const u = await createUserWithEmailAndPassword(auth,email,pw);
      if(name) await updateProfile(u.user, { displayName: name });
    }catch(err){ setErr(err.message); }
  }
  return (
    <div className='card'>
      <h2 className='text-xl font-semibold mb-3'>Register</h2>
      {err && <div className='mb-2 text-red-500'>{err}</div>}
      <form onSubmit={onSubmit} className='flex flex-col gap-3'>
        <input className='border p-2 rounded' placeholder='Full name' value={name} onChange={e=>setName(e.target.value)} />
        <input className='border p-2 rounded' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input type='password' className='border p-2 rounded' placeholder='Password' value={pw} onChange={e=>setPw(e.target.value)} />
        <button className='btn bg-green-600' type='submit'>Create account</button>
      </form>
    </div>
  );
}
