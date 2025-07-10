import React from "react";

interface ActionsPanelProps {
  onDelete: () => void;
  onLoad: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  selectedNodeId: string | null;
}

export const ActionsPanel: React.FC<ActionsPanelProps> = ({
  onDelete,
  onSubmit,
  onLoad,
  onExport,
  onImport,
  selectedNodeId,
}) => {
  return (
    <div className="p-4 space-y-2 flex-1">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Actions</h3>

      <button
        onClick={onDelete}
        disabled={!selectedNodeId || selectedNodeId === "start"}
        className="w-full flex items-center justify-start gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200 font-medium"
      >
        <span>🗑️</span>
        Delete Selected
      </button>

      <hr className="my-3 border-gray-200" />

      <button
        onClick={onSubmit}
        className="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors duration-200 font-medium"
      >
        <span>💾</span>
        Submit Flow
      </button>

      <button
        onClick={onLoad}
        className="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors duration-200 font-medium"
      >
        <span>📂</span>
        Load Flow
      </button>

      <button
        onClick={onExport}
        className="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors duration-200 font-medium"
      >
        <span>📥</span>
        Export JSON
      </button>

      <label htmlFor="import-json" className="w-full cursor-pointer">
        <div className="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors duration-200 font-medium">
          <span>📥</span>
          Import JSON
        </div>
        <input
          id="import-json"
          type="file"
          accept=".json"
          onChange={onImport}
          className="hidden"
        />
      </label>
    </div>
  );
};
