export function FlowStats({ stats }: { stats: { userNodes: number; botNodes: number; connections: number } }) {
  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Flow Statistics</h3>
      <div className="grid grid-cols-3 gap-2">
        {/* Repeat for each stat */}
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{stats.userNodes}</div>
          <div className="text-xs text-green-700">User</div>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{stats.botNodes}</div>
          <div className="text-xs text-blue-700">Bot</div>
        </div>
        <div className="text-center p-2 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">{stats.connections}</div>
          <div className="text-xs text-purple-700">Links</div>
        </div>
      </div>
    </div>
  );
}
