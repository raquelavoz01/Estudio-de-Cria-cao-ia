
import React, { useState, useCallback, useRef } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';
import { DownloadIcon, UploadIcon } from './Icons';

// Audio decoding utilities (copied from AudioNarrator)
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const TalkingAvatar: React.FC = () => {
    const [avatarImage, setAvatarImage] = useState<string | null>(null);
    const [script, setScript] = useState('');
    const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setAvatarImage(e.target?.result as string);
            setGeneratedAudioUrl(null);
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const handleGenerateSpeech = useCallback(async () => {
        if (!script) {
            setError('Por favor, insira o roteiro para o avatar.');
            return;
        }
        if (!avatarImage) {
            setError('Por favor, envie uma imagem para o avatar.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedAudioUrl(null);

        try {
            const base64Audio = await geminiService.generateAudio(script);
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioContext = audioContextRef.current;
            const decodedBytes = decode(base64Audio);
            const audioBuffer = await decodeAudioData(decodedBytes, audioContext, 24000, 1);
            const wavBlob = bufferToWave(audioBuffer, audioBuffer.length);
            const url = URL.createObjectURL(wavBlob);
            setGeneratedAudioUrl(url);
        } catch (e) {
            setError('Falha ao gerar a fala. Tente novamente.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [script, avatarImage]);
    
     const handleDownloadAudio = () => {
        if (!generatedAudioUrl) return;
        const a = document.createElement('a');
        a.href = generatedAudioUrl;
        a.download = `ia_avatar_audio_${Date.now()}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const bufferToWave = (abuffer: AudioBuffer, len: number) => {
        let numOfChan = abuffer.numberOfChannels, length = len * numOfChan * 2 + 44, buffer = new ArrayBuffer(length), view = new DataView(buffer), channels = [], i, sample, offset = 0, pos = 0;
        setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157); setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan); setUint32(abuffer.sampleRate); setUint32(abuffer.sampleRate * 2 * numOfChan); setUint16(numOfChan * 2); setUint16(16); setUint32(0x61746164); setUint32(length - pos - 4);
        for (i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i));
        while (pos < length) {
            for (i = 0; i < numOfChan; i++) {
                sample = Math.max(-1, Math.min(1, channels[i][offset])); sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; view.setInt16(pos, sample, true); pos += 2;
            }
            offset++
        }
        function setUint16(data: number) { view.setUint16(pos, data, true); pos += 2; }
        function setUint32(data: number) { view.setUint32(pos, data, true); pos += 4; }
        return new Blob([view], { type: 'audio/wav' });
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Avatar Falante IA</h2>
                <p className="text-slate-400 mb-4">Dê vida aos seus personagens. Envie uma imagem, escreva um roteiro e gere uma narração com IA.</p>
                
                <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full max-w-sm aspect-square bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-purple-500 hover:text-purple-400 transition-colors"
                        >
                            {avatarImage ? (
                                <img src={avatarImage} alt="Avatar" className="max-w-full max-h-full object-contain rounded-md" />
                            ) : (
                                <><UploadIcon /><span className="mt-2 text-sm font-semibold">Enviar Imagem do Avatar</span></>
                            )}
                        </button>
                        {generatedAudioUrl && !isLoading && (
                            <div className="w-full max-w-sm mt-4">
                               <audio controls src={generatedAudioUrl} className="w-full" />
                               <button onClick={handleDownloadAudio} className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors shadow-md">
                                 <DownloadIcon /> Baixar Áudio
                               </button>
                            </div>
                        )}
                         {isLoading && (
                            <div className="w-full max-w-sm mt-4 flex justify-center">
                                <Loader />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="script-input" className="block mb-2 text-sm font-medium text-slate-400">Roteiro do Avatar</label>
                        <textarea
                            id="script-input"
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            placeholder="Escreva aqui o que seu avatar vai dizer..."
                            className="w-full flex-1 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition resize-none"
                        />
                        <button
                            onClick={handleGenerateSpeech}
                            disabled={isLoading || !avatarImage || !script}
                            className="w-full mt-4 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
                        >
                            {isLoading ? <Loader /> : 'Gerar Fala'}
                        </button>
                    </div>
                </div>
            </div>
            {error && <div className="mt-4 bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}
        </div>
    );
};

export default TalkingAvatar;
