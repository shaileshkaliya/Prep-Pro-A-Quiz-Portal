import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import { MessageCircle } from 'lucide-react';
import axios from 'axios'; // Add this for API calls

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activePanel, setActivePanel] = useState(() => {
    if (location.pathname.includes('quizcontent')) return 'Quiz';
    if (location.pathname.includes('userscontent')) return 'Users';
    if (location.pathname.includes('resultscontent')) return 'Results';
    return 'Dashboard';
  });

  const handlePanelChange = (panel, path) => {
    setActivePanel(panel);
    navigate(`/admindashboard${path}`);
  };

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const handleChatToggle = () => setIsChatOpen((prev) => !prev);

  const handleSendMessage = async () => {
    if (chatInput.trim()) {
      const userMessage = { text: chatInput, sender: 'admin' };
      setChatMessages((prev) => [...prev, userMessage]);

      try {
        const res = await axios.post('http://localhost:8000/conversation', {
          message: chatInput,
        });

        const botMessage = {
          text: res.data.response || 'No response from Gemini.',
          sender: 'bot',
        };
        setChatMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        setChatMessages((prev) => [
          ...prev,
          { text: 'Error contacting Gemini API.', sender: 'bot' },
        ]);
      }

      setChatInput('');
    }
  };

  return (
    <div className="flex mt-16 h-full w-full min-h-screen relative">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6 flex-shrink-0">
        <ul className="space-y-4">
          {['Dashboard', 'Quiz', 'Users', 'Results'].map((panel) => (
            <li key={panel}>
              <button
                className={`w-full py-2 px-4 rounded ${
                  activePanel === panel ? 'bg-blue-500' : 'hover:bg-gray-600'
                }`}
                onClick={() =>
                  handlePanelChange(
                    panel,
                    panel === 'Dashboard'
                      ? ''
                      : `/${panel.toLowerCase()}content`
                  )
                }
              >
                {panel}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col relative">
        <DashboardHeader onLogout={onLogout} />
        <Outlet />

        {/* Floating Chat Button */}
        <div
          onClick={handleChatToggle}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full cursor-pointer shadow-lg z-50 flex items-center space-x-2"
        >
          <MessageCircle className="w-5 h-5" />
          {!isChatOpen && (
            <span className="text-sm hidden sm:inline">Support</span>
          )}
        </div>

        {/* Chat Window */}
        {isChatOpen && (
          <div className="fixed bottom-20 right-6 w-80 h-96 bg-white border rounded-lg shadow-xl z-50 flex flex-col">
            <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
              <span className="font-semibold">Admin Bot</span>
              <button
                onClick={handleChatToggle}
                className="text-white text-lg"
              >
                ×
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === 'admin' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-xs ${
                      msg.sender === 'admin'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 rounded border"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-3 py-2 rounded"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;