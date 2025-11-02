import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const BedtimeStoryGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [character, setCharacter] = useState('');
    const [style, setStyle] = useState('Calmo e reconfortante');
    const [story, setStory] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!topic || !character) {
            setError('Por favor, preencha o tema e o personagem principal.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setStory(null);
        try {
            const result = await geminiService.generateBedtimeStory(topic, character, style);
            setStory(result);
        } catch (e) {
            setError('Falha ao gerar a história. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [topic, character, style]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Histórias para Dormir</h2>
                <p className="text-slate-400 mb-4">Crie histórias relaxantes para as crianças dormirem.</p>
                
                <div className="space-y-4 mb-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Tema da História</label>
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex: Uma estrela que queria visitar a Terra" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Personagem Principal</label>
                        <input type="text" value={character} onChange={(e) => setCharacter(e.target.value)} placeholder="Ex: Um coelho corajoso chamado Fagulha" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                     <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Estilo da História</label>
                        <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg">
                            <option>Calmo e reconfortante</option>
                            <option>Mágico e sonhador</option>
                            <option>Engraçado e gentil</option>
                            <option>Aventureiro e inspirador</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar História'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || story) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[300px]"><Loader /></div>
                    ) : (
                        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                           {story}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BedtimeStoryGenerator;