import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const FacebookAdsPrimaryText: React.FC = () => {
    const [product, setProduct] = useState('');
    const [audience, setAudience] = useState('');
    const [tone, setTone] = useState('Persuasivo');
    const [primaryText, setPrimaryText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!product || !audience) {
            setError('Por favor, preencha o produto e o público-alvo.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setPrimaryText(null);
        try {
            const result = await geminiService.generateFbAdsPrimaryText(product, audience, tone);
            setPrimaryText(result);
        } catch (e) {
            setError('Falha ao gerar o texto. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [product, audience, tone]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Texto Principal dos Anúncios do Facebook</h2>
                <p className="text-slate-400 mb-4">Gere textos primários para seus anúncios do Facebook que geram mais leads e vendas.</p>
                
                <div className="space-y-4 mb-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Produto/Serviço</label>
                        <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Ex: App de meditação 'CalmaMente'" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Público-alvo</label>
                        <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Ex: Profissionais ocupados buscando alívio do estresse" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                     <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Tom de Voz</label>
                        <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg">
                            <option>Persuasivo</option>
                            <option>Amigável</option>
                            <option>Formal</option>
                            <option>Engraçado</option>
                            <option>Inspirador</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Texto'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || primaryText) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[200px]"><Loader /></div>
                    ) : (
                        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                           {primaryText}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FacebookAdsPrimaryText;