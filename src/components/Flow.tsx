"use client"

import type React from "react"
import { useCallback, useState, useEffect, useRef } from "react"
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
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  useReactFlow
} from "@xyflow/react"
// import { v4 as uuidv4 } from "uuid"

// Import ReactFlow styles
import '@xyflow/react/dist/style.css';
import SidebarLayout from "./SideBarLayout";
import { SidebarHeader } from "./SidebarHeader";
import { FlowStats } from "./FlowStats";
import { AddNodeButtons } from "./AddNodeButton";
import { SearchBox } from "./SearchBox";
import { ActionsPanel } from "./ActionPanel";
import { SelectedNodeInfo } from "./SelectedNode";
import FlowCanvas from "./FlowCanvas";

const initialNodes: Node[] = [
  {
    id: "start",
    type: "startNode",
    position: { x: 100, y: 20 },
    data: { label: "Start" },
    draggable: false,
  },
]

const initialEdges: Edge[] = [

]

// Custom Node Components
const UserNode = ({ data, id, selected }: any) => (
  <div
    className={`relative bg-gradient-to-r from-green-50 to-emerald-50 border-2 rounded-lg p-4 min-w-[200px] shadow-sm transition-all duration-200 ${selected ? "border-green-500 shadow-lg scale-105" : "border-green-300 hover:border-green-400"
      }`}
  >
    <Handle type="target" position={Position.Left} className="w-5 h-5 bg-green-500 border-2 border-white" />

    <div className="flex items-center gap-2 mb-2">
      <div className="w-4 h-4 bg-green-600 rounded-sm flex items-center justify-center">
        <span className="text-white text-xs">👤</span>
      </div>
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        User Message
      </span>
    </div>

    <div className="text-sm">
      {data.isEditing ? (
        <textarea
          value={data.message}
          onChange={(e) => data.onChange(e, id)}
          className="w-full min-h-[60px] text-sm resize-none border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter user message..."
        />
      ) : (
        <div className="text-gray-700 font-medium">{data.message}</div>
      )}
    </div>

    <Handle type="source" position={Position.Right} className="w-5 h-5 bg-green-500 border-2 border-white" />
  </div>
)

const BotNode = ({ data, id, selected }: any) => (
  <div
    className={`relative bg-gradient-to-r from-blue-50 to-indigo-50 border-2 rounded-lg p-4 min-w-[200px] shadow-sm transition-all duration-200 ${selected ? "border-blue-500 shadow-lg scale-105" : "border-blue-300 hover:border-blue-400"
      }`}
  >
    <Handle type="target" position={Position.Left} className="w-10 h-10 bg-blue-500 border-2 border-white" />

    <div className="flex items-center gap-2 mb-2">
      <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
        <span className="text-white text-xs">🤖</span>
      </div>
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        Bot Response
      </span>
    </div>

    <div className="text-sm">
      {data.isEditing ? (
        <textarea
          value={data.message}
          onChange={(e) => data.onChange(e, id)}
          className="w-full min-h-[60px] text-sm resize-none border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter bot response..."
        />
      ) : (
        <div className="text-gray-700 font-medium">{data.message}</div>
      )}
    </div>

    <Handle
      type="source"
      position={Position.Right}
      className="w-12 h-12 bg-blue-500 border-2 border-white" // Increased from w-10 h-10 to w-12 h-12
    />
  </div>
)

const StartNode = ({ data, selected }: any) => (
  <div
    className={`relative bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-dashed rounded-lg p-4 text-center min-w-[120px] transition-all duration-200 ${selected ? "border-purple-500 shadow-lg scale-105" : "border-purple-300"
      }`}
  >
    <div className="flex items-center justify-center gap-2 mb-1">
      <span className="text-lg">🚀</span>
    </div>
    <div className="font-bold text-purple-700 text-sm uppercase tracking-wide">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500 border-2 border-white" />
  </div>
)

const nodeTypes = {
  startNode: StartNode,
  userMessage: UserNode,
  botResponse: BotNode,
}

function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  // const setViewport  = useReactFlow();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [flowStats, setFlowStats] = useState({ userNodes: 0, botNodes: 0, connections: 0 })
  const nodeIdCounter = useRef(2);

  // Calculate flow statistics
  useEffect(() => {
    const userNodes = nodes.filter((n) => n.type === "userMessage").length
    const botNodes = nodes.filter((n) => n.type === "botResponse").length
    const connections = edges.length
    setFlowStats({ userNodes, botNodes, connections })
  }, [nodes, edges])



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
      })),
    )
  }, [selectedNodeId])

  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [])

  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [])

  const onConnect: OnConnect = useCallback((connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...connection,
          animated: true,
          style: { stroke: "#6366f1", strokeWidth: 2 },
        },
        eds,
      ),
    )
  }, [])

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNodeId(node.id)
  }

  const handleInlineEdit = (e: React.ChangeEvent<HTMLTextAreaElement>, id: string) => {
    const newMessage = e.target.value
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, data: { ...node.data, message: newMessage } } : node)),
    )
  }

  const addNode = (type: "userMessage" | "botResponse") => {
     const id = `${nodeIdCounter.current++}`;
    const newNode: Node = {
      id,
      type,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 100 },
      data: {
        message: type === "userMessage" ? "New user message" : "New bot response",
        sender: type === "userMessage" ? "user" : "bot",
        isEditing: false,
        onChange: handleInlineEdit,
      },
    }
    setNodes((nds) => [...nds, newNode])

    if (type === "userMessage") {
      setEdges((eds) => [
        ...eds,
        {
          id: `e-${id}`,
          source: "start",
          target: id,
          animated: true,
          style: { stroke: "#6366f1", strokeWidth: 2 },
        },
      ])
    }
  }

  const handleSave = () => {
    localStorage.setItem("botFlowNodes", JSON.stringify(nodes))
    localStorage.setItem("botFlowEdges", JSON.stringify(edges))
    alert("Flow saved successfully!")
  }

  const handleLoad = () => {
    const savedNodes = localStorage.getItem("botFlowNodes")
    const savedEdges = localStorage.getItem("botFlowEdges")
    if (savedNodes && savedEdges) {
      setNodes(JSON.parse(savedNodes))
      setEdges(JSON.parse(savedEdges))
    } else {
      alert("No saved flow found.")
    }
  }

  const handleDeleteNode = () => {
    if (!selectedNodeId || selectedNodeId === "start") return

    const confirmDelete = window.confirm("Are you sure you want to delete this node?")
    if (!confirmDelete) return

    setNodes((prev) => prev.filter((node) => node.id !== selectedNodeId))
    setEdges((prev) => prev.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId))
    setSelectedNodeId(null)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const found = nodes.find(
      (n) => typeof n.data?.message === "string" && n.data.message.toLowerCase().includes(term.toLowerCase()),
    )
    if (found) {
      setSelectedNodeId(found.id)
    }
  }

  const exportFlow = () => {
    const flowData = { nodes, edges, timestamp: new Date().toISOString() }
    const dataStr = JSON.stringify(flowData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "bot-flow.json"
    link.click()
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
        setNodes(data.nodes);
        setEdges(data.edges);
        alert("Flow imported successfully!");
      } else {
        alert("Invalid JSON structure. Must contain 'nodes' and 'edges'.");
      }
    } catch (err) {
      alert("Failed to import JSON: " + (err as Error).message);
    }
  };
  return (
  <div className="flex h-screen bg-gray-50">
    {/* Sidebar Section */}
    <SidebarLayout>
      <SidebarHeader />
      <FlowStats stats={flowStats} />
      <AddNodeButtons addNode={addNode} />
      <SearchBox value={searchTerm} onChange={handleSearch} />
      <ActionsPanel
        onDelete={handleDeleteNode}
        onSave={handleSave}
        onLoad={handleLoad}
        onExport={exportFlow}
        onImport={handleImport}
        selectedNodeId={selectedNodeId}
      />
      {selectedNodeId && <SelectedNodeInfo id={selectedNodeId} />}
    </SidebarLayout>

    {/* Flow Canvas Section */}
    <FlowCanvas
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
    />
  </div>
);
}
export default Flow