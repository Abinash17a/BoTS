export function AddNodeButtons({ addNode }: { addNode: (type: "userMessage" | "botResponse") => void }) {
    return (
        <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Add Nodes</h3>
            <div className="space-y-2">
                <button
                    onClick={() => addNode("userMessage")}
                    className="w-full flex items-center justify-start gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-200 font-medium"
                >
                    👤 User Message
                </button>
                <button
                    onClick={() => addNode("botResponse")}
                    className="w-full flex items-center justify-start gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 font-medium"
                >
                    🤖 Bot Response
                </button>
            </div>
        </div>
    );
}
