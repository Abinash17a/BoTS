import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setProjectInfo } from '../store/ProjectSlice';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    dispatch(setProjectInfo({ projectName, clientName, clientEmail }));

    try {
      // await axios.post('/api/projects', {
      //   name: projectName,
      //   client: {
      //     name: clientName,
      //     email: clientEmail,
      //   },
      // });

      setMessage('Project and client created successfully!');
      setProjectName('');
      setClientName('');
      setClientEmail('');
      navigate('/bots');
    } catch (error) {
      console.error('Error creating project/client:', error);
      setMessage('Failed to create project and client.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl max-w-xl w-full p-10 sm:p-12">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold text-indigo-700 mb-2">🤖 Bot Builder</h1>
          <p className="text-indigo-600 text-lg font-medium">
            Create, edit, and manage intelligent chatbots with ease.
          </p>
        </header>

        {/* <div className="flex justify-center mb-8">
          <Link
            to="/bots"
            className="inline-block px-8 py-3 bg-indigo-700 text-white rounded-full font-semibold text-lg shadow-lg hover:bg-indigo-800 transition"
          >
            View Bots
          </Link>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="projectName" className="block text-sm font-semibold text-gray-700 mb-1">
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Enter your project name"
              required
            />
          </div>

          <div>
            <label htmlFor="clientName" className="block text-sm font-semibold text-gray-700 mb-1">
              Client Name
            </label>
            <input
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Enter client name"
              required
            />
          </div>

          <div>
            <label htmlFor="clientEmail" className="block text-sm font-semibold text-gray-700 mb-1">
              Client Email
            </label>
            <input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Enter client email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full text-white font-bold text-lg shadow-md transition ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Submitting...' : 'Create Project'}
          </button>

          {message && (
            <p
              className={`mt-4 text-center text-sm font-medium ${
                message.includes('successfully') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
