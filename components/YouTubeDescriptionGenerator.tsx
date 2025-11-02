import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const YouTubeDescriptionGenerator: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Crie uma descrição de vídeo do YouTube otimizada para SEO sobre o seguinte tópico: "${prompt}". Inclua um resumo, timestamps (se aplicável), links relevantes e hashtags.`);
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Gerador de Descrição de Vídeo do YouTube"
            description="Faça seus vídeos se destacarem e terem boa classificação com ótimas descrições!"
            inputLabel="Tópico do vídeo"
            inputPlaceholder="Descreva sobre o que é o seu vídeo..."
            buttonText="Gerar Descrição"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default YouTubeDescriptionGenerator;
