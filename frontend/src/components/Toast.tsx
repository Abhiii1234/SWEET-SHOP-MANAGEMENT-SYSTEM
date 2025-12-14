import React, { useEffect } from 'react';

export interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error';
}

interface ToastContainerProps {
    toasts: ToastMessage[];
    removeToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast key={toast.id} {...toast} onRemove={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const Toast: React.FC<ToastMessage & { onRemove: () => void }> = ({ message, type, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onRemove]);

    return (
        <div className={`toast ${type}`}>
            <span>{type === 'success' ? '✅' : '❌'}</span>
            <span>{message}</span>
        </div>
    );
};
