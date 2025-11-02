import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const CharacterNameGenerator: React.FC = () => {
    const [genre, setGenre] = useState('');
    const [description, setDescription] = useState('');
    const [names, setNames] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!genre || !description) {
            setError('Por favor, preencha o gênero e a descrição.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setNames([]);
        try {
            const result = await geminiService.generateCharacterNames(genre, description);
            setNames(result);
        } catch (e) {
            setError('Falha ao gerar nomes. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [genre, description]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Nomes de Personagens</h2>
                <p className="text-slate-400 mb-4">Gere nomes de personagens exclusivos com facilidade.</p>
                
                <div className="space-y-4 mb-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Gênero da História</label>
                        <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Ex: Fantasia Medieval, Cyberpunk, Comédia Romântica" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-400">Breve Descrição do Personagem</label>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Um ladrão ágil com um coração de ouro" className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Nomes'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || names.length > 0) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[150px]"><Loader /></div>
                    ) : (
                         <div className="space-y-3">
                            <h3 className="text-xl font-bold text-purple-300 mb-2">Nomes Sugeridos</h3>
                            {names.map((name, i) => (
                                <div key={i} className="p-3 bg-slate-700 rounded-lg text-slate-300">{name}</div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CharacterNameGenerator;