
import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

interface MusicResult {
    title: string;
    style: string;
    lyrics: string;
}

const MusicGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedMusic, setGeneratedMusic] = useState<MusicResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!prompt) {
            setError('Por favor, insira um tema ou ideia para a música.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedMusic(null);
        try {
            const result = await geminiService.generateMusic(prompt);
            setGeneratedMusic(result);
        } catch (e) {
            setError('Falha ao gerar a música. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [prompt]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Músicas com IA</h2>
                <p className="text-slate-400 mb-4">Descreva o tema, gênero ou sentimento da sua música, e a IA criará uma letra original para você.</p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: uma canção de rock sobre a liberdade de dirigir em uma estrada deserta à noite"
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Letra'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || generatedMusic) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                             <Loader />
                        </div>
                    ) : generatedMusic ? (
                        <div className="prose prose-invert max-w-none text-slate-300">
                            <h3 className="text-2xl font-bold text-purple-300">{generatedMusic.title}</h3>
                            <p className="italic text-slate-400">Estilo: {generatedMusic.style}</p>
                            <hr className="border-slate-700 my-4" />
                            <p className="whitespace-pre-wrap">{generatedMusic.lyrics}</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default MusicGenerator;
