import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
}

interface ChatModalProps {
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Welcome to the chat!', sender: 'them' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input.trim(), sender: 'me' }]);
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  const goToProfile = (name: string) => {
    navigate(`/profile/${name}`);
    onClose();
  };

  return (
    <div className="modal-overlay active" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-300">Chat</h2>
          <button onClick={onClose} className="text-red-400 hover:text-red-300">
            ✕
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden rounded-lg shadow-inner bg-gray-900 bg-opacity-60">
          <div className="conversations-list p-2 overflow-y-auto border-r border-gray-700 w-56">
            {/* Example conversations */}
            <div className="conversation-item" onClick={() => goToProfile('friend')}>Friend</div>
            <div className="conversation-item" onClick={() => alert('Tournament info')}>TournamentBot</div>
          </div>
          <div className="chat-area flex flex-col flex-1">
            <div className="chat-messages flex-1 p-2 overflow-y-auto">
              {messages.map(m => (
                <div key={m.id} className={`message-bubble ${m.sender === 'me' ? 'sent' : 'received'}`}>\
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
            <div className="chat-input-container p-2 border-t border-gray-700">
              <div className="flex">
                <input
                  className="search-input flex-grow mr-2"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Type a message..."
                />
                <button onClick={sendMessage} className="button-hover bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg">
                  Send
                </button>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <button onClick={() => alert('Invite sent!')} className="hover:text-blue-300">
                  <i className="fas fa-gamepad mr-1" /> Invite to game
                </button>
                <button onClick={() => alert('User blocked')} className="hover:text-red-400">
                  <i className="fas fa-ban mr-1" /> Block user
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
