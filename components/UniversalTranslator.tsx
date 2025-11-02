import React from 'react';
import GenericTool from './GenericTool';
import * as geminiService from '../services/geminiService';

const UniversalTranslator: React.FC = () => {
    const generateAction = (prompt: string) => {
        return geminiService.generateGenericText(`Traduza o seguinte texto para o português. Se o texto já estiver em português, traduza para o inglês:\n\n"${prompt}"`);
    };

    const renderResult = (result: string) => (
        <div>
            <h3 className="text-xl font-bold text-purple-300 mb-2">Tradução</h3>
            <p className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">{result}</p>
        </div>
    );

    return (
        <GenericTool
            title="Tradutor Universal"
            description="Traduza textos entre idiomas com precisão usando IA."
            inputLabel="Texto para traduzir"
            inputPlaceholder="Cole seu texto aqui para traduzir..."
            buttonText="Traduzir"
            generateAction={generateAction}
            renderResult={renderResult}
        />
    );
};

export default UniversalTranslator;
