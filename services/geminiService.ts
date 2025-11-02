import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Chapter } from '../types';

const getAi = () => {
    // API_KEY is automatically provided by the environment.
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateBookOutline = async (premise: string): Promise<Chapter[]> => {
    const ai = getAi();
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
                        title: {
                            type: Type.STRING,
                            description: "O título do capítulo."
                        },
                        summary: {
                            type: Type.STRING,
                            description: "Um resumo conciso do capítulo."
                        }
                    },
                    required: ["title", "summary"]
                }
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        const chapters = JSON.parse(jsonText);
        return chapters as Chapter[];
    } catch (e) {
        console.error("Failed to parse Gemini JSON response:", response.text);
        throw new Error("Received invalid JSON from AI for book outline.");
    }
};

export const generateSynopsis = async (premise: string, chapters: Chapter[]): Promise<string> => {
    const ai = getAi();
    const chapterOutlines = chapters.map(c => `- ${c.title}: ${c.summary}`).join('\n');
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Com base na premissa de livro "${premise}" e no esboço de capítulos abaixo, escreva uma sinopse de contracapa cativante e concisa (150-200 palavras) que atraia os leitores.

Esboço dos Capítulos:
${chapterOutlines}`,
    });
    return response.text;
};


export const generateChapterContent = async (title: string, summary: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: `Escreva o conteúdo completo para um capítulo de livro.
        
        Título do Capítulo: "${title}"
        Resumo do Capítulo: "${summary}"
        
        Instruções:
        - Desenvolve os pontos do resumo em uma narrativa rica e envolvente.
        - Mantenha um tom e estilo consistentes com uma obra de ficção.
        - O capítulo deve ter um bom ritmo, com começo, meio e fim.
        - A resposta deve ser apenas o texto do capítulo, sem títulos ou formatação extra.`,
    });
    return response.text;
};

export const generateImage = async (prompt: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            aspectRatio: '1:1',
        },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;
};

export const generateBookCoverFromImage = async (base64ImageData: string, mimeType: string, title: string): Promise<string> => {
    const ai = getAi();
    const imagePart = {
        inlineData: {
            data: base64ImageData,
            mimeType: mimeType,
        },
    };
    const textPart = {
        text: `Transforme esta imagem em uma arte de capa de livro para um livro com o título "${title}". Adicione o título de forma estilizada e proeminente na imagem. Mantenha o estilo artístico da imagem original, mas adapte-a para parecer uma capa de livro profissional. O título deve ser o foco principal e facilmente legível, mesmo como uma miniatura. Não inclua nomes de autor.`
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [imagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    throw new Error("Nenhuma imagem foi gerada pela IA.");
};

export const generatePortrait = async (base64ImageData: string, mimeType: string, style: string): Promise<string> => {
    const ai = getAi();
    const imagePart = {
        inlineData: {
            data: base64ImageData,
            mimeType: mimeType,
        },
    };
    const textPart = {
        text: `Usando esta foto como referência para o rosto e a fisionomia da pessoa, gere uma nova imagem dela em um estilo de retrato profissional '${style}'. Mantenha a identidade da pessoa, mas melhore a iluminação, o fundo e o traje para corresponder ao estilo solicitado. O resultado deve ser um retrato de alta qualidade e fotorrealista. Não altere as características faciais da pessoa. Apenas edite a foto para parecer mais profissional.`
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    throw new Error("Nenhuma imagem de retrato foi gerada.");
};

export const generateVideo = async (prompt: string): Promise<string> => {
    // Instantiate new client to ensure latest API key is used
    const ai = getAi(); 
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '16:9'
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was found.");
    }
    
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
};

export const generateAudio = async (text: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio data received from API.");
    }
    return base64Audio;
};

export const generateMusic = async (prompt: string): Promise<{title: string, style: string, lyrics: string}> => {
    const ai = getAi();
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
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse Gemini JSON response for music:", response.text);
        throw new Error("Received invalid JSON from AI for music generation.");
    }
};

export const generateSoundEffectDescription = async (prompt: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Descreva em detalhes um efeito sonoro para o seguinte prompt: "${prompt}". A descrição deve ser vívida e útil para um designer de som criar o áudio. Inclua elementos como o ataque, sustentação, decaimento, e quaisquer qualidades texturais (ex: metálico, orgânico, áspero, suave).`,
    });
    return response.text;
};

export const upscaleImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
    const ai = getAi();
    const imagePart = {
        inlineData: { data: base64ImageData, mimeType: mimeType },
    };
    const textPart = {
        text: "Melhore esta imagem. Aumente a resolução, melhore a nitidez dos detalhes, corrija quaisquer artefatos de compressão ou ruído e restaure as cores para serem mais vibrantes e realistas. O resultado deve ser uma versão de alta qualidade da imagem original."
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("Nenhuma imagem otimizada foi gerada.");
};

export const redesignInterior = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
    const ai = getAi();
    const imagePart = {
        inlineData: { data: base64ImageData, mimeType: mimeType },
    };
    const textPart = {
        text: `Esta é uma foto de um cômodo. Redesenhe o interior com base na seguinte instrução: "${prompt}". Mantenha a estrutura arquitetônica básica do cômodo (janelas, portas, formato), mas altere a mobília, a decoração, as cores e a iluminação para combinar com o novo estilo. O resultado deve ser uma imagem fotorrealista do cômodo redesenhado.`
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("Nenhuma imagem de design de interiores foi gerada.");
};

// Writing Tools
export const generateSeoArticle = async (topic: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: `Escreva um artigo otimizado para SEO sobre o tópico: "${topic}". O artigo deve ser bem estruturado com um título, introdução, vários subtítulos (H2), e uma conclusão. Inclua palavras-chave relevantes naturalmente ao longo do texto. O tom deve ser informativo e envolvente.`,
    });
    return response.text;
};

export const generateBlogTitles = async (topic: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere 5 títulos criativos e otimizados para SEO para um post de blog sobre o tópico: "${topic}".`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });
    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse Gemini JSON response for blog titles:", response.text);
        throw new Error("Received invalid JSON from AI for blog titles.");
    }
};

export const generateBlogOutline = async (title: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Crie um esboço (outline) para um post de blog com o título: "${title}". Forneça uma lista de 4 a 6 subtítulos (tópicos principais) que devem ser abordados no artigo.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });
    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse Gemini JSON response for blog outline:", response.text);
        throw new Error("Received invalid JSON from AI for blog outline.");
    }
};

export const generateBlogPost = async (title: string, outline: string[]): Promise<string> => {
    const ai = getAi();
    const outlineText = outline.map(item => `- ${item}`).join('\n');
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: `Escreva um post de blog completo com base no seguinte título e esboço. O artigo deve ser envolvente, informativo e bem estruturado.

Título: ${title}

Esboço:
${outlineText}
`,
    });
    return response.text;
};

export const generateInstagramCaptions = async (description: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere 3 legendas para uma postagem no Instagram sobre: "${description}". Inclua emojis relevantes e hashtags populares. Varie o tom (uma engraçada, uma inspiradora, uma informativa).`,
         config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });
     try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse Gemini JSON response for instagram captions:", response.text);
        throw new Error("Received invalid JSON from AI for instagram captions.");
    }
};

export const generateParagraph = async (topic: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Escreva um parágrafo bem desenvolvido sobre o seguinte tópico: "${topic}".`,
    });
    return response.text;
};

export const generateSeoMetadata = async (topic: string): Promise<{title: string, description: string}> => {
     const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere um título de SEO (máximo 60 caracteres) e uma meta descrição (máximo 160 caracteres) para uma página da web sobre: "${topic}".`,
         config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["title", "description"]
            }
        }
    });
    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse Gemini JSON response for SEO metadata:", response.text);
        throw new Error("Received invalid JSON from AI for SEO metadata.");
    }
};

export const generateTopicsAndBullets = async (text: string): Promise<{topics: string[], bullets: string[]}> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analise o seguinte texto e extraia os tópicos principais e os pontos-chave (marcadores).

