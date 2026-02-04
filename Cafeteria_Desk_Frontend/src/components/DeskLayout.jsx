import React, { useMemo } from 'react';

const DeskLayout = ({ desks, bookings, onSelectDesk, selectedDeskId, isAdmin, onCancelBooking }) => {

    // Group desks by block
    const blocks = useMemo(() => {
        const groups = {};
        desks.forEach(desk => {
            const block = desk.block || "Unassigned";
            if (!groups[block]) {
                groups[block] = {
                    name: `Zone ${block}`, // Can be mapped to real names like "Quiet Zone" if backend returns it
                    desks: [],
                    maxRow: 0,
                    maxCol: 0
                };
            }
            groups[block].desks.push(desk);
            groups[block].maxRow = Math.max(groups[block].maxRow, desk.row || 0);
            groups[block].maxCol = Math.max(groups[block].maxCol, desk.col || 0);
        });
        return Object.keys(groups).sort().map(key => groups[key]);
    }, [desks]);

    return (
        <div className="p-6 bg-white rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                🏢 Office Floor Map
            </h3>

            <div className="space-y-12">
                {blocks.map((block) => (
                    <div key={block.name} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                            {block.name}
                        </h4>

                        <div
                            className="grid gap-3 justify-start"
                            style={{
                                display: 'grid',
                                gridTemplateRows: `repeat(${block.maxRow}, 1fr)`,
                                gridTemplateColumns: `repeat(${block.maxCol}, 1fr)`,
                                width: 'fit-content'
                            }}
                        >
                            {block.desks.map((desk) => {
                                const isBooked = bookings && bookings[desk.id];
                                const isSelected = selectedDeskId === desk.id;
                                const isMaintenance = desk.status.toLowerCase() === 'maintenance';

                                let bgColor = "bg-white border-gray-200 hover:border-indigo-400 hover:shadow-md";
                                let textColor = "text-gray-600";
                                let cursor = "cursor-pointer";

                                if (isBooked) {
                                    bgColor = "bg-red-50 border-red-200";
                                    textColor = "text-red-400";
                                    cursor = isAdmin ? "cursor-pointer" : "cursor-not-allowed";
                                } else if (isMaintenance) {
                                    bgColor = "bg-gray-100 border-gray-200 opacity-60";
                                    textColor = "text-gray-400";
                                    cursor = "cursor-not-allowed";
                                } else if (isSelected) {
                                    bgColor = "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200 transform scale-105";
                                    textColor = "text-white";
                                } else {
                                    // Available default
                                    bgColor = "bg-emerald-50 border-emerald-200 hover:bg-emerald-100";
                                    textColor = "text-emerald-700";
                                }

                                return (
                                    <div
                                        key={desk.id}
                                        onClick={() => {
                                            if (isBooked && isAdmin && onCancelBooking) {
                                                onCancelBooking(isBooked.id); // isBooked is the booking object
                                                return;
                                            }
                                            if (!isBooked && !isMaintenance && onSelectDesk) {
                                                onSelectDesk(desk);
                                            }
                                        }}
                                        className={`
                                            relative w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 flex items-center justify-center 
                                            transition-all duration-200 ${bgColor} ${cursor}
                                        `}
                                        style={{
                                            gridRow: desk.row,
                                            gridColumn: desk.col
                                        }}
                                        title={`${desk.location} - ${desk.desk_code}`}
                                    >
                                        <span className={`text-xs font-bold ${textColor}`}>
                                            {desk.desk_code.split('-').pop()} {/* Show just number if simpler, or code */}
                                        </span>

                                        {/* Chair Indicator (Pure Visual) */}
                                        <div className={`absolute -bottom-1 w-8 h-1 rounded-full ${isSelected ? 'bg-indigo-700' : 'bg-gray-200'}`}></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-6 justify-center text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-emerald-50 border-2 border-emerald-200"></div>
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-indigo-600 border-2 border-indigo-600"></div>
                    <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-red-50 border-2 border-red-200"></div>
                    <span>Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-gray-100 border-2 border-gray-200"></div>
                    <span>Maintenance</span>
                </div>
            </div>
        </div>
    );
};

export default DeskLayout;
