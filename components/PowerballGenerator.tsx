import React from 'react';

const PowerballGenerator: React.FC = () => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Números da Powerball</h2>
                <p className="text-slate-400 mb-4">Gere números aleatórios da loteria Powerball.</p>
                 <div className="mt-4 flex justify-center">
                    <button
                        className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        Gerar Números
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PowerballGenerator;