export function AddNodeButtons({
  addNode,
}: {
  addNode: (type: "userMessage" | "botResponse") => void;
}) {
  return (
    <div className="space-y-2">
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("application/reactflow", "userMessage");
          e.dataTransfer.effectAllowed = "move";
        }}
        className="cursor-move w-full flex items-center justify-start gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 font-medium"
      >
        <span>👤</span> User Message
      </div>
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("application/reactflow", "botResponse");
          e.dataTransfer.effectAllowed = "move";
        }}
        className="cursor-move w-full flex items-center justify-start gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 font-medium"
      >
        <span>🤖</span> Bot Response
      </div>
    </div>
  );
}
