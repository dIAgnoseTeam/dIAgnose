import { useState, useRef, useEffect } from "react";
import { Send, Plus } from "lucide-react";

const MOCK_SESSIONS = [
  { id: 1, title: "Dolor de cabeza persistente", date: "Hoy", active: true },
  {
    id: 2,
    title: "Consulta sobre tensión arterial",
    date: "Ayer",
    active: false,
  },
  { id: 3, title: "Seguimiento diabetes tipo 2", date: "02/05", active: false },
];

const MOCK_MESSAGES = [
  {
    id: 1,
    role: "assistant",
    text: "Hola, soy el asistente de dlAgnose. ¿En qué puedo ayudarte hoy?",
  },
  {
    id: 2,
    role: "user",
    text: "Llevo tres días con dolor de cabeza constante.",
  },
  {
    id: 3,
    role: "assistant",
    text: "Entiendo. ¿Dónde sientes el dolor?",
  },
];

const Chat = () => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text }]);
    setInput("");
    // Aquí iría la llamada a tu API
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-4 h-full overflow-hidden">
      {/* ── Panel izquierdo: sesiones ── */}
      <div className="flex flex-col w-64 shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-800">
            Conversaciones
          </span>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500
                             hover:bg-teal-50 hover:text-teal-700 transition-colors"
          >
            <Plus />
          </button>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto py-2">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() =>
                setSessions(
                  sessions.map((x) => ({ ...x, active: x.id === s.id })),
                )
              }
              className={`w-full text-left px-4 py-2.5 rounded-lg mx-1 transition-colors
                ${
                  s.active
                    ? "bg-teal-50 text-teal-800"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              style={{ width: "calc(100% - 8px)" }}
            >
              <p
                className={`text-xs font-medium truncate ${s.active ? "text-teal-800" : "text-gray-700"}`}
              >
                {s.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{s.date}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Panel derecho: chat ── */}
      <div className="flex flex-col flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Cabecera */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 shrink-0">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="white"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.22z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Asistente dlAgnose
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
              <p className="text-xs text-gray-400">En línea</p>
            </div>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center shrink-0 mb-0.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.22z" />
                  </svg>
                </div>
              )}

              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                ${
                  msg.role === "user"
                    ? "bg-teal-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 shrink-0">
          <div
            className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2
                          focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-100 transition-all"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu consulta... (Enter para enviar)"
              rows={1}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 
                         resize-none outline-none leading-relaxed py-1"
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center
                         hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed 
                         transition-colors shrink-0 mb-0.5"
            >
              <Send width={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
