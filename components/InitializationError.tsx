import React from 'react';
import { LogoIcon } from './Icons';

interface InitializationErrorProps {
    error: string;
}

const InitializationError: React.FC<InitializationErrorProps> = ({ error }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 font-sans text-white">
            <div className="w-full max-w-3xl bg-slate-800/50 backdrop-blur-sm border border-red-500/50 rounded-2xl shadow-2xl shadow-red-500/10 p-8 text-center">
                <div className="flex flex-col items-center mb-6">
                    <LogoIcon />
                    <h1 className="text-2xl font-bold text-red-400 mt-4">Erro de Configuração</h1>
                </div>
                <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-red-300">Não foi possível iniciar o Estúdio de IA.</p>
                    <p className="mt-2 text-slate-300">{error}</p>
                </div>
                <div className="mt-6 text-left text-slate-400 space-y-4 text-sm">
                    <p>O aplicativo não conseguiu se conectar aos serviços de IA do Google porque uma Chave de API não foi encontrada. Isso pode acontecer por dois motivos principais, dependendo de onde você está executando o aplicativo.</p>

                    {/* Vercel Instructions */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <p className="font-bold text-slate-200">Como corrigir (para Implantação na Vercel):</p>
                        <p className="mt-2">Se você está vendo este erro em seu site publicado na Vercel, siga estes passos:</p>
                        <ol className="list-decimal list-inside space-y-2 pl-4 mt-2">
                            <li>
                                Vá para a página de chaves de API do Google AI Studio para <strong>criar uma nova chave</strong>: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">aistudio.google.com/app/apikey</a>.
                            </li>
                            <li>No seu projeto na Vercel, navegue até <strong>Settings</strong> &gt; <strong>Environment Variables</strong>.</li>
                            <li>
                                Crie uma variável com o nome **exato**: <code className="bg-slate-700 px-1 rounded font-bold">VITE_API_KEY</code>. O prefixo `VITE_` é crucial.
                            </li>
                            <li>Copie o valor completo da sua nova chave do AI Studio e cole no campo de valor da variável de ambiente.</li>
                            <li>Salve as alterações e faça o <strong>"Redeploy"</strong> do seu projeto para aplicar a nova chave.</li>
                        </ol>
                    </div>

                    {/* Local/AI Studio Instructions */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <p className="font-bold text-slate-200">Como corrigir (para Desenvolvimento Local ou AI Studio):</p>
                        <p className="mt-2">Se você está vendo este erro no seu ambiente de desenvolvimento local, verifique o seguinte:</p>
                        <ol className="list-decimal list-inside space-y-2 pl-4 mt-2">
                            <li>
                                O ambiente deve ter uma variável de ambiente ou segredo chamado **exatamente**: <code className="bg-slate-700 px-1 rounded font-bold">API_KEY</code>.
                            </li>
                            <li>Verifique se o valor da chave está correto, não expirou e não foi revogado.</li>
                            <li>Se estiver no Google AI Studio, verifique o painel "Secrets" (geralmente à esquerda) e certifique-se de que a chave `API_KEY` está lá e corretamente configurada.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InitializationError;