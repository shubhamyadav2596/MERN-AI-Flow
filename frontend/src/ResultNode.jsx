import { Handle, Position } from 'reactflow';

export default function ResultNode({ data }) {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Left} id="b" />
      <strong>AI Response</strong>
      <div style={{ marginTop: '10px', fontSize: '14px', color: '#333', maxWidth: '300px', maxHeight: '400px', overflowY: 'auto' }}>
        {data.responseText || "Waiting for prompt..."}
      </div>
    </div>
  );
}