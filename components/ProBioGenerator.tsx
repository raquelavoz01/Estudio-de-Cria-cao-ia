import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const ProBioGenerator: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Crie uma biografia profissional com base nas seguintes informações: "${prompt}"`);
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Gerador de Bio Profissional"
            description="Crie uma biografia profissional com base em suas informações pessoais e profissionais."
            inputLabel="Informações chave"
            inputPlaceholder="Insira suas conquistas, cargo, experiência e tom desejado..."
            buttonText="Gerar Bio"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default ProBioGenerator;
