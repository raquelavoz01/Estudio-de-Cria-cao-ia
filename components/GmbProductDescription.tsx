import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const GmbProductDescription: React.FC = () => {
    const [product, setProduct] = useState('');
    const [features, setFeatures] = useState('');
    const [description, setDescription] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!product || !features) {
            setError('Por favor, preencha o nome do produto e suas características.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setDescription(null);
        try {
            const result = await geminiService.generateGmbProductDescription(product, features);
            setDescription(result);
        } catch (e) {
            setError('Falha ao gerar a descrição. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [product, features]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Google Meu Negócio - Descrição do Produto</h2>
                <p className="text-slate-400 mb-4">Gere descrições de produtos ou serviços para o seu Google Meu Negócio.</p>
                
                <div className="space-y-4 mb-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Produto/Serviço</label>
                        <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Ex: Consultoria de Marketing Digital" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Principais Características/Diferenciais</label>
                        <textarea value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="Ex: Foco em SEO local, estratégias personalizadas, aumento de tráfego orgânico" className="w-full h-24 p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                </div>

                <div className="flex justify-end">
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

export default GmbProductDescription;