
import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

interface CopyResult {
    headlines: string[];
    benefits: string[];
    cta: string;
}

const LandingPageCopy: React.FC = () => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [copy, setCopy] = useState<CopyResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!productName || !description) {
            setError('Por favor, preencha o nome do produto e a descrição.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setCopy(null);
        try {
            const result = await geminiService.generateLandingPageCopy(productName, description);
            setCopy(result);
        } catch (e) {
            setError('Falha ao gerar a cópia. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [productName, description]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Cópia para Landing Page</h2>
                <p className="text-slate-400 mb-4">Crie textos que convertem. Descreva seu produto ou serviço e a IA gerará uma cópia de alta conversão para sua landing page.</p>
                
                <label className="block mb-2 text-sm font-medium text-slate-400">Nome do Produto/Serviço</label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ex: Café Supernova"
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition mb-4"
                />

                <label className="block mb-2 text-sm font-medium text-slate-400">Descrição do Produto/Serviço</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: um café especial de origem única com notas de chocolate e caramelo, torrado para máxima energia."
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Cópia'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {isLoading && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex justify-center">
                    <Loader />
                </div>
            )}

            {copy && !isLoading && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-purple-300 mb-2">Títulos Sugeridos (Headlines)</h3>
                        <ul className="list-disc list-inside space-y-2">
                            {copy.headlines.map((headline, i) => <li key={i} className="text-slate-300">{headline}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-purple-300 mb-2">Benefícios Principais</h3>
                         <ul className="list-disc list-inside space-y-2">
                            {copy.benefits.map((benefit, i) => <li key={i} className="text-slate-300">{benefit}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-purple-300 mb-2">Chamada para Ação (CTA)</h3>
                        <p className="bg-slate-700 p-3 rounded-lg text-slate-200 font-semibold">{copy.cta}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPageCopy;