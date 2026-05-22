'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen w-full bg-[#F4F0FF] p-1.5 2xl:p-2.5 relative font-sans selection:bg-brand/20 selection:text-brand">
        <div className="absolute top-[-15%] left-[-5%] w-[45%] h-[45%] bg-brand/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[10%] w-[35%] h-[35%] bg-brand-accent/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="w-full min-h-[calc(100vh-12px)] 2xl:min-h-[calc(100vh-20px)] relative z-10">
          <Sidebar />
          
          <main className="flex flex-col min-w-0 w-full pl-[252px] 2xl:pl-[284px]">
            <Topbar />
            
            <div className="flex-1 pt-1.5 pb-10">
              <div className="w-full min-w-0 px-1">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
