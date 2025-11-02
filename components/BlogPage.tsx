import React from 'react';

// Placeholder data for blog posts
const blogPosts = [
  {
    id: 1,
    category: 'Criação de Conteúdo',
    title: 'Como Usar IA para Escrever um E-book em 7 Dias',
    excerpt: 'Descubra um fluxo de trabalho passo a passo usando as ferramentas do nosso Estúdio de Criação para transformar uma simples ideia em um e-book completo, pronto para publicar.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop',
    author: 'Alexandre Borges',
    date: '25 de Julho, 2024',
    featured: true,
  },
  {
    id: 2,
    category: 'Design Digital',
    title: '5 Prompts Essenciais para Gerar Imagens de Capa de Livro com IA',
    excerpt: 'A capa é a primeira impressão do seu livro. Aprenda a criar prompts detalhados que guiam a IA para gerar capas visualmente impressionantes e alinhadas com seu gênero.',
    imageUrl: 'https://images.unsplash.com/photo-1599422438838-348b55d78574?q=80&w=1964&auto=format&fit=crop',
    author: 'Sofia Pereira',
    date: '22 de Julho, 2024',
  },
  {
    id: 3,
    category: 'Vídeo Marketing',
    title: 'De Roteiro a Vídeo: Criando Teasers para Redes Sociais com IA',
    excerpt: 'Transforme os capítulos do seu livro ou artigos de blog em roteiros curtos e gere vídeos promocionais dinâmicos para TikTok e Instagram Reels, tudo dentro do estúdio.',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1974&auto=format&fit=crop',
    author: 'Carlos Andrade',
    date: '18 de Julho, 2024',
  },
  {
    id: 4,
    category: 'SEO & Escrita',
    title: 'O Guia Definitivo do GoDaddy: Aumentando a Profundidade do Conteúdo',
    excerpt: 'Analisamos as recomendações de SEO da GoDaddy e mostramos como aplicar cada uma delas usando as ferramentas do Estúdio de Criação IA para ranquear melhor.',
    imageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070&auto=format&fit=crop',
    author: 'Juliana Costa',
    date: '15 de Julho, 2024',
  },
];

const FeaturedPostCard: React.FC<{ post: (typeof blogPosts)[0] }> = ({ post }) => (
    <div className="group cursor-pointer">
        <div className="overflow-hidden rounded-xl bg-slate-800 shadow-lg shadow-purple-900/10">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative">
                    <img className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-105" src={post.imageUrl} alt={post.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-purple-400">{post.category}</p>
                    <h2 className="mt-2 text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {post.title}
                    </h2>
                    <p className="mt-4 text-slate-400">{post.excerpt}</p>
                    <div className="mt-6 flex items-center gap-4 text-sm">
                        <span className="text-slate-300">{post.author}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-500">{post.date}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


const PostCard: React.FC<{ post: (typeof blogPosts)[0] }> = ({ post }) => (
    <div className="group cursor-pointer flex flex-col overflow-hidden rounded-xl bg-slate-800 shadow-lg shadow-purple-900/10 transform transition-transform duration-300 hover:-translate-y-1">
        <div className="flex-shrink-0">
            <img className="h-48 w-full object-cover" src={post.imageUrl} alt={post.title} />
        </div>
        <div className="flex flex-1 flex-col justify-between p-6">
            <div className="flex-1">
                <p className="text-sm font-medium text-purple-400">{post.category}</p>
                <p className="mt-2 text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {post.title}
                </p>
                <p className="mt-3 text-base text-slate-400">{post.excerpt}</p>
            </div>
            <div className="mt-6 flex items-center text-sm">
                 <span className="text-slate-300">{post.author}</span>
                 <span className="text-slate-500 mx-2">•</span>
                 <span className="text-slate-500">{post.date}</span>
            </div>
        </div>
    </div>
);

const BlogPage: React.FC = () => {
    const featuredPost = blogPosts.find(p => p.featured);
    const otherPosts = blogPosts.filter(p => !p.featured);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    Blog da IA
                </h1>
                <p className="mt-3 max-w-2xl mx-auto text-xl text-slate-400 sm:mt-4">
                    Guias, tutoriais e insights para impulsionar sua criatividade com inteligência artificial.
                </p>
            </div>
            
            {featuredPost && (
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">Em Destaque</h2>
                    <FeaturedPostCard post={featuredPost} />
                </div>
            )}
            
            <div>
                 <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-cyan-500 pl-4">Últimas Postagens</h2>
                <div className="grid gap-12 lg:grid-cols-3">
                    {otherPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
