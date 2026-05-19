'use client';

import { cn } from '@/lib/utils';

export type SettingsTabValue = 'all' | 'company' | 'security' | 'integrations' | 'operation' | 'financial' | 'system';

interface SettingsTabsProps {
  activeTab: SettingsTabValue;
  onTabChange: (tab: SettingsTabValue) => void;
}

const tabsList: { value: SettingsTabValue; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'company', label: 'Empresa' },
  { value: 'security', label: 'Segurança' },
  { value: 'integrations', label: 'Integrações' },
  { value: 'operation', label: 'Operação' },
  { value: 'financial', label: 'Financeiro' },
  { value: 'system', label: 'Sistema' },
];

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="flex border-b border-[#E7E5EF] w-full overflow-x-auto no-scrollbar">
      <div className="flex gap-2">
        {tabsList.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                "relative py-3.5 px-4 text-xs font-black uppercase tracking-[0.08em] transition-all whitespace-nowrap cursor-pointer",
                isActive
                  ? "text-brand border-b-2 border-brand"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
