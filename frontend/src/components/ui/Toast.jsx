const STYLES = {
  success: "bg-teal-600 text-white",
  error: "bg-red-500 text-white",
  warning: "bg-amber-500 text-white",
};

const Toast = ({ toast }) => {
  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 
                     px-4 py-3 rounded-xl shadow-lg text-sm font-medium
                     animate-fade-in ${STYLES[toast.type]}`}
    >
      {toast.type === "success" && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {toast.message}
    </div>
  );
};

export default Toast;
