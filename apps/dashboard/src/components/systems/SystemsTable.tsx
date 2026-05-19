'use client';

import { useState } from 'react';
import { 
  MoreVertical, 
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  PlayCircle,
  Eye,
  Activity,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const systems = [
  { 
    id: 'sys_001', 
    name: 'Pagar.Me', 
    desc: 'Gateway de Pagamento', 
    status: 'Operacional', 
    env: 'Produção', 
    gateway: 'Pagar.Me Principal', 
    gwId: 'gw_pm_01', 
    checkout: 'Checkout Pagar.Me', 
    chkId: 'chk_pm_default', 
    last: 'há 2 min', 
    time: '11/05 14:36',
    uptime: '99,92%', 
    reqs: '142 req/s',
    color: 'success',
    icon: 'P',
    iconColor: 'bg-success'
  },
  { 
    id: 'sys_002', 
    name: 'Mercado Pago', 
    desc: 'Gateway de Pagamento', 
    status: 'Operacional', 
    env: 'Produção', 
    gateway: 'Mercado Pago Master', 
    gwId: 'gw_mp_01', 
    checkout: 'Checkout Mercado Pago', 
    chkId: 'chk_mp_default', 
    last: 'há 4 min', 
    time: '11/05 14:34',
    uptime: '99,78%', 
    reqs: '118 req/s',
    color: 'success',
    icon: 'M',
    iconColor: 'bg-blue-500'
  },
  { 
    id: 'sys_003', 
    name: 'Stripe', 
    desc: 'Gateway de Pagamento', 
    status: 'Atenção', 
    env: 'Produção', 
    gateway: 'Stripe Global', 
    gwId: 'gw_stripe_01', 
    checkout: 'Checkout Stripe', 
    chkId: 'chk_stripe_default', 
    last: 'há 15 min', 
    time: '11/05 14:23',
    uptime: '98,21%', 
    reqs: '86 req/s',
    color: 'warning',
    icon: '$',
    iconColor: 'bg-indigo-600'
  },
  { 
    id: 'sys_004', 
    name: 'Asaas', 
    desc: 'Gateway de Pagamento', 
    status: 'Operacional', 
    env: 'Produção', 
    gateway: 'Asaas Principal', 
    gwId: 'gw_asaas_01', 
    checkout: 'Checkout Asaas', 
    chkId: 'chk_asaas_default', 
    last: 'há 1 min', 
    time: '11/05 14:37',
    uptime: '99,95%', 
    reqs: '74 req/s',
    color: 'success',
    icon: 'A',
    iconColor: 'bg-blue-400'
  },
  { 
    id: 'sys_005', 
    name: 'Banco do Brasil PIX', 
    desc: 'PIX Direct', 
    status: 'Instável', 
    env: 'Produção', 
    gateway: 'BB PIX Principal', 
    gwId: 'gw_bbpix_01', 
    checkout: 'Checkout PIX BB', 
    chkId: 'chk_pix_bb_default', 
    last: 'há 30 min', 
    time: '11/05 14:07',
    uptime: '95,12%', 
    reqs: '62 req/s',
    color: 'danger',
    icon: 'B',
    iconColor: 'bg-yellow-500'
  },
  { 
    id: 'sys_006', 
    name: 'Cielo', 
    desc: 'Adquirente', 
    status: 'Operacional', 
    env: 'Produção', 
    gateway: 'Cielo Principal', 
    gwId: 'gw_cielo_01', 
    checkout: 'Checkout Cielo', 
    chkId: 'chk_cielo_default', 
    last: 'há 3 min', 
    time: '11/05 14:35',
    uptime: '99,61%', 
    reqs: '91 req/s',
    color: 'success',
    icon: 'C',
    iconColor: 'bg-black'
  },
  { 
    id: 'sys_007', 
    name: 'Adyen', 
    desc: 'Gateway de Pagamento', 
    status: 'Desconectado', 
    env: 'Sandbox', 
    gateway: 'Adyen Sandbox', 
    gwId: 'gw_adyen_sbx', 
    checkout: 'Checkout Adyen SBX', 
    chkId: 'chk_adyen_sbx', 
    last: '---', 
    time: '---',
    uptime: '0%', 
    reqs: '0 req/s',
    color: 'slate/30',
    icon: 'A',
    iconColor: 'bg-emerald-600'
  },
  { 
    id: 'sys_008', 
    name: 'Internal API', 
    desc: 'Integração Interna', 
    status: 'Operacional', 
    env: 'Produção', 
    gateway: 'API Core', 
    gwId: 'gw_core_api', 
    checkout: 'Checkout Interno', 
    chkId: 'chk_internal_default', 
    last: 'há 1 min', 
    time: '11/05 14:37',
    uptime: '100%', 
    color: 'success',
    icon: '</>',
    iconColor: 'bg-indigo-700'
  },
];

export function SystemsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const totalItems = systems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentSystems = systems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {/* 1. Filters Card */}
      <div className="bg-white/60 backdrop-blur-md p-2.5 rounded-xl border border-border/50 flex items-center justify-between shadow-sm w-full">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="relative w-[280px] 2xl:w-[340px] shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate/30" />
            <input 
              type="text" 
              placeholder="Buscar por nome, token, gateway ou checkout"
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-border rounded-lg text-[12px] font-bold text-ink placeholder:text-slate/30 focus:outline-none focus:ring-1 focus:ring-brand/30 transition-all h-[34px]"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { label: 'Status', value: 'Todos' },
              { label: 'Ambiente', value: 'Todos' },
              { label: 'Gateway padrinho', value: 'Todos' },
            ].map((f) => (
              <div key={f.label} className="px-3 py-1 bg-white border border-border rounded-lg flex flex-col justify-center min-w-[120px] 2xl:min-w-[140px] h-[34px] cursor-pointer hover:bg-brand-soft transition-all shrink-0">
                <span className="text-[7.5px] font-black text-slate/40 uppercase tracking-widest leading-none mb-0.5">{f.label}</span>
                <div className="flex items-center justify-between">
                   <span className="text-[11.5px] font-black text-ink">{f.value}</span>
                   <ChevronDown className="w-3.5 h-3.5 text-slate/30" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pl-4 border-l border-border/30 shrink-0">
          <p className="text-[12px] font-black text-ink">{totalItems} <span className="text-slate/40">resultados</span></p>
        </div>
      </div>

      {/* 2. Bulk Actions */}
      <div className="flex items-center gap-3 px-2 py-0.5">
        <input type="checkbox" className="w-3.5 h-3.5 rounded border-border text-brand focus:ring-brand transition-all cursor-pointer" />
        <span className="text-[11px] font-bold text-slate-400">0 selecionados</span>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/50 border border-border rounded-lg text-[10px] font-black text-slate-300 uppercase tracking-tight cursor-not-allowed">
          Ações em lote <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* 3. Main Table */}
      <div className="w-full min-w-0 overflow-hidden rounded-[24px] border border-[#E8DDFD] bg-white/80 shadow-sm">
        <div className="w-full overflow-x-hidden">
          <table className="w-full text-left table-fixed">
            <thead>
              <tr className="border-b border-border/40 bg-slate-50/50">
                <th className="w-[42px] px-2 py-2.5"></th>
                {[
                  { name: 'Sistema', width: '19%' },
                  { name: 'Status', width: '11%' },
                  { name: 'Ambiente', width: '10%' },
                  { name: 'Gateway padrinho', width: '14%' },
                  { name: 'Checkout padrão', width: '14%' },
                  { name: 'Última atividade', width: '11%' },
                  { name: 'Saúde / uso', width: '8%' },
                  { name: 'Ações rápidas', width: '13%' }
                ].map((h) => (
                  <th key={h.name} style={{ width: h.width }} className={cn("py-2.5 text-[9.5px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap", h.name === 'Ações rápidas' ? 'pl-2 pr-3' : 'px-2')}>
                    {h.name} <ChevronDown className="inline-block w-3 h-3 ml-0.5 opacity-30" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {currentSystems.map((sys) => (
                <tr key={sys.id} className="group hover:bg-brand-50/20 transition-all h-[74px]">
                  <td className="px-2 py-3.5">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-border text-brand focus:ring-brand transition-all cursor-pointer" />
                  </td>
                  <td className="px-2 py-3.5 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white/20", sys.iconColor)}>
                        <span className="text-white font-black text-sm">{sys.icon}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block max-w-full truncate font-black text-slate-950 text-[13.5px] 2xl:text-[14px] leading-tight">
                          {sys.name}
                        </span>
                        <p className="text-[11px] 2xl:text-[11.5px] font-bold text-brand/80 truncate tracking-tight mt-0.5">{sys.desc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3.5 min-w-0 overflow-hidden">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9.5px] font-black border transition-all h-7 shadow-sm",
                      sys.status === 'Operacional' ? "bg-green-50/60 border-green-100 text-green-700" : 
                      sys.status === 'Atenção' ? "bg-amber-50/60 border-amber-100 text-amber-700" : 
                      sys.status === 'Instável' ? "bg-red-50/60 border-red-100 text-red-700" : "bg-slate-50/60 border-slate-200 text-slate-400"
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full shrink-0 animate-pulse", 
                        sys.status === 'Operacional' ? "bg-green-500" : 
                        sys.status === 'Atenção' ? "bg-amber-500" : 
                        sys.status === 'Instável' ? "bg-red-500" : "bg-slate-400"
                      )} />
                      {sys.status}
                    </div>
                  </td>
                  <td className="px-2 py-3.5 min-w-0 overflow-hidden">
                    <div className={cn(
                      "px-2.5 py-1 rounded-md text-[9.5px] font-black uppercase tracking-tight inline-block border",
                      sys.env === 'Produção' ? "bg-green-50/60 text-green-700 border-green-100/30" : "bg-blue-50/60 text-blue-600 border-blue-100/30"
                    )}>
                      {sys.env}
                    </div>
                  </td>
                  <td className="px-2 py-3.5 min-w-0 overflow-hidden">
                    <p className="text-[13px] 2xl:text-[13.5px] font-black text-slate-950 leading-tight truncate">{sys.gateway}</p>
                  </td>
                  <td className="px-2 py-3.5 min-w-0 overflow-hidden">
                    <p className="text-[13px] 2xl:text-[13.5px] font-black text-slate-950 leading-tight truncate">{sys.checkout}</p>
                  </td>
                  <td className="px-2 py-3.5 min-w-0 overflow-hidden whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", 
                        sys.status === 'Operacional' ? "bg-green-500" : 
                        sys.status === 'Atenção' ? "bg-amber-500" : 
                        sys.status === 'Instável' ? "bg-red-500" : "bg-slate-400"
                      )} />
                      <div className="space-y-0.5">
                        <p className="text-[12.5px] font-black text-slate-950 leading-none">{sys.last}</p>
                        <p className="text-[10.5px] font-bold text-slate-400 leading-none">{sys.time}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3.5 min-w-0 overflow-hidden whitespace-nowrap">
                    <div className="space-y-0.5">
                      <p className={cn("text-[13px] 2xl:text-[13.5px] font-black leading-none", 
                        parseInt(sys.uptime) > 98 ? "text-green-600" : sys.status === 'Desconectado' ? "text-slate-300" : "text-red-500"
                      )}>
                        {sys.uptime}
                      </p>
                      <p className="text-[10.5px] font-bold text-slate-400 tracking-tight">{sys.reqs}</p>
                    </div>
                  </td>
                  <td className="pl-2 pr-3 py-3.5 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-1">
                      <button className="h-[34px] px-3 border border-[#E8DDFD] bg-white/80 hover:bg-slate-50 hover:border-brand/40 transition-all rounded-xl text-[10.5px] font-black text-slate-950 shrink-0">
                        Detalhe
                      </button>
                      <button className="h-[34px] px-3 border border-[#E8DDFD] bg-white/80 hover:bg-slate-50 hover:border-brand/40 transition-all rounded-xl text-[10.5px] font-black text-slate-950 shrink-0">
                        {sys.name === 'Internal API' ? 'Sinc' : 'Testar'}
                      </button>
                      <button className="w-[34px] h-[34px] flex items-center justify-center border border-[#E8DDFD] bg-white/80 hover:bg-slate-50 hover:border-brand/40 transition-all rounded-xl text-slate-400 hover:text-brand shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer - Elegant, Compact and Unified */}
        <div className="flex h-[60px] items-center justify-between border-t border-[#E8DDFD] px-5 bg-white/40 shadow-sm shrink-0">
          <p className="text-[12.5px] font-bold text-slate-600">
            Mostrando <span className="font-black text-slate-950">{startIndex + 1}</span> a <span className="font-black text-slate-950">{endIndex}</span> de <span className="font-black text-slate-950">{totalItems}</span> resultados
          </p>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E8DDFD] text-slate-400 hover:bg-brand-soft/20 hover:text-brand transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {[1, 2].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black shadow-sm transition-all",
                  currentPage === page 
                    ? "bg-brand text-white" 
                    : "border border-[#E8DDFD] text-slate-500 hover:bg-brand-soft/20 hover:text-brand"
                )}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E8DDFD] text-slate-400 hover:bg-brand-soft/20 hover:text-brand transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
              Itens por página
            </span>

            <button className="flex h-9 items-center gap-2 rounded-xl border border-[#E8DDFD] bg-white/80 px-3 text-xs font-bold text-slate-900">
              5
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
