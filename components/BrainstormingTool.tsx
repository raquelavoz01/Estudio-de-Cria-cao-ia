import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const BrainstormingTool: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericJsonArray(`Gere uma lista de 10 ideias criativas de brainstorming sobre o seguinte tópico: "${prompt}"`);
    };

    const renderResult = (result: string[]) => (
        <div>
            <h3 className="text-xl font-bold text-purple-300 mb-2">Ideias Geradas</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                {result.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </div>
    );

    return (
        <GenericTool
            title="Ferramenta de Brainstorming"
            description="Gere soluções e ideias criativas para qualquer problema."
            inputLabel="Tópico para brainstorming"
            inputPlaceholder="Ex: ideias de nomes para uma nova cafeteria com tema de espaço"
            buttonText="Gerar Ideias"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default BrainstormingTool;
