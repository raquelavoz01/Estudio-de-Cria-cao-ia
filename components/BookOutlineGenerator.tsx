import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const BookOutlineGenerator: React.FC = () => {
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [outline, setOutline] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!title || !genre) {
            setError('Por favor, preencha o título e o gênero do livro.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setOutline([]);
        try {
            const result = await geminiService.generateBookOutlineForTitle(title, genre);
            setOutline(result);
        } catch (e) {
            setError('Falha ao gerar o esboço do livro. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [title, genre]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Esboços de Livros</h2>
                <p className="text-slate-400 mb-4">Crie um esboço estruturado para seu livro com assistência de IA.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Título do Livro</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: A Última Estrela Cadente" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Gênero</label>
                        <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Ex: Ficção Científica" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Esboço'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || outline.length > 0) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[200px]"><Loader /></div>
                    ) : (
                        <div>
                            <h3 className="text-xl font-bold text-purple-300 mb-2">Esboço Sugerido para "{title}"</h3>
                            <ul className="list-decimal list-inside space-y-2 text-slate-300">
                                {outline.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookOutlineGenerator;