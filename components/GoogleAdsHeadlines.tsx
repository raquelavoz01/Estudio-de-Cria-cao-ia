import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const GoogleAdsHeadlines: React.FC = () => {
    const [product, setProduct] = useState('');
    const [description, setDescription] = useState('');
    const [headlines, setHeadlines] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!product || !description) {
            setError('Por favor, preencha o nome do produto e a descrição.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setHeadlines([]);
        try {
            const result = await geminiService.generateGoogleAdsHeadlines(product, description);
            setHeadlines(result);
        } catch (e) {
            setError('Falha ao gerar os títulos. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [product, description]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Títulos do Google Ads</h2>
                <p className="text-slate-400 mb-4">Obtenha mais cliques com nosso gerador de títulos do Google Ads!</p>
                
                <div className="space-y-4 mb-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Produto/Serviço</label>
                        <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Ex: Tênis de corrida 'Velocitas'" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Descrição</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Tênis ultraleve para corredores de longa distância, com amortecimento responsivo." className="w-full h-24 p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Títulos'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || headlines.length > 0) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[200px]"><Loader /></div>
                    ) : (
                         <div className="space-y-3">
                            <h3 className="text-xl font-bold text-purple-300 mb-2">Títulos Sugeridos</h3>
                            {headlines.map((item, i) => (
                                <div key={i} className="p-3 bg-slate-700 rounded-lg text-slate-300">{item} <span className="text-xs text-slate-400">({item.length} caracteres)</span></div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GoogleAdsHeadlines;