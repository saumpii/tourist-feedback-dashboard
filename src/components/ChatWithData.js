'use client'
import { useState } from 'react'

export default function ChatWithData({ filteredData = [] }) {
  const [show, setShow] = useState(false)
  const [input, setInput] = useState('')
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const newChat = [...chat, { role: 'user', text: input }]
    setChat(newChat)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat-with-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input, data: filteredData })
      })
      const result = await res.json()
      setChat([...newChat, { role: 'ai', text: result.output }])
    } catch {
      setChat([...newChat, { role: 'ai', text: '⚠️ Error: AI could not respond.' }])
    }

    setLoading(false)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-3 rounded-full shadow-xl hover:scale-105 hover:shadow-pink-400 transition z-50"
      >
        🧠 Chat with Data
      </button>

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d0d2a] rounded-xl w-full max-w-xl shadow-2xl p-6 relative border border-purple-800">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-300 font-bold text-lg">🧠 Data Terminal</h2>
              <button onClick={() => setShow(false)} className="text-gray-400 hover:text-red-400 text-xl">&times;</button>
            </div>

            {/* Chat Window */}
            <div className="h-64 overflow-y-auto space-y-3 border border-purple-900 p-3 rounded bg-[#161632] mb-4 scroll-smooth">
              {chat.map((msg, i) => (
                <div key={i} className={`text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block px-4 py-2 rounded-xl max-w-xs whitespace-pre-wrap
                    ${msg.role === 'user'
                      ? 'bg-purple-700 text-white'
                      : 'bg-gray-800 border border-pink-600 text-pink-200'}
                  `}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-pink-300 italic text-sm animate-pulse">AI is typing...</div>
              )}
            </div>

            {/* Input Row */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask your question..."
                className="flex-grow bg-[#1a1a40] border border-purple-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-purple-500"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
