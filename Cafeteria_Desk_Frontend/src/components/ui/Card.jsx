import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Card = ({ children, className = '', noPadding = false }) => (
    <div className={`bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-lg border border-white/50 ${noPadding ? '' : 'p-8'} ${className}`}>
        {children}
    </div>
);

export const StatCard = ({ title, value, icon: Icon, color = 'indigo' }) => {
    const colorStyles = {
        indigo: 'bg-indigo-100 text-indigo-600',
        green: 'bg-green-100 text-green-600',
        red: 'bg-red-100 text-red-600',
        orange: 'bg-orange-100 text-orange-600',
        blue: 'bg-blue-100 text-blue-600',
        purple: 'bg-purple-100 text-purple-600',
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{value}</h3>
                </div>
                {Icon && (
                    <div className={`p-3 rounded-xl ${colorStyles[color] || colorStyles.indigo}`}>
                        <Icon size={24} />
                    </div>
                )}
            </div>
        </div>
    );
};

import Button from './Button';

export const ActionCard = ({ title, desc, icon, path, onClick, big = false }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) onClick();
        if (path) navigate(path);
    };

    return (
        <div
            onClick={handleClick}
            className={`group relative overflow-hidden rounded-[2rem] bg-white/80 backdrop-blur-xl shadow-lg border border-white/50 
        hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer
        ${big ? "p-10 min-h-[260px] flex flex-col justify-end" : "p-8"}
      `}
        >
            {/* Background Icon Decoration */}
            <div className="absolute -top-6 -right-6 text-9xl text-gray-900/[0.03] group-hover:text-indigo-600/[0.05] transition-colors duration-500 select-none">
                {icon}
            </div>

            <div className="relative z-10">
                <div className={`text-indigo-600 mb-4 ${big ? 'mb-6' : ''}`}>
                    <span className="text-4xl">{icon}</span>
                </div>

                <h3 className={`font-bold text-gray-800 leading-tight ${big ? "text-2xl mb-2" : "text-xl mb-1"}`}>
                    {title}
                </h3>

                <p className="text-gray-500 font-medium leading-relaxed max-w-sm mb-6">
                    {desc}
                </p>

                <div className="mt-auto">
                    <Button
                        variant="primary"
                        size={big ? "lg" : "md"}
                        className="shadow-indigo-200 group-hover:scale-105 transition-transform"
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick();
                        }}
                    >
                        Open
                    </Button>
                </div>
            </div>
        </div>
    );
};
