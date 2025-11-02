import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const AdCopyGenerator: React.FC = () => {
    const [product, setProduct] = useState('');
    const [audience, setAudience] = useState('');
    const [tone, setTone] = useState('Persuasivo');
    const [results, setResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!product || !audience) {
            setError('Por favor, preencha o produto e o público-alvo.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResults([]);
        try {
            const generatedResults = await geminiService.generateAdCopy(product, audience, tone);
            setResults(generatedResults);
        } catch (e) {
            setError('Falha ao gerar a cópia do anúncio. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [product, audience, tone]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Cópia de Anúncios</h2>
                <p className="text-slate-400 mb-4">Crie um texto publicitário atraente para seus produtos ou serviços.</p>

                <div className="space-y-4 mb-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Produto/Serviço</label>
                        <input
                            type="text"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            placeholder="Ex: Tênis de corrida sustentáveis 'EcoRun'"
                            className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Público-alvo</label>
                        <input
                            type="text"
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                            placeholder="Ex: Corredores ecologicamente conscientes"
                            className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Tom de Voz</label>
                        <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                        >
                            <option>Persuasivo</option>
                            <option>Amigável</option>
                            <option>Formal</option>
                            <option>Engraçado</option>
                            <option>Inspirador</option>
                        </select>
                    </div>
                </div>

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

            {(isLoading || results.length > 0) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[150px]"><Loader /></div>
                    ) : (
                         <div className="space-y-4">
                            <h3 className="text-xl font-bold text-purple-300 mb-2">Variações de Anúncio Sugeridas</h3>
                            {results.map((item, i) => (
                                <div key={i} className="p-4 bg-slate-700 rounded-lg text-slate-300 whitespace-pre-wrap">{item}</div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdCopyGenerator;