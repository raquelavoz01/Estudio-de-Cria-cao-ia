import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const ReelsScriptGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [script, setScript] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!topic) {
            setError('Por favor, insira um tópico para o roteiro.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setScript([]);
        try {
            const result = await geminiService.generateReelsScript(topic);
            setScript(result);
        } catch (e) {
            setError('Falha ao gerar o roteiro. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [topic]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Roteiros de Reels</h2>
                <p className="text-slate-400 mb-4">Crie roteiros envolventes para seus vídeos do Instagram Reels ou TikTok sem esforço algum!</p>
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: como fazer o café gelado perfeito em casa"
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Roteiro'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || script.length > 0) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[200px]"><Loader /></div>
                    ) : (
                        <div>
                            <h3 className="text-xl font-bold text-purple-300 mb-2">Roteiro Sugerido</h3>
                            <ul className="list-decimal list-inside space-y-2 text-slate-300">
                                {script.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReelsScriptGenerator;