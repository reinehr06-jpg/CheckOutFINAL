'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MOCK_DISTRIBUTION = [
  { range: '0–20', count: 14201, pct: 62.1, color: '#10B981' },
  { range: '20–40', count: 5410, pct: 23.6, color: '#059669' },
  { range: '40–60', count: 2182, pct: 9.5, color: '#F59E0B' },
  { range: '60–80', count: 812, pct: 3.5, color: '#D97706' },
  { range: '80–100', count: 310, pct: 1.3, color: '#EF4444' },
];

export function TrustScoreHistogram() {
  return (
    <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm shadow-slate-100/50 space-y-4 text-left">
      <div>
        <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
          Distribuição de Scores
        </h4>
        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
          Percentual de transações agrupadas por criticidade de risco.
        </span>
      </div>

      <div className="h-60 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_DISTRIBUTION} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E7E5EF/50" />
            <XAxis type="number" stroke="#94A3B8" fontSize={9} tickLine={false} />
            <YAxis dataKey="range" type="category" stroke="#94A3B8" fontSize={9} tickLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl shadow-2xl text-[10.5px] font-bold space-y-1 text-left">
                      <span className="text-slate-400 font-medium block">Faixa: {data.range}</span>
                      <div className="flex items-center justify-between gap-4">
                        <span>Quantidade:</span>
                        <span>{data.count.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>Percentual:</span>
                        <span className="text-brand-soft">{data.pct}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
              {MOCK_DISTRIBUTION.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
