import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const TextShortener: React.FC = () => {
    const [text, setText] = useState('');
    const [shortenedText, setShortenedText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!text) {
            setError('Por favor, insira o texto que deseja encurtar.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setShortenedText(null);
        try {
            const result = await geminiService.shortenText(text);
            setShortenedText(result);
        } catch (e) {
            setError('Falha ao encurtar o texto. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [text]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Encurtador de Texto</h2>
                <p className="text-slate-400 mb-4">Encurte seu texto para as partes mais importantes, sem perder o sentido.</p>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Cole seu texto longo aqui..."
                    className="w-full h-40 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Encurtar Texto'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || shortenedText) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[150px]">
                             <Loader />
                        </div>
                    ) : shortenedText ? (
                        <div>
                            <h3 className="text-xl font-bold text-purple-300 mb-2">Texto Resumido</h3>
                            <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                               {shortenedText}
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default TextShortener;
