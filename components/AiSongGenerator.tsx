import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const AiSongGenerator: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Gere a letra completa de uma música com base na seguinte descrição: "${prompt}". Inclua gênero, instrumentos, versos, refrão e ponte.`, 'gemini-2.5-pro');
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Gerador de Músicas de IA"
            description="Gere letras de músicas originais com base em sua descrição. A geração de áudio ainda não está implementada."
            inputLabel="Descrição da música"
            inputPlaceholder="Descreva o tema, gênero e instrumentos da sua música..."
            buttonText="Gerar Letra da Música"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default AiSongGenerator;
