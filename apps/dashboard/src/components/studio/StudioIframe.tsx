'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudioIframeProps {
  checkoutId?: string;
  className?: string;
}

declare global {
  interface Window {
    __studioToken?: string;
  }
}

export function StudioIframe({ checkoutId, className }: StudioIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const studioUrl = process.env.NEXT_PUBLIC_CHECKOUT_STUDIO_URL || 'http://localhost:5173';

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Listen for postMessage from checkout-studio
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== studioUrl) return;
      const { type, payload } = event.data || {};
      switch (type) {
        case 'STUDIO_SAVED':
          showToast('Checkout salvo com sucesso!');
          break;
        case 'STUDIO_PUBLISHED':
          showToast('Checkout publicado com sucesso!');
          break;
        case 'STUDIO_ERROR':
          showToast(payload?.message || 'Erro no checkout studio');
          break;
        case 'STUDIO_READY':
          setLoading(false);
          // Send auth token and checkout ID to the iframe
          const token = window.__studioToken || '';
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              { type: 'STUDIO_INIT', payload: { token, checkoutId } },
              studioUrl
            );
          }
          break;
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [studioUrl, checkoutId, showToast]);

  // Build URL with checkout ID if provided
  const src = checkoutId ? `${studioUrl}?checkoutId=${checkoutId}` : studioUrl;

  return (
    <div className={cn('relative flex flex-col', fullscreen ? 'fixed inset-0 z-50 bg-white' : 'flex-1', className)}>
      {/* Toolbar */}
      <div className="h-10 bg-white border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 text-brand animate-spin" />}
          <span className="text-[11px] font-bold text-ink-subtle">
            {loading ? 'Carregando Checkout Studio...' : 'Checkout Studio'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => iframeRef.current?.contentWindow?.postMessage({ type: 'STUDIO_UNDO' }, studioUrl)}
            className="p-1.5 hover:bg-surface-raised rounded text-ink-subtle hover:text-ink transition-colors"
            title="Desfazer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-1.5 hover:bg-surface-raised rounded text-ink-subtle hover:text-ink transition-colors"
            title={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          >
            {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Iframe */}
      <div className="flex-1 relative">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-raised text-center p-8">
            <div className="w-12 h-12 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">!</span>
            </div>
            <h3 className="text-sm font-bold text-ink mb-2">Erro ao carregar o Checkout Studio</h3>
            <p className="text-xs text-ink-muted mb-4">Verifique se o servidor do Checkout Studio está rodando em {studioUrl}</p>
            <button
              onClick={() => { setError(false); setLoading(true); }}
              className="px-4 py-2 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-deep transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={src}
            className="w-full h-full border-0"
            onLoad={() => setLoading(false)}
            onError={() => { setError(true); setLoading(false); }}
            allow="clipboard-read; clipboard-write"
          />
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xl animate-in slide-in-from-bottom-2 z-10">
          {toast}
        </div>
      )}
    </div>
  );
}
