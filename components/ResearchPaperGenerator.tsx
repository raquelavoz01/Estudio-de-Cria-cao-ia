import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const ResearchPaperGenerator: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Gere um artigo de pesquisa abrangente com estrutura e citações adequadas (se possível) com base nas seguintes informações: "${prompt}"`, 'gemini-2.5-pro');
    };

    const renderResult = (result: string) => (
        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
           {result}
        </div>
    );

    return (
        <GenericTool
            title="Gerador de Artigos de Pesquisa"
            description="Gere artigos de pesquisa abrangentes com estrutura e citações adequadas."
            inputLabel="Tópico da pesquisa e pontos-chave"
            inputPlaceholder="Insira o tópico da sua pesquisa, pontos-chave e fontes..."
            buttonText="Gerar Artigo"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default ResearchPaperGenerator;
