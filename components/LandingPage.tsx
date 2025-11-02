import React, { useState } from 'react';
import { LogoIcon, BookIcon, ImageIcon, VideoIcon, SeoIcon, DownloadIcon, LightbulbIcon, MagicIcon, CheckIcon } from './Icons';

interface LandingPageProps {
  onStart: () => void;
}

const faqs = [
  {
    question: 'O que é um estúdio de criação IA?',
    answer: 'Um estúdio de criação IA, como o nosso, é uma plataforma online que reúne um conjunto de ferramentas poderosas baseadas em inteligência artificial. O objetivo é automatizar, acelerar e inspirar o processo criativo. Em vez de começar do zero, você pode usar a IA para gerar rascunhos, criar imagens, desenvolver roteiros, otimizar textos para SEO e muito mais, tudo em um só lugar. É como ter uma agência de design digital e conteúdo sob demanda, disponível 24/7.'
  },
  {
    question: 'Como a inteligência artificial ajuda no design digital?',
    answer: 'A inteligência artificial revoluciona o design digital ao permitir a criação de visuais impressionantes a partir de simples descrições de texto. No nosso estúdio, você pode gerar logotipos, banners para redes sociais, capas de e-books e até mesmo redesenhar o interior de um cômodo. A IA interpreta suas ideias (prompts) e as transforma em imagens originais, economizando horas de trabalho e eliminando a necessidade de habilidades técnicas avançadas em softwares de edição.'
  },
  {
    question: 'Para quem é este estúdio de criação?',
    answer: 'O estúdio foi projetado para um público amplo! Desde escritores e autores que buscam criar livros completos, passando por profissionais de marketing e social media que precisam de conteúdo otimizado e anúncios, até empreendedores e pequenas empresas que desejam criar sua própria identidade visual e materiais de marketing. Se você cria conteúdo de qualquer tipo, nossas ferramentas de criação IA podem potencializar seu trabalho.'
  },
  {
    question: 'Preciso ter conhecimento técnico para usar as ferramentas?',
    answer: 'Absolutamente não! Uma das maiores vantagens do nosso estúdio de criação IA é a sua simplicidade. Todas as ferramentas são intuitivas e baseadas em comandos simples. Se você sabe descrever o que quer, pode criar. Nossa interface guia você através do processo, tornando a criação de conteúdo e design digital acessível a todos, independentemente do nível de habilidade técnica.'
  }
];

