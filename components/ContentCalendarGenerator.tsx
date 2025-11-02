import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const ContentCalendarGenerator: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Crie um calendário de conteúdo para mídias sociais para uma semana com base nas seguintes informações: "${prompt}". Para cada dia, forneça uma ideia de postagem, um formato sugerido (ex: imagem, vídeo, story) e uma legenda curta.`, 'gemini-2.5-pro');
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Gerador de Calendário de Conteúdo"
            description="Planeje seu conteúdo para mídias sociais para alcançar mais pessoas e aumentar seu público."
            inputLabel="Informações do calendário"
            inputPlaceholder="Descreva seu nicho, plataformas e frequência de postagem desejada..."
            buttonText="Gerar Calendário"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default ContentCalendarGenerator;
