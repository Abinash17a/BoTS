import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-white flex items-center justify-center">
      <div className="text-center p-6 bg-white shadow-xl rounded-2xl w-full max-w-lg">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">🤖 Bot Builder</h1>
        <p className="text-gray-600 text-lg mb-6">Create, edit, and manage intelligent chatbots with ease.</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/bots"
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            View Bots
          </Link>
        </div>
      </div>
    </div>
  );
}
