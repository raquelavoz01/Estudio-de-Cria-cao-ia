import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const InstagramBioGenerator: React.FC = () => {
    const [description, setDescription] = useState('');
    const [tone, setTone] = useState('Profissional');
    const [bios, setBios] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!description) {
            setError('Por favor, descreva sobre o que é o seu perfil.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setBios([]);
        try {
            const result = await geminiService.generateInstagramBio(description, tone);
            setBios(result);
        } catch (e) {
            setError('Falha ao gerar as biografias. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [description, tone]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Biografia do Instagram</h2>
                <p className="text-slate-400 mb-4">Faça seu perfil do Instagram se destacar com a ajuda do nosso gerador de biografia.</p>
                
                 <div>
                    <label className="block mb-2 text-sm font-medium text-slate-400">Descreva seu perfil</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Fotógrafo de paisagens viajando pelo mundo." className="w-full h-24 p-2 bg-slate-900 border border-slate-700 rounded-lg mb-4"/>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-slate-400">Tom de Voz</label>
                    <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg">
                        <option>Profissional</option>
                        <option>Divertido</option>
                        <option>Inspirador</option>
                        <option>Minimalista</option>
                    </select>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Biografias'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || bios.length > 0) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[150px]"><Loader /></div>
                    ) : (
                         <div className="space-y-3">
                            <h3 className="text-xl font-bold text-purple-300 mb-2">Biografias Sugeridas</h3>
                            {bios.map((bio, i) => (
                                <div key={i} className="p-3 bg-slate-700 rounded-lg text-slate-300">
                                    <p>{bio}</p>
                                    <span className="text-xs text-slate-400">({bio.length} caracteres)</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InstagramBioGenerator;