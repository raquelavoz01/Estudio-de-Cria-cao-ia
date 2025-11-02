import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

interface TopicsResult {
    topics: string[];
    bullets: string[];
}

const TopicGenerator: React.FC = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState<TopicsResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!text) {
            setError('Por favor, insira um texto para análise.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const generatedResult = await geminiService.generateTopicsAndBullets(text);
            setResult(generatedResult);
        } catch (e) {
            setError('Falha ao gerar tópicos. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [text]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Tópicos e Marcadores</h2>
                <p className="text-slate-400 mb-4">Extraia tópicos principais e marcadores do seu texto para um resumo rápido.</p>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Cole seu texto aqui para extrair os pontos principais..."
                    className="w-full h-40 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Extrair Tópicos'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {isLoading && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex justify-center">
                    <Loader />
                </div>
            )}

            {result && !isLoading && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-purple-300 mb-2">Tópicos Principais</h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                           {result.topics.map((topic, i) => <li key={`topic-${i}`}>{topic}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-xl font-bold text-purple-300 mb-2">Pontos-chave</h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            {result.bullets.map((bullet, i) => <li key={`bullet-${i}`}>{bullet}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopicGenerator;
