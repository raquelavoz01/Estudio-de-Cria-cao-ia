import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';
import { DownloadIcon } from './Icons';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isAnimeStyle, setIsAnimeStyle] = useState(false);
  const [isHyperRealistic, setIsHyperRealistic] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const promptErrorId = "prompt-error";

  const handleGenerateImage = useCallback(async () => {
    if (!prompt) {
      setError('Por favor, insira uma descrição para a imagem.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      let finalPrompt = prompt;
      if (isAnimeStyle) {
        finalPrompt = `anime style, ${finalPrompt}`;
      }
      if (isHyperRealistic) {
        finalPrompt = `photorealistic 4k, ultra-detailed, cinematic lighting, ${finalPrompt}`;
      }
      const imageUrl = await geminiService.generateImage(finalPrompt);
      setGeneratedImage(imageUrl);
    } catch (e) {
      setError('Falha ao gerar a imagem. Tente novamente.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isAnimeStyle, isHyperRealistic]);
  
  const handleDownloadImage = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `ia_image_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Imagens</h2>
        <p className="text-slate-400 mb-4">Descreva a imagem que você quer criar. Seja o mais detalhado possível para melhores resultados.</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: um astronauta cavalgando um cavalo cósmico em uma nebulosa, arte digital épica"
          className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
          aria-invalid={!!error}
          aria-describedby={error ? promptErrorId : undefined}
        />
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                        type="checkbox"
                        checked={isAnimeStyle}
                        onChange={(e) => setIsAnimeStyle(e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                    />
                    Estilo Anime
                </label>
                 <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                        type="checkbox"
                        checked={isHyperRealistic}
                        onChange={(e) => setIsHyperRealistic(e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                    />
                    Estilo Hiper-realista
                </label>
           </div>
            <button
              onClick={handleGenerateImage}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {isLoading ? <Loader /> : 'Gerar Imagem'}
            </button>
        </div>
      </div>

      {error && <div id={promptErrorId} role="alert" className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg min-h-[400px] flex flex-col items-center justify-center">
        {isLoading ? (
          <Loader />
        ) : generatedImage ? (
          <>
            <img src={generatedImage} alt="Generated art" className="rounded-lg max-w-full max-h-[600px] object-contain mb-4" />
             <button
                onClick={handleDownloadImage}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors shadow-md"
              >
                <DownloadIcon /> Baixar Imagem
              </button>
          </>
        ) : (
          <p className="text-slate-500">Sua imagem gerada aparecerá aqui.</p>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;