import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const GmbPostGenerator: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Crie uma postagem de atualização para o Google Meu Negócio sobre a seguinte novidade: "${prompt}". A postagem deve ser concisa, informativa e incluir uma chamada para ação, se aplicável.`);
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Postagem do Google Meu Negócio"
            description="Gerar atualizações de postagens de novidades para o Google Meu Negócio."
            inputLabel="O que você quer anunciar?"
            inputPlaceholder="Ex: promoção de fim de semana, novo item no menu"
            buttonText="Gerar Postagem"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default GmbPostGenerator;
