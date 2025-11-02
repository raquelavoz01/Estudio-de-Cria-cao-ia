import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

interface BriefResult {
    targetKeywords: string[];
    suggestedTitles: string[];
    structure: string[];
}

const SeoContentBrief: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [brief, setBrief] = useState<BriefResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!topic) {
            setError('Por favor, insira um tópico para o briefing.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setBrief(null);
        try {
            const result = await geminiService.generateSeoContentBrief(topic);
            setBrief(result);
        } catch (e) {
            setError('Falha ao gerar o briefing. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [topic]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Resumo de Conteúdo de SEO</h2>
                <p className="text-slate-400 mb-4">Gere briefings de conteúdo de SEO que geram resultados! Planeje seu conteúdo com palavras-chave, títulos e estrutura.</p>
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: as melhores práticas para SEO em e-commerce em 2024"
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Briefing'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {isLoading && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex justify-center"><Loader /></div>
            )}

            {brief && !isLoading && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-purple-300 mb-2">Palavras-chave Alvo</h3>
                        <div className="flex flex-wrap gap-2">
                            {brief.targetKeywords.map((kw, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-700 text-cyan-300 rounded-full text-sm font-medium">{kw}</span>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-bold text-purple-300 mb-2">Títulos Sugeridos</h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            {brief.suggestedTitles.map((title, i) => <li key={i}>{title}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-purple-300 mb-2">Estrutura Sugerida</h3>
                        <ul className="list-decimal list-inside space-y-2 text-slate-300">
                           {brief.structure.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeoContentBrief;