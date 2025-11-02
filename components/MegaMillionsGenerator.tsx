import React from 'react';
import LotteryNumberGenerator from './LotteryNumberGenerator';

const MegaMillionsGenerator: React.FC = () => {
    // Reutiliza o componente de Loteria, que já possui toda a lógica.
    // Apenas serve como um ponto de entrada para a view específica.
    return <LotteryNumberGenerator />;
};

export default MegaMillionsGenerator;
