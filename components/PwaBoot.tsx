'use client';
import {useEffect,useState} from 'react';

export default function PwaBoot(){
  const [online,setOnline]=useState(true);
  const [cached,setCached]=useState(false);
  useEffect(()=>{
    setOnline(navigator.onLine);
    let active=true;
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('/sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{
        if(active)setCached(true);
      }).catch(()=>{if(active)setCached(false)});
    }
    const update=()=>setOnline(navigator.onLine);
    window.addEventListener('online',update);
    window.addEventListener('offline',update);
    return()=>{active=false;window.removeEventListener('online',update);window.removeEventListener('offline',update)};
  },[]);
  return <div role="status" aria-live="polite" className={online?'net online':'net offline'}>
    {online?'Online':cached?'Offline · check-ins available on this device':'Offline · reconnect to load AURA'}
  </div>;
}
