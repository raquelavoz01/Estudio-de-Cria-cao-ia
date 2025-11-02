import React from 'react';
import { UploadIcon } from './Icons';

const PdfSummarizer: React.FC = () => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Resumo de PDF</h2>
                <p className="text-slate-400 mb-4">Resuma documentos PDF com facilidade. Envie seu arquivo para começar.</p>
                <div className="mt-4 flex flex-col items-center gap-4">
                     <button
                        className="w-full max-w-md flex justify-center items-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors shadow-md"
                    >
                        <UploadIcon /> Enviar PDF
                    </button>
                    <button
                        className="w-full max-w-md px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        Gerar Resumo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PdfSummarizer;