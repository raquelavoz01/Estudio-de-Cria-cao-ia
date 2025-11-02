import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat as GeminiChat } from "@google/genai";
import { ChatMessage } from '../types';
import Loader from './Loader';
import { LogoIcon, SendIcon, UserIcon } from './Icons';
import * as geminiService from '../services/geminiService';

const Chat: React.FC = () => {
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatSession = useRef<GeminiChat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = () => {
            try {
                // AI is initialized in App.tsx, we can safely create a session now.
                chatSession.current = geminiService.createChatSession();

                setHistory([{
                    role: 'model',
                    content: 'Olá! Como posso ajudar você a dar vida à sua próxima grande história hoje?'
                }]);
            } catch (e: any) {
                setError("Falha ao inicializar a sessão de chat.");
                console.error(e);
            }
        };
        initChat();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

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
            setHistory(prev => prev.slice(0, -1)); // Remove the empty model message
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [message, isLoading]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e as any);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto">
            <div className="flex-1 overflow-y-auto pr-4 space-y-6">
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
                {isLoading && history[history.length-1]?.role === 'model' && (
                     <div className="flex items-start gap-4">
                        <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-full flex items-center justify-center text-white">
                            <LogoIcon />
                        </div>
                        <div className="max-w-xl p-4 rounded-2xl shadow-md bg-slate-800 text-slate-200 rounded-bl-none">
                           <Loader />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="mt-6">
                {error && <div className="mb-2 bg-red-500/20 text-red-300 p-3 rounded-lg text-sm">{error}</div>}
                <div className="relative">
                    <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Digite sua mensagem aqui... (Shift+Enter para nova linha)"
                        className="w-full h-12 p-3 pr-20 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition resize-none"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !message.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md">
                        <SendIcon />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;