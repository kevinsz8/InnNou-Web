import React, { createContext, useContext, useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { registerErrorModal } from "./errorModalService";

interface ErrorContextType {
    showError: (message: string) => void;
    hideError: () => void;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

export const useError = () => {
    const ctx = useContext(ErrorContext);
    if (!ctx) throw new Error("useError must be used inside ErrorProvider");
    return ctx;
};

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const showError = (msg: string) => {
        setMessage(msg);
        setOpen(true);
    };

    const hideError = () => {
        setOpen(false);
        setMessage("");
    };

    //  conectar con el handler global
    useEffect(() => {
        registerErrorModal(showError);
    }, []);

    return (
        <ErrorContext.Provider value={{ showError, hideError }}>
            {children}

            {/*  GLOBAL MODAL */}
            <Modal open={open} onClose={hideError}>
                <h2 className="text-red-600 font-bold mb-2">
                    Something went wrong
                </h2>

                <p className="text-slate-600">{message}</p>
            </Modal>
        </ErrorContext.Provider>
    );
};