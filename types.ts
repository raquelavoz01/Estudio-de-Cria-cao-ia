export type View = 'book' | 'image' | 'video' | 'audio' | 'chat' | 'portrait' | 'avatar' | 'interior' | 'music' | 'sfx' | 'upscaler' | 'docschat' | 'article' | 'blog' | 'instagram' | 'paragraph' | 'seo' | 'youtube' | 'landingpage' | 'email' | 'topics' | 'grammar' | 'shortener' | 'brainstorm' | 'blogtitle' | 'blogoutline' | 'blogintro' | 'blogconclusion' | 'marketingcampaign' | 'marketingemail' | 'adcopy' | 'translator' | 'eli5' | 'marketingstrategy' | 'summarygenerator' | 'youtubedescription' | 'youtubetitle' | 'youtubeideas' | 'videoscript' | 'tiktokcaptions' | 'tiktokhashtags' | 'researchpaper' | 'questionanswerer' | 'seobrief' | 'aboutme' | 'probiogenerator' | 'googleadsheadlines' | 'googleadsdescriptions' | 'gmbproduct' | 'gmbpost' | 'fbadsheadlines' | 'fbadstext' | 'socialpost' | 'songgenerator' | 'songideas' | 'lyricsgenerator' | 'booktitle' | 'bookoutline' | 'chaptergenerator' | 'booksummary' | 'instagrambio' | 'reels_script' | 'reels_captions' | 'reels_ideas' | 'instagram_hashtags' | 'instagram_thread' | 'content_calendar' | 'video_prompt' | 'image_description' | 'pdf_summary' | 'lottery_numbers' | 'powerball_numbers' | 'megamillions_numbers' | 'bedtime_story' | 'lullaby' | 'character_name' | 'character_description' | 'character_backstory' | 'tone_analyzer' | 'pricing' | 'blog_home';

export type Plan = 'escritor' | 'arquiteto' | 'mestre';

export interface Chapter {
  title: string;
  summary: string;
  content?: string;
}

export interface Book {
  id: string;
  title: string;
  premise: string;
  synopsis: string;
  chapters: Chapter[];
  uploadedCoverImage: string;
  coverImageUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

// This is a global declaration to extend the Window interface for aistudio
declare global {
  // Fix: Defined a global AIStudio interface to resolve declaration conflicts.
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // FIX: Removed the `readonly` modifier from `aistudio` to resolve the "All declarations of 'aistudio' must have identical modifiers" error. The property is also optional as it may not always be present at runtime.
    aistudio?: AIStudio;
    webkitAudioContext: typeof AudioContext;
  }
}