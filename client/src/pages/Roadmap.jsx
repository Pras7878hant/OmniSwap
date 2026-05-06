import { useCallback, useState, useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Panel } from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
// Template-----------
const TEMPLATES = {
     Corporate: {
          "TCS NQT (Ninja & Digital)": {
               nodes: [
                    { id: 'tcs1', position: { x: 250, y: 50 }, data: { label: 'Round 1: Foundation Section' }, className: 'border-2 border-purple-500 font-bold' },
                    { id: 'tcs2', position: { x: 250, y: 150 }, data: { label: 'Traits, Numerical, Verbal, Reasoning' }, className: 'text-xs bg-purple-50' },
                    { id: 'tcs3', position: { x: 250, y: 250 }, data: { label: 'Round 2: Advanced Section' }, className: 'border-2 border-purple-500 font-bold' },
                    { id: 'tcs4', position: { x: 100, y: 350 }, data: { label: 'Advanced Quants & Logic' }, className: 'text-xs' },
                    { id: 'tcs5', position: { x: 400, y: 350 }, data: { label: 'Advanced Coding (2 Questions)' }, className: 'text-xs' },
                    { id: 'tcs6', position: { x: 250, y: 450 }, data: { label: 'Round 3: Technical Interview' }, style: { backgroundColor: '#8b5cf6', color: 'white' } },
                    { id: 'tcs7', position: { x: 250, y: 550 }, data: { label: 'Round 4: HR / Managerial' }, style: { backgroundColor: '#10b981', color: 'white', fontWeight: 'bold' } },
               ],
               edges: [
                    { id: 'e-tcs1', source: 'tcs1', target: 'tcs2' },
                    { id: 'e-tcs2', source: 'tcs2', target: 'tcs3', animated: true },
                    { id: 'e-tcs3', source: 'tcs3', target: 'tcs4' },
                    { id: 'e-tcs4', source: 'tcs3', target: 'tcs5' },
                    { id: 'e-tcs5', source: 'tcs4', target: 'tcs6', animated: true },
                    { id: 'e-tcs6', source: 'tcs5', target: 'tcs6', animated: true },
                    { id: 'e-tcs7', source: 'tcs6', target: 'tcs7', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
               ]
          },
          "Accenture Hiring Process": {
               nodes: [
                    { id: 'acc1', position: { x: 250, y: 50 }, data: { label: 'Round 1: Cognitive & Technical' }, className: 'border-2 border-blue-500 font-bold' },
                    { id: 'acc2', position: { x: 250, y: 150 }, data: { label: 'English, Critical Reasoning, MS Office' }, className: 'text-xs bg-blue-50' },
                    { id: 'acc3', position: { x: 250, y: 250 }, data: { label: 'Round 2: Coding Assessment (45m)' }, className: 'border-2 border-blue-500 font-bold' },
                    { id: 'acc4', position: { x: 250, y: 350 }, data: { label: 'Round 3: Communication Test' }, style: { backgroundColor: '#3b82f6', color: 'white' } },
                    { id: 'acc5', position: { x: 250, y: 450 }, data: { label: 'Round 4: Tech + HR Interview' }, style: { backgroundColor: '#10b981', color: 'white', fontWeight: 'bold' } },
               ],
               edges: [
                    { id: 'e-acc1', source: 'acc1', target: 'acc2' },
                    { id: 'e-acc2', source: 'acc2', target: 'acc3', animated: true },
                    { id: 'e-acc3', source: 'acc3', target: 'acc4', animated: true },
                    { id: 'e-acc4', source: 'acc4', target: 'acc5', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
               ]
          },
          "HCLTech First Careers": {
               nodes: [
                    { id: 'hcl1', position: { x: 250, y: 50 }, data: { label: 'Round 1: Aptitude Test' }, className: 'border-2 border-sky-500 font-bold' },
                    { id: 'hcl2', position: { x: 250, y: 150 }, data: { label: 'Quants, Logical, Verbal' }, className: 'text-xs' },
                    { id: 'hcl3', position: { x: 250, y: 250 }, data: { label: 'Round 2: Domain/IT Test' }, className: 'border-2 border-sky-500 font-bold' },
                    { id: 'hcl4', position: { x: 250, y: 350 }, data: { label: 'Round 3: Technical Interview' }, style: { backgroundColor: '#0ea5e9', color: 'white' } },
                    { id: 'hcl5', position: { x: 250, y: 450 }, data: { label: 'Round 4: HR Discussion' }, style: { backgroundColor: '#10b981', color: 'white', fontWeight: 'bold' } },
               ],
               edges: [
                    { id: 'e-hcl1', source: 'hcl1', target: 'hcl2' },
                    { id: 'e-hcl2', source: 'hcl2', target: 'hcl3', animated: true },
                    { id: 'e-hcl3', source: 'hcl3', target: 'hcl4', animated: true },
                    { id: 'e-hcl4', source: 'hcl4', target: 'hcl5', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
               ]
          }
     },
     Technologies: {
          "Data Science & ML": {
               nodes: [
                    { id: 'ds1', position: { x: 250, y: 50 }, data: { label: 'Mathematics & Statistics' }, className: 'border-2 border-orange-500 font-bold' },
                    { id: 'ds2', position: { x: 250, y: 150 }, data: { label: 'Python Programming' } },
                    { id: 'ds3', position: { x: 250, y: 250 }, data: { label: 'Data Manipulation (Pandas, SQL)' }, style: { backgroundColor: '#f97316', color: 'white' } },
                    { id: 'ds4', position: { x: 100, y: 350 }, data: { label: 'Machine Learning (Scikit)' }, style: { backgroundColor: '#ea580c', color: 'white' } },
                    { id: 'ds5', position: { x: 400, y: 350 }, data: { label: 'Deep Learning (PyTorch/TF)' }, style: { backgroundColor: '#ea580c', color: 'white' } },
                    { id: 'ds6', position: { x: 250, y: 450 }, data: { label: 'Target: Data Scientist Role' }, style: { backgroundColor: '#10b981', color: 'white', fontWeight: 'bold' } },
               ],
               edges: [
                    { id: 'e-ds1', source: 'ds1', target: 'ds2' },
                    { id: 'e-ds2', source: 'ds2', target: 'ds3' },
                    { id: 'e-ds3', source: 'ds3', target: 'ds4', animated: true },
                    { id: 'e-ds4', source: 'ds3', target: 'ds5', animated: true },
                    { id: 'e-ds5', source: 'ds4', target: 'ds6', animated: true, style: { stroke: '#10b981' } },
                    { id: 'e-ds6', source: 'ds5', target: 'ds6', animated: true, style: { stroke: '#10b981' } },
               ]
          },
          "Web Dev (MERN Stack)": {
               nodes: [
                    { id: 'm1', position: { x: 250, y: 50 }, data: { label: 'HTML, CSS & JavaScript (ES6+)' }, className: 'border-2 border-indigo-500 font-bold' },
                    { id: 'm2', position: { x: 100, y: 150 }, data: { label: 'Frontend: React.js' }, style: { backgroundColor: '#61dafb' } },
                    { id: 'm3', position: { x: 400, y: 150 }, data: { label: 'Backend: Node.js & Express' }, style: { backgroundColor: '#8cc84b' } },
                    { id: 'm4', position: { x: 400, y: 250 }, data: { label: 'Database: MongoDB' }, style: { backgroundColor: '#47a248', color: 'white' } },
                    { id: 'm5', position: { x: 250, y: 350 }, data: { label: 'Goal: Full Stack Developer' }, style: { backgroundColor: '#10b981', color: 'white', fontWeight: 'bold' } },
               ],
               edges: [
                    { id: 'em1-2', source: 'm1', target: 'm2' },
                    { id: 'em1-3', source: 'm1', target: 'm3' },
                    { id: 'em3-4', source: 'm3', target: 'm4' },
                    { id: 'em2-5', source: 'm2', target: 'm5', animated: true },
                    { id: 'em4-5', source: 'm4', target: 'm5', animated: true },
               ]
          }
     }
};

const ExamRoadmap = () => {
     const [nodes, setNodes, onNodesChange] = useNodesState([]);
     const [edges, setEdges, onEdgesChange] = useEdgesState([]);

     const [customNodeName, setCustomNodeName] = useState("");
     const [roadmapTitle, setRoadmapTitle] = useState("My Custom Roadmap");
     const [isPublic, setIsPublic] = useState(false);

     useEffect(() => {
          const savedData = localStorage.getItem('userRoadmap');
          if (savedData) {
               const parsed = JSON.parse(savedData);
               setNodes(parsed.nodes || []);
               setEdges(parsed.edges || []);
               setRoadmapTitle(parsed.title || "My Custom Roadmap");
               setIsPublic(parsed.isPublic || false);
          } else {
               // default
               setNodes(TEMPLATES.Corporate["TCS NQT (Ninja & Digital)"].nodes);
               setEdges(TEMPLATES.Corporate["TCS NQT (Ninja & Digital)"].edges);
               setRoadmapTitle("TCS NQT (Ninja & Digital)");
          }
     }, [setNodes, setEdges]);

     const onConnect = useCallback(
          (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#4f46e5', strokeWidth: 2 } }, eds)),
          [setEdges]
     );

     const handleAddCustomNode = (isGoal = false) => {
          if (!customNodeName.trim()) return;
          const newNode = {
               id: `node_${Date.now()}`,
               position: { x: Math.random() * 100 + 50, y: 50 },
               data: { label: customNodeName },
               style: isGoal
                    ? { backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', border: 'none' }
                    : { backgroundColor: '#ffffff', border: '1px solid #cbd5e1' }
          };
          setNodes((nds) => [...nds, newNode]);
          setCustomNodeName("");
     };

     const loadTemplate = (category, templateName) => {
          if (window.confirm(`Load ${templateName} template? This will clear your current canvas.`)) {
               setNodes(TEMPLATES[category][templateName].nodes);
               setEdges(TEMPLATES[category][templateName].edges);
               setRoadmapTitle(templateName);
          }
     };

     // save function
     const handleSave = async () => {
          const payload = {
               title: roadmapTitle,
               nodes,
               edges,
               isPublic
          };

          try {
               const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

               const response = await axios.post(`${BASE_URL}/roadmaps/save`, payload);

               if (response.data.success) {
                    alert(`Saved to Database! ${isPublic ? "🌎 Visible to the community." : "🔒 Private to you."}`);


                    localStorage.setItem('userRoadmap', JSON.stringify(payload));
               }
          } catch (error) {
               console.error("Failed to save roadmap:", error);
               alert("❌ Error saving to the database. Check your backend console.");
          }
     };

     return (
          <div className="flex w-full h-screen bg-slate-50">

               {/* left sidebar*/}
               <div className="w-80 h-full bg-white border-r border-slate-200 p-6 flex flex-col gap-5 overflow-y-auto shadow-md z-10 custom-scrollbar">

                    {/* Database Controls */}
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                         <input
                              type="text"
                              value={roadmapTitle}
                              onChange={(e) => setRoadmapTitle(e.target.value)}
                              className="w-full text-lg font-bold text-slate-800 mb-3 border-b-2 border-indigo-200 focus:border-indigo-600 focus:outline-none bg-transparent"
                              placeholder="Roadmap Title..."
                         />
                         <label className="flex items-center gap-2 text-sm text-slate-700 mb-4 cursor-pointer font-medium">
                              <input
                                   type="checkbox"
                                   checked={isPublic}
                                   onChange={(e) => setIsPublic(e.target.checked)}
                                   className="rounded text-indigo-600 w-4 h-4"
                              />
                              Publish to Community Hub
                         </label>
                         <button onClick={handleSave} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-bold shadow-md transition-all active:scale-95">
                              💾 Save to Database
                         </button>
                    </div>

                    <hr className="border-slate-200" />

                    {/* Dynamic Node*/}
                    <div>
                         <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">➕ Add Custom Node</h3>
                         <input
                              type="text"
                              value={customNodeName}
                              onChange={(e) => setCustomNodeName(e.target.value)}
                              placeholder="e.g., Learn AWS, Pass Exam..."
                              className="w-full p-2 text-sm border rounded-lg mb-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomNode()}
                         />
                         <div className="flex gap-2">
                              <button onClick={() => handleAddCustomNode(false)} className="flex-1 bg-white border border-slate-300 py-1.5 text-xs font-bold text-slate-600 rounded-md hover:bg-slate-50 shadow-sm">
                                   Add Step
                              </button>
                              <button onClick={() => handleAddCustomNode(true)} className="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-200 py-1.5 text-xs font-bold rounded-md hover:bg-emerald-100 shadow-sm">
                                   Add Target
                              </button>
                         </div>
                    </div>

                    <hr className="border-slate-200" />

                    {Object.keys(TEMPLATES).map(category => (
                         <div key={category}>
                              <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">🏢 {category} Templates</h3>
                              <div className="flex flex-col gap-2">
                                   {Object.keys(TEMPLATES[category]).map((templateName) => (
                                        <button
                                             key={templateName}
                                             onClick={() => loadTemplate(category, templateName)}
                                             className="text-left px-3 py-2 text-sm bg-slate-800 text-slate-100 font-medium rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
                                        >
                                             {templateName}
                                        </button>
                                   ))}
                              </div>
                         </div>
                    ))}
               </div>

               {/* right canvas*/}
               <div className="flex-1 h-full relative">
                    <ReactFlow
                         nodes={nodes}
                         edges={edges}
                         onNodesChange={onNodesChange}
                         onEdgesChange={onEdgesChange}
                         onConnect={onConnect}
                         fitView
                    >
                         <Controls />
                         <MiniMap nodeColor={(n) => n.style?.backgroundColor || '#cbd5e1'} />
                         <Background variant="dots" gap={16} size={1} />
                         <Panel position="top-right" className="bg-white/90 p-3 rounded-lg shadow-lg text-xs text-slate-600 font-medium border border-slate-200">
                              🖱️ Drag nodes to reorganize.<br />
                              🔗 Drag between handles to connect.<br />
                              ❌ Select node + Backspace to delete.
                         </Panel>
                    </ReactFlow>
               </div>
          </div>
     );
};

export default ExamRoadmap;