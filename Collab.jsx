import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import { ReactFlowProvider, addEdge, MiniMap, Controls, Background, ReactFlow } from 'react-flow-renderer';
import html2canvas from 'html2canvas';

export default function Collab(){
  const [projectId, setProjectId] = useState(null);
  useEffect(()=>{
    function check(){ const m = /#project=([A-Za-z0-9-]+)/.exec(window.location.hash); setProjectId(m?m[1]:null); }
    window.addEventListener('hashchange', check); check();
    return ()=>window.removeEventListener('hashchange', check);
  },[]);
  if(!projectId) return null;

  // Rich text
  const [value, setValue] = useState('<h3>Notes</h3><p>Start typing...</p>');

  // React Flow
  const [nodes, setNodes] = useState([
    { id: '1', position: { x: 50, y: 50 }, data: { label: 'Start' } },
    { id: '2', position: { x: 250, y: 100 }, data: { label: 'Plan' } },
  ]);
  const [edges, setEdges] = useState([]);

  function onConnect(params){ setEdges(es => addEdge(params, es)); }

  // media
  const [media, setMedia] = useState([]); // {id, type, src}

  function handleFile(e, type){
    const f = e.target.files?.[0];
    if(!f) return;
    const r = new FileReader();
    r.onload = () => setMedia(m=>[...m, { id: Date.now(), type, src: r.result }]);
    r.readAsDataURL(f);
  }

  // theme
  function toggleTheme(){ document.documentElement.classList.toggle('dark'); }

  // screenshot
  const rootRef = useRef(null);
  function screenshot(){
    if(!rootRef.current) return;
    html2canvas(rootRef.current).then(canvas=>{
      const a = document.createElement('a'); a.href = canvas.toDataURL(); a.download = `collab-${projectId}.png`; a.click();
    });
  }

  return (
    <div ref={rootRef} className='card'>
      <h2 className='text-lg font-semibold mb-2'>Project: {projectId}</h2>
      <div className='mb-4 flex gap-2'>
        <button className='btn' onClick={toggleTheme}>Toggle Theme</button>
        <button className='btn bg-green-600' onClick={screenshot}>Screenshot</button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='p-3 rounded border'>
          <h3 className='font-medium mb-2'>Rich Text Notes</h3>
          <ReactQuill theme='snow' value={value} onChange={setValue} className='editor' />
        </div>

        <div className='p-3 rounded border'>
          <h3 className='font-medium mb-2'>Structure / Diagram</h3>
          <ReactFlowProvider>
            <div style={{height:300, border:'1px solid #e5e7eb', borderRadius:8}}>
              <ReactFlow nodes={nodes} edges={edges} onConnect={onConnect} fitView>
                <MiniMap />
                <Controls />
                <Background />
              </ReactFlow>
            </div>
            <div className='mt-2 flex gap-2'>
              <button className='btn' onClick={()=> setNodes(n=>[...n, { id: Date.now().toString(), position:{x:100, y:200}, data:{label:'Node'} }])}>Add Node</button>
              <button className='btn bg-red-600' onClick={()=>{ setNodes([]); setEdges([]); }}>Clear</button>
            </div>
          </ReactFlowProvider>
        </div>
      </div>

      <div className='mt-4 p-3 rounded border'>
        <h3 className='font-medium mb-2'>Media</h3>
        <div className='flex gap-2 mb-2'>
          <input type='file' accept='image/*' onChange={(e)=>handleFile(e,'image')} />
          <input type='file' accept='video/*' onChange={(e)=>handleFile(e,'video')} />
          <input type='file' accept='audio/*' onChange={(e)=>handleFile(e,'audio')} />
        </div>
        <div className='preview-media grid gap-3'>
          {media.map(m=>(
            <div key={m.id} className='p-2 border rounded'>
              {m.type==='image' && <img src={m.src} alt='img' />}
              {m.type==='video' && <video src={m.src} controls />}
              {m.type==='audio' && <audio src={m.src} controls />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
