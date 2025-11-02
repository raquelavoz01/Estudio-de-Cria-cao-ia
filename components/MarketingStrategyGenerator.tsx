import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const MarketingStrategyGenerator: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Crie uma estratégia de marketing abrangente com base na seguinte descrição de negócio: "${prompt}". Inclua análise de público, posicionamento da marca, estratégias de conteúdo, canais de aquisição e métricas de sucesso (KPIs).`, 'gemini-2.5-pro');
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Gerador de Estratégia e Plano de Marketing"
            description="Crie uma estratégia de marketing abrangente para o seu negócio."
            inputLabel="Descrição do negócio, público-alvo e objetivos"
            inputPlaceholder="Descreva seu negócio, público-alvo e objetivos..."
            buttonText="Gerar Estratégia"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default MarketingStrategyGenerator;
