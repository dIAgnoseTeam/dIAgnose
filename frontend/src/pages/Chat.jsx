import { useState, useRef, useEffect } from "react";
import { Send, Plus, ChevronLeft, MessageSquare } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { chatService, historicService } from "../services/api";
import ReactMarkdown from "react-markdown";

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessions, setSessions] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Función para cargar sesiones del usuario
  const loadSessions = async () => {
    try {
      const { data } = await chatService.getChatsByUser(user.id);
      const formattedSessions = data.map((chat) => ({
        id: chat.id,
        titulo: chat.titulo,
        fecha_creacion: chat.fecha_creacion,
        activo: chat.activo,
      }));
      setSessions(formattedSessions);

      // Seleccionar primera sesión si no hay ninguna seleccionada
      if (formattedSessions.length > 0 && !currentChat) {
        handleSessionClick(formattedSessions[0].id);
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  };

  // Cargar sesiones al montar o cuando cambia el usuario
  useEffect(() => {
    if (user?.id) {
      loadSessions();
    }
  }, [user?.id]);
  // Auto-scroll al cambiar mensajes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Función para cargar mensajes de una sesión
  const loadMessages = async (chatId) => {
    try {
      setLoading(true);
      const { data } = await historicService.getByChat(chatId);
      // Transformar historic a formato de mensaje
      const formattedMessages = data.map((historic) => ({
        id: historic.id,
        role: historic.rol,
        text: historic.mensaje,
        fecha_creacion: historic.fecha_creacion,
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar click en sesión
  const handleSessionClick = async (sessionId) => {
    setSessions((prev) =>
      prev.map((s) => ({ ...s, active: s.id === sessionId })),
    );
    setCurrentChat(sessionId);
    await loadMessages(sessionId);
    setShowSidebar(false);
  };

  // Funcion para manejar nuevo chat
  const handleNewChat = async () => {
    try {
      const titulo = prompt("¿Cuál es el tema de la consulta?");
      if (!titulo) return;

      const { data } = await chatService.createChat({
        id_usuario: user.id,
        titulo,
        activo: "T",
      });

      setSessions((prev) => [
        ...prev.map((s) => ({ ...s, active: false })),
        {
          id: data.id,
          titulo: data.titulo,
          fecha_creacion: data.fecha_creacion,
          activo: data.activo,
          active: true,
        },
      ]);
      setCurrentChat(data.id);
      setMessages([]);
      setShowSidebar(false);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  // Función para manejar envío de mensaje
  const handleSend = async () => {
    const text = input.trim();
    if (!text || !currentChat) return;

    try {
      setLoading(true);

      const userMsg = {
        id: Date.now(),
        role: "user",
        text,
        fecha_creacion: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");

      // Llamar a tu endpoint del backend
      const response = await chatService.sendMessage(currentChat, text);

      const assistantMessage = response.data.generated_text;

      const assistantMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: assistantMessage,
        fecha_creacion: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar Enter en textarea
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Hoy";
    if (date.toDateString() === yesterday.toDateString()) return "Ayer";
    return date.toLocaleDateString("es-ES");
  };

  return (
    <div className="flex gap-4 h-full overflow-hidden relative">
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div
        className={`
          flex flex-col w-64 shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm
          fixed md:relative top-0 bottom-0 left-0 h-dvh md:h-full z-50 md:z-auto
          transform transition-transform duration-300 ease-in-out
          ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          md:flex
        `}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-800">
            Conversaciones
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500
                               hover:bg-teal-50 hover:text-teal-700 transition-colors"
              title="Nueva conversación"
            >
              <Plus size={18} />
            </button>
            <button
              className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg text-gray-500
                               hover:bg-gray-100 transition-colors"
              onClick={() => setShowSidebar(false)}
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {sessions.length === 0 ? (
            <p className="text-xs text-gray-400 px-4 py-4 text-center">
              No hay conversaciones. Crea una nueva.
            </p>
          ) : (
            sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSessionClick(s.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg mx-1 transition-colors
                  ${
                    s.active
                      ? "bg-teal-50 text-teal-800"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                style={{ width: "calc(100% - 8px)" }}
              >
                <p
                  className={`text-xs font-medium truncate ${
                    s.active ? "text-teal-800" : "text-gray-700"
                  }`}
                >
                  {s.titulo}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(s.fecha_creacion)}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm min-w-0">
        <div className="flex items-center gap-3 px-3 sm:px-5 py-3 border-b border-gray-100 shrink-0">
          <button
            className="md:hidden w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors shrink-0"
            onClick={() => setShowSidebar(true)}
          >
            <MessageSquare size={16} />
          </button>

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
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              Asistente dlAgnose
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block shrink-0" />
              <p className="text-xs text-gray-400">En línea</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-4 min-h-0">
          {!currentChat ? (
            <p className="text-center text-gray-400 mt-8">
              Selecciona o crea una conversación para empezar
            </p>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-400 mt-8">
              Ningún mensaje aún. ¡Escribe tu primera consulta!
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center shrink-0 mb-0.5">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.22z" />
                    </svg>
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[70%] px-3 sm:px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${
                    msg.role === "user"
                      ? "bg-teal-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      components={{
                        // Formato básico para markdown
                        p: ({ node, ...props }) => (
                          <p className="mb-2 last:mb-0" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc ml-4 mb-2" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="list-decimal ml-4 mb-2" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="mb-1" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="font-semibold" {...props} />
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="px-3 sm:px-4 py-3 border-t border-gray-100 shrink-0">
          <div
            className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2
                          focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-100 transition-all"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu consulta..."
              rows={1}
              disabled={!currentChat || loading}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 
                         resize-none outline-none leading-relaxed py-1 min-w-0 disabled:opacity-50"
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !currentChat || loading}
              className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center
                         hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed 
                         transition-colors shrink-0 mb-0.5"
            >
              <Send width={16} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center hidden sm:block">
            Presiona Enter para enviar
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
