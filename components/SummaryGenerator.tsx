import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const SummaryGenerator: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Gere um resumo acadêmico conciso e profissional do seguinte texto:\n\n"${prompt}"`);
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Gerador de Resumos"
            description="Gere um resumo acadêmico conciso e profissional a partir do contexto e dos destaques da sua pesquisa."
            inputLabel="Texto para resumir"
            inputPlaceholder="Cole seu texto ou artigo aqui..."
            buttonText="Gerar Resumo"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default SummaryGenerator;
