import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const GoogleAdsDescriptions: React.FC = () => {
    const [product, setProduct] = useState('');
    const [description, setDescription] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!product || !description) {
            setError('Por favor, preencha o nome do produto e a descrição.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResults([]);
        try {
            const generatedResults = await geminiService.generateGoogleAdsDescriptions(product, description);
            setResults(generatedResults);
        } catch (e) {
            setError('Falha ao gerar as descrições. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [product, description]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Descrições de Anúncios do Google</h2>
                <p className="text-slate-400 mb-4">Obtenha mais conversões com nosso gerador de descrições de anúncios do Google!</p>
                
                <div className="space-y-4 mb-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Produto/Serviço</label>
                        <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Ex: Ferramenta de automação de e-mail" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Descrição</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Envie e-mails personalizados para seus clientes em escala e economize tempo." className="w-full h-24 p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Descrições'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || results.length > 0) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[150px]"><Loader /></div>
                    ) : (
                         <div className="space-y-3">
                            <h3 className="text-xl font-bold text-purple-300 mb-2">Descrições Sugeridas</h3>
                            {results.map((item, i) => (
                                <div key={i} className="p-3 bg-slate-700 rounded-lg text-slate-300">{item} <span className="text-xs text-slate-400">({item.length} caracteres)</span></div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GoogleAdsDescriptions;