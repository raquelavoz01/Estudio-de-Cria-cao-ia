import { GoogleGenAI, Type, Modality, Chat } from "@google/genai";
import { Chapter } from '../types';

// Centralized error handler for Gemini API calls
const handleGeminiError = (error: any, context: string): string => {
    console.error(`Erro do Gemini no contexto: ${context}`, error);

    let messageToTest = '';

    // Tenta encontrar a string de mensagem de erro mais específica
    if (error?.error?.message && typeof error.error.message === 'string') {
        messageToTest = error.error.message;
    } else if (error?.message && typeof error.message === 'string') {
        messageToTest = error.message;
    } else if (typeof error === 'string') {
        messageToTest = error;
    } else if (typeof error === 'object' && error !== null) {
        // Como último recurso, transforma o objeto de erro em string para inspecioná-lo
        try {
            messageToTest = JSON.stringify(error);
        } catch (e) {
            messageToTest = 'Ocorreu um erro desconhecido ao processar o objeto de erro.';
        }
    }

    // A mensagem de erro pode ser uma string JSON, então tenta analisá-la
    try {
        const jsonMatch = messageToTest.match(/{.*}/s);
        if (jsonMatch) {
            const parsedError = JSON.parse(jsonMatch[0]);
            if (parsedError?.error?.message) {
                messageToTest = parsedError.error.message;
            }
        }
    } catch (e) {
        // Ignora erros de análise, usa a string que já temos
    }

    // Agora verifica a mensagem extraída em busca de problemas conhecidos
    if (messageToTest.includes('Requested entity was not found')) {
        return messageToTest; // Passa este erro específico para o componente de vídeo lidar com ele
    }
    if (messageToTest.includes('API key expired')) {
        return 'Sua Chave de API expirou. Por favor, crie uma nova chave no Google AI Studio e atualize sua variável de ambiente.';
    }
    if (messageToTest.includes('API_KEY_INVALID') || messageToTest.includes('API key not valid')) {
        return 'Sua Chave de API é inválida. Verifique se você a copiou corretamente do Google AI Studio e atualize sua variável de ambiente.';
    }
    if (messageToTest.includes('permission denied')) {
        return 'Permissão negada. Verifique se sua Chave de API tem as permissões necessárias para usar o modelo Gemini.';
    }
    if (messageToTest.includes('billing account')) {
        return 'Há um problema com a conta de faturamento associada à sua chave de API. Verifique suas configurações de faturamento no Google Cloud.';
    }
    if (messageToTest.includes('sustained long wait')) {
        return 'O serviço de IA está demorando muito para responder, o que pode indicar sobrecarga. Por favor, tente novamente mais tarde.';
    }
    if (messageToTest.includes('429') || messageToTest.includes('resource has been exhausted')) {
        return 'Você atingiu o limite de solicitações para a API. Por favor, aguarde um momento antes de tentar novamente.';
    }

    // Fallback genérico
    return `Ocorreu um erro ao se comunicar com a IA. Tente novamente.`;
};


// Helper function to get a fresh AI client instance
const getAiClient = (): GoogleGenAI => {
    const apiKey = process.env.VITE_API_KEY || process.env.API_KEY;
    if (!apiKey) {
        throw new Error("Chave de API não encontrada. Configure VITE_API_KEY (para produção) ou API_KEY (para desenvolvimento local).");
    }
    return new GoogleGenAI({ apiKey });
};


export const createChatSession = (): Chat => {
    const ai = getAiClient();
    const systemInstruction = "Você é um assistente de IA para o 'Estúdio de Criação IA'. Sua função é ajudar escritores a dar vida a mundos, personagens e narrativas épicas. Você pode ajudar com ideias, esboços, desenvolvimento de personagens e muito mais. O aplicativo também possui ferramentas para gerar imagens, vídeos e narrações de áudio. Você pode sugerir prompts para essas ferramentas, mas não pode gerá-los diretamente. Seja criativo, amigável e prestativo.";
    
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
};


export const generateBookOutline = async (premise: string): Promise<Chapter[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Crie um esboço detalhado de capítulos para um livro com a seguinte premissa: "${premise}". Forneça uma lista de capítulos, cada um com um título e um resumo de um parágrafo.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "O título do capítulo." },
                            summary: { type: Type.STRING, description: "Um resumo conciso do capítulo." }
                        },
                        required: ["title", "summary"]
                    }
                }
            }
        });
        try {
            const jsonText = response.text.trim();
            return JSON.parse(jsonText) as Chapter[];
        } catch (e) {
            console.error("Falha ao analisar a resposta JSON do Gemini (esboço do livro):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para o esboço do livro.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o esboço do livro'));
    }
};

export const generateSynopsis = async (premise: string, chapters: Chapter[]): Promise<string> => {
    const ai = getAiClient();
    try {
        const chapterOutlines = chapters.map(c => `- ${c.title}: ${c.summary}`).join('\n');
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Com base na premissa de livro "${premise}" e no esboço de capítulos abaixo, escreva uma sinopse de contracapa cativante e concisa (150-200 palavras) que atraia os leitores.\n\nEsboço dos Capítulos:\n${chapterOutlines}`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar a sinopse'));
    }
};


export const generateChapterContent = async (title: string, summary: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Escreva o conteúdo completo para um capítulo de livro.\n\nTítulo do Capítulo: "${title}"\nResumo do Capítulo: "${summary}"\n\nInstruções:\n- Desenvolve os pontos do resumo em uma narrativa rica e envolvente.\n- Mantenha um tom e estilo consistentes com uma obra de ficção.\n- O capítulo deve ter um bom ritmo, com começo, meio e fim.\n- A resposta deve ser apenas o texto do capítulo, sem títulos ou formatação extra.`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o conteúdo do capítulo'));
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: { numberOfImages: 1, aspectRatio: '1:1' },
        });
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar a imagem'));
    }
};

export const generateBookCoverFromImage = async (base64ImageData: string, mimeType: string, title: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const imagePart = { inlineData: { data: base64ImageData, mimeType: mimeType } };
        const textPart = { text: `Transforme esta imagem em uma arte de capa de livro para um livro com o título "${title}". Adicione o título de forma estilizada e proeminente na imagem. Mantenha o estilo artístico da imagem original, mas adapte-a para parecer uma capa de livro profissional. O título deve ser o foco principal e facilmente legível, mesmo como uma miniatura. Não inclua nomes de autor.` };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: { responseModalities: [Modality.IMAGE] },
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("Nenhuma imagem foi gerada pela IA.");
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar a capa do livro'));
    }
};

export const generatePortrait = async (base64ImageData: string, mimeType: string, style: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const imagePart = { inlineData: { data: base64ImageData, mimeType: mimeType } };
        const textPart = { text: `Usando esta foto como referência para o rosto e a fisionomia da pessoa, gere uma nova imagem dela em um estilo de retrato profissional '${style}'. Mantenha a identidade da pessoa, mas melhore a iluminação, o fundo e o traje para corresponder ao estilo solicitado. O resultado deve ser um retrato de alta qualidade e fotorrealista. Não altere as características faciais da pessoa. Apenas edite a foto para parecer mais profissional.` };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: { responseModalities: [Modality.IMAGE] },
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("Nenhuma imagem de retrato foi gerada.");
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o retrato'));
    }
};

export const generateVideo = async (prompt: string): Promise<string> => {
    try {
        const ai = getAiClient(); // Uses the same helper for consistency
        const apiKey = process.env.VITE_API_KEY || process.env.API_KEY; 
        if (!apiKey) {
            throw new Error("A chave de API é necessária para baixar o vídeo gerado.");
        }
        
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
        });
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Video generation completed, but no download link was found.");
        }
        const response = await fetch(`${downloadLink}&key=${apiKey}`);
        if (!response.ok) {
            throw new Error(`Failed to download video: ${response.statusText}`);
        }
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o vídeo'));
    }
};

export const generateAudio = async (text: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from API.");
        }
        return base64Audio;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o áudio'));
    }
};

export const generateMusic = async (prompt: string): Promise<{title: string, style: string, lyrics: string}> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere uma música com base no seguinte tema: "${prompt}". Forneça um título para a música, uma descrição do estilo musical e a letra completa.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "O título da música." },
                        style: { type: Type.STRING, description: "Uma breve descrição do estilo musical (ex: 'Pop rock animado', 'Balada folk acústica')." },
                        lyrics: { type: Type.STRING, description: "A letra completa da música, com versos e refrão." }
                    },
                    required: ["title", "style", "lyrics"]
                }
            }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar a resposta JSON do Gemini (música):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para a música.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar a música'));
    }
};

export const generateSoundEffectDescription = async (prompt: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Descreva em detalhes um efeito sonoro para o seguinte prompt: "${prompt}". A descrição deve ser vívida e útil para um designer de som criar o áudio. Inclua elementos como o ataque, sustentação, decaimento, e quaisquer qualidades textuais (ex: metálico, orgânico, áspero, suave).`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar a descrição do efeito sonoro'));
    }
};

export const upscaleImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const imagePart = { inlineData: { data: base64ImageData, mimeType: mimeType } };
        const textPart = { text: "Melhore esta imagem. Aumente a resolução, melhore a nitidez dos detalhes, corrija quaisquer artefatos de compressão ou ruído e restaure as cores para serem mais vibrantes e realistas. O resultado deve ser uma versão de alta qualidade da imagem original." };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: { responseModalities: [Modality.IMAGE] },
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("Nenhuma imagem otimizada foi gerada.");
    } catch(e) {
        throw new Error(handleGeminiError(e, 'otimizar a imagem'));
    }
};

export const redesignInterior = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const imagePart = { inlineData: { data: base64ImageData, mimeType: mimeType } };
        const textPart = { text: `Esta é uma foto de um cômodo. Redesenhe o interior com base na seguinte instrução: "${prompt}". Mantenha a estrutura arquitetônica básica do cômodo (janelas, portas, formato), mas altere a mobília, a decoração, as cores e a iluminação para combinar com o novo estilo. O resultado deve ser uma imagem fotorrealista do cômodo redesenhado.` };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: { responseModalities: [Modality.IMAGE] },
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("Nenhuma imagem de design de interiores foi gerada.");
    } catch(e) {
        throw new Error(handleGeminiError(e, 'redesenhar o interior'));
    }
};

export const generateSeoArticle = async (topic: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Escreva um artigo otimizado para SEO sobre o tópico: "${topic}". O artigo deve ser bem estruturado com um título, introdução, vários subtítulos (H2), e uma conclusão. Inclua palavras-chave relevantes naturalmente ao longo do texto. O tom deve ser informativo e envolvente.`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o artigo de SEO'));
    }
};

export const generateBlogTitles = async (topic: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere 5 títulos criativos e otimizados para SEO para um post de blog sobre o tópico: "${topic}".`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar a resposta JSON do Gemini (títulos de blog):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para os títulos de blog.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar os títulos de blog'));
    }
};

export const generateBlogOutline = async (title: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Crie um esboço (outline) para um post de blog com o título: "${title}". Forneça uma lista de 4 a 6 subtítulos (tópicos principais) que devem ser abordados no artigo.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar a resposta JSON do Gemini (esboço de blog):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para o esboço de blog.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o esboço de blog'));
    }
};

export const generateBlogPost = async (title: string, outline: string[]): Promise<string> => {
    const ai = getAiClient();
    try {
        const outlineText = outline.map(item => `- ${item}`).join('\n');
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Escreva um post de blog completo com base no seguinte título e esboço. O artigo deve ser envolvente, informativo e bem estruturado.\n\nTítulo: ${title}\n\nEsboço:\n${outlineText}\n`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o post de blog'));
    }
};

export const generateInstagramCaptions = async (description: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere 3 legendas para uma postagem no Instagram sobre: "${description}". Inclua emojis relevantes e hashtags populares. Varie o tom (uma engraçada, uma inspiradora, uma informativa).`,
             config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
        });
         try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar a resposta JSON do Gemini (legendas do Instagram):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para as legendas do Instagram.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar as legendas do Instagram'));
    }
};

export const generateParagraph = async (topic: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Escreva um parágrafo bem desenvolvido sobre o seguinte tópico: "${topic}".`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o parágrafo'));
    }
};

export const generateSeoMetadata = async (topic: string): Promise<{title: string, description: string}> => {
     const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere um título de SEO (máximo 60 caracteres) e uma meta descrição (máximo 160 caracteres) para uma página da web sobre: "${topic}".`,
             config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { title: { type: Type.STRING }, description: { type: Type.STRING } },
                    required: ["title", "description"]
                }
            }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar a resposta JSON do Gemini (metadados de SEO):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para os metadados de SEO.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar os metadados de SEO'));
    }
};

export const generateTopicsAndBullets = async (text: string): Promise<{topics: string[], bullets: string[]}> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analise o seguinte texto e extraia os tópicos principais e os pontos-chave (marcadores).\n\nTexto:\n---\n${text}\n---`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        topics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Uma lista dos principais tópicos ou temas abordados no texto." },
                        bullets: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Uma lista de marcadores resumindo os pontos mais importantes ou fatos do texto." }
                    },
                    required: ["topics", "bullets"]
                }
            }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar a resposta JSON do Gemini (tópicos e marcadores):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para os tópicos e marcadores.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar tópicos e marcadores'));
    }
};

export const shortenText = async (text: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Encurte o texto a seguir, mantendo as informações mais importantes e o significado central. Resuma-o de forma concisa.\n\nTexto Original:\n---\n${text}\n---`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'encurtar o texto'));
    }
};

export const generateBlogPostIntro = async (topic: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Escreva uma introdução de post de blog cativante e envolvente (aproximadamente 100-150 palavras) para o seguinte tópico: "${topic}". A introdução deve prender a atenção do leitor e apresentar o tema principal do artigo.`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar a introdução do post de blog'));
    }
};

export const generateBlogPostConclusion = async (topic: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Escreva uma conclusão de post de blog impactante (aproximadamente 100-150 palavras) para um artigo sobre o seguinte tópico: "${topic}". A conclusão deve resumir os pontos principais e terminar com uma chamada para ação ou um pensamento final memorável.`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar a conclusão do post de blog'));
    }
};

export const generateArticleFromYouTubeSummary = async (summary: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Converta o seguinte tópico ou resumo de um vídeo do YouTube em um artigo de blog bem estruturado e otimizado para SEO. O artigo deve ter um título, introdução, subtítulos e uma conclusão.\n\nResumo do Vídeo: "${summary}"`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar artigo a partir do resumo do YouTube'));
    }
};

export const generateLandingPageCopy = async (productName: string, description: string): Promise<{ headlines: string[], benefits: string[], cta: string }> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere uma cópia de marketing para uma landing page.\n\nProduto/Serviço: ${productName}\nDescrição: ${description}\n\nForneça 3 opções de títulos (headlines), uma lista de 4 benefícios principais e uma chamada para ação (call to action) convincente.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        headlines: { type: Type.ARRAY, items: { type: Type.STRING } },
                        benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
                        cta: { type: Type.STRING }
                    },
                    required: ["headlines", "benefits", "cta"]
                }
            }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar a resposta JSON do Gemini (cópia da landing page):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para a cópia da landing page.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar a cópia da landing page'));
    }
};

