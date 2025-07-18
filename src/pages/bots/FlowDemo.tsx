import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

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
  // Get projectName and clientEmail from redux store
  const projectName = useSelector((state: any) => state.project.projectName);
  const clientEmail = useSelector((state: any) => state.project.clientEmail);
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
        <form className="flex gap-2 mt-2" onSubmit={async e => {
          e.preventDefault();
          if (!input.trim()) return;

          // Add user message immediately
          setChat(prev => [
            ...prev,
            { sender: 'user' as const, message: input },
            { sender: 'bot' as const, message: '...' }
          ]);

          try {
            const res = await axios.post('http://localhost:3000/clients/response', {
              query: input,
              email: clientEmail,
              projectName: projectName
            });
            const botReply = res.data?.response || res.data?.message || 'No response from bot.';
            setChat(prev => {
              // Replace last bot message ('...') with real reply
              const updated = [...prev];
              // Find last bot message index
              const idx = updated.map(x => x.sender).lastIndexOf('bot');
              if (idx !== -1) updated[idx] = { sender: 'bot', message: botReply };
              return updated;
            });
          } catch (err) {
            setChat(prev => {
              const updated = [...prev];
              const idx = updated.map(x => x.sender).lastIndexOf('bot');
              if (idx !== -1) updated[idx] = { sender: 'bot', message: 'Error contacting bot API.' };
              return updated;
            });
          }
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
