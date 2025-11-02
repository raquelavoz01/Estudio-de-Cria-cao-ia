import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const EmailGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!prompt) {
            setError('Por favor, insira um prompt para o e-mail.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setEmail('');
        try {
            const result = await geminiService.generateEmail(prompt);
            setEmail(result);
        } catch (e) {
            setError('Falha ao gerar o e-mail. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }, [prompt]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Geração de E-mail com IA</h2>
                <p className="text-slate-400 mb-4">Crie e-mails profissionais e sofisticados em minutos. De newsletters a e-mails de vendas.</p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: um e-mail de marketing para anunciar um novo produto de software para gerenciamento de projetos"
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
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

export default EmailGenerator;