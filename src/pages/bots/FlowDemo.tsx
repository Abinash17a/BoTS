import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FlowNode {
  id: string;
  type: string;
  data: {
    message: string;
    sender?: 'user' | 'bot';
    label?: string; // for startNode
  };
}

interface FlowEdge {
  source: string;
  target: string;
}

const LOCAL_KEY = 'flow_demo_data';

// Simulate the API call for a bot response
function mockBotApi({ projectName, clientEmail, userMessage }: { projectName: string; clientEmail: string; userMessage: string; }) {
  // In real usage, this would be an async fetch/post
  return `Bot reply to "${userMessage}" (project: ${projectName}, client: ${clientEmail})`;
}

export default function FlowDemo() {
  const [chat, setChat] = useState<{ sender: 'user' | 'bot'; message: string }[]>([]);
  const [input, setInput] = useState('');
  const [projectName, setProjectName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [allNodes, setAllNodes] = useState<FlowNode[]>([]);
  const [allEdges, setAllEdges] = useState<FlowEdge[]>([]);
  const navigate = useNavigate();
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  // Store nodes and edges for lookup, but do not pre-populate chat
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      const { nodes, edges } = JSON.parse(saved);
      setAllNodes(nodes || []);
      setAllEdges(edges || []);
      let proj = '';
      let email = '';
      const startNode = nodes.find((n: FlowNode) => n.type === 'startNode');
      if (startNode && startNode.data && startNode.data.label) {
        proj = startNode.data.label;
      }
      setProjectName(proj);
      setClientEmail(email);
    }
  }, []);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-50 to-white">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <button className="mt-2 text-white py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-900 mb-4 text-sm" onClick={() => navigate('/bots')}>Back to Flow Builder</button>
        <h2 className="text-2xl font-bold mb-2 text-indigo-600">Flow Demo Chat</h2>
        <div className="mb-2 text-xs text-gray-500">Project: <span className="text-gray-700">{projectName || 'N/A'}</span></div>
        <div className="mb-4 text-xs text-gray-500">Client Email: <span className="text-gray-700">{clientEmail || 'N/A'}</span></div>

        <div className="h-96 max-h-96 overflow-y-auto scrollbar-hide border rounded p-2 mb-4 bg-gray-50">
          {chat.length === 0 && <div className="text-gray-400">No conversation found.</div>}
          {chat.map((node, idx) => (
            <div key={idx} className={`mb-2 flex ${node.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-3 py-2 rounded-lg max-w-xs ${node.sender === 'user' ? 'bg-indigo-200 text-left' : 'bg-gray-200 text-left'}`}>
                <span className="block text-xs text-gray-500">{node.sender}</span>
                <span>{node.message}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form className="flex gap-2 mt-2" onSubmit={e => {
          e.preventDefault();
          if (!input.trim()) return;

          // Find the userMessage node with matching message
          const userNode = allNodes.find(n => n.type === 'userMessage' && n.data.message.trim().toLowerCase() === input.trim().toLowerCase());
          let botReply = 'No matching bot response found.';

          if (userNode) {
            // Find the edge where source is this user node
            const edge = allEdges.find(e => e.source === userNode.id);
            if (edge) {
              // Find the botResponse node whose id matches edge.target
              const botNode = allNodes.find(n => n.type === 'botResponse' && n.id === edge.target);
              if (botNode) {
                botReply = botNode.data.message;
              }
            }
          }

          setChat(prev => [
            ...prev,
            { sender: 'user' as const, message: input },
            { sender: 'bot' as const, message: botReply }
          ]);
          setInput('');
        }}>
          <input
            className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-1 rounded hover:bg-indigo-600 transition"
          >Send</button>
        </form>
      </div>
    </div>
  );
}
