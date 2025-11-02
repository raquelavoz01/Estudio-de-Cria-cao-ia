import React from 'react';

const GrammarChecker: React.FC = () => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Corretor Gramatical</h2>
                <p className="text-slate-400 mb-4">Certifique-se de que sua escrita não tenha erros!</p>
                <textarea
                    placeholder="Cole seu texto aqui para verificar a gramática..."
                    className="w-full h-40 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        Verificar Texto
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GrammarChecker;