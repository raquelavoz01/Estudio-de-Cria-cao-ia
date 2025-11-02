
import React, { useState, useCallback, useRef } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';
import { DownloadIcon, UploadIcon } from './Icons';

const PortraitStudio: React.FC = () => {
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [style, setStyle] = useState('Corporativo');
    const [generatedPortrait, setGeneratedPortrait] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setSourceImage(e.target?.result as string);
            setGeneratedPortrait(null); // Clear previous result
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const handleGeneratePortrait = useCallback(async () => {
        if (!sourceImage) {
            setError('Por favor, envie uma imagem de origem.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedPortrait(null);

        try {
            const [header, base64Data] = sourceImage.split(',');
            const mimeTypeMatch = header.match(/:(.*?);/);
            if (!mimeTypeMatch || !base64Data) {
                throw new Error("Formato de imagem inválido.");
            }
            const mimeType = mimeTypeMatch[1];
            
            const imageUrl = await geminiService.generatePortrait(base64Data, mimeType, style);
            setGeneratedPortrait(imageUrl);
        } catch (e) {
            setError('Falha ao gerar o retrato. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [sourceImage, style]);

    const handleDownload = () => {
        if (!generatedPortrait) return;
        const a = document.createElement('a');
        a.href = generatedPortrait;
        a.download = `ia_portrait_${style.toLowerCase()}_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Estúdio de Retratos IA</h2>
                <p className="text-slate-400 mb-4">Transforme suas fotos em retratos profissionais. Envie uma selfie e escolha um estilo para começar.</p>
                
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                         <label className="block mb-2 text-sm font-medium text-slate-400">1. Envie sua foto</label>
                         <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-square bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-purple-500 hover:text-purple-400 transition-colors"
                         >
                            {sourceImage ? (
                                <img src={sourceImage} alt="Imagem de origem" className="max-w-full max-h-full object-contain rounded-md" />
                            ) : (
                                <>
                                    <UploadIcon />
                                    <span className="mt-2 text-sm font-semibold">Clique para enviar</span>
                                </>
                            )}
                         </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="style-select" className="block mb-2 text-sm font-medium text-slate-400">2. Escolha um estilo</label>
                            <select
                                id="style-select"
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                            >
                                <option>Corporativo</option>
                                <option>Criativo</option>
                                <option>Rede Social</option>
                                <option>Cinematográfico</option>
                            </select>
                        </div>
                        <button
                            onClick={handleGeneratePortrait}
                            disabled={isLoading || !sourceImage}
                            className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                        >
                            {isLoading ? <Loader /> : 'Gerar Retrato Profissional'}
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}

            <div className="bg-slate-800 p-6 rounded-xl shadow-lg min-h-[400px] flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-white mb-4">Seu Retrato Gerado</h3>
                {isLoading ? (
                    <Loader />
                ) : generatedPortrait ? (
                    <div className="text-center">
                        <img src={generatedPortrait} alt="Retrato gerado" className="rounded-lg max-w-full max-h-[500px] object-contain mb-4" />
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 mx-auto px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors shadow-md"
                        >
                            <DownloadIcon /> Baixar Retrato
                        </button>
                    </div>
                ) : (
                    <p className="text-slate-500">O retrato gerado por IA aparecerá aqui.</p>
                )}
            </div>
        </div>
    );
};

export default PortraitStudio;