export const generateEmail = async (prompt: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Escreva um e-mail profissional com base na seguinte solicitação: "${prompt}"`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o e-mail'));
    }
};

export const generateMarketingEmail = async (product: string, audience: string, goal: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Escreva um e-mail de marketing persuasivo e profissional.\n\nNome do Produto/Serviço: ${product}\nPúblico-alvo: ${audience}\nObjetivo do E-mail: ${goal}\n\nO e-mail deve incluir uma linha de assunto cativante, um corpo de texto envolvente que destaque os benefícios e uma chamada para ação clara.`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o e-mail de marketing'));
    }
};

export const generateAdCopy = async (product: string, audience: string, tone: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Escreva 3 variações de texto de anúncio atraentes.\n\nProduto/Serviço: ${product}\nPúblico-alvo: ${audience}\nTom: ${tone}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (cópia de anúncio):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para a cópia do anúncio.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar a cópia do anúncio'));
    }
};

export const generateYouTubeVideoTitles = async (topic: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere 5 títulos de vídeo do YouTube atraentes e com alta probabilidade de clique para o seguinte tópico: "${topic}". Os títulos devem ser otimizados para busca e curiosidade.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (títulos do YouTube):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para os títulos do YouTube.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar títulos do YouTube'));
    }
};

export const generateYouTubeVideoIdeas = async (topic: string): Promise<{ title: string; hook: string; description: string }[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere 3 ideias de vídeo completas para o YouTube sobre o tópico: "${topic}". Para cada ideia, forneça um título, um gancho (hook) para os primeiros 15 segundos e uma breve descrição do vídeo.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { title: { type: Type.STRING }, hook: { type: Type.STRING }, description: { type: Type.STRING } },
                        required: ["title", "hook", "description"]
                    }
                }
            }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (ideias do YouTube):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para as ideias do YouTube.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar ideias para o YouTube'));
    }
};

export const generateVideoScriptOutline = async (topic: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Crie um esboço de roteiro para um vídeo do YouTube sobre o tópico: "${topic}". O esboço deve incluir uma introdução, 3-4 pontos principais e uma conclusão com uma chamada para ação.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (esboço de roteiro):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para o esboço de roteiro.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o esboço de roteiro de vídeo'));
    }
};

export const generateTikTokCaptions = async (topic: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere 3 legendas curtas e virais para um vídeo do TikTok sobre: "${topic}". As legendas devem ser envolventes e incluir uma pergunta ou chamada para ação para incentivar comentários.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (legendas do TikTok):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para as legendas do TikTok.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar legendas para o TikTok'));
    }
};

export const generateTikTokHashtags = async (topic: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere uma lista de hashtags relevantes e populares para um vídeo do TikTok sobre: "${topic}". Inclua uma mistura de hashtags de nicho e de tendência. Forneça 10 hashtags.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING, description: "Uma única hashtag, começando com #" } } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (hashtags do TikTok):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para as hashtags do TikTok.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar hashtags para o TikTok'));
    }
};

export const generateSeoContentBrief = async (topic: string): Promise<{ targetKeywords: string[], suggestedTitles: string[], structure: string[] }> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Crie um briefing de conteúdo de SEO para o tópico: "${topic}". Forneça uma lista de palavras-chave alvo, 3 sugestões de títulos e uma estrutura de artigo sugerida com subtítulos.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        targetKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                        suggestedTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
                        structure: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de subtítulos (H2, H3) para o artigo." }
                    },
                    required: ["targetKeywords", "suggestedTitles", "structure"]
                }
            }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (briefing de SEO):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para o briefing de SEO.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o briefing de conteúdo de SEO'));
    }
};

