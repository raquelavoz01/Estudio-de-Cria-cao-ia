import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const BookTitleGenerator: React.FC = () => {
    const [genre, setGenre] = useState('');
    const [premise, setPremise] = useState('');
    const [titles, setTitles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!genre || !premise) {
            setError('Por favor, preencha o gênero e a premissa do livro.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setTitles([]);
        try {
            const result = await geminiService.generateBookTitles(genre, premise);
            setTitles(result);
        } catch (e) {
            setError('Falha ao gerar os títulos. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [genre, premise]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Títulos de Livros</h2>
                <p className="text-slate-400 mb-4">Crie títulos de livros exclusivos e criativos com IA.</p>
                
                <div className="space-y-4 mb-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Gênero</label>
                        <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Ex: Fantasia, Mistério, Romance" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Premissa do Livro</label>
                        <textarea value={premise} onChange={(e) => setPremise(e.target.value)} placeholder="Ex: Um jovem mago descobre uma profecia que o obriga a unir reinos rivais contra uma escuridão antiga." className="w-full h-24 p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
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
            
            {(isLoading || titles.length > 0) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[200px]"><Loader /></div>
                    ) : (
                         <div className="space-y-3">
                            <h3 className="text-xl font-bold text-purple-300 mb-2">Títulos Sugeridos</h3>
                            {titles.map((title, i) => (
                                <div key={i} className="p-3 bg-slate-700 rounded-lg text-slate-300">{title}</div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookTitleGenerator;