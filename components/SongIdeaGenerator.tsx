import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

interface SongIdea {
    title: string;
    concept: string;
}

const SongIdeaGenerator: React.FC = () => {
    const [genre, setGenre] = useState('');
    const [mood, setMood] = useState('');
    const [ideas, setIdeas] = useState<SongIdea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!genre || !mood) {
            setError('Por favor, preencha o gênero e o humor/sentimento.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setIdeas([]);
        try {
            const result = await geminiService.generateSongIdeas(genre, mood);
            setIdeas(result);
        } catch (e) {
            setError('Falha ao gerar ideias para músicas. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [genre, mood]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Ideias para Músicas</h2>
                <p className="text-slate-400 mb-4">Se você não consegue pensar em uma música, nós podemos ajudar!</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Gênero</label>
                        <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Ex: Pop, Rock, Folk, Eletrônica" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Humor / Sentimento</label>
                        <input type="text" value={mood} onChange={(e) => setMood(e.target.value)} placeholder="Ex: Alegre, Melancólico, Energético" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Ideias'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {isLoading && (
                 <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex justify-center"><Loader /></div>
            )}
            
            {ideas.length > 0 && !isLoading && (
                <div className="space-y-4">
                    {ideas.map((idea, index) => (
                        <div key={index} className="bg-slate-800 p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-bold text-purple-300 mb-2">{idea.title}</h3>
                            <p className="text-slate-300">{idea.concept}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SongIdeaGenerator;