import React, { createContext, useContext, useState, useRef } from 'react';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const ConfirmationContext = createContext();

export const ConfirmationProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: "",
        message: "",
        confirmText: "Confirm",
        cancelText: "Cancel",
        variant: "danger"
    });

    const resolver = useRef(null);

    const confirm = (options) => {
        setModalState({
            isOpen: true,
            title: options.title || "Are you sure?",
            message: options.message || "Proceed with this action?",
            confirmText: options.confirmText || "Confirm",
            cancelText: options.cancelText || "Cancel",
            variant: options.variant || "danger"
        });

        return new Promise((resolve) => {
            resolver.current = resolve;
        });
    };

    const handleConfirm = () => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
        if (resolver.current) {
            resolver.current(true);
        }
    };

    const handleCancel = () => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
        if (resolver.current) {
            resolver.current(false);
        }
    };

    return (
        <ConfirmationContext.Provider value={confirm}>
            {children}
            <ConfirmationModal
                {...modalState}
                onConfirm={handleConfirm}
                onClose={handleCancel}
            />
        </ConfirmationContext.Provider>
    );
};

export const useConfirm = () => {
    const context = useContext(ConfirmationContext);
    if (!context) {
        throw new Error("useConfirm must be used within a ConfirmationProvider");
    }
    return context;
};
