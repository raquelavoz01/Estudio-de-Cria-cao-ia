import React, { useState, useCallback } from 'react';
import Loader from './Loader';

interface GenericToolProps {
  title: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  buttonText: string;
  generateAction: (prompt: string) => Promise<any>;
  renderResult: (result: any) => React.ReactNode;
}

const GenericTool: React.FC<GenericToolProps> = ({
  title,
  description,
  inputLabel,
  inputPlaceholder,
  buttonText,
  generateAction,
  renderResult
}) => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!prompt) {
            setError(`Por favor, preencha o campo: ${inputLabel.toLowerCase()}.`);
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const generatedResult = await generateAction(prompt);
            setResult(generatedResult);
        } catch (e: any) {
            setError(e.message || 'Falha ao gerar o conteúdo. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, generateAction, inputLabel]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
                <p className="text-slate-400 mb-4">{description}</p>
                
                <label className="block mb-2 text-sm font-medium text-slate-400">{inputLabel}</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={inputPlaceholder}
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : buttonText}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || result) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                             <Loader />
                        </div>
                    ) : result ? (
                        renderResult(result)
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default GenericTool;
