import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const SocialPostGenerator: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Crie uma postagem para mídias sociais (como Facebook, LinkedIn ou Twitter) sobre o seguinte tópico: "${prompt}". Inclua emojis e hashtags relevantes.`);
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Gerador de Postagens para Mídias Sociais"
            description="Crie facilmente postagens exclusivas e de alta qualidade para suas páginas de mídia social - com apenas um clique!"
            inputLabel="Tópico da postagem"
            inputPlaceholder="Sobre o que você quer postar hoje?"
            buttonText="Gerar Postagem"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default SocialPostGenerator;
