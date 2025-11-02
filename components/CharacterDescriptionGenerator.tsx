import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const CharacterDescriptionGenerator: React.FC = () => {
    const [name, setName] = useState('');
    const [archetype, setArchetype] = useState('');
    const [description, setDescription] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!name || !archetype) {
            setError('Por favor, preencha o nome e o arquétipo do personagem.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setDescription(null);
        try {
            const result = await geminiService.generateCharacterDescription(name, archetype);
            setDescription(result);
        } catch (e) {
            setError('Falha ao gerar a descrição. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [name, archetype]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Descrição de Personagens</h2>
                <p className="text-slate-400 mb-4">Gere descrições detalhadas para seus personagens, incluindo aparência e personalidade.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Nome do Personagem</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Lyra" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Arquétipo / Tipo</label>
                        <input type="text" value={archetype} onChange={(e) => setArchetype(e.target.value)} placeholder="Ex: O herói relutante, a mentora sábia" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Descrição'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || description) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[200px]"><Loader /></div>
                    ) : (
                        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                           {description}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CharacterDescriptionGenerator;