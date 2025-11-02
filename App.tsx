
import React, { useState, Suspense, lazy } from 'react';
import { View, Plan } from './types';
import Sidebar from './components/Sidebar';
import { LogoIcon } from './components/Icons';
import Auth from './components/Auth';
import PricingPage from './components/PricingPage';
import InitializationError from './components/InitializationError';
import LandingPage from './components/LandingPage';
import Loader from './components/Loader';

// Lazy load all feature components for code splitting and better performance
const BlogPage = lazy(() => import('./components/BlogPage'));
const Chat = lazy(() => import('./components/Chat'));
const ChatWithFiles = lazy(() => import('./components/ChatWithFiles'));
const BookCreator = lazy(() => import('./components/BookCreator'));
const ImageGenerator = lazy(() => import('./components/ImageGenerator'));
const PortraitStudio = lazy(() => import('./components/PortraitStudio'));
const MagicUpscaler = lazy(() => import('./components/MagicUpscaler'));
const InteriorDesigner = lazy(() => import('./components/InteriorDesigner'));
const VideoGenerator = lazy(() => import('./components/VideoGenerator'));
const TalkingAvatar = lazy(() => import('./components/TalkingAvatar'));
const AudioNarrator = lazy(() => import('./components/AudioNarrator'));
const MusicGenerator = lazy(() => import('./components/MusicGenerator'));
const SoundEffectGenerator = lazy(() => import('./components/SoundEffectGenerator'));
const ArticleWriter = lazy(() => import('./components/ArticleWriter'));
const BlogWorkflow = lazy(() => import('./components/BlogWorkflow'));
const InstagramCaption = lazy(() => import('./components/InstagramCaption'));
const ParagraphWriter = lazy(() => import('./components/ParagraphWriter'));
const SeoTools = lazy(() => import('./components/SeoTools'));
const YouTubeToArticle = lazy(() => import('./components/YouTubeToArticle'));
const LandingPageCopy = lazy(() => import('./components/LandingPageCopy'));
const EmailGenerator = lazy(() => import('./components/EmailGenerator'));
const TopicGenerator = lazy(() => import('./components/TopicGenerator'));
const GrammarChecker = lazy(() => import('./components/GrammarChecker'));
const TextShortener = lazy(() => import('./components/TextShortener'));
const BrainstormingTool = lazy(() => import('./components/BrainstormingTool'));
const BlogTitleGenerator = lazy(() => import('./components/BlogTitleGenerator'));
const BlogOutlineGenerator = lazy(() => import('./components/BlogOutlineGenerator'));
const BlogIntroGenerator = lazy(() => import('./components/BlogIntroGenerator'));
const BlogConclusionGenerator = lazy(() => import('./components/BlogConclusionGenerator'));
const MarketingCampaignGenerator = lazy(() => import('./components/MarketingCampaignGenerator'));
const MarketingEmailGenerator = lazy(() => import('./components/MarketingEmailGenerator'));
const AdCopyGenerator = lazy(() => import('./components/AdCopyGenerator'));
const UniversalTranslator = lazy(() => import('./components/UniversalTranslator'));
const ExplainLikeImFive = lazy(() => import('./components/ExplainLikeImFive'));
const MarketingStrategyGenerator = lazy(() => import('./components/MarketingStrategyGenerator'));
const SummaryGenerator = lazy(() => import('./components/SummaryGenerator'));
const YouTubeDescriptionGenerator = lazy(() => import('./components/YouTubeDescriptionGenerator'));
const YouTubeTitleGenerator = lazy(() => import('./components/YouTubeTitleGenerator'));
const YouTubeIdeaGenerator = lazy(() => import('./components/YouTubeIdeaGenerator'));
const VideoScriptOutlineGenerator = lazy(() => import('./components/VideoScriptOutlineGenerator'));
const TikTokCaptionGenerator = lazy(() => import('./components/TikTokCaptionGenerator'));
const TikTokHashtagGenerator = lazy(() => import('./components/TikTokHashtagGenerator'));
const ResearchPaperGenerator = lazy(() => import('./components/ResearchPaperGenerator'));
const QuestionAnswerer = lazy(() => import('./components/QuestionAnswerer'));
const SeoContentBrief = lazy(() => import('./components/SeoContentBrief'));
const AboutMeGenerator = lazy(() => import('./components/AboutMeGenerator'));
const ProBioGenerator = lazy(() => import('./components/ProBioGenerator'));
const GoogleAdsHeadlines = lazy(() => import('./components/GoogleAdsHeadlines'));
const GoogleAdsDescriptions = lazy(() => import('./components/GoogleAdsDescriptions'));
const GmbProductDescription = lazy(() => import('./components/GmbProductDescription'));
const GmbPostGenerator = lazy(() => import('./components/GmbPostGenerator'));
const FacebookAdsHeadlines = lazy(() => import('./components/FacebookAdsHeadlines'));
const FacebookAdsPrimaryText = lazy(() => import('./components/FacebookAdsPrimaryText'));
const SocialPostGenerator = lazy(() => import('./components/SocialPostGenerator'));
const AiSongGenerator = lazy(() => import('./components/AiSongGenerator'));
const SongIdeaGenerator = lazy(() => import('./components/SongIdeaGenerator'));
const LyricsGenerator = lazy(() => import('./components/LyricsGenerator'));
const BookTitleGenerator = lazy(() => import('./components/BookTitleGenerator'));
const BookOutlineGenerator = lazy(() => import('./components/BookOutlineGenerator'));
const ChapterGenerator = lazy(() => import('./components/ChapterGenerator'));
const BookSummarizer = lazy(() => import('./components/BookSummarizer'));
const InstagramBioGenerator = lazy(() => import('./components/InstagramBioGenerator'));
const ReelsScriptGenerator = lazy(() => import('./components/ReelsScriptGenerator'));
const ReelsCaptionGenerator = lazy(() => import('./components/ReelsCaptionGenerator'));
const ReelsIdeaGenerator = lazy(() => import('./components/ReelsIdeaGenerator'));
const InstagramHashtagGenerator = lazy(() => import('./components/InstagramHashtagGenerator'));
const InstagramThreadGenerator = lazy(() => import('./components/InstagramThreadGenerator'));
const ContentCalendarGenerator = lazy(() => import('./components/ContentCalendarGenerator'));
const VideoPromptGenerator = lazy(() => import('./components/VideoPromptGenerator'));
const ImageDescriptionGenerator = lazy(() => import('./components/ImageDescriptionGenerator'));
const PdfSummarizer = lazy(() => import('./components/PdfSummarizer'));
const LotteryNumberGenerator = lazy(() => import('./components/LotteryNumberGenerator'));
const PowerballGenerator = lazy(() => import('./components/PowerballGenerator'));
const MegaMillionsGenerator = lazy(() => import('./components/MegaMillionsGenerator'));
const BedtimeStoryGenerator = lazy(() => import('./components/BedtimeStoryGenerator'));
const LullabyGenerator = lazy(() => import('./components/LullabyGenerator'));
const CharacterNameGenerator = lazy(() => import('./components/CharacterNameGenerator'));
const CharacterDescriptionGenerator = lazy(() => import('./components/CharacterDescriptionGenerator'));
const CharacterBackstoryGenerator = lazy(() => import('./components/CharacterBackstoryGenerator'));
const ToneAnalyzer = lazy(() => import('./components/ToneAnalyzer'));


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('chat');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  // Check for API key at the highest level. If it's missing, block the app.
  // This checks for the Vercel key first, then falls back to the local dev key.
  const apiKey = process.env.VITE_API_KEY || process.env.API_KEY;
  if (!apiKey) {
      return <InitializationError error="Nenhuma Chave de API foi encontrada." />;
  }
  
  const renderActiveView = () => {
    switch (activeView) {
      case 'blog_home':
        return <BlogPage />;
      case 'chat':
        return <Chat />;
      case 'docschat':
        return <ChatWithFiles />;
      case 'book':
        return <BookCreator />;
      case 'image':
        return <ImageGenerator />;
      case 'portrait':
        return <PortraitStudio />;
      case 'upscaler':
        return <MagicUpscaler />;
      case 'interior':
        return <InteriorDesigner />;
      case 'video':
        return <VideoGenerator />;
      case 'avatar':
        return <TalkingAvatar />;
      case 'audio':
        return <AudioNarrator />;
      case 'music':
        return <MusicGenerator />;
      case 'sfx':
        return <SoundEffectGenerator />;
      case 'article':
        return <ArticleWriter />;
      case 'blog':
        return <BlogWorkflow />;
      case 'instagram':
        return <InstagramCaption />;
      case 'paragraph':
        return <ParagraphWriter />;
      case 'seo':
        return <SeoTools />;
      case 'youtube':
        return <YouTubeToArticle />;
      case 'landingpage':
        return <LandingPageCopy />;
      case 'email':
        return <EmailGenerator />;
      case 'topics':
        return <TopicGenerator />;
      case 'grammar':
        return <GrammarChecker />;
      case 'shortener':
        return <TextShortener />;
      case 'brainstorm':
        return <BrainstormingTool />;
      case 'blogtitle':
        return <BlogTitleGenerator />;
      case 'blogoutline':
        return <BlogOutlineGenerator />;
      case 'blogintro':
        return <BlogIntroGenerator />;
      case 'blogconclusion':
        return <BlogConclusionGenerator />;
      case 'marketingcampaign':
        return <MarketingCampaignGenerator />;
      case 'marketingemail':
        return <MarketingEmailGenerator />;
      case 'adcopy':
        return <AdCopyGenerator />;
      case 'translator':
        return <UniversalTranslator />;
      case 'eli5':
        return <ExplainLikeImFive />;
      case 'marketingstrategy':
        return <MarketingStrategyGenerator />;
      case 'summarygenerator':
        return <SummaryGenerator />;
      case 'youtubedescription':
        return <YouTubeDescriptionGenerator />;
      case 'youtubetitle':
        return <YouTubeTitleGenerator />;
      case 'youtubeideas':
        return <YouTubeIdeaGenerator />;
      case 'videoscript':
        return <VideoScriptOutlineGenerator />;
      case 'tiktokcaptions':
        return <TikTokCaptionGenerator />;
      case 'tiktokhashtags':
        return <TikTokHashtagGenerator />;
      case 'researchpaper':
        return <ResearchPaperGenerator />;
      case 'questionanswerer':
        return <QuestionAnswerer />;
      case 'seobrief':
        return <SeoContentBrief />;
      case 'aboutme':
        return <AboutMeGenerator />;
      case 'probiogenerator':
        return <ProBioGenerator />;
      case 'googleadsheadlines':
        return <GoogleAdsHeadlines />;
      case 'googleadsdescriptions':
        return <GoogleAdsDescriptions />;
      case 'gmbproduct':
        return <GmbProductDescription />;
      case 'gmbpost':
        return <GmbPostGenerator />;
      case 'fbadsheadlines':
        return <FacebookAdsHeadlines />;
      case 'fbadstext':
        return <FacebookAdsPrimaryText />;
      case 'socialpost':
        return <SocialPostGenerator />;
      case 'songgenerator':
        return <AiSongGenerator />;
      case 'songideas':
        return <SongIdeaGenerator />;
      case 'lyricsgenerator':
        return <LyricsGenerator />;
      case 'booktitle':
        return <BookTitleGenerator />;
      case 'bookoutline':
        return <BookOutlineGenerator />;
      case 'chaptergenerator':
        return <ChapterGenerator />;
      case 'booksummary':
        return <BookSummarizer />;
      case 'instagrambio':
        return <InstagramBioGenerator />;
      case 'reels_script':
        return <ReelsScriptGenerator />;
      case 'reels_captions':
        return <ReelsCaptionGenerator />;
      case 'reels_ideas':
        return <ReelsIdeaGenerator />;
      case 'instagram_hashtags':
        return <InstagramHashtagGenerator />;
      case 'instagram_thread':
        return <InstagramThreadGenerator />;
      case 'content_calendar':
        return <ContentCalendarGenerator />;
      case 'video_prompt':
        return <VideoPromptGenerator />;
      case 'image_description':
        return <ImageDescriptionGenerator />;
      case 'pdf_summary':
        return <PdfSummarizer />;
      case 'lottery_numbers':
        return <LotteryNumberGenerator />;
      case 'powerball_numbers':
        return <PowerballGenerator />;
      case 'megamillions_numbers':
        return <MegaMillionsGenerator />;
      case 'bedtime_story':
        return <BedtimeStoryGenerator />;
      case 'lullaby':
        return <LullabyGenerator />;
      case 'character_name':
        return <CharacterNameGenerator />;
      case 'character_description':
        return <CharacterDescriptionGenerator />;
      case 'character_backstory':
        return <CharacterBackstoryGenerator />;
      case 'tone_analyzer':
        return <ToneAnalyzer />;
      default:
        return <Chat />;
    }
  };
  
  const handleAuthSuccess = (plan: Plan | null) => {
      setIsAuthenticated(true);
      setUserPlan(plan);
      setShowAuth(false); // Reset auth view on success
  };

  if (!isAuthenticated) {
    if (showAuth) {
        return <Auth onAuthSuccess={handleAuthSuccess} />;
    }
    return <LandingPage onStart={() => setShowAuth(true)} />;
  }

  if (!userPlan) {
    return <PricingPage onSelectPlan={(plan) => setUserPlan(plan)} />;
  }

  const suspenseFallback = (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <Loader />
        <p className="mt-2 text-slate-400">Carregando ferramenta...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} userPlan={userPlan} />
      <main id="main-content" className="flex-1 flex flex-col overflow-hidden">
        <header role="banner" className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-white flex items-center gap-3">
                <LogoIcon />
                <span>
                    Estúdio de Criação IA 
                    <span className="hidden sm:inline text-cyan-400 font-medium"> – Design Digital e Inteligência Artificial</span>
                </span>
            </h1>
        </header>
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Suspense fallback={suspenseFallback}>
            {renderActiveView()}
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default App;
