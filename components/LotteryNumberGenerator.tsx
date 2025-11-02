import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';

const LotteryNumberGenerator: React.FC = () => {
    const [game, setGame] = useState('TOTO (6 números de 1 a 49)');
    const [numbers, setNumbers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setNumbers([]);
        try {
            const result = await geminiService.generateLotteryNumbers(game);
            setNumbers(result);
        } catch (e) {
            setError('Falha ao gerar os números. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [game]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Gerador de Números de Loteria</h2>
                <p className="text-slate-400 mb-4">Gere um conjunto de números de loteria aleatórios para vários jogos. Boa sorte!</p>
                
                <div>
                    <label className="block mb-2 text-sm font-medium text-slate-400">Selecione o Jogo</label>
                    <select value={game} onChange={(e) => setGame(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg mb-4">
                        <option>TOTO (6 números de 1 a 49)</option>
                        <option>4D (4 dígitos de 0 a 9)</option>
                        <option>Powerball (5 de 1 a 69, 1 de 1 a 26)</option>
                        <option>Mega Millions (5 de 1 a 70, 1 de 1 a 25)</option>
                        <option>EuroMillions (5 de 1 a 50, 2 de 1 a 12)</option>
                        <option>Lotto (6 números de 1 a 59)</option>
                    </select>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? <Loader /> : 'Gerar Números'}
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            
            {(isLoading || numbers.length > 0) && (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[100px]"><Loader /></div>
                    ) : (
                        <div>
                            <h3 className="text-xl font-bold text-purple-300 mb-2">Seus Números da Sorte</h3>
                            <div className="flex flex-wrap gap-4 justify-center">
                                {numbers.map((num, i) => (
                                    <span key={i} className="flex items-center justify-center w-16 h-16 bg-cyan-500 text-white rounded-full text-2xl font-bold shadow-lg">
                                        {num}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LotteryNumberGenerator;