Texto:
---
${text}
---`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    topics: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Uma lista dos principais tópicos ou temas abordados no texto."
                    },
                    bullets: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Uma lista de marcadores resumindo os pontos mais importantes ou fatos do texto."
                    }
                },
                required: ["topics", "bullets"]
            }
        }
    });
    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse Gemini JSON response for topics/bullets:", response.text);
        throw new Error("Received invalid JSON from AI for topics/bullets.");
    }
};

export const shortenText = async (text: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Encurte o texto a seguir, mantendo as informações mais importantes e o significado central. Resuma-o de forma concisa.

Texto Original:
---
${text}
---`,
    });
    return response.text;
};

export const generateBlogPostIntro = async (topic: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Escreva uma introdução de post de blog cativante e envolvente (aproximadamente 100-150 palavras) para o seguinte tópico: "${topic}". A introdução deve prender a atenção do leitor e apresentar o tema principal do artigo.`,
    });
    return response.text;
};

export const generateBlogPostConclusion = async (topic: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Escreva uma conclusão de post de blog impactante (aproximadamente 100-150 palavras) para um artigo sobre o seguinte tópico: "${topic}". A conclusão deve resumir os pontos principais e terminar com uma chamada para ação ou um pensamento final memorável.`,
    });
    return response.text;
};


// Marketing Tools
export const generateArticleFromYouTubeSummary = async (summary: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: `Converta o seguinte tópico ou resumo de um vídeo do YouTube em um artigo de blog bem estruturado e otimizado para SEO. O artigo deve ter um título, introdução, subtítulos e uma conclusão.

Resumo do Vídeo: "${summary}"`,
    });
    return response.text;
};

export const generateLandingPageCopy = async (productName: string, description: string): Promise<{ headlines: string[], benefits: string[], cta: string }> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere uma cópia de marketing para uma landing page.
        
Produto/Serviço: ${productName}
Descrição: ${description}

Forneça 3 opções de títulos (headlines), uma lista de 4 benefícios principais e uma chamada para ação (call to action) convincente.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    headlines: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    benefits: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    cta: {
                        type: Type.STRING
                    }
                },
                required: ["headlines", "benefits", "cta"]
            }
        }
    });
    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse Gemini JSON response for landing page copy:", response.text);
        throw new Error("Received invalid JSON from AI for landing page copy.");
    }
};

export const generateEmail = async (prompt: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: `Escreva um e-mail profissional com base na seguinte solicitação: "${prompt}"`,
    });
    return response.text;
};

export const generateMarketingEmail = async (product: string, audience: string, goal: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: `Escreva um e-mail de marketing persuasivo e profissional.

Nome do Produto/Serviço: ${product}
Público-alvo: ${audience}
Objetivo do E-mail: ${goal}

O e-mail deve incluir uma linha de assunto cativante, um corpo de texto envolvente que destaque os benefícios e uma chamada para ação clara.`,
    });
    return response.text;
};

// Social Media Tools
export const generateYouTubeVideoTitles = async (topic: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere 5 títulos de vídeo do YouTube atraentes e com alta probabilidade de clique para o seguinte tópico: "${topic}". Os títulos devem ser otimizados para busca e curiosidade.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for YouTube titles:", response.text);
        throw new Error("Received invalid JSON from AI for YouTube titles.");
    }
};

export const generateYouTubeVideoIdeas = async (topic: string): Promise<{ title: string; hook: string; description: string }[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere 3 ideias de vídeo completas para o YouTube sobre o tópico: "${topic}". Para cada ideia, forneça um título, um gancho (hook) para os primeiros 15 segundos e uma breve descrição do vídeo.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        hook: { type: Type.STRING },
                        description: { type: Type.STRING }
                    },
                    required: ["title", "hook", "description"]
                }
            }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for YouTube ideas:", response.text);
        throw new Error("Received invalid JSON from AI for YouTube ideas.");
    }
};


export const generateVideoScriptOutline = async (topic: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Crie um esboço de roteiro para um vídeo do YouTube sobre o tópico: "${topic}". O esboço deve incluir uma introdução, 3-4 pontos principais e uma conclusão com uma chamada para ação.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for video script outline:", response.text);
        throw new Error("Received invalid JSON from AI for video script outline.");
    }
};

export const generateTikTokCaptions = async (topic: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere 3 legendas curtas e virais para um vídeo do TikTok sobre: "${topic}". As legendas devem ser envolventes e incluir uma pergunta ou chamada para ação para incentivar comentários.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for TikTok captions:", response.text);
        throw new Error("Received invalid JSON from AI for TikTok captions.");
    }
};

export const generateTikTokHashtags = async (topic: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere uma lista de hashtags relevantes e populares para um vídeo do TikTok sobre: "${topic}". Inclua uma mistura de hashtags de nicho e de tendência. Forneça 10 hashtags.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING, description: "Uma única hashtag, começando com #" } }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for TikTok hashtags:", response.text);
        throw new Error("Received invalid JSON from AI for TikTok hashtags.");
    }
};


// Book Tools

export const generateSeoContentBrief = async (topic: string): Promise<{ targetKeywords: string[], suggestedTitles: string[], structure: string[] }> => {
    const ai = getAi();
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
        console.error("Failed to parse Gemini JSON for SEO brief:", response.text);
        throw new Error("Received invalid JSON from AI for SEO brief.");
    }
};

export const generateGoogleAdsHeadlines = async (product: string, description: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere 5 títulos curtos e impactantes (máximo 30 caracteres cada) para uma campanha do Google Ads.
        Produto: ${product}
        Descrição: ${description}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for Google Ads headlines:", response.text);
        throw new Error("Received invalid JSON from AI for Google Ads headlines.");
    }
};

export const generateGoogleAdsDescriptions = async (product: string, description: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere 3 descrições persuasivas (máximo 90 caracteres cada) para uma campanha do Google Ads.
        Produto: ${product}
        Descrição: ${description}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for Google Ads descriptions:", response.text);
        throw new Error("Received invalid JSON from AI for Google Ads descriptions.");
    }
};

