import React from "react";
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
  useReactFlow,
  type OnInit
} from "@xyflow/react"

interface FlowCanvasProps {
  onInit: OnInit;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onNodeClick: any;
  onDragOver:any,
  onDrop:any,
  nodeTypes: any;
}


const FlowCanvas: React.FC<FlowCanvasProps> = ({
  onInit,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onDragOver,
  onDrop,
  nodeTypes,
}) => {
  return (
    <div className="flex-1 relative" style={{ height: "100vh", width: "100%", cursor: "crosshair" }}>
      <ReactFlow
        onInit={onInit}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
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
  );
};

export default FlowCanvas;
