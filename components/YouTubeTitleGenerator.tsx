import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const YouTubeTitleGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [titles, setTitles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!topic) {
            setError('Por favor, insira um tópico para gerar os títulos.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setTitles([]);
        try {
            const result = await geminiService.generateYouTubeVideoTitles(topic);
            setTitles(result);
        } catch (e) {
            setError('Falha ao gerar os títulos. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [topic]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Títulos para Vídeos do YouTube</h2>
                <p className="text-slate-400 mb-4">Crie títulos atraentes para seus vídeos do YouTube em segundos!</p>
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: os erros mais comuns que fotógrafos iniciantes cometem"
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Títulos'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || titles.length > 0) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                             <Loader />
                        </div>
                    ) : (
                         <div className="space-y-3">
                            <h3 className="text-xl font-bold text-purple-300 mb-2">Títulos Sugeridos</h3>
                            {titles.map((title, i) => (
                                <div key={i} className="p-3 bg-slate-700 rounded-lg text-slate-300">
                                    {title}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default YouTubeTitleGenerator;