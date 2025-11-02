
import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const InstagramCaption: React.FC = () => {
    const [description, setDescription] = useState('');
    const [captions, setCaptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!description) {
            setError('Por favor, descreva sua postagem.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setCaptions([]);
        try {
            const result = await geminiService.generateInstagramCaptions(description);
            setCaptions(result);
        } catch (e) {
            setError('Falha ao gerar legendas. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [description]);
    
    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Maybe add a toast notification here in the future
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Legendas para Instagram</h2>
                <p className="text-slate-400 mb-4">Não sabe o que escrever? Descreva sua foto ou vídeo e deixe a IA criar legendas cativantes para você.</p>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: uma foto de uma praia ensolarada com coqueiros e um mar azul cristalino"
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Legendas'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {isLoading && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex justify-center">
                    <Loader />
                </div>
            )}

            {captions.length > 0 && !isLoading && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg space-y-4">
                    <h3 className="text-xl font-bold text-white">Sugestões de Legenda:</h3>
                     {captions.map((caption, index) => (
                        <div key={index} className="bg-slate-700 p-4 rounded-lg">
                            <p className="whitespace-pre-wrap text-slate-300">{caption}</p>
                            <button onClick={() => handleCopyToClipboard(caption)} className="mt-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300">
                                Copiar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstagramCaption;