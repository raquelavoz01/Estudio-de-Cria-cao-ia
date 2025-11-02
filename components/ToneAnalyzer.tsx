import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const ToneAnalyzer: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Analise o tom do seguinte texto. Descreva o tom principal (ex: Positivo, Negativo, Neutro) e quaisquer tons secundários (ex: Formal, Otimista, Cético):\n\n"${prompt}"`);
    };

    const renderResult = (result: string) => (
         <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Analisador de Tom de Texto"
            description="Analise o tom de um texto. Descubra se é positivo, negativo, neutro, formal, informal, etc."
            inputLabel="Texto para analisar"
            inputPlaceholder="Cole seu texto aqui para analisar o tom..."
            buttonText="Analisar Tom"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default ToneAnalyzer;
