import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat as GeminiChat, GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import Loader from './Loader';
import { LogoIcon, SendIcon, UserIcon, UploadIcon } from './Icons';
import * as geminiService from '../services/geminiService';

const ChatWithFiles: React.FC = () => {
    const [context, setContext] = useState('');
    const [fileName, setFileName] = useState('');
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chatInitialized, setChatInitialized] = useState(false);
    const chatSession = useRef<GeminiChat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            setContext(text);
        };
        reader.onerror = () => {
            setError("Falha ao ler o arquivo.");
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const initializeChat = useCallback(() => {
        if (!context.trim()) {
            setError("Por favor, carregue um arquivo com conteúdo antes de iniciar o chat.");
            return;
        }
        setIsLoading(true);
        try {
            const apiKey = process.env.VITE_API_KEY || process.env.API_KEY;
            if (!apiKey) {
                throw new Error("Nenhuma Chave de API foi encontrada.");
            }
            const ai = new GoogleGenAI({ apiKey });

            const systemInstruction = `Você é um assistente de IA especialista em análise de texto. O usuário forneceu o seguinte documento como contexto. Todas as suas respostas devem ser baseadas EXCLUSIVAMENTE neste documento. Não use conhecimento externo. Se a resposta não estiver no documento, diga "A informação não foi encontrada no documento fornecido."

Documento:
---
${context}
---
`;
            chatSession.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: systemInstruction,
                },
            });


            setHistory([{
                role: 'model',
                content: `Contexto do arquivo "${fileName}" carregado. Agora você pode fazer perguntas sobre o documento que você forneceu.`
            }]);
            setChatInitialized(true);
            setError(null);
        } catch (e: any) {
            setError("Falha ao inicializar o assistente de IA. Verifique as configurações.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [context, fileName]);

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading || !chatSession.current) return;
        
        const userMessage = message.trim();
        setHistory(prev => [...prev, { role: 'user', content: userMessage }]);
        setMessage('');
        setIsLoading(true);
        setError(null);
        
        setHistory(prev => [...prev, { role: 'model', content: '' }]);

        try {
            const stream = await chatSession.current.sendMessageStream({ message: userMessage });
            
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                setHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1].content += chunkText;
                    return newHistory;
                });
            }
        } catch (e: any) {
            const errorMessage = "Ocorreu um erro ao se comunicar com a IA. Tente novamente.";
            setError(errorMessage);
            setHistory(prev => prev.slice(0, -1));
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [message, isLoading]);
    
    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto">
            {!chatInitialized ? (
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-white">Bate-papo com Arquivos</h2>
                    <p className="text-slate-400 mb-4">Carregue um arquivo de texto (.txt, .md) para que a IA possa responder perguntas com base em seu conteúdo.</p>
                    
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".txt,.md,text/plain,text/markdown" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors shadow-md">
                        <UploadIcon />
                        {fileName ? `Carregado: ${fileName}` : 'Escolher Arquivo'}
                    </button>
                    
                    {context && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-slate-400 mb-2">Pré-visualização do conteúdo:</h3>
                            <div className="w-full h-32 p-3 bg-slate-900 border border-slate-700 rounded-lg overflow-y-auto text-sm text-slate-300">
                                {context.substring(0, 500)}...
                            </div>
                        </div>
                    )}

                    <button onClick={initializeChat} disabled={!context.trim() || isLoading} className="mt-4 w-full px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md">
                        {isLoading ? <Loader /> : 'Iniciar Chat com este Arquivo'}
                    </button>
                    {error && <div className="mt-4 bg-red-500/20 text-red-300 p-3 rounded-lg text-sm">{error}</div>}
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto pr-4 space-y-6 mb-4">
                        {history.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'model' && (
                                    <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-full flex items-center justify-center text-white">
                                        <LogoIcon />
                                    </div>
                                )}
                                <div className={`max-w-xl p-4 rounded-2xl shadow-md ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center text-slate-400">
                                       <UserIcon/>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="mt-auto">
                         {error && <div className="mb-2 bg-red-500/20 text-red-300 p-3 rounded-lg text-sm">{error}</div>}
                        <div className="relative">
                            <input
                                type="text"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Faça uma pergunta sobre o documento..."
                                className="w-full p-3 pr-20 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                                disabled={isLoading}
                            />
                            <button type="submit" disabled={isLoading || !message.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md">
                                <SendIcon />
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default ChatWithFiles;