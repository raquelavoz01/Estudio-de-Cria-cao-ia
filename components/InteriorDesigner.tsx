
import React, { useState, useCallback, useRef } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';
import { DownloadIcon, UploadIcon } from './Icons';

const InteriorDesigner: React.FC = () => {
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('um estilo moderno e minimalista com cores neutras e toques de madeira clara');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setSourceImage(e.target?.result as string);
            setGeneratedImage(null);
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const handleGenerateDesign = useCallback(async () => {
        if (!sourceImage) {
            setError('Por favor, envie uma foto do seu espaço.');
            return;
        }
        if (!prompt) {
            setError('Por favor, descreva o estilo de design que você deseja.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const [header, base64Data] = sourceImage.split(',');
            const mimeTypeMatch = header.match(/:(.*?);/);
            if (!mimeTypeMatch || !base64Data) {
                throw new Error("Formato de imagem inválido.");
            }
            const mimeType = mimeTypeMatch[1];
            
            const imageUrl = await geminiService.redesignInterior(base64Data, mimeType, prompt);
            setGeneratedImage(imageUrl);
        } catch (e) {
            setError('Falha ao gerar o design. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [sourceImage, prompt]);

    const handleDownload = () => {
        if (!generatedImage) return;
        const a = document.createElement('a');
        a.href = generatedImage;
        a.download = `ia_design_interior_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Designer de Interiores com IA</h2>
                <p className="text-slate-400 mb-6">Tire uma foto do seu espaço, descreva o estilo dos seus sonhos e deixe a IA redesenhá-lo em segundos.</p>
                
                <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-slate-400">1. Envie uma foto do seu espaço</label>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full aspect-video bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-purple-500 hover:text-purple-400 transition-colors"
                            >
                                {sourceImage ? (
                                    <img src={sourceImage} alt="Espaço original" className="max-w-full max-h-full object-contain rounded-md" />
                                ) : (
                                    <><UploadIcon /><span className="mt-2 text-sm font-semibold">Clique para enviar</span></>
                                )}
                            </button>
                        </div>
                        <div>
                            <label htmlFor="prompt-input" className="block mb-2 text-sm font-medium text-slate-400">2. Descreva o estilo desejado</label>
                            <textarea
                                id="prompt-input"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ex: Estilo escandinavo, com muita luz natural e plantas."
                                className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                            />
                        </div>
                        <button
                            onClick={handleGenerateDesign}
                            disabled={isLoading || !sourceImage}
                            className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                        >
                            {isLoading ? <Loader /> : 'Redesenhar com IA'}
                        </button>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="block mb-2 text-sm font-medium text-slate-400">3. Resultado Gerado</label>
                        <div className="w-full aspect-video bg-slate-900 border border-slate-700 rounded-lg flex flex-col items-center justify-center">
                            {isLoading ? (
                                <Loader />
                            ) : generatedImage ? (
                                <div className="p-2 text-center">
                                    <img src={generatedImage} alt="Design gerado" className="rounded-lg max-w-full max-h-[400px] object-contain mb-4" />
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 mx-auto px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors shadow-md"
                                    >
                                        <DownloadIcon /> Baixar Design
                                    </button>
                                </div>
                            ) : (
                                <p className="text-slate-500 p-4 text-center">O seu novo design de interiores aparecerá aqui.</p>
                            )}
                        </div>
                    </div>
                </div>

                 {error && <div className="mt-4 bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            </div>
        </div>
    );
};

export default InteriorDesigner;
