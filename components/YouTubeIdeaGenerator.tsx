import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

interface VideoIdea {
    title: string;
    hook: string;
    description: string;
}

const YouTubeIdeaGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [ideas, setIdeas] = useState<VideoIdea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!topic) {
            setError('Por favor, insira um tópico para gerar ideias.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setIdeas([]);
        try {
            const result = await geminiService.generateYouTubeVideoIdeas(topic);
            setIdeas(result);
        } catch (e) {
            setError('Falha ao gerar ideias. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [topic]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Ideias para Vídeos do YouTube</h2>
                <p className="text-slate-400 mb-4">Inspire-se para fazer seu próximo vídeo no YouTube! Insira um tópico e obtenha ideias completas.</p>
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: receitas fáceis e saudáveis para estudantes"
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Ideias'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {isLoading && (
                 <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex justify-center">
                    <Loader />
                </div>
            )}
            
            {ideas.length > 0 && !isLoading && (
                <div className="space-y-4">
                    {ideas.map((idea, index) => (
                        <div key={index} className="bg-slate-800 p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-bold text-purple-300 mb-2">{idea.title}</h3>
                            <div className="space-y-3 text-slate-300">
                                <p><strong className="text-slate-100">Gancho (Hook):</strong> {idea.hook}</p>
                                <p><strong className="text-slate-100">Descrição:</strong> {idea.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default YouTubeIdeaGenerator;