import { useState, useCallback, useMemo } from 'react';
import ReactFlow, { Background, Controls, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import InputNode from './InputNode';
import ResultNode from './ResultNode';

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];
const API_BASE_URL = ('http://localhost:5000').replace(/\/$/, '');

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Define custom node types
  const nodeTypes = useMemo(() => ({ inputNode: InputNode, resultNode: ResultNode }), []);

  // Initialize nodes. Notice how we pass state and the onChange handler via the `data` prop.
  const [nodes, setNodes] = useState([
    {
      id: '1',
      type: 'inputNode',
      position: { x: 100, y: 200 },
      data: { promptText: prompt, onChange: setPrompt },
    },
    {
      id: '2',
      type: 'resultNode',
      position: { x: 500, y: 200 },
      data: { responseText: response },
    },
  ]);

  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  // Run Flow Logic
  const handleRunFlow = async () => {
    if (!prompt) return;
    setLoading(true);
    setResponse('Thinking...');
    updateResultNode('Thinking...');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/ask-ai`, { prompt });
      setResponse(res.data.answer);
      updateResultNode(res.data.answer);
    } catch (error) {
      console.error(error);
      const errorData = error?.response?.data;
      const errorMsg =
        (errorData?.error && errorData?.hint)
          ? `${errorData.error} ${errorData.hint}`
          : errorData?.error ||
            "Error fetching AI response.";
      setResponse(errorMsg);
      updateResultNode(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Save Logic
  const handleSave = async () => {
    if (!prompt || !response || response === 'Thinking...') return alert('Run the flow first!');
    try {
      await axios.post(`${API_BASE_URL}/api/save`, { prompt, response });
      alert('Saved to MongoDB successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save.');
    }
  };

  // Helper to update the React Flow Result Node
  const updateResultNode = (newText) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '2') {
          node.data = { ...node.data, responseText: newText };
        }
        return node;
      })
    );
  };

  // Keep the Input Node's data in sync when `prompt` state changes
  useMemo(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '1') {
          node.data = { ...node.data, promptText: prompt, onChange: setPrompt };
        }
        return node;
      })
    );
  }, [prompt]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', background: '#f8f9fa', borderBottom: '1px solid #ddd', display: 'flex', gap: '10px' }}>
        <button onClick={handleRunFlow} disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {loading ? 'Running...' : 'Run Flow'}
        </button>
        <button onClick={handleSave} style={{ padding: '10px 20px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none' }}>
          Save to Database
        </button>
      </div>
      
      <div style={{ flex: 1 }}>
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}