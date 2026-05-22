'use client';

import { use } from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { StudioIframe } from '@/components/studio/StudioIframe';

export default function StudioPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Top Bar */}
      <header className="h-12 bg-white border-b border-border flex items-center px-4 shrink-0">
        <Link
          href="/dashboard/checkouts"
          className="p-1.5 hover:bg-surface-raised rounded-lg transition-colors mr-3"
        >
          <ChevronLeft size={18} className="text-ink-subtle" />
        </Link>
        <div className="h-5 w-px bg-border mr-3" />
        <div>
          <h1 className="text-sm font-bold text-ink">Checkout Studio</h1>
          <p className="text-[10px] font-bold text-ink-subtle">ID: {resolvedParams.id}</p>
        </div>
      </header>

      <StudioIframe checkoutId={resolvedParams.id} className="flex-1" />
    </div>
  );
}
