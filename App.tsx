import React, { useState, useEffect } from 'react';
import { View, Plan } from './types';
import Sidebar from './components/Sidebar';
import BookCreator from './components/BookCreator';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import AudioNarrator from './components/AudioNarrator';
import Chat from './components/Chat';
import PortraitStudio from './components/PortraitStudio';
import TalkingAvatar from './components/TalkingAvatar';
import InteriorDesigner from './components/InteriorDesigner';
import MagicUpscaler from './components/MagicUpscaler';
import MusicGenerator from './components/MusicGenerator';
import SoundEffectGenerator from './components/SoundEffectGenerator';
import ChatWithFiles from './components/ChatWithFiles';
import { LogoIcon } from './components/Icons';
import ArticleWriter from './components/ArticleWriter';
import BlogWorkflow from './components/BlogWorkflow';
import InstagramCaption from './components/InstagramCaption';
import ParagraphWriter from './components/ParagraphWriter';
import SeoTools from './components/SeoTools';
import YouTubeToArticle from './components/YouTubeToArticle';
import LandingPageCopy from './components/LandingPageCopy';
import EmailGenerator from './components/EmailGenerator';
import TopicGenerator from './components/TopicGenerator';
import GrammarChecker from './components/GrammarChecker';
import TextShortener from './components/TextShortener';
import BrainstormingTool from './components/BrainstormingTool';
import BlogTitleGenerator from './components/BlogTitleGenerator';
import BlogOutlineGenerator from './components/BlogOutlineGenerator';
import BlogIntroGenerator from './components/BlogIntroGenerator';
import BlogConclusionGenerator from './components/BlogConclusionGenerator';
import MarketingCampaignGenerator from './components/MarketingCampaignGenerator';
import MarketingEmailGenerator from './components/MarketingEmailGenerator';
import AdCopyGenerator from './components/AdCopyGenerator';
import UniversalTranslator from './components/UniversalTranslator';
import ExplainLikeImFive from './components/ExplainLikeImFive';
import MarketingStrategyGenerator from './components/MarketingStrategyGenerator';
import SummaryGenerator from './components/SummaryGenerator';
import YouTubeDescriptionGenerator from './components/YouTubeDescriptionGenerator';
import YouTubeTitleGenerator from './components/YouTubeTitleGenerator';
import YouTubeIdeaGenerator from './components/YouTubeIdeaGenerator';
import VideoScriptOutlineGenerator from './components/VideoScriptOutlineGenerator';
import TikTokCaptionGenerator from './components/TikTokCaptionGenerator';
import TikTokHashtagGenerator from './components/TikTokHashtagGenerator';
import ResearchPaperGenerator from './components/ResearchPaperGenerator';
import QuestionAnswerer from './components/QuestionAnswerer';
import SeoContentBrief from './components/SeoContentBrief';
import AboutMeGenerator from './components/AboutMeGenerator';
import ProBioGenerator from './components/ProBioGenerator';
import GoogleAdsHeadlines from './components/GoogleAdsHeadlines';
import GoogleAdsDescriptions from './components/GoogleAdsDescriptions';
import GmbProductDescription from './components/GmbProductDescription';
import GmbPostGenerator from './components/GmbPostGenerator';
import FacebookAdsHeadlines from './components/FacebookAdsHeadlines';
import FacebookAdsPrimaryText from './components/FacebookAdsPrimaryText';
import SocialPostGenerator from './components/SocialPostGenerator';
import AiSongGenerator from './components/AiSongGenerator';
import SongIdeaGenerator from './components/SongIdeaGenerator';
import LyricsGenerator from './components/LyricsGenerator';
import BookTitleGenerator from './components/BookTitleGenerator';
import BookOutlineGenerator from './components/BookOutlineGenerator';
import ChapterGenerator from './components/ChapterGenerator';
import BookSummarizer from './components/BookSummarizer';
import InstagramBioGenerator from './components/InstagramBioGenerator';
import ReelsScriptGenerator from './components/ReelsScriptGenerator';
import ReelsCaptionGenerator from './components/ReelsCaptionGenerator';
import ReelsIdeaGenerator from './components/ReelsIdeaGenerator';
import InstagramHashtagGenerator from './components/InstagramHashtagGenerator';
import InstagramThreadGenerator from './components/InstagramThreadGenerator';
import ContentCalendarGenerator from './components/ContentCalendarGenerator';
import VideoPromptGenerator from './components/VideoPromptGenerator';
import ImageDescriptionGenerator from './components/ImageDescriptionGenerator';
import PdfSummarizer from './components/PdfSummarizer';
import LotteryNumberGenerator from './components/LotteryNumberGenerator';
import PowerballGenerator from './components/PowerballGenerator';
import MegaMillionsGenerator from './components/MegaMillionsGenerator';
import BedtimeStoryGenerator from './components/BedtimeStoryGenerator';
import LullabyGenerator from './components/LullabyGenerator';
import CharacterNameGenerator from './components/CharacterNameGenerator';
import CharacterDescriptionGenerator from './components/CharacterDescriptionGenerator';
import CharacterBackstoryGenerator from './components/CharacterBackstoryGenerator';
import ToneAnalyzer from './components/ToneAnalyzer';
import Auth from './components/Auth';
import PricingPage from './components/PricingPage';
import InitializationError from './components/InitializationError';
import BlogPage from './components/BlogPage';
import LandingPage from './components/LandingPage';


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
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
};

export default App;