export const generateGmbProductDescription = async (product: string, features: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Escreva uma descrição de produto concisa e atraente para o Google Meu Negócio.
        Produto/Serviço: ${product}
        Principais Características: ${features}`,
    });
    return response.text;
};

export const generateFbAdsHeadlines = async (product: string, audience: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere 5 títulos chamativos para um anúncio do Facebook.
        Produto: ${product}
        Público-alvo: ${audience}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for Facebook Ads headlines:", response.text);
        throw new Error("Received invalid JSON from AI for Facebook Ads headlines.");
    }
};

export const generateFbAdsPrimaryText = async (product: string, audience: string, tone: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: `Escreva o texto principal para um anúncio do Facebook que gere leads e vendas.
        Produto: ${product}
        Público-alvo: ${audience}
        Tom: ${tone}`,
    });
    return response.text;
};

export const generateSongIdeas = async (genre: string, mood: string): Promise<{ title: string; concept: string }[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere 3 ideias para músicas.
        Gênero: ${genre}
        Humor/Sentimento: ${mood}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        concept: { type: Type.STRING }
                    },
                    required: ["title", "concept"]
                }
            }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for song ideas:", response.text);
        throw new Error("Received invalid JSON from AI for song ideas.");
    }
};

export const generateBookTitles = async (genre: string, premise: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere 5 títulos de livros criativos e únicos.
        Gênero: ${genre}
        Premissa: ${premise}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for book titles:", response.text);
        throw new Error("Received invalid JSON from AI for book titles.");
    }
};

export const generateBookOutlineForTitle = async (title: string, genre: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Crie um esboço estruturado com os principais pontos da trama para um livro.
        Título: ${title}
        Gênero: ${genre}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Uma lista de títulos de capítulos ou pontos principais da trama." }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for book outline:", response.text);
        throw new Error("Received invalid JSON from AI for book outline.");
    }
};

// Social Media & Utility Tools (New)
export const generateInstagramBio = async (description: string, tone: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere 3 opções de biografia para o Instagram (máximo 150 caracteres cada).
        Descrição do perfil: ${description}
        Tom desejado: ${tone}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for Instagram bio:", response.text);
        throw new Error("Received invalid JSON from AI for Instagram bio.");
    }
};

export const generateReelsScript = async (topic: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Crie um roteiro curto e envolvente para um Instagram Reel (ou TikTok) de 30-60 segundos sobre o tema: "${topic}". O roteiro deve ser dividido em cenas ou etapas fáceis de seguir.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Uma lista de etapas ou cenas do roteiro." }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for Reels script:", response.text);
        throw new Error("Received invalid JSON from AI for Reels script.");
    }
};

export const generateReelsCaptions = async (topic: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere 3 legendas curtas e impactantes para um Instagram Reel sobre: "${topic}". As legendas devem ser otimizadas para engajamento.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for Reels captions:", response.text);
        throw new Error("Received invalid JSON from AI for Reels captions.");
    }
};

export const generateReelsIdeas = async (niche: string): Promise<{idea: string; hook: string; scenes: string[]}[]> => {
    const ai = getAi();
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
        console.error("Failed to parse Gemini JSON for Reels ideas:", response.text);
        throw new Error("Received invalid JSON from AI for Reels ideas.");
    }
};

export const generateInstagramHashtags = async (topic: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere 15 hashtags relevantes para uma postagem no Instagram sobre: "${topic}". Inclua uma mistura de hashtags populares, de nicho e específicas.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING, description: "Uma única hashtag, começando com #" } }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for Instagram hashtags:", response.text);
        throw new Error("Received invalid JSON from AI for Instagram hashtags.");
    }
};

export const generateInstagramThread = async (topic: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere uma sequência de 5 posts curtos para um tópico (thread) do Instagram sobre: "${topic}". O primeiro post deve ser um gancho, e os posts seguintes devem desenvolver a ideia.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Uma lista de 5 posts para a thread." }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for Instagram thread:", response.text);
        throw new Error("Received invalid JSON from AI for Instagram thread.");
    }
};

export const generateVideoPrompt = async (idea: string): Promise<{prompt: string; camera: string; style: string; fx: string}> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere um prompt de vídeo detalhado para um modelo de IA de geração de vídeo.
        Ideia: ${idea}`,
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
        console.error("Failed to parse Gemini JSON for video prompt:", response.text);
        throw new Error("Received invalid JSON from AI for video prompt.");
    }
};

export const generateImageDescription = async (base64ImageData: string, mimeType: string): Promise<string> => {
    const ai = getAi();
    const imagePart = { inlineData: { data: base64ImageData, mimeType: mimeType } };
    const textPart = { text: "Descreva esta imagem em detalhes. Seja objetivo e foque nos elementos visuais presentes." };
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
    });
    return response.text;
};

export const generateLotteryNumbers = async (game: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere um conjunto de números aleatórios para o seguinte jogo de loteria: ${game}.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for lottery numbers:", response.text);
        throw new Error("Received invalid JSON from AI for lottery numbers.");
    }
};

export const generateBedtimeStory = async (topic: string, character: string, style: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: `Escreva uma história infantil curta para dormir.
        Tema: ${topic}
        Personagem principal: ${character}
        Estilo: ${style}`,
    });
    return response.text;
};

export const generateLullaby = async (topic: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Escreva a letra de uma canção de ninar suave e relaxante sobre: "${topic}".`,
    });
    return response.text;
};

export const generateCharacterNames = async (genre: string, description: string): Promise<string[]> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Gere 5 nomes de personagens únicos.
        Gênero da história: ${genre}
        Breve descrição do personagem: ${description}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    });
    try {
        return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("Failed to parse Gemini JSON for character names:", response.text);
        throw new Error("Received invalid JSON from AI for character names.");
    }
};

export const generateCharacterDescription = async (name: string, archetype: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Escreva uma descrição detalhada para um personagem.
        Nome: ${name}
        Arquétipo/Tipo: ${archetype}`,
    });
    return response.text;
};