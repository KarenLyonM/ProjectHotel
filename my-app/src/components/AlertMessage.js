import React from 'react';

const AlertMessage = ({ showAlert, message, onClose }) => {
    if (!showAlert) {
        return null;
    }

    return (
        <div className="fixed inset-0  mx-0 flex items-center justify-center z-50 w-full">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md relative">
                <strong className="font-bold">Sin resultados disponibles</strong>
                <div>
                    <span className="block sm:inline">{message}</span>
                </div>
                <button onClick={onClose} className="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1">
                    <svg className="fill-current h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                </button>
            </div>
        </div>
    );
}

export default AlertMessage;
