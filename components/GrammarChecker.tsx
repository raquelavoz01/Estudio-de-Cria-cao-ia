import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const GrammarChecker: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Corrija a gramática e a ortografia do seguinte texto, retornando apenas o texto corrigido:\n\n"${prompt}"`);
    };

    const renderResult = (result: string) => (
        <div>
            <h3 className="text-xl font-bold text-purple-300 mb-2">Texto Corrigido</h3>
            <p className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">{result}</p>
        </div>
    );

    return (
        <GenericTool
            title="Corretor Gramatical"
            description="Certifique-se de que sua escrita não tenha erros!"
            inputLabel="Texto para verificar"
            inputPlaceholder="Cole seu texto aqui para verificar a gramática..."
            buttonText="Verificar Texto"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default GrammarChecker;
