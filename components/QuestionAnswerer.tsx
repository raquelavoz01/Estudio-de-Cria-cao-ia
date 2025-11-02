import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const QuestionAnswerer: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Responda à seguinte pergunta da forma mais precisa e concisa possível: "${prompt}"`);
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Respondedor de Perguntas"
            description="Obtenha respostas rápidas e confiáveis para qualquer dúvida."
            inputLabel="Sua pergunta"
            inputPlaceholder="Faça sua pergunta aqui..."
            buttonText="Obter Resposta"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default QuestionAnswerer;
