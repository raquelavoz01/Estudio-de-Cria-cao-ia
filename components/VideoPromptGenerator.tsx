import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

interface VideoPrompt {
    prompt: string;
    camera: string;
    style: string;
    fx: string;
}

const VideoPromptGenerator: React.FC = () => {
    const [idea, setIdea] = useState('');
    const [prompt, setPrompt] = useState<VideoPrompt | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!idea) {
            setError('Por favor, insira uma ideia para o prompt de vídeo.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setPrompt(null);
        try {
            const result = await geminiService.generateVideoPrompt(idea);
            setPrompt(result);
        } catch (e) {
            setError('Falha ao gerar o prompt. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [idea]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Prompts de Vídeo</h2>
                <p className="text-slate-400 mb-4">Gere prompts de vídeo usando direção de câmera, estilo, ritmo, efeitos especiais e muito mais.</p>
                <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Ex: um gato cyberpunk dirigindo uma moto voadora em uma cidade chuvosa à noite"
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Prompt'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || prompt) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[200px]"><Loader /></div>
                    ) : (
                         <div className="space-y-4">
                            <h3 className="text-xl font-bold text-purple-300 mb-2">Prompt de Vídeo Detalhado</h3>
                            <div>
                                <h4 className="font-semibold text-slate-300">Descrição Visual:</h4>
                                <p className="p-2 bg-slate-700 rounded-md text-slate-300">{prompt.prompt}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-slate-300">Direção da Câmera:</h4>
                                <p className="p-2 bg-slate-700 rounded-md text-slate-300">{prompt.camera}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-slate-300">Estilo Visual:</h4>
                                <p className="p-2 bg-slate-700 rounded-md text-slate-300">{prompt.style}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-slate-300">Efeitos Especiais:</h4>
                                <p className="p-2 bg-slate-700 rounded-md text-slate-300">{prompt.fx}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VideoPromptGenerator;