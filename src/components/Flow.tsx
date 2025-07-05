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
import { v4 as uuidv4 } from "uuid"

// Import ReactFlow styles
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: "start",
    type: "startNode",
    position: { x: 100, y: 20 },
    data: { label: "Start" },
    draggable: false,
  },
  {
    id: "1",
    type: "userMessage",
    position: { x: 50, y: 150 },
    data: { message: "What is your name?", sender: "user" },
  },
  {
    id: "2",
    type: "botResponse",
    position: { x: 300, y: 150 },
    data: { message: "I am BotX, your AI assistant!", sender: "bot" },
  },
]

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#6366f1", strokeWidth: 2 },
  },
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
    const id = uuidv4()
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
          id: `e-start-${id}`,
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


  //   const handleImportClick = () => {
  //   fileInputRef.current?.click();
  // };

  //   const importFlow = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]; // Get the selected file

  //   if (file) {
  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //       try {
  //         const content = e.target?.result as string;
  //         const loadedFlow = JSON.parse(content);

  //         if (loadedFlow.nodes && loadedFlow.edges) {
  //           // Set the new nodes and edges from the loaded data
  //           setNodes(loadedFlow.nodes || []);
  //           setEdges(loadedFlow.edges || []);

  //           // Optional: Reset viewport to fit the new flow
  //           // This waits for the DOM to update before fitting
  //           requestAnimationFrame(() => {
  //               setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 800 }); // Reset to origin and zoom 1
  //               // Or if you want to fit the view of the new nodes:
  //               // fitView(); // Requires useReactFlow().fitView
  //           });

  //           alert('Flow loaded successfully!');
  //         } else {
  //           alert('Invalid flow data: Missing nodes or edges arrays.');
  //         }
  //       } catch (error) {
  //         console.error('Error parsing flow data:', error);
  //         alert('Failed to parse flow data. Make sure it\'s a valid JSON file.');
  //       }
  //     };

  //     reader.readAsText(file); // Read the file as text
  //   }
  // }, [setNodes, setEdges, setViewport]); // Include setViewport in dependencies
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-indigo-600">⚡</span>
            Bot Flow Builder
          </h2>
          <p className="text-sm text-gray-500 mt-1">Design your conversation flow</p>
        </div>

        {/* Flow Statistics */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Flow Statistics</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{flowStats.userNodes}</div>
              <div className="text-xs text-green-700">User</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{flowStats.botNodes}</div>
              <div className="text-xs text-blue-700">Bot</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{flowStats.connections}</div>
              <div className="text-xs text-purple-700">Links</div>
            </div>
          </div>
        </div>

        {/* Add Nodes Section */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add Nodes</h3>
          <div className="space-y-2">
            <button
              onClick={() => addNode("userMessage")}
              className="w-full flex items-center justify-start gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 font-medium"
            >
              <span>👤</span>
              User Message
            </button>
            <button
              onClick={() => addNode("botResponse")}
              className="w-full flex items-center justify-start gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 font-medium"
            >
              <span>🤖</span>
              Bot Response
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Search</h3>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions Section */}
        <div className="p-4 space-y-2 flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Actions</h3>

          <button
            onClick={handleDeleteNode}
            disabled={!selectedNodeId || selectedNodeId === "start"}
            className="w-full flex items-center justify-start gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200 font-medium"
          >
            <span>🗑️</span>
            Delete Selected
          </button>

          <hr className="my-3 border-gray-200" />

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors duration-200 font-medium"
          >
            <span>💾</span>
            Save Flow
          </button>

          <button
            onClick={handleLoad}
            className="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors duration-200 font-medium"
          >
            <span>📂</span>
            Load Flow
          </button>

          <button
            onClick={exportFlow}
            className="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors duration-200 font-medium"
          >
            <span>📥</span>
            Export JSON
          </button>
          <>
            <input
              id="import-json"
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <label
              htmlFor="import-json"
              className="w-full cursor-pointer"
            >
              <div
                className="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors duration-200 font-medium"
              >
                <span>📥</span>
                Import JSON
              </div>
            </label>
          </>

        </div>

        {/* Selected Node Info */}
        {selectedNodeId && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Selected Node</h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 border">
              ID: {selectedNodeId}
            </span>
          </div>
        )}
      </div>

      {/* Flow Area - Fixed container sizing */}
      <div className="flex-1 relative" style={{ height: "100vh", width: "100%", cursor: "crosshair" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
          style={{ width: "100%", height: "100%" }}
          defaultEdgeOptions={{
            animated: true,
            style: { stroke: "#6366f1", strokeWidth: 2 },
          }}
        >
          <Background color="#e5e7eb" gap={20} />
          <MiniMap
            className="bg-white border border-gray-200 rounded-lg"
            nodeColor={(node) => {
              switch (node.type) {
                case "userMessage":
                  return "#10b981";
                case "botResponse":
                  return "#3b82f6";
                case "startNode":
                  return "#8b5cf6";
                default:
                  return "#6b7280";
              }
            }}
          />
          <Controls className="bg-white border border-gray-200 rounded-lg" />
        </ReactFlow>
      </div>
    </div>
  )
}
export default Flow