import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const CharacterBackstoryGenerator: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Crie uma história de fundo rica e envolvente para um personagem com base na seguinte descrição: "${prompt}"`, 'gemini-2.5-pro');
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Gerador de História de Fundo de Personagem"
            description="Crie histórias de fundo ricas e envolventes para seus personagens."
            inputLabel="Informações do personagem"
            inputPlaceholder="Insira o nome, arquétipo e pontos-chave que você quer na história de fundo do personagem..."
            buttonText="Gerar História de Fundo"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default CharacterBackstoryGenerator;
