import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";

const NewChatModal = ({ onConfirm, onCancel }) => {
  const [titulo, setTitulo] = useState("");
  const inputRef = useRef(null);

  // Pequeño delay para que la animacion termine
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(timer);
  }, []);

  // Manejamos el submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (titulo.trim()) onConfirm(titulo.trim());
  };

  // Manejamos el cierre del modal con Escape
  const handleKeyDown = (e) => {
    if (e.key === "Escape") onCancel();
  };

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Fondo difuminado */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        style={{ animation: "fadeIn 0.15s ease" }}
      />

      {/* Tarjeta del modal */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: "slideUp 0.2s ease" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
              <Plus size={16} className="text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Nueva conversación
              </p>
              <p className="text-xs text-gray-400">
                Pon un título para identificarla
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400
                       hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Tema de la consulta
            </label>
            <input
              ref={inputRef}
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Consulta sobre dolor de cabeza..."
              maxLength={80}
              className="w-full px-3.5 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200
                         rounded-xl outline-none placeholder-gray-400
                         focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
            />
            <p className="text-right text-xs text-gray-300 mt-1">
              {titulo.length}/80
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100
                         hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!titulo.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-teal-600
                         hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Crear conversación
            </button>
          </div>
        </form>
      </div>

      {/* Keyframes inline */}
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
};

export default NewChatModal;
