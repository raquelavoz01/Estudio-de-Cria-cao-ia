import React, { useState, useCallback, useRef } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';
import { UploadIcon } from './Icons';

const ImageDescriptionGenerator: React.FC = () => {
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setSourceImage(e.target?.result as string);
            setDescription(null); // Clear previous result
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const handleGenerateDescription = useCallback(async () => {
        if (!sourceImage) {
            setError('Por favor, envie uma imagem para descrever.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setDescription(null);

        try {
            const [header, base64Data] = sourceImage.split(',');
            const mimeTypeMatch = header.match(/:(.*?);/);
            if (!mimeTypeMatch || !base64Data) {
                throw new Error("Formato de imagem inválido.");
            }
            const mimeType = mimeTypeMatch[1];
            
            const result = await geminiService.generateImageDescription(base64Data, mimeType);
            setDescription(result);
        } catch (e) {
            setError('Falha ao gerar a descrição. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [sourceImage]);


    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Descrição de Imagem</h2>
                <p className="text-slate-400 mb-4">Envie uma imagem e a IA irá descrevê-la para você. Útil para acessibilidade (texto alternativo) e análise de conteúdo.</p>
                
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full max-w-md aspect-video bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-purple-500 hover:text-purple-400 transition-colors"
                    >
                        {sourceImage ? (
                            <img src={sourceImage} alt="Imagem de origem" className="max-w-full max-h-full object-contain rounded-md" />
                        ) : (
                            <>
                                <UploadIcon />
                                <span className="mt-2 text-sm font-semibold">Clique para enviar imagem</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleGenerateDescription}
                        disabled={isLoading || !sourceImage}
                        className="w-full max-w-md px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Descrição'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}

            {(isLoading || description) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[150px]"><Loader /></div>
                    ) : (
                        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                           {description}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageDescriptionGenerator;