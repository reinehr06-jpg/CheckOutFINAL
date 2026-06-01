'use client';

import { use } from 'react';
import { StudioShell } from '@/components/studio/StudioShell';

export default function StudioPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  // Todo o layout (TopBar, Sidebars, Canvas) agora é gerenciado pelo StudioShell
  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden w-full absolute inset-0 z-50">
      <StudioShell checkoutId={resolvedParams.id} />
    </div>
  );
}
