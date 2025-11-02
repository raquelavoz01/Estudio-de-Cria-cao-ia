import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Book, Chapter } from '../types';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';
import { BackIcon, CoverIcon, DownloadIcon, PlusIcon, SaveIcon, SynopsisIcon, UploadIcon } from './Icons';

const BookCreator: React.FC = () => {
  const [library, setLibrary] = useState<Book[]>([]);
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string>('');
  const importFileRef = useRef<HTMLInputElement>(null);
  const coverUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedLibrary = localStorage.getItem('ai-studio-library');
      if (savedLibrary) {
        setLibrary(JSON.parse(savedLibrary));
      }
    } catch (e) {
      console.error("Failed to load library from localStorage", e);
      setLibrary([]);
    }
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const persistLibrary = (updatedLibrary: Book[]) => {
    localStorage.setItem('ai-studio-library', JSON.stringify(updatedLibrary));
    setLibrary(updatedLibrary);
  };

  const handleSelectBook = (bookId: string) => {
    const bookToEdit = library.find(b => b.id === bookId);
    if (bookToEdit) {
      setEditingBook({ ...bookToEdit });
      setCurrentBookId(bookId);
    }
  };
  
  const handleCreateNewBook = () => {
    const newBook: Book = {
      id: `book_${Date.now()}`,
      title: 'Novo Livro Sem Título',
      premise: '',
      synopsis: '',
      chapters: [],
      uploadedCoverImage: '',
      coverImageUrl: '',
    };
    const updatedLibrary = [...library, newBook];
    persistLibrary(updatedLibrary);
    handleSelectBook(newBook.id);
  };

  const handleSaveBook = () => {
    if (!editingBook) return;
    const updatedLibrary = library.map(b => b.id === editingBook.id ? editingBook : b);
    persistLibrary(updatedLibrary);
    setToast('Livro salvo com sucesso!');
  };

  const updateEditingBook = (updates: Partial<Book>) => {
    if (!editingBook) return;
    setEditingBook(prev => prev ? { ...prev, ...updates } : null);
  };
  
  const setLoading = (key: string, value: boolean) => {
      setIsLoading(prev => ({...prev, [key]: value}));
  }

  const handleGenerateOutline = useCallback(async () => {
    if (!editingBook || !editingBook.premise) {
      setError('Por favor, insira a premissa do livro.');
      return;
    }
    setLoading('outline', true);
    setError(null);
    try {
      const generatedChapters = await geminiService.generateBookOutline(editingBook.premise);
      updateEditingBook({ chapters: generatedChapters });
    } catch (e) {
      setError('Falha ao gerar o esboço. Tente novamente.');
      console.error(e);
    } finally {
      setLoading('outline', false);
    }
  }, [editingBook]);

  const handleGenerateSynopsis = useCallback(async () => {
    if (!editingBook || !editingBook.premise || editingBook.chapters.length === 0) {
      setError('Gere o esboço dos capítulos primeiro para criar uma sinopse.');
      return;
    }
    setLoading('synopsis', true);
    setError(null);
    try {
        const synopsis = await geminiService.generateSynopsis(editingBook.premise, editingBook.chapters);
        updateEditingBook({ synopsis });
    } catch (e) {
        setError('Falha ao gerar a sinopse. Tente novamente.');
        console.error(e);
    } finally {
        setLoading('synopsis', false);
    }
  }, [editingBook]);
  
  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const result = e.target?.result as string;
        updateEditingBook({ uploadedCoverImage: result, coverImageUrl: '' }); // Reset generated cover
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // Reset input
  };

  const handleGenerateCover = useCallback(async () => {
    if (!editingBook || !editingBook.title || !editingBook.uploadedCoverImage) {
      setError('Por favor, envie uma imagem e insira um título para gerar a capa.');
      return;
    }
    setLoading('cover', true);
    setError(null);
    try {
      const [header, base64Data] = editingBook.uploadedCoverImage.split(',');
      const mimeTypeMatch = header.match(/:(.*?);/);
      if (!mimeTypeMatch || !base64Data) {
          throw new Error("Formato de imagem inválido.");
      }
      const mimeType = mimeTypeMatch[1];
      
      const imageUrl = await geminiService.generateBookCoverFromImage(base64Data, mimeType, editingBook.title);
      updateEditingBook({ coverImageUrl: imageUrl });
    } catch (e) {
      setError('Falha ao gerar a capa. Tente novamente.');
      console.error(e);
    } finally {
      setLoading('cover', false);
    }
  }, [editingBook]);
  
  const handleDownloadCover = () => {
    if (!editingBook || !editingBook.coverImageUrl) return;
    const a = document.createElement('a');
    a.href = editingBook.coverImageUrl;
    a.download = `${editingBook.title.replace(/ /g, '_')}_cover.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const handleGenerateChapterContent = useCallback(async (chapterIndex: number) => {
    if (!editingBook) return;
    const chapter = editingBook.chapters[chapterIndex];
    if (!chapter || chapter.content) return;

    setLoading(`chapter_${chapterIndex}`, true);
    setError(null);
    try {
        const content = await geminiService.generateChapterContent(chapter.title, chapter.summary);
        const updatedChapters = editingBook.chapters.map((c, i) => i === chapterIndex ? { ...c, content } : c);
        updateEditingBook({ chapters: updatedChapters });
    } catch (e) {
        setError('Falha ao gerar o conteúdo do capítulo. Tente novamente.');
        console.error(e);
    } finally {
        // FIX: Replaced undefined variable `index` with `chapterIndex`.
        setLoading(`chapter_${chapterIndex}`, false);
    }
  }, [editingBook]);
  
  const handleExportMarkdown = () => {
      if (!editingBook) return;
      let markdown = `# ${editingBook.title}\n\n`;
      if (editingBook.synopsis) {
          markdown += `## Sinopse\n\n${editingBook.synopsis}\n\n`;
      }
      editingBook.chapters.forEach(chapter => {
          markdown += `## ${chapter.title}\n\n`;
          markdown += `${chapter.content || chapter.summary}\n\n`;
      });
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${editingBook.title.replace(/ /g, '_')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };
  
  const handleExportLibrary = () => {
      const json = JSON.stringify(library, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai_studio_library.json';
      a.click();
      URL.revokeObjectURL(url);
  };
  
  const handleImportLibrary = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const text = e.target?.result as string;
              const importedLibrary = JSON.parse(text);
              // Basic validation
              if (Array.isArray(importedLibrary) && importedLibrary.every(item => item.id && item.title)) {
                  persistLibrary(importedLibrary);
                  setToast('Biblioteca importada com sucesso!');
              } else {
                  setError('Arquivo de importação inválido.');
              }
          } catch (err) {
              setError('Falha ao ler o arquivo. Certifique-se de que é um JSON válido.');
          }
      };
      reader.readAsText(file);
      event.target.value = ''; // Reset input
  };

  // Main Render Logic
  if (!currentBookId || !editingBook) {
    // Library View
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white">Minha Biblioteca</h2>
            <div className="flex gap-2">
                <input type="file" ref={importFileRef} onChange={handleImportLibrary} accept=".json" className="hidden" />
                <button onClick={() => importFileRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"><UploadIcon/> Importar</button>
                <button onClick={handleExportLibrary} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"><DownloadIcon/> Exportar</button>
            </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {library.map(book => (
            <div key={book.id} onClick={() => handleSelectBook(book.id)} className="group cursor-pointer aspect-[2/3] bg-slate-800 rounded-lg overflow-hidden relative shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300">
                {book.coverImageUrl ? (
                    <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover"/>
                ) : (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center p-2">
                        <span className="text-center text-slate-400 font-bold">{book.title}</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <h3 className="text-white text-lg font-bold text-center">{book.title}</h3>
                </div>
            </div>
          ))}
          <button onClick={handleCreateNewBook} className="flex flex-col items-center justify-center aspect-[2/3] bg-slate-800 hover:bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg text-slate-500 hover:text-white transition-colors duration-300">
            <PlusIcon />
            <span className="mt-2 font-semibold">Criar Novo Livro</span>
          </button>
        </div>
      </div>
    );
  }

  // Editor View
  return (
    <div className="space-y-6">
        {toast && <div className="fixed top-20 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">{toast}</div>}

        <div className="flex justify-between items-center">
            <button onClick={() => setCurrentBookId(null)} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"><BackIcon /> Voltar para a Biblioteca</button>
            <div className="flex items-center gap-4">
                <button onClick={handleSaveBook} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-md"><SaveIcon /> Salvar</button>
                <button onClick={handleExportMarkdown} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors shadow-md"><DownloadIcon/> Exportar Markdown</button>
            </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">1. Detalhes do Livro</h2>
                <label className="block mb-2 text-sm font-medium text-slate-400">Título</label>
                <input type="text" value={editingBook.title} onChange={e => updateEditingBook({title: e.target.value})} className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition mb-4"/>

                <label className="block mb-2 text-sm font-medium text-slate-400">Premissa</label>
                <textarea value={editingBook.premise} onChange={e => updateEditingBook({premise: e.target.value})} placeholder="Ex: Uma aventura de ficção científica..." className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition" />
                
                <div className="mt-4 flex flex-wrap gap-4">
                    <button onClick={handleGenerateOutline} disabled={isLoading['outline']} className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 transition-colors shadow-md">{isLoading['outline'] ? <Loader /> : 'Gerar Esboço'}</button>
                    <button onClick={handleGenerateSynopsis} disabled={isLoading['synopsis'] || editingBook.chapters.length === 0} className="flex items-center gap-2 px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 disabled:bg-slate-600 transition-colors shadow-md">{isLoading['synopsis'] ? <Loader /> : <><SynopsisIcon/>Gerar Sinopse</>}</button>
                </div>
                 {editingBook.synopsis && (
                    <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
                        <h3 className="font-bold text-purple-300">Sinopse</h3>
                        <p className="text-slate-300 whitespace-pre-wrap">{editingBook.synopsis}</p>
                    </div>
                )}
            </div>

            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">2. Capítulos</h2>
                <div className="max-h-96 overflow-y-auto pr-2 space-y-2">
                    {editingBook.chapters.map((chapter, index) => (
                        <div key={index} className="bg-slate-700 p-3 rounded-lg">
                            <h3 className="font-bold text-white">{chapter.title}</h3>
                            <p className="text-sm text-slate-400 mb-2">{chapter.summary}</p>
                            {chapter.content ? (
                                <details>
                                    <summary className="cursor-pointer text-cyan-400">Mostrar Conteúdo</summary>
                                    <div className="mt-2 pt-2 border-t border-slate-600 prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">{chapter.content}</div>
                                </details>
                            ) : (
                                <button onClick={() => handleGenerateChapterContent(index)} disabled={isLoading[`chapter_${index}`]} className="px-4 py-1 text-sm bg-cyan-700 text-white font-semibold rounded-lg hover:bg-cyan-800 disabled:bg-slate-600 transition-colors">
                                    {isLoading[`chapter_${index}`] ? <Loader /> : 'Gerar Conteúdo'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
             <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Capa do Livro</h2>

                <div className="aspect-[2/3] bg-slate-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {isLoading['cover'] && <Loader/>}
                    {!isLoading['cover'] && editingBook.coverImageUrl && <img src={editingBook.coverImageUrl} alt="Capa do livro gerada" className="w-full h-full object-contain"/>}
                    {!isLoading['cover'] && !editingBook.coverImageUrl && <span className="text-slate-500 text-center p-4">A capa gerada aparecerá aqui</span>}
                </div>

                {editingBook.uploadedCoverImage && (
                    <div className="mb-4">
                        <p className="text-sm font-medium text-slate-400 mb-2">Imagem base:</p>
                        <img src={editingBook.uploadedCoverImage} alt="Imagem para capa" className="rounded-lg max-w-full h-auto mx-auto" style={{ maxHeight: '150px' }}/>
                    </div>
                )}
                
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    ref={coverUploadRef}
                    onChange={handleCoverImageUpload}
                    className="hidden"
                />
                <div className="space-y-2">
                    <button 
                        onClick={() => coverUploadRef.current?.click()} 
                        className="w-full flex justify-center items-center gap-2 px-6 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors shadow-md">
                        <UploadIcon /> Enviar Imagem
                    </button>

                    <button 
                        onClick={handleGenerateCover} 
                        disabled={isLoading['cover'] || !editingBook.uploadedCoverImage || !editingBook.title} 
                        className="w-full flex justify-center items-center gap-2 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md">
                        {isLoading['cover'] ? <Loader /> : <><CoverIcon/>Gerar Capa a partir da Imagem</>}
                    </button>
                    
                    {editingBook.coverImageUrl && !isLoading['cover'] && (
                        <button
                            onClick={handleDownloadCover}
                            className="w-full flex justify-center items-center gap-2 px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors shadow-md">
                            <DownloadIcon /> Baixar Capa
                        </button>
                    )}
                </div>
            </div>
        </div>

      </div>
      {error && <div className="mt-4 bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
    </div>
  );
};

export default BookCreator;