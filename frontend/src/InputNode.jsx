import { Handle, Position } from 'reactflow';

export default function InputNode({ data }) {
  return (
    <div className="custom-node">
      <strong>User Prompt</strong>
      <input 
        type="text" 
        placeholder="Type here..." 
        value={data.promptText}
        onChange={(e) => data.onChange(e.target.value)}
        className="nodrag" // Prevents panning the canvas when selecting text
      />
      <Handle type="source" position={Position.Right} id="a" />
    </div>
  );
}