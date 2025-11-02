import React from 'react';
import { Plan } from '../types';
import { LogoIcon } from './Icons';

interface PricingPageProps {
  onSelectPlan: (plan: Plan) => void;
}

const TickItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center space-x-3">
        <svg className="flex-shrink-0 w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
        <span className="text-slate-300">{children}</span>
    </li>
);

const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 py-8 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <LogoIcon />
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Escolha o Plano Perfeito para Você
          </h1>
          <p className="mt-4 text-xl text-slate-400">
            Desbloqueie seu potencial criativo com o poder da IA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Plano Escritor */}
          <div className="flex flex-col p-6 mx-auto w-full text-center text-white bg-slate-800/50 rounded-lg border border-slate-700 shadow-lg shadow-cyan-500/10">
            <h3 className="mb-4 text-2xl font-semibold">Plano Escritor</h3>
            <p className="text-sm text-slate-400">Ideal para blogueiros, estudantes e gerentes de mídias sociais.</p>
            <div className="flex justify-center items-baseline my-8">
              <span className="mr-2 text-5xl font-extrabold">R$29</span>
              <span className="text-slate-400">/mês</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              <TickItem>Ferramentas Essenciais de Texto</TickItem>
              <TickItem>Geração para Redes Sociais</TickItem>
              <TickItem>Brainstorming e Ideias</TickItem>
              <TickItem>Ferramentas de Diversão</TickItem>
            </ul>
            <button
              onClick={() => onSelectPlan('escritor')} 
              className="mt-auto block w-full py-3 font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-500 rounded-lg hover:opacity-90 transition-opacity"
            >
              Começar com Escritor
            </button>
          </div>

          {/* Plano Arquiteto */}
          <div className="flex flex-col p-6 mx-auto w-full text-center text-white bg-slate-800/50 rounded-lg border-2 border-purple-500 shadow-2xl shadow-purple-500/20">
             <h3 className="mb-4 text-2xl font-semibold">Plano Arquiteto</h3>
            <p className="text-sm text-slate-400">Perfeito para criadores de conteúdo, profissionais de marketing e autores.</p>
            <div className="flex justify-center items-baseline my-8">
              <span className="mr-2 text-5xl font-extrabold">R$59</span>
              <span className="text-slate-400">/mês</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              <TickItem><strong>Tudo do Plano Escritor</strong></TickItem>
              <TickItem>Gerador de Imagens IA</TickItem>
              <TickItem>Criador de Livros Completo</TickItem>
              <TickItem>Ferramentas Avançadas de Marketing</TickItem>
              <TickItem>Geração de Músicas com IA</TickItem>
            </ul>
            <button
              onClick={() => onSelectPlan('arquiteto')} 
              className="mt-auto block w-full py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-500 rounded-lg hover:opacity-90 transition-opacity"
            >
              Começar com Arquiteto
            </button>
          </div>

          {/* Plano Mestre */}
          <div className="flex flex-col p-6 mx-auto w-full text-center text-white bg-slate-800/50 rounded-lg border border-slate-700 shadow-lg shadow-pink-500/10">
            <h3 className="mb-4 text-2xl font-semibold">Plano Mestre</h3>
            <p className="text-sm text-slate-400">O pacote completo para agências e profissionais que exigem o máximo.</p>
            <div className="flex justify-center items-baseline my-8">
              <span className="mr-2 text-5xl font-extrabold">R$99</span>
              <span className="text-slate-400">/mês</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              <TickItem><strong>Tudo do Plano Arquiteto</strong></TickItem>
              <TickItem>Gerador de Vídeo de Alta Qualidade</TickItem>
              <TickItem>Edição de Imagem IA (Retratos, Upscaler)</TickItem>
               <TickItem>Bate-papo com Arquivos (PDFs, Docs)</TickItem>
              <TickItem>Narrador de Áudio e Avatar Falante</TickItem>
            </ul>
            <button
              onClick={() => onSelectPlan('mestre')} 
              className="mt-auto block w-full py-3 font-semibold text-white bg-gradient-to-r from-pink-600 to-red-500 rounded-lg hover:opacity-90 transition-opacity"
            >
              Seja um Mestre
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PricingPage;