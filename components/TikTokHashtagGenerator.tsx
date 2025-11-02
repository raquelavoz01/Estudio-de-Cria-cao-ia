import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const TikTokHashtagGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!topic) {
            setError('Por favor, descreva o tópico do seu vídeo.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setHashtags([]);
        try {
            const result = await geminiService.generateTikTokHashtags(topic);
            setHashtags(result);
        } catch (e) {
            setError('Falha ao gerar hashtags. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [topic]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Hashtags para TikTok</h2>
                <p className="text-slate-400 mb-4">Obtenha mais seguidores e curtidas no TikTok com as hashtags certas. Descreva seu vídeo para obter uma lista de hashtags populares e de nicho.</p>
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: um tutorial de maquiagem para iniciantes"
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Hashtags'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || hashtags.length > 0) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[100px]">
                           <Loader />
                       </div>
                    ) : (
                        <div>
                            <h3 className="text-xl font-bold text-purple-300 mb-2">Hashtags Sugeridas</h3>
                            <div className="flex flex-wrap gap-2">
                                {hashtags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-700 text-cyan-300 rounded-full text-sm font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TikTokHashtagGenerator;