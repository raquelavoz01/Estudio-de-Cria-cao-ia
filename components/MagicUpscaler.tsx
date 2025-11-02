
import React, { useState, useCallback, useRef } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';
import { DownloadIcon, UploadIcon } from './Icons';

const MagicUpscaler: React.FC = () => {
    const [sourceImage, setSourceImage] = useState<string | null>(null);
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

    const handleUpscaleImage = useCallback(async () => {
        if (!sourceImage) {
            setError('Por favor, envie uma imagem para otimizar.');
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
            
            const imageUrl = await geminiService.upscaleImage(base64Data, mimeType);
            setGeneratedImage(imageUrl);
        } catch (e) {
            setError('Falha ao otimizar a imagem. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [sourceImage]);

    const handleDownload = () => {
        if (!generatedImage) return;
        const a = document.createElement('a');
        a.href = generatedImage;
        a.download = `ia_otimizada_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Otimizador de Imagem Mágico</h2>
                <p className="text-slate-400 mb-6">Melhore a resolução e restaure fotos antigas ou de baixa qualidade com um único clique.</p>

                <div className="flex flex-col items-center gap-4">
                    <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full max-w-md flex justify-center items-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors shadow-md"
                    >
                        <UploadIcon /> {sourceImage ? 'Trocar Imagem' : 'Enviar Imagem'}
                    </button>
                    {sourceImage && (
                        <button
                            onClick={handleUpscaleImage}
                            disabled={isLoading || !sourceImage}
                            className="w-full max-w-md px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                        >
                            {isLoading ? <Loader /> : 'Otimizar Imagem com IA'}
                        </button>
                    )}
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}

            {(sourceImage || isLoading) && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 p-4 rounded-xl shadow-lg">
                        <h3 className="text-lg font-bold text-slate-300 mb-2 text-center">Original</h3>
                        <div className="aspect-square bg-slate-900 rounded-lg flex items-center justify-center p-2">
                             {sourceImage && <img src={sourceImage} alt="Imagem original" className="max-w-full max-h-full object-contain" />}
                        </div>
                    </div>
                     <div className="bg-slate-800 p-4 rounded-xl shadow-lg">
                        <h3 className="text-lg font-bold text-slate-300 mb-2 text-center">Resultado Otimizado</h3>
                        <div className="aspect-square bg-slate-900 rounded-lg flex flex-col items-center justify-center p-2">
                            {isLoading && <Loader />}
                            {!isLoading && generatedImage && (
                                <>
                                    <img src={generatedImage} alt="Imagem otimizada" className="max-w-full max-h-full object-contain mb-4" />
                                     <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 mx-auto px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors shadow-md"
                                    >
                                        <DownloadIcon /> Baixar Imagem
                                    </button>
                                </>
                            )}
                            {!isLoading && !generatedImage && <p className="text-slate-500">A imagem otimizada aparecerá aqui.</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MagicUpscaler;
