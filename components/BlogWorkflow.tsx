
import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';
import { BackIcon } from './Icons';

type Step = 'topic' | 'titles' | 'outline' | 'content';

const BlogWorkflow: React.FC = () => {
    const [step, setStep] = useState<Step>('topic');
    const [topic, setTopic] = useState('');
    const [titles, setTitles] = useState<string[]>([]);
    const [selectedTitle, setSelectedTitle] = useState('');
    const [outline, setOutline] = useState<string[]>([]);
    const [blogPost, setBlogPost] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReset = () => {
        setStep('topic');
        setTopic('');
        setTitles([]);
        setSelectedTitle('');
        setOutline([]);
        setBlogPost('');
        setError(null);
    };

    const handleGenerateTitles = useCallback(async () => {
        if (!topic) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await geminiService.generateBlogTitles(topic);
            setTitles(result);
            setStep('titles');
        } catch (e) {
            setError('Falha ao gerar títulos.');
        } finally {
            setIsLoading(false);
        }
    }, [topic]);

    const handleSelectTitle = useCallback(async (title: string) => {
        setSelectedTitle(title);
        setIsLoading(true);
        setError(null);
        try {
            const result = await geminiService.generateBlogOutline(title);
            setOutline(result);
            setStep('outline');
        } catch (e) {
            setError('Falha ao gerar o esboço.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleGeneratePost = useCallback(async () => {
        if (!selectedTitle || outline.length === 0) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await geminiService.generateBlogPost(selectedTitle, outline);
            setBlogPost(result);
            setStep('content');
        } catch (e) {
            setError('Falha ao gerar o post do blog.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedTitle, outline]);
    
    const renderStep = () => {
        switch (step) {
            case 'topic':
                return (
                    <>
                        <p className="text-slate-400 mb-4">Qual é o tópico principal do seu post de blog?</p>
                        <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex: Dicas de produtividade para trabalho remoto" className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition" />
                        <button onClick={handleGenerateTitles} disabled={isLoading || !topic} className="mt-4 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600">
                            {isLoading ? <Loader /> : 'Gerar Títulos'}
                        </button>
                    </>
                );
            case 'titles':
                return (
                    <>
                        <p className="text-slate-400 mb-4">Escolha o título que você mais gosta:</p>
                        <div className="space-y-3">
                            {titles.map((title, i) => (
                                <button key={i} onClick={() => handleSelectTitle(title)} className="w-full p-4 bg-slate-700 rounded-lg text-left hover:bg-purple-800 transition-colors">
                                    {title}
                                </button>
                            ))}
                        </div>
                    </>
                );
            case 'outline':
                 return (
                    <>
                        <p className="text-slate-400 mb-4">Aqui está um esboço sugerido. Sinta-se à vontade para ajustá-lo antes de gerar o post.</p>
                        <h3 className="font-bold text-lg mb-2 text-purple-300">{selectedTitle}</h3>
                        <div className="space-y-2">
                             {outline.map((item, i) => (
                                <input key={i} type="text" value={item} onChange={(e) => {
                                    const newOutline = [...outline];
                                    newOutline[i] = e.target.value;
                                    setOutline(newOutline);
                                }} className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg"/>
                            ))}
                        </div>
                        <button onClick={handleGeneratePost} disabled={isLoading} className="mt-4 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600">
                            {isLoading ? <Loader /> : 'Escrever Post do Blog'}
                        </button>
                    </>
                );
            case 'content':
                return (
                    <>
                        <h3 className="text-2xl font-bold text-purple-300 mb-4">{selectedTitle}</h3>
                        <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">{blogPost}</div>
                        <button onClick={handleReset} className="mt-6 flex items-center gap-2 px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"><BackIcon /> Começar de Novo</button>
                    </>
                );
        }
    };
    
    const steps = [
        {id: 'topic', label: 'Tópico'},
        {id: 'titles', label: 'Títulos'},
        {id: 'outline', label: 'Esboço'},
        {id: 'content', label: 'Conteúdo Final'}
    ];
    const currentStepIndex = steps.findIndex(s => s.id === step);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-white">Fluxo de Trabalho de Post de Blog</h2>
                
                {/* Stepper UI */}
                <div className="mb-8">
                    <ol className="flex items-center w-full">
                        {steps.map((s, index) => (
                             <li key={s.id} className={`flex w-full items-center ${index < steps.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block" : ""} ${index <= currentStepIndex ? 'text-purple-500 after:border-purple-500' : 'text-slate-500 after:border-slate-700'}`}>
                                <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${index <= currentStepIndex ? 'bg-purple-500' : 'bg-slate-700'}`}>
                                    <span className="text-white font-bold">{index + 1}</span>
                                </span>
                            </li>
                        ))}
                    </ol>
                </div>

                {isLoading && step !== 'content' ? <div className="flex justify-center p-8"><Loader/></div> : renderStep()}
                {error && <div className="mt-4 bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
            </div>
        </div>
    );
};

export default BlogWorkflow;