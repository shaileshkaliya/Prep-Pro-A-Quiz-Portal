import React from 'react';

const NumberGrid = (Question) => {
    return (
        <div className="grid grid-cols-5 gap-1 w-2/12">
            {[...Array(40)].map((_, i) => (
                <div
                    key={i + 1}
                    className={`rounded-md px-4 py-2 text-center font-bold w-12 ${i < 20 ? 'bg-green-400 text-white' : 'bg-gray-300'
                        }`}
                >
                    {i + 1}
                </div>
            ))}
        </div>
    );
};

export default NumberGrid;