const FAQItem: React.FC<{ faq: typeof faqs[0]; isOpen: boolean; onClick: () => void }> = ({ faq, isOpen, onClick }) => (
  <div className="border-b border-slate-700 py-4">
    <dt>
      <button onClick={onClick} className="flex w-full items-start justify-between text-left text-slate-300">
        <span className="text-base font-semibold leading-7">{faq.question}</span>
        <span className="ml-6 flex h-7 items-center">
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          )}
        </span>
      </button>
    </dt>
    {isOpen && (
      <dd className="mt-2 pr-12">
        <p className="text-base leading-7 text-slate-400">{faq.answer}</p>
      </dd>
    )}
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-900 text-white font-sans overflow-x-hidden">
      {/* Header */}
      <header role="banner" className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
        <nav className="flex items-center justify-between p-4 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
              <LogoIcon />
              <span className="text-xl font-bold">Estúdio de Criação IA</span>
            </a>
          </div>
           <div className="hidden lg:flex lg:gap-x-12">
            <a href="#workflow" onClick={(e) => handleScroll(e, 'workflow')} className="text-sm font-semibold leading-6 text-slate-300 hover:text-cyan-400 transition-colors">Processo</a>
            <a href="#portfolio" onClick={(e) => handleScroll(e, 'portfolio')} className="text-sm font-semibold leading-6 text-slate-300 hover:text-cyan-400 transition-colors">Exemplos</a>
            <a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="text-sm font-semibold leading-6 text-slate-300 hover:text-cyan-400 transition-colors">FAQ</a>
          </div>
          <div className="flex lg:flex-1 lg:justify-end">
            <button onClick={onStart} className="rounded-md bg-purple-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500">
              Agendar Consultoria
            </button>
          </div>
        </nav>
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#805ad5] to-[#3182ce] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>
          <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl animate-fade-in-down">Estúdio de Criação IA – Soluções em design com Inteligência Artificial</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300 animate-fade-in-up">Sua agência de conteúdo, design e marketing em um clique. Da ideia à publicação, nossa plataforma completa utiliza o poder da inteligência artificial para acelerar seu processo criativo e produzir materiais de alta qualidade.</p>
            <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <button onClick={onStart} className="rounded-md bg-purple-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 transition-transform hover:scale-105">
                Começar Agora (Grátis)
              </button>
               <a href="#portfolio" onClick={(e) => handleScroll(e, 'portfolio')} className="text-sm font-semibold leading-6 text-slate-300 transition-colors hover:text-cyan-400">
                  Ver Portfólio <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        
         {/* Workflow Section */}
        <section id="workflow" aria-labelledby="workflow-heading" className="py-24 sm:py-32 bg-slate-950/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:text-center">
                  <p className="text-base font-semibold leading-7 text-purple-400">Nosso Processo</p>
                  <h2 id="workflow-heading" className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">O que fazemos: Do Conceito à Criação em 3 Passos</h2>
                  <p className="mt-6 text-lg leading-8 text-slate-400">Simplificamos a criação IA e o design digital. Nosso fluxo de trabalho guiado por inteligência artificial transforma suas ideias em resultados profissionais rapidamente.</p>
              </div>
              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                      <div className="flex flex-col items-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white">
                              <LightbulbIcon />
                          </div>
                          <h3 className="mt-4 text-xl font-semibold text-white">1. Descreva sua Ideia</h3>
                          <p className="mt-2 leading-7 text-slate-400">Comece com um prompt. Descreva o que você quer criar: uma imagem para redes sociais, um artigo de blog sobre <a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="text-cyan-400 underline">inteligência artificial</a>, um vídeo de produto ou uma legenda cativante.</p>
                      </div>
                      <div className="flex flex-col items-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white">
                              <MagicIcon />
                          </div>
                          <h3 className="mt-4 text-xl font-semibold text-white">2. Deixe a IA Criar</h3>
                          <p className="mt-2 leading-7 text-slate-400">Nossa plataforma de criação IA interpreta sua visão e gera rascunhos de alta qualidade em segundos. Seja um texto, imagem ou roteiro, a IA faz o trabalho pesado para você.</p>
                      </div>
                      <div className="flex flex-col items-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white">
                             <CheckIcon />
                          </div>
                          <h3 className="mt-4 text-xl font-semibold text-white">3. Refine e Publique</h3>
                          <p className="mt-2 leading-7 text-slate-400">Ajuste o resultado gerado para que ele fique perfeito. Adicione seu toque pessoal, faça edições e, em seguida, exporte seu conteúdo final para usar em qualquer lugar.</p>
                      </div>
                  </div>
              </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" aria-labelledby="portfolio-heading" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <p className="text-base font-semibold leading-7 text-purple-400">Portfólio</p>
              <h2 id="portfolio-heading" className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Nossos Serviços: Veja o que você pode criar</h2>
              <p className="mt-6 text-lg leading-8 text-slate-400">De capas de livros a retratos profissionais e vídeos de marketing, a única limitação é a sua imaginação. Aqui estão alguns exemplos gerados com nossas ferramentas de criação IA.</p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
              <div className="group relative flex flex-col items-start justify-end rounded-2xl bg-cover bg-center p-8 h-80 shadow-lg overflow-hidden" >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1599422438838-348b55d78574?q=80&w=800)'}}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <h3 className="relative text-xl font-bold text-white">Capa de Livro de Fantasia</h3>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-center text-white p-4">
                          <p className="text-3xl font-bold text-cyan-400">+200%</p>
                          <p>Aumento nas Vendas</p>
                      </div>
                  </div>
              </div>
               <div className="group relative flex flex-col items-start justify-end rounded-2xl bg-cover bg-center p-8 h-80 shadow-lg overflow-hidden" >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800)'}}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <h3 className="relative text-xl font-bold text-white">Teaser de Vídeo Promocional</h3>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-center text-white p-4">
                          <p className="text-3xl font-bold text-cyan-400">+350%</p>
                          <p>Engajamento no Instagram</p>
                      </div>
                  </div>
              </div>
               <div className="group relative flex flex-col items-start justify-end rounded-2xl bg-cover bg-center p-8 h-80 shadow-lg overflow-hidden" >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800)'}}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <h3 className="relative text-xl font-bold text-white">Retrato Corporativo</h3>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-center text-white p-4">
                          <p className="text-3xl font-bold text-cyan-400">98%</p>
                          <p>Aceitação no LinkedIn</p>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </section>

         {/* E-book CTA Section */}
         <section aria-labelledby="cta-heading" className="bg-slate-950/50">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
            <div className="relative isolate overflow-hidden bg-slate-800 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
               <div className="absolute -top-40 -left-40 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
                  <div className="relative aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#805ad5] to-[#3182ce] opacity-30" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
              </div>
              <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                <h2 id="cta-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Acelere sua criação de conteúdo.</h2>
                <p className="mt-6 text-lg leading-8 text-slate-300">Baixe nosso 'Guia Rápido de Criação IA' e aprenda os segredos para gerar conteúdo de alta qualidade em tempo recorde.</p>
                 <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
                    <input type="email" aria-label="Endereço de e-mail para guia" placeholder="seu-email@exemplo.com" className="w-full sm:w-auto flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6" />
                    <button onClick={onStart} className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                        Baixar Guia
                    </button>
                </div>
                <p className="mt-4 text-xs text-slate-400 text-center lg:text-left">Ao se inscrever, você receberá o guia e nossas novidades. Sem spam.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" aria-labelledby="faq-heading" className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-4xl divide-y divide-slate-700">
            <h2 id="faq-heading" className="text-2xl font-bold leading-10 tracking-tight text-white">Perguntas Frequentes</h2>
            <dl className="mt-10 space-y-6 divide-y divide-slate-700">
              {faqs.map((faq, index) => (
                <FAQItem key={index} faq={faq} isOpen={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)} />
              ))}
            </dl>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-950/50 border-t border-slate-800">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 lg:px-8">
            <div className="mx-auto max-w-2xl">
                <h3 className="text-center text-sm font-semibold leading-6 text-white">Inscreva-se na nossa newsletter</h3>
                <p className="mt-2 text-center text-sm leading-6 text-slate-400">As últimas novidades, artigos e recursos do mundo da criação IA, enviados para sua caixa de entrada.</p>
                <form className="mt-6 sm:flex sm:max-w-md mx-auto">
                    <input type="email" aria-label="Endereço de e-mail para newsletter" placeholder="Digite seu e-mail" required className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full" />
                    <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                        <button type="submit" className="flex w-full items-center justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500">Inscrever-se</button>
                    </div>
                </form>
            </div>
           <div className="mt-10 flex justify-center space-x-10">
                <a href="#workflow" onClick={(e) => handleScroll(e, 'workflow')} className="text-sm leading-6 text-slate-400 hover:text-white">Processo</a>
                <a href="#portfolio" onClick={(e) => handleScroll(e, 'portfolio')} className="text-sm leading-6 text-slate-400 hover:text-white">Exemplos</a>
                <a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="text-sm leading-6 text-slate-400 hover:text-white">FAQ</a>
            </div>
          <p className="mt-10 text-center text-xs leading-5 text-slate-500">&copy; {new Date().getFullYear()} Estúdio de Criação IA. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;