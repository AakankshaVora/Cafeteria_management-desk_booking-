import React from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';
import Button from './Button';

const ConfirmationModal = ({
    isOpen,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    onConfirm,
    onClose,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger" // danger | info
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform scale-100 transition-all border border-gray-100">

                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-red-50' : 'bg-indigo-50'}`}>
                        {variant === 'danger' ? (
                            <AlertCircle className={`w-6 h-6 ${variant === 'danger' ? 'text-red-600' : 'text-indigo-600'}`} />
                        ) : (
                            <HelpCircle className={`w-6 h-6 ${variant === 'danger' ? 'text-red-600' : 'text-indigo-600'}`} />
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                </div>

                {/* Message */}
                <p className="text-gray-600 mb-8 leading-relaxed">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="px-6"
                    >
                        {cancelText}
                    </Button>
                    <button
                        onClick={onConfirm}
                        className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all transform active:scale-95 ${variant === 'danger'
                                ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200'
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
