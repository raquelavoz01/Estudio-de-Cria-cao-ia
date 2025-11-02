import React from 'react';
import { View, Plan } from './types';
import { BookIcon, ImageIcon, VideoIcon, AudioIcon, ChatIcon, PortraitIcon, AvatarIcon, InteriorIcon, MagicIcon, MusicIcon, SoundIcon, DocsIcon, WritingIcon, SeoIcon, InstagramIcon, YouTubeIcon, LandingPageIcon, EmailIcon, ListIcon, CheckIcon, ShortenIcon, LightbulbIcon, CampaignIcon, TranslateIcon, ChildIcon, SummaryIcon, StrategyIcon, TikTokIcon, ResearchIcon, BioIcon, GoogleIcon, FacebookIcon, BriefcaseIcon, CalendarIcon, BedtimeIcon, PdfIcon, LotteryIcon, CharacterIcon, ToneIcon, NewspaperIcon } from './components/Icons';

export const NAV_ITEMS: ({ id: View; label: string; icon: React.ReactElement; plan: Plan } | { isSeparator: true; label: string })[] = [
  {
    id: 'chat',
    label: 'Chat IA',
    icon: <ChatIcon />,
    plan: 'escritor',
  },
  {
    isSeparator: true,
    label: 'Conteúdo & Aprendizado',
  },
  {
    id: 'blog_home',
    label: 'Blog da IA',
    icon: <NewspaperIcon />,
    plan: 'escritor',
  },
  {
    isSeparator: true,
    label: 'Criação de Mídia'
  },
  {
    id: 'image',
    label: 'Gerador de Imagens',
    icon: <ImageIcon />,
    plan: 'arquiteto',
  },
    {
    id: 'image_description',
    label: 'Descrição de Imagem',
    icon: <ImageIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'portrait',
    label: 'Estúdio de Retratos',
    icon: <PortraitIcon />,
    plan: 'mestre',
  },
  {
    id: 'upscaler',
    label: 'Otimizador de Imagem',
    icon: <MagicIcon />,
    plan: 'mestre',
  },
  {
    id: 'interior',
    label: 'Designer de Interiores',
    icon: <InteriorIcon />,
    plan: 'mestre',
  },
  {
    id: 'video',
    label: 'Gerador de Vídeos',
    icon: <VideoIcon />,
    plan: 'mestre',
  },
  {
    id: 'video_prompt',
    label: 'Prompts de Vídeo',
    icon: <VideoIcon />,
    plan: 'mestre',
  },
  {
    id: 'avatar',
    label: 'Avatar Falante',
    icon: <AvatarIcon />,
    plan: 'mestre',
  },
  {
    id: 'audio',
    label: 'Narrador de Áudio',
    icon: <AudioIcon />,
    plan: 'mestre',
  },
  {
    id: 'sfx',
    label: 'Efeitos Sonoros',
    icon: <SoundIcon />,
    plan: 'arquiteto',
  },
   {
    isSeparator: true,
    label: 'Personagens & Histórias'
  },
  {
    id: 'bedtime_story',
    label: 'Histórias para Dormir',
    icon: <BedtimeIcon />,
    plan: 'escritor',
  },
  {
    id: 'lullaby',
    label: 'Canções de Ninar',
    icon: <BedtimeIcon />,
    plan: 'escritor',
  },
  {
    id: 'character_name',
    label: 'Nomes de Personagens',
    icon: <CharacterIcon />,
    plan: 'escritor',
  },
  {
    id: 'character_description',
    label: 'Descrição de Personagem',
    icon: <CharacterIcon />,
    plan: 'escritor',
  },
   {
    id: 'character_backstory',
    label: 'História de Personagem',
    icon: <CharacterIcon />,
    plan: 'arquiteto',
  },
  {
    isSeparator: true,
    label: 'Ferramentas de Escrita'
  },
   {
    id: 'docschat',
    label: 'Bate-papo com Arquivos',
    icon: <DocsIcon />,
    plan: 'mestre',
  },
  {
    id: 'article',
    label: 'Gerador de Artigos',
    icon: <WritingIcon />,
    plan: 'escritor',
  },
  {
    id: 'blog',
    label: 'Fluxo de Trabalho de Blog',
    icon: <WritingIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'blogtitle',
    label: 'Título da Postagem',
    icon: <WritingIcon />,
    plan: 'escritor',
  },
  {
    id: 'blogoutline',
    label: 'Esboço da Postagem',
    icon: <WritingIcon />,
    plan: 'escritor',
  },
  {
    id: 'blogintro',
    label: 'Introdução da Postagem',
    icon: <WritingIcon />,
    plan: 'escritor',
  },
  {
    id: 'blogconclusion',
    label: 'Conclusão da Postagem',
    icon: <WritingIcon />,
    plan: 'escritor',
  },
  {
    id: 'topics',
    label: 'Gerador de Tópicos',
    icon: <ListIcon />,
    plan: 'escritor',
  },
  {
    id: 'shortener',
    label: 'Encurtador de Texto',
    icon: <ShortenIcon />,
    plan: 'escritor',
  },
  {
    id: 'paragraph',
    label: 'Escritor de Parágrafos',
    icon: <WritingIcon />,
    plan: 'escritor',
  },
  {
    id: 'grammar',
    label: 'Corretor Gramatical',
    icon: <CheckIcon />,
    plan: 'escritor',
  },
  {
    id: 'brainstorm',
    label: 'Ferramenta de Brainstorm',
    icon: <LightbulbIcon />,
    plan: 'escritor',
  },
  {
    isSeparator: true,
    label: 'Ferramentas de Livro'
  },
  {
    id: 'book',
    label: 'Criador de Livros',
    icon: <BookIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'booktitle',
    label: 'Títulos de Livros',
    icon: <BookIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'bookoutline',
    label: 'Esboço de Livro',
    icon: <BookIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'chaptergenerator',
    label: 'Gerador de Capítulos',
    icon: <BookIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'booksummary',
    label: 'Resumo de Livros',
    icon: <BookIcon />,
    plan: 'arquiteto',
  },
  {
    isSeparator: true,
    label: 'Ferramentas de Música'
  },
  {
    id: 'music',
    label: 'Letras de Músicas',
    icon: <MusicIcon />,
    plan: 'escritor',
  },
  {
    id: 'songideas',
    label: 'Ideias para Músicas',
    icon: <MusicIcon />,
    plan: 'escritor',
  },
  {
    id: 'lyricsgenerator',
    label: 'Gerador de Letras',
    icon: <MusicIcon />,
    plan: 'escritor',
  },
  {
    id: 'songgenerator',
    label: 'Gerador de Músicas IA',
    icon: <MusicIcon />,
    plan: 'arquiteto',
  },
   {
    isSeparator: true,
    label: 'Redes Sociais'
  },
  {
    id: 'instagrambio',
    label: 'Biografia do Instagram',
    icon: <InstagramIcon />,
    plan: 'escritor',
  },
  {
    id: 'instagram',
    label: 'Legendas do Instagram',
    icon: <InstagramIcon />,
    plan: 'escritor',
  },
  {
    id: 'reels_ideas',
    label: 'Ideias para Reels',
    icon: <InstagramIcon />,
    plan: 'escritor',
  },
  {
    id: 'reels_captions',
    label: 'Legendas para Reels',
    icon: <InstagramIcon />,
    plan: 'escritor',
  },
  {
    id: 'reels_script',
    label: 'Roteiro para Reels',
    icon: <InstagramIcon />,
    plan: 'escritor',
  },
  {
    id: 'instagram_hashtags',
    label: 'Hashtags do Instagram',
    icon: <InstagramIcon />,
    plan: 'escritor',
  },
  {
    id: 'instagram_thread',
    label: 'Tópicos do Instagram',
    icon: <InstagramIcon />,
    plan: 'escritor',
  },
  {
    id: 'youtubetitle',
    label: 'Títulos para YouTube',
    icon: <YouTubeIcon />,
    plan: 'escritor',
  },
  {
    id: 'youtubeideas',
    label: 'Ideias para YouTube',
    icon: <YouTubeIcon />,
    plan: 'escritor',
  },
  {
    id: 'videoscript',
    label: 'Esboço de Roteiro',
    icon: <YouTubeIcon />,
    plan: 'escritor',
  },
  {
    id: 'youtubedescription',
    label: 'Descrição para YouTube',
    icon: <YouTubeIcon />,
    plan: 'escritor',
  },
  {
    id: 'tiktokcaptions',
    label: 'Legendas para TikTok',
    icon: <TikTokIcon />,
    plan: 'escritor',
  },
  {
    id: 'tiktokhashtags',
    label: 'Hashtags para TikTok',
    icon: <TikTokIcon />,
    plan: 'escritor',
  },
  {
    id: 'socialpost',
    label: 'Post para Redes Sociais',
    icon: <WritingIcon />,
    plan: 'escritor',
  },
  {
    id: 'content_calendar',
    label: 'Calendário de Conteúdo',
    icon: <CalendarIcon />,
    plan: 'arquiteto',
  },
  {
    isSeparator: true,
    label: 'Marketing & Anúncios'
  },
  {
    id: 'seobrief',
    label: 'Briefing de Conteúdo SEO',
    icon: <SeoIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'googleadsheadlines',
    label: 'Títulos do Google Ads',
    icon: <GoogleIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'googleadsdescriptions',
    label: 'Descrições do Google Ads',
    icon: <GoogleIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'fbadsheadlines',
    label: 'Títulos do Facebook Ads',
    icon: <FacebookIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'fbadstext',
    label: 'Texto do Facebook Ads',
    icon: <FacebookIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'gmbproduct',
    label: 'Descrição GMB',
    icon: <BriefcaseIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'gmbpost',
    label: 'Postagem GMB',
    icon: <BriefcaseIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'youtube',
    label: 'YouTube para Artigo',
    icon: <YouTubeIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'landingpage',
    label: 'Cópia de Landing Page',
    icon: <LandingPageIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'marketingemail',
    label: 'E-mail de Marketing',
    icon: <EmailIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'marketingcampaign',
    label: 'Campanhas de Marketing',
    icon: <CampaignIcon />,
    plan: 'arquiteto',
  },
   {
    id: 'adcopy',
    label: 'Cópia de Anúncios',
    icon: <LandingPageIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'email',
    label: 'Gerador de E-mail',
    icon: <EmailIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'marketingstrategy',
    label: 'Estratégia de Marketing',
    icon: <StrategyIcon />,
    plan: 'arquiteto',
  },
  {
    isSeparator: true,
    label: 'Ferramentas Acadêmicas'
  },
  {
    id: 'researchpaper',
    label: 'Artigo de Pesquisa',
    icon: <ResearchIcon />,
    plan: 'arquiteto',
  },
  {
    id: 'questionanswerer',
    label: 'Respondedor de Perguntas',
    icon: <LightbulbIcon />,
    plan: 'escritor',
  },
  {
    isSeparator: true,
    label: 'Biografias & Perfis'
  },
  {
    id: 'aboutme',
    label: 'Gerador "Sobre Mim"',
    icon: <BioIcon />,
    plan: 'escritor',
  },
  {
    id: 'probiogenerator',
    label: 'Gerador de Bio Profissional',
    icon: <BioIcon />,
    plan: 'escritor',
  },
  {
    isSeparator: true,
    label: 'Análise & Utilitários'
  },
   {
    id: 'pdf_summary',
    label: 'Resumo de PDF',
    icon: <PdfIcon />,
    plan: 'mestre',
  },
  {
    id: 'translator',
    label: 'Tradutor Universal',
    icon: <TranslateIcon />,
    plan: 'escritor',
  },
  {
    id: 'eli5',
    label: 'Explique como se eu tivesse 5',
    icon: <ChildIcon />,
    plan: 'escritor',
  },
  {
    id: 'summarygenerator',
    label: 'Gerador de Resumos',
    icon: <SummaryIcon />,
    plan: 'escritor',
  },
  {
    id: 'tone_analyzer',
    label: 'Analisador de Tom',
    icon: <ToneIcon />,
    plan: 'escritor',
  },
  {
    isSeparator: true,
    label: 'Diversão'
  },
  {
    id: 'lottery_numbers',
    label: 'Números da Loteria',
    icon: <LotteryIcon />,
    plan: 'escritor',
  },
  {
    id: 'powerball_numbers',
    label: 'Números da Powerball',
    icon: <LotteryIcon />,
    plan: 'escritor',
  },
  {
    id: 'megamillions_numbers',
    label: 'Números da Mega Millions',
    icon: <LotteryIcon />,
    plan: 'escritor',
  },
];