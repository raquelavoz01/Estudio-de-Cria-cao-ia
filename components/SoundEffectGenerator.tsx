
import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const SoundEffectGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [description, setDescription] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!prompt) {
            setError('Por favor, insira uma descrição para o efeito sonoro.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setDescription(null);
        try {
            const result = await geminiService.generateSoundEffectDescription(prompt);
            setDescription(result);
        } catch (e) {
            setError('Falha ao gerar a descrição. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [prompt]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Efeitos Sonoros (Descrição)</h2>
                <p className="text-slate-400 mb-4">Precisa de um som específico? Descreva-o e a IA criará uma descrição detalhada para ajudar na sua criação.</p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: o som de um portal mágico se abrindo com energia crepitante"
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Descrição'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || description) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[150px]">
                             <Loader />
                        </div>
                    ) : description ? (
                        <div className="prose prose-invert max-w-none text-slate-300">
                            <h3 className="text-xl font-bold text-purple-300">Descrição do Efeito Sonoro</h3>
                            <hr className="border-slate-700 my-2" />
                            <p className="whitespace-pre-wrap">{description}</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default SoundEffectGenerator;
