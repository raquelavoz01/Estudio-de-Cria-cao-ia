import React from 'react';
import { LogoIcon } from './Icons';

interface InitializationErrorProps {
    error: string;
}

const InitializationError: React.FC<InitializationErrorProps> = ({ error }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 font-sans text-white">
            <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-sm border border-red-500/50 rounded-2xl shadow-2xl shadow-red-500/10 p-8 text-center">
                <div className="flex flex-col items-center mb-6">
                    <LogoIcon />
                    <h1 className="text-2xl font-bold text-red-400 mt-4">Erro de Configuração</h1>
                </div>
                <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-red-300">Não foi possível iniciar o Estúdio de IA.</p>
                    <p className="mt-2 text-slate-300">{error}</p>
                </div>
                <div className="mt-6 text-left text-slate-400 space-y-3 text-sm">
                    <p><strong>O que isso significa?</strong></p>
                    <p>O aplicativo não conseguiu se conectar aos serviços de IA do Google. As causas mais comuns são:</p>
                    <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>A Chave de API (API Key) não foi adicionada ao ambiente do projeto.</li>
                        <li>A variável de ambiente da Chave de API está com o nome incorreto.</li>
                        <li>O valor da Chave de API está incorreto, é inválido ou <strong>expirou</strong>.</li>
                    </ul>
                    <p className="pt-2"><strong>Como corrigir:</strong></p>
                    <ol className="list-decimal list-inside space-y-2 pl-4">
                        <li>
                            Vá para a página de chaves de API do Google AI Studio para <strong>criar uma nova chave</strong> ou verificar suas chaves existentes: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">aistudio.google.com/app/apikey</a>.
                        </li>
                        <li>No seu projeto na Vercel (ou outro serviço de hospedagem), navegue até <strong>Settings</strong> &gt; <strong>Environment Variables</strong>.</li>
                        <li>
                            Certifique-se de que existe uma variável com o nome exato <code className="bg-slate-700 px-1 rounded font-bold">API_KEY</code>.
                        </li>
                        <li>Copie o valor completo da sua nova chave do AI Studio e cole no campo de valor da variável de ambiente.</li>
                        <li>Salve as alterações e faça o <strong>"Redeploy"</strong> do seu projeto para que a nova chave seja aplicada.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default InitializationError;
