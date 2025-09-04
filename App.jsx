import React, { useEffect, useState, useContext, createContext } from 'react';
import Login from '@/Login.jsx';
import Register from '@/Register.jsx';
import Dashboard from '@/Dashboard.jsx';
import { auth } from '@/firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext(null);
export function useAuth(){ return useContext(AuthContext); }

export default function App(){
  const [user,setUser] = useState(null);
  const [page,setPage] = useState('login');
  useEffect(()=>{ const unsub=onAuthStateChanged(auth,u=>setUser(u)); return unsub; },[]);
  if(user){
    return (
      <AuthContext.Provider value={{user}}>
        <div className='header'>
          <div className='flex items-center gap-3'><h1 className='text-xl font-bold'>CollabNote Pro</h1></div>
          <div className='flex items-center gap-3'>
            <div className='small'>Hi, {user.displayName || user.email}</div>
            <button className='btn bg-red-600' onClick={()=>signOut(auth)}>Logout</button>
          </div>
        </div>
        <div className='container'><Dashboard /></div>
      </AuthContext.Provider>
    )
  }
  return (
    <div className='p-6 max-w-md mx-auto'>
      {page==='login' ? <Login /> : <Register />}
      <div className='mt-4 text-center'>
        {page==='login' ? (
          <button className='text-blue-500' onClick={()=>setPage('register')}>Create an account</button>
        ) : (
          <button className='text-blue-500' onClick={()=>setPage('login')}>Already have an account? Login</button>
        )}
      </div>
    </div>
  );
}
