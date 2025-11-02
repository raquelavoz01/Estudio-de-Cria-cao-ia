import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const ChapterGenerator: React.FC = () => {
     const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Escreva um capítulo de história único e cativante com base na seguinte descrição de cena ou resumo: "${prompt}"`, 'gemini-2.5-pro');
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Gerador de Capítulos"
            description="Gere capítulos de histórias únicos e cativantes com IA."
            inputLabel="Descrição do capítulo"
            inputPlaceholder="Descreva o que deve acontecer neste capítulo..."
            buttonText="Gerar Capítulo"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default ChapterGenerator;
