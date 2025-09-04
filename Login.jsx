import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/firebase.js';

export default function Login(){
  const [email,setEmail]=useState(''); const [pw,setPw]=useState(''); const [err,setErr]=useState('');
  async function onSubmit(e){
    e.preventDefault();
    try{ await signInWithEmailAndPassword(auth,email,pw); }catch(err){ setErr(err.message); }
  }
  async function google(){
    try{ await signInWithPopup(auth, googleProvider); }catch(e){ setErr(e.message); }
  }
  return (
    <div className='card'>
      <h2 className='text-xl font-semibold mb-3'>Login</h2>
      {err && <div className='mb-2 text-red-500'>{err}</div>}
      <form onSubmit={onSubmit} className='flex flex-col gap-3'>
        <input className='border p-2 rounded' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input type='password' className='border p-2 rounded' placeholder='Password' value={pw} onChange={e=>setPw(e.target.value)} />
        <button className='btn' type='submit'>Login with Email</button>
      </form>
      <div className='mt-4'>
        <button className='btn' onClick={google}>Sign in with Google</button>
      </div>
    </div>
  );
}
