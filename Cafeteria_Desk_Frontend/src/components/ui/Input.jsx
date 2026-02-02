import React from 'react';

export const Input = ({ label, className = '', ...props }) => (
    <div className="w-full">
        {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
        <input
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 ${className}`}
            {...props}
        />
    </div>
);

export const Select = ({ label, children, className = '', ...props }) => (
    <div className="w-full">
        {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
        <div className="relative">
            <select
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-700 appearance-none cursor-pointer ${className}`}
                {...props}
            >
                {children}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    </div>
);

export const Textarea = ({ label, className = '', ...props }) => (
    <div className="w-full">
        {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
        <textarea
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none ${className}`}
            {...props}
        />
    </div>
);
