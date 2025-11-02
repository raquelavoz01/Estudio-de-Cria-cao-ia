import React from 'react';
import ChatWithFiles from './ChatWithFiles';

const PdfSummarizer: React.FC = () => {
    // A funcionalidade de resumir um PDF é um caso de uso do ChatWithFiles.
    // Reutilizamos o componente para evitar duplicação de lógica de upload e chat.
    return <ChatWithFiles />;
};

export default PdfSummarizer;
