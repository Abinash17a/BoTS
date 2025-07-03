import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  MiniMap,
  Handle,
  Controls,
  Position,
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'startNode',
    position: { x: 300, y: 20 },
    data: { label: 'Start' },
    draggable: false,
  },
  {
    id: '1',
    type: 'userMessage',
    position: { x: 50, y: 150 },
    data: { message: 'What is your name?', sender: 'user' },
  },
  {
    id: '2',
    type: 'botResponse',
    position: { x: 300, y: 150 },
    data: { message: 'I am BotX.', sender: 'bot' },
  },
];
const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
  },
];

// Custom node types
const UserNode = ({ data, id }: any) => (
  <div
    style={{
      padding: 10,
      border: '2px solid #4CAF50',
      borderRadius: 5,
      background: '#f0fff0',
      position: 'relative',
    }}
  >
    {/* Target Handle: Accept connection from start */}
    <Handle
      type="target"
      position={Position.Left}
      id="in"
      style={{ top: '50%', background: '#4CAF50' }}
    />

    <strong>User Says:</strong>
    <div>
      {data.isEditing ? (
        <input
          value={data.message}
          onChange={(e) => data.onChange(e, id)}
          style={{ width: '100%' }}
        />
      ) : (
        <div>{data.message}</div>
      )}
    </div>

    {/* Source Handle: Connect to bot response */}
    <Handle
      type="source"
      position={Position.Right}
      id="out"
      style={{ top: '50%', background: '#4CAF50' }}
    />
  </div>
);

const BotNode = ({ data, id }: any) => (
  <div style={{ padding: 10, border: '2px solid #2196F3', borderRadius: 5, background: '#e3f2fd', position: 'relative' }}>
    <Handle type="target" position={Position.Left} id="b" style={{ background: '#2196F3' }} />
    <strong>Bot Replies:</strong>
    <div>
      {data.isEditing ? (
        <input
          value={data.message}
          onChange={(e) => data.onChange(e, id)}
          style={{ width: '100%' }}
        />
      ) : (
        <div>{data.message}</div>
      )}
    </div>
  </div>
);
const StartNode = ({ data }: any) => (
  <div style={{
    padding: 10,
    border: '2px dashed #9C27B0',
    borderRadius: 5,
    background: '#f3e5f5',
    fontWeight: 'bold',
    textAlign: 'center',
    width: 100,
    textTransform: 'uppercase'
  }}>
    🚀 {data.label}
    <Handle type="source" position={Position.Bottom} style={{ background: '#9C27B0' }} />
  </div>
);

const nodeTypes = {
  startNode: StartNode,
  userMessage: UserNode,
  botResponse: BotNode,
};

export default function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Attach editable props
  useEffect(() => {
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isEditing: node.id === selectedNodeId,
          onChange: handleInlineEdit,
        },
      }))
    );
  }, [selectedNodeId]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    []
  );

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNodeId(node.id);
  };

  const handleInlineEdit = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const newMessage = e.target.value;
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, message: newMessage } } : node
      )
    );
  };

const addNode = (type: 'userMessage' | 'botResponse') => {
  const id = uuidv4();
  const newNode: Node = {
    id,
    type,
    position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 100 },
    data: {
      message: type === 'userMessage' ? 'New user message' : 'New bot response',
      sender: type === 'userMessage' ? 'user' : 'bot',
      isEditing: false,
      onChange: handleInlineEdit,
    },
  };

  setNodes((nds) => [...nds, newNode]);

  // Only connect to 'start' if it's a user message
  if (type === 'userMessage') {
    setEdges((eds) => [
      ...eds,
      {
        id: `e-start-${id}`,
        source: 'start',
        target: id,
        animated: true,
      },
    ]);
  }
};

  const handleSave = () => {
    localStorage.setItem('botFlowNodes', JSON.stringify(nodes));
    localStorage.setItem('botFlowEdges', JSON.stringify(edges));
    alert('Flow saved!');
  };

  const handleLoad = () => {
    const savedNodes = localStorage.getItem('botFlowNodes');
    const savedEdges = localStorage.getItem('botFlowEdges');
    if (savedNodes && savedEdges) {
      setNodes(JSON.parse(savedNodes));
      setEdges(JSON.parse(savedEdges));
    } else {
      alert('No saved flow found.');
    }
  };
const handleDeleteNode = () => {
  if (!selectedNodeId || selectedNodeId === 'start') return;

  const confirmDelete = window.confirm("Are you sure you want to delete this node?");
  if (!confirmDelete) return;

  setNodes((prev) => prev.filter((node) => node.id !== selectedNodeId));
  setEdges((prev) => prev.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
  setSelectedNodeId(null);
};
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const found = nodes.find((n) =>
      typeof n.data?.message === 'string' &&
      n.data.message.toLowerCase().includes(term.toLowerCase())
    );
    if (found) {
      setSelectedNodeId(found.id);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Sidebar */}
      <div style={{ width: 220, padding: 20, borderRight: '1px solid #ccc', background: '#fafafa' }}>
        <h3>🧠 Add Node</h3>
        <button onClick={() => addNode('userMessage')} style={{ marginBottom: 10 }}>
          ➕ User Message
        </button>
        <br />
        <button onClick={() => addNode('botResponse')} style={{ marginBottom: 20 }}>
          ➕ Bot Response
        </button>
        <button onClick={handleDeleteNode} style={{ color: 'red', marginTop: 20 }}>
          🗑 Delete Selected Node
        </button>
        <input
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        />
        <br />
        <button onClick={handleSave} style={{ marginBottom: 10 }}>💾 Save Flow</button>
        <br />
        <button onClick={handleLoad}>📂 Load Flow</button>

      </div>

      {/* Flow Area */}
      <div style={{ flexGrow: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
