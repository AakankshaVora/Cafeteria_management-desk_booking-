import React from 'react';

export const TableContainer = ({ children, title, actions }) => (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-lg border border-white/50 overflow-hidden flex flex-col h-full">
        {(title || actions) && (
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {title && <h2 className="text-xl font-bold text-gray-800">{title}</h2>}
                {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
        )}
        <div className="overflow-x-auto flex-1 w-full">
            <table className="w-full text-left border-collapse">
                {children}
            </table>
        </div>
    </div>
);

export const Thead = ({ children }) => (
    <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold">
        <tr>{children}</tr>
    </thead>
);

export const Th = ({ children, className = '' }) => (
    <th className={`px-6 py-4 font-semibold tracking-wide ${className}`}>
        {children}
    </th>
);

export const Tbody = ({ children }) => (
    <tbody className="text-gray-700 divide-y divide-gray-50 font-medium">
        {children}
    </tbody>
);

export const Tr = ({ children, className = '', onClick }) => (
    <tr
        onClick={onClick}
        className={`hover:bg-indigo-50/30 transition-colors duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
        {children}
    </tr>
);

export const Td = ({ children, className = '' }) => (
    <td className={`px-6 py-4 vertical-top ${className}`}>
        {children}
    </td>
);