export const generateGoogleAdsHeadlines = async (product: string, description: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere 5 títulos curtos e impactantes (máximo 30 caracteres cada) para uma campanha do Google Ads.\nProduto: ${product}\nDescrição: ${description}`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (títulos do Google Ads):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para os títulos do Google Ads.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar títulos para o Google Ads'));
    }
};

export const generateGoogleAdsDescriptions = async (product: string, description: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere 3 descrições persuasivas (máximo 90 caracteres cada) para uma campanha do Google Ads.\nProduto: ${product}\nDescrição: ${description}`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (descrições do Google Ads):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para as descrições do Google Ads.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar descrições para o Google Ads'));
    }
};

export const generateGmbProductDescription = async (product: string, features: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Escreva uma descrição de produto concisa e atraente para o Google Meu Negócio.\nProduto/Serviço: ${product}\nPrincipais Características: ${features}`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar a descrição de produto do GMB'));
    }
};

export const generateFbAdsHeadlines = async (product: string, audience: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere 5 títulos chamativos para um anúncio do Facebook.\nProduto: ${product}\nPúblico-alvo: ${audience}`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (títulos do Facebook Ads):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para os títulos do Facebook Ads.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar títulos para o Facebook Ads'));
    }
};

export const generateFbAdsPrimaryText = async (product: string, audience: string, tone: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Escreva o texto principal para um anúncio do Facebook que gere leads e vendas.\nProduto: ${product}\nPúblico-alvo: ${audience}\nTom: ${tone}`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o texto principal para o Facebook Ads'));
    }
};

export const generateSongIdeas = async (genre: string, mood: string): Promise<{ title: string; concept: string }[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere 3 ideias para músicas.\nGênero: ${genre}\nHumor/Sentimento: ${mood}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { title: { type: Type.STRING }, concept: { type: Type.STRING } },
                        required: ["title", "concept"]
                    }
                }
            }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (ideias de músicas):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para as ideias de músicas.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar ideias de músicas'));
    }
};

export const generateBookTitles = async (genre: string, premise: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere 5 títulos de livros criativos e únicos.\nGênero: ${genre}\nPremissa: ${premise}`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (títulos de livros):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para os títulos de livros.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar títulos de livros'));
    }
};

export const generateBookOutlineForTitle = async (title: string, genre: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Crie um esboço estruturado com os principais pontos da trama para um livro.\nTítulo: ${title}\nGênero: ${genre}`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Uma lista de títulos de capítulos ou pontos principais da trama." } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (esboço de livro):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para o esboço de livro.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o esboço de livro'));
    }
};

export const generateInstagramBio = async (description: string, tone: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere 3 opções de biografia para o Instagram (máximo 150 caracteres cada).\nDescrição do perfil: ${description}\nTom desejado: ${tone}`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (bio do Instagram):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para a bio do Instagram.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar a bio do Instagram'));
    }
};

export const generateReelsScript = async (topic: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Crie um roteiro curto e envolvente para um Instagram Reel (ou TikTok) de 30-60 segundos sobre o tema: "${topic}". O roteiro deve ser dividido em cenas ou etapas fáceis de seguir.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Uma lista de etapas ou cenas do roteiro." } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (roteiro de Reels):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para o roteiro de Reels.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o roteiro de Reels'));
    }
};

export const generateReelsCaptions = async (topic: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere 3 legendas curtas e impactantes para um Instagram Reel sobre: "${topic}". As legendas devem ser otimizadas para engajamento.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (legendas de Reels):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para as legendas de Reels.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar legendas para Reels'));
    }
};

export const generateReelsIdeas = async (niche: string): Promise<{idea: string; hook: string; scenes: string[]}[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere 3 ideias de Instagram Reels para o seguinte nicho: "${niche}". Para cada ideia, forneça o conceito principal, um gancho (hook) forte para os primeiros 3 segundos e uma breve lista de cenas.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            idea: { type: Type.STRING },
                            hook: { type: Type.STRING },
                            scenes: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["idea", "hook", "scenes"]
                    }
                }
            }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (ideias de Reels):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para as ideias de Reels.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar ideias para Reels'));
    }
};

