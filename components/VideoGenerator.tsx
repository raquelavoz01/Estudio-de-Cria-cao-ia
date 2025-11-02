
import React, { useState, useEffect, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';
import { DownloadIcon } from './Icons';

const loadingMessages = [
    "Consultando as musas da criação...",
    "Renderizando pixels em movimento...",
    "Aguarde, a magia está acontecendo...",
    "Costurando frames para sua obra-prima...",
    "Quase lá, polindo os detalhes finais...",
];

const VideoGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [isAiStudioEnv, setIsAiStudioEnv] = useState(false);
    const [aistudioKeyRequired, setAistudioKeyRequired] = useState(false);
    
    useEffect(() => {
        const checkEnv = async () => {
            const inAiStudio = typeof window !== 'undefined' && !!window.aistudio;
            setIsAiStudioEnv(inAiStudio);
            if (inAiStudio) {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setAistudioKeyRequired(!hasKey);
            }
        };
        checkEnv();
    }, []);
    
    useEffect(() => {
        let interval: number;
        if (isLoading) {
            interval = window.setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % loadingMessages.length;
                    return loadingMessages[nextIndex];
                });
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleGenerateVideo = useCallback(async () => {
        if (!prompt) {
            setError('Por favor, insira uma descrição para o vídeo.');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setGeneratedVideo(null);
        setLoadingMessage(loadingMessages[0]);
        try {
            const videoUrl = await geminiService.generateVideo(prompt);
            setGeneratedVideo(videoUrl);
        } catch (e: any) {
            // A verificação principal de erro de chave já é feita em App.tsx
            // Esta é uma verificação secundária para o caso específico de chave inválida no AI Studio
            let message = 'Falha ao gerar o vídeo. Tente novamente.';
            if (isAiStudioEnv && e.message && e.message.includes("Requested entity was not found")) {
                message = "Sua Chave de API parece ser inválida. Por favor, selecione uma chave novamente.";
                setAistudioKeyRequired(true);
            }
            setError(message);
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, isAiStudioEnv]);
    
    const handleDownloadVideo = () => {
      if (!generatedVideo) return;
      const a = document.createElement('a');
      a.href = generatedVideo;
      a.download = `ia_video_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    const handleSelectApiKey = async () => {
        if (isAiStudioEnv && window.aistudio) {
            try {
                await window.aistudio.openSelectKey();
                setAistudioKeyRequired(false);
                setError(null);
            } catch (err) {
                setError("Não foi possível abrir o seletor de Chave de API.");
                console.error(err);
            }
        }
    };
    
    // Mostra a tela de seleção de chave APENAS se estiver no ambiente AI Studio e a chave não tiver sido selecionada.
    if (aistudioKeyRequired) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto text-center">
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-white">Chave de API Necessária</h2>
                    <p className="text-slate-400 mb-4">Para usar o Gerador de Vídeo, você precisa selecionar uma chave de API do Google AI Studio.</p>
                    <p className="text-slate-400 mb-6 text-sm">Os impostos podem ser aplicados. Consulte a <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">documentação de preços</a> para mais detalhes.</p>
                    <button
                        onClick={handleSelectApiKey}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                    >
                        Selecionar Chave de API
                    </button>
                    {error && <div className="mt-4 bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
                </div>
            </div>
        );
    }

    // Para usuários na Vercel, ou usuários no AI Studio que já selecionaram a chave, mostra o gerador.
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Vídeos</h2>
                <p className="text-slate-400 mb-4">Descreva a cena que você quer animar. A geração de vídeo pode levar alguns minutos.</p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: um close-up de uma gota de chuva caindo em uma poça em câmera lenta, cinematográfico"
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <button
                    onClick={handleGenerateVideo}
                    disabled={isLoading}
                    className="mt-4 w-full sm:w-auto px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                    {isLoading ? 'Gerando...' : 'Gerar Vídeo'}
                </button>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}

            <div className="bg-slate-800 p-6 rounded-xl shadow-lg min-h-[400px] flex flex-col items-center justify-center">
                {isLoading ? (
                    <div className="text-center">
                        <Loader />
                        <p className="mt-4 text-slate-400">{loadingMessage}</p>
                    </div>
                ) : generatedVideo ? (
                    <div className="text-center">
                        <video controls src={generatedVideo} className="rounded-lg max-w-full" />
                         <button
                            onClick={handleDownloadVideo}
                            className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors shadow-md"
                          >
                            <DownloadIcon /> Baixar Vídeo
                          </button>
                    </div>
                ) : (
                    <p className="text-slate-500">Seu vídeo gerado aparecerá aqui.</p>
                )}
            </div>
        </div>
    );
};

export default VideoGenerator;