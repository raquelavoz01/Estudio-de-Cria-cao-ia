
import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const YouTubeToArticle: React.FC = () => {
    const [summary, setSummary] = useState('');
    const [article, setArticle] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!summary) {
            setError('Por favor, insira o tópico ou um resumo do vídeo.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setArticle(null);
        try {
            const result = await geminiService.generateArticleFromYouTubeSummary(summary);
            setArticle(result);
        } catch (e) {
            setError('Falha ao gerar o artigo. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [summary]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Artigos a partir de Vídeos do YouTube</h2>
                <p className="text-slate-400 mb-4">Reaproveite seu conteúdo de vídeo. Insira o tópico ou um resumo do seu vídeo do YouTube e a IA o transformará em um post de blog.</p>
                <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Ex: um vídeo sobre as 5 melhores ferramentas de IA para desenvolvedores em 2024"
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Converter para Artigo'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || article) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[300px]">
                             <Loader />
                        </div>
                    ) : article ? (
                        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                           {article}
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default YouTubeToArticle;