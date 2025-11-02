import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

interface ReelIdea {
    idea: string;
    hook: string;
    scenes: string[];
}

const ReelsIdeaGenerator: React.FC = () => {
    const [niche, setNiche] = useState('');
    const [ideas, setIdeas] = useState<ReelIdea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!niche) {
            setError('Por favor, insira seu nicho ou área de conteúdo.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setIdeas([]);
        try {
            const result = await geminiService.generateReelsIdeas(niche);
            setIdeas(result);
        } catch (e) {
            setError('Falha ao gerar ideias. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [niche]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Ideias para Reels do Instagram</h2>
                <p className="text-slate-400 mb-4">Tenha ideias para seu próximo Instagram Reels e ganhe mais visualizações!</p>
                <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="Ex: Culinária, Fitness, Viagens, Marketing Digital"
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
                <div className="mt-4 flex justify-end">
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
                            <h3 className="text-xl font-bold text-purple-300 mb-2">{idea.idea}</h3>
                            <div className="space-y-3 text-slate-300">
                                <p><strong className="text-slate-100">Gancho (Hook):</strong> {idea.hook}</p>
                                <div>
                                    <strong className="text-slate-100">Cenas:</strong>
                                    <ul className="list-disc list-inside ml-4">
                                        {idea.scenes.map((scene, i) => <li key={i}>{scene}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReelsIdeaGenerator;