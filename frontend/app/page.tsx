'use client'

import { useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState<Array<{role: string, content: string}>>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return

    setLoading(true)
    const userMessage = message
    setMessage('')
    setHistory([...history, { role: 'user', content: userMessage }])

    try {
      const res = await fetch(`http://localhost:8000/chat?message=${encodeURIComponent(userMessage)}`, {
        method: 'POST'
      })
      const data = await res.json()
      const aiResponse = data.response || 'Error'
      setHistory(prev => [...prev, { role: 'ai', content: aiResponse }])
    } catch (error) {
      setHistory(prev => [...prev, { role: 'ai', content: 'Error: ' + String(error) }])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-800 rounded-lg shadow-2xl h-96 flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
          <h1 className="text-2xl font-bold text-white">ARIA</h1>
          <p className="text-blue-100 text-sm">Locally-run AI OS</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-100'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-start"><div className="bg-slate-700 text-slate-100 px-4 py-2 rounded-lg">Thinking...</div></div>}
        </div>

        <div className="border-t border-slate-700 p-4 bg-slate-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask ARIA..."
              disabled={loading}
              className="flex-1 px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <button onClick={handleSend} disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}