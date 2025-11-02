
import React, { useState, useCallback, useRef } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';
import { DownloadIcon } from './Icons';

// Audio decoding utilities
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


const AudioNarrator: React.FC = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleGenerateAudio = useCallback(async () => {
    if (!text) {
      setError('Por favor, insira o texto para narração.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const base64Audio = await geminiService.generateAudio(text);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
      }
      const audioContext = audioContextRef.current;
      
      const decodedBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(decodedBytes, audioContext, 24000, 1);
      
      // Convert AudioBuffer to a WAV blob URL to use in <audio> tag
      const wavBlob = bufferToWave(audioBuffer, audioBuffer.length);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);

    } catch (e) {
      setError('Falha ao gerar o áudio. Tente novamente.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [text]);
  
  const handleDownloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `ia_audio_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Helper to convert raw PCM audio buffer to a WAV blob
  const bufferToWave = (abuffer: AudioBuffer, len: number) => {
    let numOfChan = abuffer.numberOfChannels,
        length = len * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [],
        i, sample,
        offset = 0,
        pos = 0;

    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"

    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit

    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length

    // write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
            view.setInt16(pos, sample, true); // write 16-bit sample
            pos += 2;
        }
        offset++
    }
    
    function setUint16(data: number) {
      view.setUint16(pos, data, true);
      pos += 2;
    }
    
    function setUint32(data: number) {
      view.setUint32(pos, data, true);
      pos += 4;
    }

    return new Blob([view], { type: 'audio/wav' });
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Narrador de Áudio</h2>
        <p className="text-slate-400 mb-4">Insira o texto que você deseja converter em áudio falado.</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ex: Era uma vez, em uma terra muito distante..."
          className="w-full h-40 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
        />
        <button
          onClick={handleGenerateAudio}
          disabled={isLoading}
          className="mt-4 w-full sm:w-auto px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          {isLoading ? <Loader /> : 'Gerar Narração'}
        </button>
      </div>

      {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg min-h-[100px] flex items-center justify-center">
        {isLoading ? (
          <Loader />
        ) : audioUrl ? (
          <div className="w-full flex flex-col sm:flex-row items-center gap-4">
            <audio controls src={audioUrl} className="w-full" />
            <button
              onClick={handleDownloadAudio}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors shadow-md"
            >
              <DownloadIcon /> Baixar Áudio (.wav)
            </button>
          </div>
        ) : (
          <p className="text-slate-500">Sua narração de áudio aparecerá aqui.</p>
        )}
      </div>
    </div>
  );
};

export default AudioNarrator;