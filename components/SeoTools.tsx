
import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

interface SeoResult {
    title: string;
    description: string;
}

const SeoTools: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [metadata, setMetadata] = useState<SeoResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!topic) {
            setError('Por favor, insira o tópico da sua página.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setMetadata(null);
        try {
            const result = await geminiService.generateSeoMetadata(topic);
            setMetadata(result);
        } catch (e) {
            setError('Falha ao gerar metadados de SEO. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [topic]);

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Título SEO e Meta Descrições</h2>
                <p className="text-slate-400 mb-4">Melhore o ranking do seu site nos mecanismos de busca. Insira o tópico da sua página para gerar metadados otimizados.</p>
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: uma loja online de plantas raras e exóticas"
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Metadados'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {isLoading && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex justify-center">
                    <Loader />
                </div>
            )}

            {metadata && !isLoading && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg space-y-4">
                    <div>
                        <h3 className="text-lg font-bold text-purple-300 mb-2">Título de SEO Sugerido</h3>
                        <div className="bg-slate-700 p-3 rounded-lg">
                            <p className="text-slate-300">{metadata.title}</p>
                            <span className="text-xs font-mono text-slate-400">{metadata.title.length} caracteres</span>
                             <button onClick={() => handleCopyToClipboard(metadata.title)} className="ml-4 text-xs font-semibold text-cyan-400 hover:text-cyan-300">
                                Copiar
                            </button>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-bold text-purple-300 mb-2">Meta Descrição Sugerida</h3>
                        <div className="bg-slate-700 p-3 rounded-lg">
                            <p className="text-slate-300">{metadata.description}</p>
                            <span className="text-xs font-mono text-slate-400">{metadata.description.length} caracteres</span>
                             <button onClick={() => handleCopyToClipboard(metadata.description)} className="ml-4 text-xs font-semibold text-cyan-400 hover:text-cyan-300">
                                Copiar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeoTools;