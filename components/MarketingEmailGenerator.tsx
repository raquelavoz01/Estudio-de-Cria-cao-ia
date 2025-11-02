import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const MarketingEmailGenerator: React.FC = () => {
    const [product, setProduct] = useState('');
    const [audience, setAudience] = useState('');
    const [goal, setGoal] = useState('');
    const [email, setEmail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!product || !audience || !goal) {
            setError('Por favor, preencha todos os campos.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setEmail(null);
        try {
            const result = await geminiService.generateMarketingEmail(product, audience, goal);
            setEmail(result);
        } catch (e) {
            setError('Falha ao gerar o e-mail. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [product, audience, goal]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de E-mail de Marketing</h2>
                <p className="text-slate-400 mb-4">Crie e-mails de marketing atraentes e personalizados para seu produto e público.</p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Nome do Produto/Serviço</label>
                        <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Ex: Software de Análise de Dados 'InsightPro'" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Público-alvo</label>
                        <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Ex: Pequenas e médias empresas de e-commerce" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                     <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Objetivo do E-mail</label>
                        <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Ex: Anunciar um novo recurso e incentivar o teste gratuito" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar E-mail'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || email) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[300px]">
                             <Loader />
                        </div>
                    ) : email ? (
                        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                           {email}
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default MarketingEmailGenerator;
