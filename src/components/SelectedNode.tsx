export function SelectedNodeInfo({ id }: { id: string }) {
  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Selected Node</h3>
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 border">
        ID: {id}
      </span>
    </div>
  );
}
