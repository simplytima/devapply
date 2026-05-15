import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
      } text-white`}>
        {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
        <p className="text-sm">{message}</p>
        <button onClick={onClose} className="ml-4">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;