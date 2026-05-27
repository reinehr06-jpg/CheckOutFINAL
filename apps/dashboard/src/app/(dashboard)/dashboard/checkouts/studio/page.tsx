'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { StudioIframe } from '@/components/studio/StudioIframe';

export default function CheckoutStudioPage() {
  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden text-left">
      {/* Top Bar */}
      <header className="h-12 bg-white border-b border-border flex items-center px-4 shrink-0">
        <Link
          href="/dashboard/checkouts"
          className="p-1.5 hover:bg-surface-raised rounded-lg transition-colors mr-3"
          title="Voltar para checkouts"
        >
          <ChevronLeft size={18} className="text-ink-subtle" />
        </Link>
        <div className="h-5 w-px bg-border mr-3" />
        <div>
          <h1 className="text-sm font-bold text-ink flex items-center gap-1.5">
            Checkout Studio
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          </h1>
          <p className="text-[10px] font-bold text-ink-subtle">Selecione um checkout salvo no menu esquerdo para editar</p>
        </div>
      </header>

      <StudioIframe className="flex-1" />
    </div>
  );
}
