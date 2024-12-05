// src/App.js
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
   Controls,
   Background,
   applyEdgeChanges,
   applyNodeChanges,
   addEdge,
   useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { BLOCK_TYPES, computeNodeOutput } from './data/blockTypes';
import LogicNode from './components/LogicNode';
import CustomEdge from './components/CustomEdge';
import SettingsPanel from './components/SettingsPanel';
import SimulationControls from './components/SimulationControls';

const nodeTypes = {
   logicNode: LogicNode,
};

const edgeTypes = {
   custom: CustomEdge,
};

const defaultEdgeOptions = {
   animated: true,
   style: {
       stroke: '#999',
   },
};

function App() {
   const [nodes, setNodes] = useState([]);
   const [edges, setEdges] = useState([]);
   const [selectedNode, setSelectedNode] = useState(null);
   const [signalStates, setSignalStates] = useState({});
   const [simulationState, setSimulationState] = useState({
       angle: 0,
       distance: 0,
       altitude: 0,
       speed: 0
   });

   const { project } = useReactFlow();

   const updateSimulation = useCallback((newState) => {
       setSimulationState(newState);
   }, []);

   const onNodesChange = useCallback((changes) => {
       setNodes((nds) => {
           const updatedNodes = applyNodeChanges(changes, nds);
           const removedNodes = changes
               .filter(change => change.type === 'remove')
               .map(change => change.id);
           
           if (removedNodes.length > 0) {
               setEdges(eds => eds.filter(edge => 
                   !removedNodes.includes(edge.source) && 
                   !removedNodes.includes(edge.target)
               ));
               if (removedNodes.includes(selectedNode?.id)) {
                   setSelectedNode(null);
               }
           }
           return updatedNodes;
       });
   }, [selectedNode]);

   const onEdgesChange = useCallback(
       (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
       []
   );

   const onConnect = useCallback((connection) => {
       // Check if target already has inputs
       const targetInputs = edges.filter(edge => edge.target === connection.target);
       if (targetInputs.length > 0) return;

       // Check if source is already connected to this target
       const existingConnection = edges.find(edge => 
           edge.source === connection.source && 
           edge.target === connection.target
       );
       if (existingConnection) return;

       setEdges((eds) => addEdge({
           ...connection,
           type: 'custom',
           data: { value: 0 }
       }, eds));
   }, [edges]);

   const onNodeClick = useCallback((event, node) => {
       setSelectedNode(node);
   }, []);

   const onBackgroundClick = useCallback(() => {
       setSelectedNode(null);
   }, []);

   const updateNodeData = useCallback((nodeId, newData) => {
       setNodes((nds) => {
           return nds.map((node) => {
               if (node.id === nodeId) {
                   const updatedNode = {
                       ...node,
                       data: newData
                   };
                   setSelectedNode(updatedNode);
                   return updatedNode;
               }
               return node;
           });
       });
   }, []);

   const handleKeyPress = useCallback((event) => {
       // Don't trigger if typing in an input
       if (event.target.tagName === 'INPUT') return;

       // Handle deletion
       if (event.key === 'Delete' || event.key === 'Backspace') {
           if (selectedNode) {
               setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
               setEdges((eds) => eds.filter((edge) => 
                   edge.source !== selectedNode.id && 
                   edge.target !== selectedNode.id
               ));
               setSelectedNode(null);
           }
           return;
       }

       const key = event.key.toUpperCase();
       const isKeyDown = event.type === 'keydown';
       
       setNodes(currentNodes => 
           currentNodes.map(node => {
               const settings = node.data.settings;
               if (settings.greenKeybind === key || settings.redKeybind === key) {
                   const isGreenKey = settings.greenKeybind === key;
                   const toggleSetting = isGreenKey ? 'greenToggle' : 'redToggle';
                   
                   if (settings[toggleSetting]) {
                       if (isKeyDown && !event.repeat) {
                           return {
                               ...node,
                               data: {
                                   ...node.data,
                                   isActive: !node.data.isActive
                               }
                           };
                       }
                   } else {
                       return {
                           ...node,
                           data: {
                               ...node.data,
                               isActive: isKeyDown
                           }
                       };
                   }
               }
               return node;
           })
       );
   }, [selectedNode]);

   useEffect(() => {
       window.addEventListener('keydown', handleKeyPress);
       window.addEventListener('keyup', handleKeyPress);
       return () => {
           window.removeEventListener('keydown', handleKeyPress);
           window.removeEventListener('keyup', handleKeyPress);
       };
   }, [handleKeyPress]);

   const onDragOver = useCallback((event) => {
       event.preventDefault();
       event.dataTransfer.dropEffect = 'move';
   }, []);

   const onDrop = useCallback((event) => {
       event.preventDefault();

       const blockType = event.dataTransfer.getData('application/blockType');
       if (!blockType) return;

       const reactFlowBounds = document.querySelector('.react-flow__renderer').getBoundingClientRect();
       const position = project({
           x: event.clientX - reactFlowBounds.left,
           y: event.clientY - reactFlowBounds.top,
       });

       const newNode = {
           id: `${blockType}-${nodes.length + 1}`,
           type: 'logicNode',
           position,
           data: {
               blockType,
               settings: { ...BLOCK_TYPES[blockType].settings },
               isActive: false
           },
       };

       setNodes((nds) => [...nds, newNode]);
   }, [nodes, project]);

   const propagateSignals = useCallback(() => {
       const newSignalStates = {};
       const processedNodes = new Set();

       const processNode = (nodeId) => {
           if (processedNodes.has(nodeId)) return;

           const node = nodes.find(n => n.id === nodeId);
           if (!node) return;

           const inputEdges = edges.filter(e => e.target === nodeId);
           const inputValues = inputEdges.map(e => signalStates[e.source] || 0);

           const output = computeNodeOutput(node, inputValues, edges, simulationState);
           newSignalStates[nodeId] = output;

           processedNodes.add(nodeId);

           edges
               .filter(e => e.source === nodeId)
               .forEach(e => processNode(e.target));
       };

       nodes
           .filter(n => !edges.some(e => e.target === n.id))
           .forEach(n => processNode(n.id));

       setSignalStates(newSignalStates);

       setEdges(eds =>
           eds.map(edge => ({
               ...edge,
               data: {
                   ...edge.data,
                   value: newSignalStates[edge.source] || 0
               }
           }))
       );
   }, [nodes, edges, simulationState]);

   useEffect(() => {
       propagateSignals();
   }, [nodes, edges, propagateSignals]);

   return (
       <div className="app-container">
           <div className="sidebar">
               <h2>Logic Blocks</h2>
               <div className="block-categories">
                   {Object.entries(BLOCK_TYPES).map(([type, info]) => (
                       <div
                           key={type}
                           className="block-item"
                           draggable
                           onDragStart={(e) => {
                               e.dataTransfer.setData('application/blockType', type);
                           }}
                       >
                           {info.name}
                       </div>
                   ))}
               </div>
           </div>

           <div className="flow-container">
               <SimulationControls updateSimulation={updateSimulation} />
               <ReactFlow
                   nodes={nodes}
                   edges={edges}
                   onNodesChange={onNodesChange}
                   onEdgesChange={onEdgesChange}
                   onConnect={onConnect}
                   onNodeClick={onNodeClick}
                   onPaneClick={onBackgroundClick}
                   onDragOver={onDragOver}
                   onDrop={onDrop}
                   nodeTypes={nodeTypes}
                   edgeTypes={edgeTypes}
                   defaultEdgeOptions={defaultEdgeOptions}
                   deleteKeyCode={null}
                   fitView
               >
                   <Background />
                   <Controls />
               </ReactFlow>
           </div>

           <SettingsPanel
               selectedNode={selectedNode}
               updateNodeData={updateNodeData}
           />
       </div>
   );
}

export default App;