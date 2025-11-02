
import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const ArticleWriter: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [article, setArticle] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!topic) {
            setError('Por favor, insira um tópico para o artigo.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setArticle(null);
        try {
            const result = await geminiService.generateSeoArticle(topic);
            setArticle(result);
        } catch (e) {
            setError('Falha ao gerar o artigo. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [topic]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Artigos com Um Clique</h2>
                <p className="text-slate-400 mb-4">Insira um tópico e a IA escreverá um artigo completo e otimizado para SEO para você em segundos.</p>
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Os benefícios da inteligência artificial no marketing digital"
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Artigo'}
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

export default ArticleWriter;