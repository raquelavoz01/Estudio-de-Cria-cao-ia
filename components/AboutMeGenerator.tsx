import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const AboutMeGenerator: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Crie um parágrafo "Sobre Mim" profissional e criativo com base nas seguintes informações: "${prompt}"`);
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title='Gerador "Sobre Mim"'
            description="Como profissional criativo, sua biografia é uma das primeiras coisas que clientes em potencial verão. Crie uma que se destaque."
            inputLabel="Suas habilidades, paixões e o que o torna único"
            inputPlaceholder="Descreva suas habilidades, paixões e o que torna você único..."
            buttonText="Gerar Biografia"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default AboutMeGenerator;
