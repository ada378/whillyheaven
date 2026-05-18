import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const styles = {
  success: "bg-luxury-2 border-gold/50 text-gold-light",
  error:   "bg-luxury-2 border-red-500/50 text-red-300",
  info:    "bg-luxury-2 border-gold/30 text-gold/80",
};

const icons = {
  success: <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />,
  error:   <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
  info:    <Info className="w-5 h-5 text-gold/70 flex-shrink-0" />,
};

export default function Toast({ message, type = "info", onDismiss }) {
  if (!message) return null;
  return (
    <div
      className={`fixed bottom-6 right-4 sm:right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-gold-lg max-w-sm fade-in-up ${styles[type] || styles.info}`}
      role="alert"
    >
      {icons[type]}
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onDismiss} className="p-1 rounded-full hover:bg-gold/10 transition flex-shrink-0" aria-label="Dismiss">
        <X className="w-4 h-4 text-gold/60" />
      </button>
    </div>
  );
}
