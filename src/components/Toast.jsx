// src/components/Toast.jsx
import React, { useEffect } from 'react';

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
      {message}
    </div>
  );
}

export default Toast;