'use client';

import { useEffect, useState, useRef } from 'react';
import { loadSchemaFromServer, setSaveStatus } from '@/lib/studio/editor/commands';
import { useStudioStore } from '@/lib/studio/editor/store';
import { fetchCheckoutDraft, saveCheckoutDraft } from '@/lib/studio/api';
import { mockSchema } from '@/lib/studio/schema/mock';

// Componentes da UI do Editor
import { TopToolbar } from './editor/TopToolbar';
import { LeftSidebar } from './editor/LeftSidebar';
import { RightSidebar } from './editor/RightSidebar';
import { Canvas } from './editor/Canvas';

interface StudioShellProps {
  checkoutId: string;
}

export function StudioShell({ checkoutId }: StudioShellProps) {
  const [loading, setLoading] = useState(true);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Inicialização (Fetch Draft)
  useEffect(() => {
    const fetchCheckout = async () => {
      setLoading(true);
      try {
        let draft = await fetchCheckoutDraft(checkoutId);
        if (!draft) {
          // Se não tiver rascunho no localStorage, usamos o mock (Fase 2)
          draft = mockSchema;
        }
        loadSchemaFromServer(draft, checkoutId, 'v_draft_1');
      } finally {
        setLoading(false);
      }
    };

    fetchCheckout();
  }, [checkoutId]);

  // Listener Global de Autosave
  useEffect(() => {
    // Subscreve-se às mudanças da Store
    const unsubscribe = useStudioStore.subscribe((state, prevState) => {
      // Se houver mudanças não salvas e o schema mudou
      if (state.unsavedChanges && state.schema !== prevState.schema) {
        
        // Limpa o timer anterior (Debounce)
        if (autosaveTimerRef.current) {
          clearTimeout(autosaveTimerRef.current);
        }

        // Define o novo timer de 1.5s
        autosaveTimerRef.current = setTimeout(async () => {
          setSaveStatus('saving');
          try {
            await saveCheckoutDraft(checkoutId, state.versionId, state.schema);
            setSaveStatus('saved');
          } catch (error) {
            console.error('Erro no autosave:', error);
            setSaveStatus('error');
          }
        }, 1500);
      }
    });

    return () => {
      unsubscribe();
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [checkoutId]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <header className="h-14 bg-white border-b border-border flex items-center px-4 shrink-0"></header>
        <div className="flex flex-1 items-center justify-center bg-surface-raised">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-brand border-t-transparent animate-spin" />
            <span className="text-sm font-bold text-ink-subtle">Carregando Studio...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <TopToolbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <Canvas />
        <RightSidebar />
      </div>
    </div>
  );
}