export const generateInstagramHashtags = async (topic: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere 15 hashtags relevantes para uma postagem no Instagram sobre: "${topic}". Inclua uma mistura de hashtags populares, de nicho e específicas.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING, description: "Uma única hashtag, começando com #" } } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (hashtags do Instagram):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para as hashtags do Instagram.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar hashtags para o Instagram'));
    }
};

export const generateInstagramThread = async (topic: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere uma sequência de 5 posts curtos para um tópico (thread) do Instagram sobre: "${topic}". O primeiro post deve ser um gancho, e os posts seguintes devem desenvolver a ideia.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Uma lista de 5 posts para a thread." } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (thread do Instagram):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para a thread do Instagram.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar thread para o Instagram'));
    }
};

export const generateVideoPrompt = async (idea: string): Promise<{prompt: string; camera: string; style: string; fx: string}> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere um prompt de vídeo detalhado para um modelo de IA de geração de vídeo.\nIdeia: ${idea}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        prompt: { type: Type.STRING, description: "Descrição visual detalhada da cena." },
                        camera: { type: Type.STRING, description: "Direção da câmera (ex: close-up, travelling, wide shot)." },
                        style: { type: Type.STRING, description: "Estilo visual (ex: cinematográfico, anime, vintage)." },
                        fx: { type: Type.STRING, description: "Efeitos especiais (ex: câmera lenta, brilho neon)." }
                    },
                    required: ["prompt", "camera", "style", "fx"]
                }
            }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (prompt de vídeo):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para o prompt de vídeo.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar o prompt de vídeo'));
    }
};

export const generateImageDescription = async (base64ImageData: string, mimeType: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const imagePart = { inlineData: { data: base64ImageData, mimeType: mimeType } };
        const textPart = { text: "Descreva esta imagem em detalhes. Seja objetivo e foque nos elementos visuais presentes." };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar a descrição da imagem'));
    }
};

export const generateLotteryNumbers = async (game: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere um conjunto de números aleatórios para o seguinte jogo de loteria: ${game}.`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (números de loteria):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para os números de loteria.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar números de loteria'));
    }
};

export const generateBedtimeStory = async (topic: string, character: string, style: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Escreva uma história infantil curta para dormir.\nTema: ${topic}\nPersonagem principal: ${character}\nEstilo: ${style}`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar a história para dormir'));
    }
};

export const generateLullaby = async (topic: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Escreva a letra de uma canção de ninar suave e relaxante sobre: "${topic}".`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar a canção de ninar'));
    }
};

export const generateCharacterNames = async (genre: string, description: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Gere 5 nomes de personagens únicos.\nGênero da história: ${genre}\nBreve descrição do personagem: ${description}`,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar JSON do Gemini (nomes de personagens):", response.text);
            throw new Error("A IA retornou uma resposta em formato inválido para os nomes de personagens.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar nomes de personagens'));
    }
};

export const generateCharacterDescription = async (name: string, archetype: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Escreva uma descrição detalhada para um personagem.\nNome: ${name}\nArquétipo/Tipo: ${archetype}`,
        });
        return response.text;
    } catch(e) {
        throw new Error(handleGeminiError(e, 'gerar a descrição do personagem'));
    }
};

// --- Funções para Ferramentas Genéricas ---

export const generateGenericText = async (prompt: string, model: 'gemini-2.5-flash' | 'gemini-2.5-pro' = 'gemini-2.5-flash'): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text;
    } catch (e) {
        throw new Error(handleGeminiError(e, 'geração de texto genérico'));
    }
};

export const generateGenericJsonArray = async (prompt: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        });
        try {
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Falha ao analisar a resposta JSON do Gemini (array genérico):", response.text);
            throw new Error("A IA retornou uma resposta em formato de array inválido.");
        }
    } catch(e) {
        throw new Error(handleGeminiError(e, 'geração de array genérico'));
    }
};
