import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const LyricsGenerator: React.FC = () => {
     const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Gere a letra completa de uma música com base na seguinte descrição: "${prompt}". Inclua versos, refrão e uma ponte.`, 'gemini-2.5-pro');
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Gerador de Letras de Músicas"
            description="Gere músicas personalizadas a partir de uma IA."
            inputLabel="Descrição da música"
            inputPlaceholder="Descreva o tema, sentimento e palavras-chave para sua letra..."
            buttonText="Gerar Letras"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default LyricsGenerator;
