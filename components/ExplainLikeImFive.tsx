import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const ExplainLikeImFive: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Explique o seguinte tópico como se eu tivesse 5 anos de idade: "${prompt}"`);
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Explique como se eu tivesse 5 anos"
            description="Explique um tópico complexo ou obscuro nos termos mais simples."
            inputLabel="Tópico para explicar"
            inputPlaceholder="Ex: computação quântica"
            buttonText="Explicar"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default ExplainLikeImFive;
