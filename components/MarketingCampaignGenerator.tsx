import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const MarketingCampaignGenerator: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Crie uma campanha de marketing detalhada com base na seguinte descrição: "${prompt}". Inclua público-alvo, principais mensagens, canais sugeridos e uma chamada para ação.`, 'gemini-2.5-pro');
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Gerador de Campanhas de Marketing"
            description="Crie campanhas de marketing personalizadas e adaptadas ao seu público-alvo e aos seus objetivos."
            inputLabel="Descrição do produto e objetivo da campanha"
            inputPlaceholder="Descreva seu produto, público-alvo e objetivo da campanha aqui..."
            buttonText="Gerar Campanha"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default MarketingCampaignGenerator;
