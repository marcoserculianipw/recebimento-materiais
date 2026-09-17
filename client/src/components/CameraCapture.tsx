import React, { useRef, useState } from 'react';
import { Camera, RefreshCw, Check, Trash2, Eye, Video } from 'lucide-react';
import { PhotoService } from '../services/photoService';

interface CameraCaptureProps {
  label: string;
  buttonText?: string;
  currentPhoto?: string;
  onPhotoConfirmed: (photoDataUrl: string) => void;
  onRemovePhoto?: () => void;
  compact?: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  label,
  buttonText = 'TIRAR FOTO',
  currentPhoto,
  onPhotoConfirmed,
  onRemovePhoto,
  compact = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Estados locais
  const [tempPreview, setTempPreview] = useState<string | null>(null);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalViewerOpen, setIsModalViewerOpen] = useState(false);

  // Iniciar câmera ao vivo (se o dispositivo suportar getUserMedia)
  const startLiveCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        // Fallback direto para o input nativo de câmera
        fileInputRef.current?.click();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Câmera traseira no celular
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setCameraStream(stream);
      setIsLiveCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(console.error);
        }
      }, 100);
    } catch (err) {
      console.warn('Erro ao acessar getUserMedia ao vivo, usando input nativo com câmera traseira:', err);
      fileInputRef.current?.click();
    }
  };

  const stopLiveCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsLiveCameraOpen(false);
  };

  const captureFrameFromLiveCamera = async () => {
    if (!videoRef.current) return;
    setIsProcessing(true);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopLiveCamera();

      try {
        const compressed = await PhotoService.compressImage(dataUrl);
        setTempPreview(compressed);
      } catch {
        setTempPreview(dataUrl);
      }
    }
    setIsProcessing(false);
  };

  // Manipular imagem capturada pelo input nativo do celular
  const handleNativeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const compressed = await PhotoService.compressImage(file);
      setTempPreview(compressed);
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      const reader = new FileReader();
      reader.onload = () => setTempPreview(reader.result as string);
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
      // Limpa valor para permitir selecionar a mesma foto caso queira refazer
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRefazer = () => {
    setTempPreview(null);
    // Aciona imediatamente para tirar nova foto
    startLiveCamera();
  };

  const handleConfirmar = () => {
    if (tempPreview) {
      onPhotoConfirmed(tempPreview);
      setTempPreview(null);
    }
  };

  return (
    <div className="w-full">
      {/* Input nativo invisível com capture="environment" para abrir a câmera traseira nativa no celular */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleNativeFileChange}
      />

      {/* 1. ESTADO: PREVIEW PENDENTE DE CONFIRMAÇÃO (FLUXO SOLICITADO) */}
      {tempPreview && (
        <div className="bg-white border-2 border-amber-400 rounded-xl p-3 sm:p-4 shadow-md animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              Pré-visualização da Foto
            </span>
            <span className="text-xs text-slate-500">Verifique a nitidez</span>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-slate-900 aspect-[4/3] flex items-center justify-center border border-slate-200">
            <img
              src={tempPreview}
              alt="Prévia capturada"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Botões do Fluxo: [REFAZER FOTO] e [CONFIRMAR FOTO] */}
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <button
              type="button"
              onClick={handleRefazer}
              className="flex items-center justify-center gap-2 py-3 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold text-sm rounded-lg border border-slate-300 transition-colors touch-target"
            >
              <RefreshCw className="w-4 h-4" />
              REFAZER FOTO
            </button>

            <button
              type="button"
              onClick={handleConfirmar}
              className="flex items-center justify-center gap-2 py-3 px-3 bg-[#0a3d62] hover:bg-[#072b46] active:bg-[#041c2e] text-white font-bold text-sm rounded-lg shadow transition-colors touch-target"
            >
              <Check className="w-5 h-5 text-emerald-300" />
              CONFIRMAR FOTO
            </button>
          </div>
        </div>
      )}

      {/* 2. ESTADO: FOTO CONFIRMADA E VINCULADA */}
      {!tempPreview && currentPhoto && (
        <div className="bg-emerald-50/60 border border-emerald-300 rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div
              onClick={() => setIsModalViewerOpen(true)}
              className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden border border-emerald-300 flex-shrink-0 cursor-pointer relative group"
            >
              <img
                src={currentPhoto}
                alt="Foto vinculada"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Foto vinculada com sucesso
              </span>
              <span className="text-xs text-slate-600 truncate">
                {label || 'Registro fotográfico'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={startLiveCamera}
              title="Trocar Foto"
              className="p-2 text-slate-600 hover:text-[#0a3d62] hover:bg-slate-200/60 rounded-lg touch-target flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {onRemovePhoto && (
              <button
                type="button"
                onClick={onRemovePhoto}
                title="Remover Foto"
                className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-100/60 rounded-lg touch-target flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. ESTADO: NENHUMA FOTO (EXIBE BOTÃO DE AÇÃO) */}
      {!tempPreview && !currentPhoto && (
        <div>
          <button
            type="button"
            onClick={startLiveCamera}
            disabled={isProcessing}
            className={`w-full flex items-center justify-center gap-2.5 font-bold rounded-xl transition-all touch-target active:scale-[0.99] ${
              compact
                ? 'py-2.5 px-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-dashed border-slate-300'
                : 'py-3.5 px-4 text-sm bg-gradient-to-r from-[#0a3d62] to-[#125488] hover:from-[#072b46] hover:to-[#0a3d62] text-white shadow-sm border border-blue-900/20'
            }`}
          >
            <Camera className={compact ? 'w-4 h-4 text-slate-600' : 'w-5 h-5 text-blue-200'} />
            <span>{buttonText}</span>
          </button>
        </div>
      )}

      {/* MODAL: CÂMERA AO VIVO COM VIEWFINDER NO NAVEGADOR */}
      {isLiveCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between p-4">
          <div className="w-full flex justify-between items-center text-white px-2 py-3">
            <span className="text-sm font-semibold flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400 animate-pulse" />
              Câmera do Dispositivo
            </span>
            <button
              type="button"
              onClick={stopLiveCamera}
              className="text-white/80 hover:text-white px-3 py-1 bg-white/10 rounded-full text-xs"
            >
              Cancelar
            </button>
          </div>

          <div className="relative w-full max-w-md flex-1 flex items-center justify-center overflow-hidden rounded-2xl border border-white/20">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            {/* Guia visual de enquadramento */}
            <div className="absolute inset-6 border-2 border-white/40 border-dashed rounded-xl pointer-events-none flex items-center justify-center">
              <span className="text-white/60 text-xs bg-black/40 px-3 py-1 rounded-full">
                Enquadre o documento / detalhe
              </span>
            </div>
          </div>

          <div className="w-full max-w-md py-6 flex flex-col items-center space-y-3">
            <button
              type="button"
              onClick={captureFrameFromLiveCamera}
              disabled={isProcessing}
              className="w-20 h-20 rounded-full border-4 border-white bg-white/30 hover:bg-white/50 active:scale-95 transition-all flex items-center justify-center"
            >
              <div className="w-14 h-14 rounded-full bg-white shadow-lg"></div>
            </button>
            <button
              type="button"
              onClick={() => {
                stopLiveCamera();
                fileInputRef.current?.click();
              }}
              className="text-xs text-white/70 hover:text-white underline pt-1"
            >
              Usar câmera nativa do sistema
            </button>
          </div>
        </div>
      )}

      {/* MODAL: VISUALIZADOR DE FOTO AMPLIADA */}
      {isModalViewerOpen && currentPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4"
          onClick={() => setIsModalViewerOpen(false)}
        >
          <div className="relative max-w-lg w-full max-h-[85vh] flex flex-col items-center">
            <img
              src={currentPhoto}
              alt="Foto ampliada"
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setIsModalViewerOpen(false)}
              className="mt-4 px-6 py-2.5 bg-white text-slate-900 font-bold rounded-full shadow-lg text-sm"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
