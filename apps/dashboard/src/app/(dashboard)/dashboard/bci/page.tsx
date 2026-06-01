'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { apiFetch } from '@/lib/api';
import { PageLayout } from '@/components/layout/PageLayout';
import { 
  BrainCircuit, 
  Sparkles, 
  Settings2, 
  Plus, 
  Info, 
  TrendingUp, 
  ChevronRight,
  Zap,
  Flame,
  CheckCircle2,
  Trophy,
  RefreshCw,
  Layers,
  ClipboardList,
  Download,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

type BciTabValue = 'friction' | 'performance' | 'activity';

export default function BciPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<BciTabValue>('friction');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters State
  const [filterPeriod, setFilterPeriod] = useState('7d');
  const [filterSystem, setFilterSystem] = useState('Todos');
  const [filterCheckout, setFilterCheckout] = useState('Todos');
  const [filterMethod, setFilterMethod] = useState('Todos');

  // Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('excel');
  const [exportSections, setExportSections] = useState<string[]>(['friction', 'performance', 'activity']);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRunAnalysis = () => {
    setLoading(true);
    triggerToast("Iniciando varredura preditiva auxiliada pela IA da Basileia...");
    setTimeout(() => {
      setLoading(false);
      triggerToast("Análise de checkout concluída! Score geral recalculado: 84/100 (Bom).");
    }, 1500);
  };  const handleConfirmExport = async () => {
    setShowExportModal(false);
    triggerToast(`Preparando exportação em formato ${exportFormat.toUpperCase()}...`);

    try {
      setLoading(true);
      // Fetch real data to avoid "ghost data"
      const res = await apiFetch('/api/v1/dashboard/bci/export');
      const realData: any = res.success && res.data ? res.data : {
        friction: [],
        performance: [],
        activity: []
      };

      if (exportFormat === 'pdf') {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.setTextColor(109, 40, 217); // brand color
        doc.text('Basileia Pay - Relatório BCI', 14, 22);
        
        doc.setFontSize(10);
        doc.setTextColor(124, 58, 237);
        doc.text('Business Intelligence & Otimização do Checkout', 14, 30);
        
        doc.setFontSize(9);
        doc.setTextColor(88, 28, 135);
        doc.text(`Período: ${filterPeriod}`, 14, 40);
        doc.text(`Data de Geração: ${new Date().toLocaleString()}`, 14, 45);
        doc.text(`Filtro de Sistema: ${filterSystem}`, 100, 40);
        doc.text(`Filtro de Checkout: ${filterCheckout}`, 100, 45);

        let startY = 55;

        if (exportSections.includes('friction')) {
          doc.setFontSize(12);
          doc.text('Fricções Detectadas pela IA', 14, startY);
          autoTable(doc, {
            startY: startY + 5,
            head: [['Ponto de Fricção', 'Fase', 'Severidade', 'Impacto Estimado']],
            body: realData.friction.length > 0 ? realData.friction.map((f: any) => [f.title, f.stage, f.severity, f.impact]) : [['Nenhum dado encontrado', '-', '-', '-']],
            theme: 'grid',
            headStyles: { fillColor: [250, 245, 255], textColor: [88, 28, 135] },
            styles: { fontSize: 8 }
          });
          startY = (doc as any).lastAutoTable.finalY + 15;
        }

        if (exportSections.includes('performance')) {
          doc.setFontSize(12);
          doc.text('Histórico e Comparativo de Versões', 14, startY);
          autoTable(doc, {
            startY: startY + 5,
            head: [['Versão', 'Status', 'Conversão', 'Tempo Médio', 'Score BCI', 'Receita Mensal']],
            body: realData.performance.length > 0 ? realData.performance.map((p: any) => [p.version, p.status, p.conversion, p.time, p.score, p.revenue]) : [['Nenhum dado encontrado', '-', '-', '-', '-', '-']],
            theme: 'grid',
            headStyles: { fillColor: [250, 245, 255], textColor: [88, 28, 135] },
            styles: { fontSize: 8 }
          });
          startY = (doc as any).lastAutoTable.finalY + 15;
        }

        if (exportSections.includes('activity')) {
          doc.setFontSize(12);
          doc.text('Benchmarks e Auditoria', 14, startY);
          autoTable(doc, {
            startY: startY + 5,
            head: [['Checkout', 'Score', 'Conversão', 'Posição']],
            body: realData.activity.length > 0 ? realData.activity.map((a: any) => [a.name, a.score, a.conversion, a.position]) : [['Nenhum dado encontrado', '-', '-', '-']],
            theme: 'grid',
            headStyles: { fillColor: [250, 245, 255], textColor: [88, 28, 135] },
            styles: { fontSize: 8 }
          });
        }

        doc.save(`relatorio_bci_${filterPeriod}_${Date.now()}.pdf`);
        triggerToast("Download do PDF concluído com sucesso!");
      } else {
        // Generate CSV or Excel (XLS)
        let fileContent = '\ufeff'; // UTF-8 BOM
        fileContent += "RELATÓRIO OPERACIONAL BCI - BASILEIA PAY\r\n";
        fileContent += `Data de Geração:;${new Date().toLocaleString()}\r\n`;
        fileContent += `Período:;${filterPeriod}\r\n`;
        fileContent += `Sistema:;${filterSystem}\r\n`;
        fileContent += `Checkout:;${filterCheckout}\r\n`;
        fileContent += `Método:;${filterMethod}\r\n\r\n`;

        if (exportSections.includes('friction')) {
          fileContent += "SEÇÃO: FRICÇÕES E RECOMENDAÇÕES DA IA\r\n";
          fileContent += "Item de Fricção;Fase;Severidade;Impacto Estimado\r\n";
          if (realData.friction.length > 0) {
            realData.friction.forEach((f: any) => {
              fileContent += `${f.title};${f.stage};${f.severity};${f.impact}\r\n`;
            });
          } else {
            fileContent += "Nenhum dado encontrado;-;-;-\r\n";
          }
          fileContent += "\r\n";
        }

        if (exportSections.includes('performance')) {
          fileContent += "SEÇÃO: DESEMPENHO A/B E HISTÓRICO\r\n";
          fileContent += "Versão;Status;Conversão;Tempo Médio;Score BCI;Receita Mensal\r\n";
          if (realData.performance.length > 0) {
            realData.performance.forEach((p: any) => {
              fileContent += `${p.version};${p.status};${p.conversion};${p.time};${p.score};${p.revenue}\r\n`;
            });
          } else {
            fileContent += "Nenhum dado encontrado;-;-;-;-;-\r\n";
          }
          fileContent += "\r\n";
        }

        if (exportSections.includes('activity')) {
          fileContent += "SEÇÃO: AUDITORIA E BENCHMARKS\r\n";
          fileContent += "Nome do Checkout;Score;Conversão;Posição\r\n";
          if (realData.activity.length > 0) {
            realData.activity.forEach((a: any) => {
              fileContent += `${a.name};${a.score};${a.conversion};${a.position}\r\n`;
            });
          } else {
            fileContent += "Nenhum dado encontrado;-;-;-\r\n";
          }
        }

        const mimeType = exportFormat === 'csv' ? 'text/csv;charset=utf-8;' : 'application/vnd.ms-excel;charset=utf-8;';
        const blob = new Blob([fileContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `relatorio_bci_${filterPeriod}_${Date.now()}.${exportFormat === 'csv' ? 'csv' : 'xls'}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        triggerToast(`Download do ${exportFormat.toUpperCase()} concluído com sucesso!`);
      }
    } catch (error) {
      console.error('Export error', error);
      triggerToast('Erro ao exportar dados da API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="BCI">
      
      {/* Toast alert indicator */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-60 bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-2 max-w-sm animate-in slide-in-from-bottom-2 duration-300">
          <span className="w-2 h-2 bg-brand rounded-full shrink-0 animate-ping" />
          <span className="text-[11px] font-black text-left">{toastMessage}</span>
        </div>
      )}

      {/* Header section - Clean & Compact */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DDFD]/60 pb-3 text-left">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-[18px] 2xl:text-[20px] font-black tracking-tight text-slate-950">
              BCI
            </h1>
            <div className="w-4 h-4 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-200">
              <Info className="w-2.5 h-2.5" />
            </div>
          </div>
          <p className="text-slate-455 font-semibold text-[11px] 2xl:text-[11.5px] tracking-tight mt-0.5">
            Centro de inteligência do checkout com análise preditiva e otimização assistida por IA.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setShowExportModal(true)}
            className="h-8 px-3.5 bg-white border border-[#E8DDFD]/90 text-slate-700 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Exportar relatório
          </button>

          <button 
            onClick={() => triggerToast("Abrindo portal de configurações do modelo BCI...")}
            className="h-8 px-3.5 bg-white border border-[#E8DDFD]/90 text-slate-700 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Settings2 className="w-3.5 h-3.5 text-slate-500" />
            Configurar modelo
          </button>
          
          <button 
            onClick={handleRunAnalysis}
            disabled={loading}
            className="h-8 px-3.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm shadow-brand/10 transition-all disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            Nova análise
          </button>
        </div>
      </div>

      {/* Advanced Filters Bar */}
      <div className="bg-white border border-[#E8DDFD] p-3.5 rounded-2xl shadow-sm grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
        <div className="flex flex-col min-w-0">
          <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1 block leading-none">Período</span>
          <div className="relative">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="appearance-none w-full bg-[#FAF8FF] border border-[#E8DDFD] rounded-xl pl-3 pr-8 py-1.5 text-xs font-black text-slate-700 focus:outline-none focus:border-brand cursor-pointer h-[34px]"
            >
              <option value="Hoje">Hoje</option>
              <option value="Ontem">Ontem</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1 block leading-none">Sistema</span>
          <div className="relative">
            <select
              value={filterSystem}
              onChange={(e) => setFilterSystem(e.target.value)}
              className="appearance-none w-full bg-[#FAF8FF] border border-[#E8DDFD] rounded-xl pl-3 pr-8 py-1.5 text-xs font-black text-slate-700 focus:outline-none focus:border-brand cursor-pointer h-[34px]"
            >
              <option value="Todos">Todos os Sistemas</option>
              <option value="E-commerce">E-commerce Central</option>
              <option value="ERP">ERP Conectado</option>
              <option value="CRM">CRM Vendas</option>
              <option value="Plataforma EAD">Plataforma EAD</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1 block leading-none">Checkout</span>
          <div className="relative">
            <select
              value={filterCheckout}
              onChange={(e) => setFilterCheckout(e.target.value)}
              className="appearance-none w-full bg-[#FAF8FF] border border-[#E8DDFD] rounded-xl pl-3 pr-8 py-1.5 text-xs font-black text-slate-700 focus:outline-none focus:border-brand cursor-pointer h-[34px]"
            >
              <option value="Todos">Todos os Checkouts</option>
              <option value="Basileia Checkout Pro">Basileia Checkout Pro</option>
              <option value="Mercado Pago Checkout">Mercado Pago Checkout</option>
              <option value="Checkout Básico">Checkout Básico</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1 block leading-none">Método</span>
          <div className="relative">
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="appearance-none w-full bg-[#FAF8FF] border border-[#E8DDFD] rounded-xl pl-3 pr-8 py-1.5 text-xs font-black text-slate-700 focus:outline-none focus:border-brand cursor-pointer h-[34px]"
            >
              <option value="Todos">Todos os Métodos</option>
              <option value="PIX">PIX</option>
              <option value="Cartão">Cartão de Crédito</option>
              <option value="Boleto">Boleto Bancário</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid Superior de Diagnósticos */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        
        {/* Card 1: Score do checkout */}
        <div className="bg-white border border-[#E8DDFD]/65 rounded-[20px] p-4 flex flex-col justify-between shadow-sm relative overflow-hidden h-[132px]">
          <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider leading-none">
            Score do checkout
          </span>

          <div className="flex items-center justify-between mt-1">
            {/* SVG Circular Gauge */}
            <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  className="stroke-slate-100"
                  strokeWidth="5.5"
                  fill="transparent"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  className="stroke-brand"
                  strokeWidth="5.5"
                  fill="transparent"
                  strokeDasharray={188}
                  strokeDashoffset={188 - (188 * 84) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-[19px] font-black text-slate-850 leading-none">84</span>
                <span className="text-[8px] text-slate-400 font-bold leading-none mt-0.5">/100</span>
              </div>
            </div>

            <div className="space-y-1 pr-1 text-right md:text-left">
              <h4 className="text-xs font-black text-slate-800 leading-none">Bom</h4>
              <div className="inline-flex items-center gap-0.5 text-[8.5px] font-black text-emerald-650 bg-emerald-50 border border-emerald-100/50 px-1 py-0.2 rounded">
                <span>▲ 6 pts vs ant.</span>
              </div>
              <span className="text-[8px] font-black text-brand bg-brand-soft/20 border border-brand/20 px-1.5 py-0.2 rounded uppercase tracking-wider block text-center leading-none">
                Alta confiança
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Diagnóstico de confiança */}
        <div className="bg-white border border-[#E8DDFD]/65 rounded-[20px] p-4 flex flex-col justify-between shadow-sm h-[132px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider leading-none">
                Confiança da IA
              </span>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-1.5 py-0.2 rounded leading-none">
                87%
              </span>
            </div>

            <h4 className="text-xs font-black text-slate-850 mt-3 leading-none">Confiável</h4>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '87%' }} />
            </div>

            <div className="flex justify-between mt-3 text-[9px] font-bold text-slate-450">
              <span>Sinais: <span className="font-extrabold text-emerald-600">14 (+)</span></span>
              <span>Alertas: <span className="font-extrabold text-amber-500">2 (▲)</span></span>
            </div>
          </div>
        </div>

        {/* Card 3: Impacto estimado */}
        <div className="bg-white border border-[#E8DDFD]/65 rounded-[20px] p-4 flex flex-col justify-between shadow-sm h-[132px]">
          <div>
            <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider leading-none">
              Impacto de Conversão
            </span>

            <h4 className="text-sm font-black text-brand mt-3 leading-none">
              +8,4% estimado
            </h4>
            <p className="text-[9px] text-slate-400 font-bold mt-1 leading-none">
              Ganho potencial em receita
            </p>

            <div className="mt-2.5 text-[10px] font-black text-slate-800 bg-violet-50/20 border border-violet-100/40 p-1 px-2 rounded-lg flex items-center justify-between">
              <span className="text-[8px] font-bold text-slate-450 uppercase leading-none">Projeção</span>
              <span className="leading-none">R$ 128.940</span>
            </div>
          </div>
        </div>

        {/* Card 4: Risco operacional */}
        <div className="bg-white border border-[#E8DDFD]/65 rounded-[20px] p-4 flex flex-col justify-between shadow-sm h-[132px]">
          <div>
            <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider leading-none">
              Risco Operacional
            </span>

            <h4 className="text-xs font-black text-amber-550 mt-3 leading-none">
              Médio
            </h4>
            <p className="text-[9px] text-slate-400 font-bold mt-1 leading-none">
              Atenção em 3 fricções
            </p>

            <div className="mt-2.5 text-[10px] font-black text-red-650 bg-red-50/30 border border-red-100 p-1 px-2 rounded-lg flex items-center justify-between">
              <span className="text-[8px] font-bold uppercase leading-none">Fricções Críticas</span>
              <span className="bg-red-100 px-1.5 py-0.2 rounded text-[9px] leading-none">3</span>
            </div>
          </div>
        </div>

      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-[#E8DDFD]/50 pb-0.5 mt-2 text-left">
        <button
          onClick={() => setActiveTab('friction')}
          className={cn(
            "pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 cursor-pointer",
            activeTab === 'friction' 
              ? "border-brand text-brand" 
              : "border-transparent text-slate-400 hover:text-slate-700"
          )}
        >
          <Flame className="w-3.5 h-3.5" />
          Fricções & Otimização
        </button>
        
        <button
          onClick={() => setActiveTab('performance')}
          className={cn(
            "pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 cursor-pointer",
            activeTab === 'performance' 
              ? "border-brand text-brand" 
              : "border-transparent text-slate-400 hover:text-slate-700"
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          Desempenho A/B & Histórico
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={cn(
            "pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 cursor-pointer",
            activeTab === 'activity' 
              ? "border-brand text-brand" 
              : "border-transparent text-slate-400 hover:text-slate-700"
          )}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          Auditoria & Benchmarks
        </button>
      </div>

      {/* Split layout: Left Tab Content (75%), Right detailed sidepanel (25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        
        {/* Left Column (col-span-3) - Spaced for larger reading, fitting screen */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: FRICÇÃO & OTIMIZAÇÃO (Side-by-side grids) */}
          {activeTab === 'friction' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
              
              {/* Pontos de Fricção */}
              <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-4 text-left h-full">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Pontos de fricção
                  </h3>
                  <span className="text-[9px] font-black uppercase text-slate-450 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">Top 5 Alertas</span>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                  {[
                    { id: 1, title: 'Campos excessivos na identif.', stage: 'Identif.', sev: 'Crítica', color: 'red', imp: '-3,2%' },
                    { id: 2, title: 'PIX com baixa clareza na etapa', stage: 'Pagam.', sev: 'Alta', color: 'amber', imp: '-2,1%' },
                    { id: 3, title: 'CTA secundário competindo', stage: 'Revisão', sev: 'Média', color: 'slate', imp: '-1,4%' },
                    { id: 4, title: 'Latência alta no mobile', stage: 'Identif.', sev: 'Alta', color: 'amber', imp: '-1,1%' },
                    { id: 5, title: 'Falta de prova social no resumo', stage: 'Revisão', sev: 'Média', color: 'slate', imp: '-0,6%' }
                  ].map((fric) => (
                    <div key={fric.id} className="p-3 border border-slate-100/70 hover:bg-slate-50/50 rounded-xl flex items-center justify-between gap-3 text-left transition-colors">
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-slate-800 truncate">{fric.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-[9px] font-bold text-slate-400">
                          <span className="text-brand font-extrabold bg-brand-soft/20 border border-brand/10 px-1.5 py-0.2 rounded-md">{fric.stage}</span>
                          <span>Impacto: <span className="text-red-500 font-extrabold">{fric.imp}</span></span>
                        </div>
                      </div>

                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase border shrink-0",
                        fric.color === 'red' ? "bg-red-50 border-red-100 text-red-650" :
                        fric.color === 'amber' ? "bg-amber-50 border-amber-100 text-amber-650" :
                        "bg-slate-50 border-slate-200 text-slate-600"
                      )}>
                        {fric.sev}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recomendações da IA */}
              <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-4 text-left h-full">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Recomendações da IA
                  </h3>
                  <span className="text-[9px] font-black uppercase text-slate-450 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">Ações Sugeridas</span>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                  {[
                    { id: 1, title: 'Simplificar etapa de identif.', desc: 'Reduzir campos para os essenciais', tag: 'Crítica', color: 'red', gain: '+3,1%' },
                    { id: 2, title: 'Reforçar prova social no checkout', desc: 'Adicionar selos e avaliações', tag: 'Alta', color: 'amber', gain: '+1,8%' },
                    { id: 3, title: 'Revisar contraste do CTA principal', desc: 'Aumentar visibilidade do botão', tag: 'Alta', color: 'amber', gain: '+1,3%' },
                    { id: 4, title: 'Reduzir ruído visual no resumo', desc: 'Esconder detalhes irrelevantes', tag: 'Média', color: 'slate', gain: '+0,9%' },
                    { id: 5, title: 'Otimizar performance mobile', desc: 'Melhorar carregamento de assets', tag: 'Média', color: 'slate', gain: '+0,7%' }
                  ].map((rec) => (
                    <div key={rec.id} className="p-3 border border-slate-100/70 hover:bg-slate-50/50 rounded-xl flex items-center justify-between gap-3 text-left transition-colors">
                      <div className="min-w-0">
                        <p className="text-[11.5px] font-black text-slate-800 truncate">{rec.title}</p>
                        <p className="text-[9px] font-bold text-slate-400 truncate mt-0.5">{rec.desc}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-black text-emerald-650 block">{rec.gain}</span>
                        <span className={cn(
                          "inline-block mt-1 px-1.5 py-0.2 rounded text-[7.5px] font-black uppercase border",
                          rec.color === 'red' ? "bg-red-50 border-red-100 text-red-650" :
                          rec.color === 'amber' ? "bg-amber-50 border-amber-100 text-amber-650" :
                          "bg-slate-50 border-slate-200 text-slate-600"
                        )}>
                          {rec.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ANÁLISE A/B & HISTÓRICO */}
          {activeTab === 'performance' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Comparativo de Versões */}
              <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm text-left">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2.5 mb-3.5">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Comparativo de Versões do Checkout
                  </h3>
                  <span className="bg-violet-50 text-brand border border-brand/20 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-brand" />
                    Melhor Performance
                  </span>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-xs font-semibold text-slate-600">
                    <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                      <tr>
                        <th className="px-4 py-2 text-left">Versão</th>
                        <th className="px-4 py-2 text-center">Status</th>
                        <th className="px-4 py-2 text-center">Conversão</th>
                        <th className="px-4 py-2 text-center">Tempo Pag.</th>
                        <th className="px-4 py-2 text-center">Abandono Ident.</th>
                        <th className="px-4 py-2 text-center">Score BCI</th>
                        <th className="px-4 py-2 text-center">Receita/mês</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-extrabold text-slate-850 text-sm">v2.5.0</td>
                        <td className="px-4 py-3 text-center">
                          <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase">Atual</span>
                        </td>
                        <td className="px-4 py-3 text-center font-black text-slate-850 text-sm">18,42%</td>
                        <td className="px-4 py-3 text-center text-slate-450 font-bold">6m 12s</td>
                        <td className="px-4 py-3 text-center text-slate-450 font-bold">32,14%</td>
                        <td className="px-4 py-3 text-center font-black text-brand text-sm">84/100</td>
                        <td className="px-4 py-3 text-center font-black text-slate-850 text-sm">R$ 128.940</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 text-slate-450">
                        <td className="px-4 py-3 font-bold">v2.4.1</td>
                        <td className="px-4 py-3 text-center">
                          <span className="bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase">Anterior</span>
                        </td>
                        <td className="px-4 py-3 text-center font-bold">16,98%</td>
                        <td className="px-4 py-3 text-center">7m 03s</td>
                        <td className="px-4 py-3 text-center">36,81%</td>
                        <td className="px-4 py-3 text-center font-bold">76/100</td>
                        <td className="px-4 py-3 text-center">R$ 104.310</td>
                      </tr>
                      <tr className="bg-emerald-50/20 font-black text-[10px] text-emerald-650">
                        <td className="px-4 py-2.5" colSpan={2}>Delta (v2.5.0 vs v2.4.1)</td>
                        <td className="px-4 py-2.5 text-center">+1,44 pp</td>
                        <td className="px-4 py-2.5 text-center">-51s</td>
                        <td className="px-4 py-2.5 text-center">-4,67 pp</td>
                        <td className="px-4 py-2.5 text-center">+8 pts</td>
                        <td className="px-4 py-2.5 text-center">+$ 24.630</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Chart Line */}
              <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm text-left">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2 mb-3.5">
                  Score e conversão ao longo do tempo
                </h3>
                
                <div className="relative w-full h-[180px] bg-slate-50/30 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                  <div className="absolute left-10 top-3 bottom-8 right-12">
                    <div className="absolute top-[50%] w-full h-[1px] bg-slate-100" />
                    <div className="absolute bottom-0 w-full h-[1px] bg-slate-200" />
                    <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                      <path
                        d="M 10 110 L 90 108 L 170 98 L 250 92 L 330 88 L 410 82 L 490 80"
                        fill="none"
                        stroke="#7C3AED"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 10 135 L 90 120 L 170 125 L 250 110 L 330 105 L 410 95 L 490 92"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <circle cx="490" cy="80" r="5" fill="#7C3AED" />
                      <circle cx="490" cy="92" r="5" fill="#10B981" />
                    </svg>
                  </div>
                  <div className="absolute left-2 top-3 bottom-8 flex flex-col justify-between text-[8px] font-black text-slate-400">
                    <span>100</span>
                    <span>50</span>
                    <span>0</span>
                  </div>
                  <div className="w-full pl-10 pr-12 flex justify-between text-[9px] font-black text-slate-450 mt-auto pt-1 border-t border-slate-100">
                    <span>10/05</span>
                    <span>12/05</span>
                    <span>14/05</span>
                    <span>16/05</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: AUDITORIA & BENCHMARKS */}
          {activeTab === 'activity' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
              
              {/* Eventos e achados recentes */}
              <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-4 text-left h-full">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Eventos recentes
                  </h3>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                  {[
                    { title: 'Análise automática concluída', tag: 'v2.5.0', res: 'Score 84/100', color: 'slate', time: '16/05 10:31' },
                    { title: 'Sinal de fricção identificado', tag: 'v2.5.0', res: 'Crítico', color: 'red', time: '16/05 09:47' },
                    { title: 'Recomendação gerada', tag: 'v2.5.0', res: 'Alta prioridade', color: 'amber', time: '16/05 09:32' },
                    { title: 'Experimento concluído', tag: 'v2.4.1', res: 'Vencedor', color: 'emerald', time: '15/05 17:21' },
                    { title: 'Análise comparativa executada', tag: 'Delta', res: 'Delta positivo', color: 'blue', time: '15/05 16:08' }
                  ].map((evt, i) => (
                    <div key={i} className="p-3 border border-slate-100/70 hover:bg-slate-50/50 rounded-xl flex items-center justify-between gap-3 text-left transition-colors">
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-slate-800 truncate">{evt.title}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[9px] font-bold text-slate-400">
                          <span className="font-extrabold text-slate-500 bg-slate-50 px-1.5 py-0.2 rounded-md">{evt.tag}</span>
                          <span>•</span>
                          <span>{evt.time}</span>
                        </div>
                      </div>

                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase border shrink-0",
                        evt.color === 'red' ? "bg-red-50 border-red-100 text-red-650" :
                        evt.color === 'amber' ? "bg-amber-50 border-amber-100 text-amber-650" :
                        evt.color === 'emerald' ? "bg-emerald-50 border-emerald-100 text-emerald-650" :
                        evt.color === 'blue' ? "bg-blue-50 border-blue-100 text-blue-700" :
                        "bg-slate-50 border-slate-200 text-slate-700"
                      )}>
                        {evt.res}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benchmarks internos */}
              <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-4 text-left h-full">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Benchmarks Internos
                  </h3>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                  {[
                    { name: 'Basileia Checkout Pro', score: '88', conv: '19,21%', pos: '1º 👑', color: 'brand' },
                    { name: 'Mercado Pago Checkout', score: '84', conv: '18,42%', pos: '2º', color: 'slate' },
                    { name: 'Loja Experiência', score: '79', conv: '16,02%', pos: '3º', color: 'slate' },
                    { name: 'Checkout Básico', score: '65', conv: '13,47%', pos: '4º', color: 'slate' },
                    { name: 'Checkout Legacy', score: '51', conv: '9,01%', pos: '5º', color: 'slate' }
                  ].map((bench, i) => (
                    <div key={i} className={cn(
                      "p-3 border rounded-xl flex items-center justify-between gap-3 text-left transition-colors",
                      bench.color === 'brand' ? "bg-brand-soft/10 border-brand/20 text-brand" : "border-slate-100/70 hover:bg-slate-50/50"
                    )}>
                      <div className="min-w-0">
                        <p className={cn(
                          "text-[11.5px] font-black truncate",
                          bench.color === 'brand' ? "text-brand" : "text-slate-800"
                        )}>{bench.name}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[9px] font-bold text-slate-450">
                          <span>Conversão: <span className="font-extrabold">{bench.conv}</span></span>
                          <span>•</span>
                          <span>Score: <span className="font-extrabold">{bench.score}</span></span>
                        </div>
                      </div>

                      <span className={cn(
                        "text-[10px] font-black uppercase shrink-0 px-2.5 py-0.5 rounded-lg",
                        bench.color === 'brand' ? "text-brand bg-brand-soft/20" : "text-slate-500 bg-slate-50"
                      )}>
                        {bench.pos}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Column (col-span-1) - Combined ultra-compact Confidence & Impact card */}
        <div className="h-full">
          
          {/* Unified Confidence & Impact Card */}
          <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-4.5 shadow-sm flex flex-col justify-between h-full text-left">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2 mb-3">
                Mapa de confiança
              </h3>

              <div className="space-y-3.5">
                {[
                  { name: 'Identificação', val: '78/100', pct: 78 },
                  { name: 'Entrega', val: '86/100', pct: 86 },
                  { name: 'Pagamento', val: '82/100', pct: 82 },
                  { name: 'Revisão', val: '89/100', pct: 89 }
                ].map((map, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10.5px] font-bold text-slate-600 leading-none">
                      <span>{map.name}</span>
                      <span className="font-extrabold text-slate-850">{map.val}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand h-full rounded-full" style={{ width: `${map.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impacto Estimado Section - Integrated directly */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2.5">
                Impacto Estimado
              </h4>
              
              <div className="grid grid-cols-2 gap-2 text-[10.5px] font-bold text-slate-500">
                <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100/50 text-left">
                  <span className="text-[8.5px] font-black text-slate-400 block uppercase">Conversão</span>
                  <span className="text-emerald-650 font-extrabold text-xs">+8,4%</span>
                </div>
                <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100/50 text-left">
                  <span className="text-[8.5px] font-black text-slate-400 block uppercase">Recuperados</span>
                  <span className="text-slate-855 font-extrabold text-xs">1.287/mês</span>
                </div>
                <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-100/50 text-left col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-[8.5px] font-black text-slate-400 uppercase">Receita mensal</span>
                    <span className="text-slate-855 font-black block text-xs">R$ 128.940</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase">Tempo impl.</span>
                    <span className="text-brand font-extrabold block text-[10.5px]">7-14 dias</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom General Score Row */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black text-slate-855 mt-4">
              <span>Score geral</span>
              <span className="text-brand font-black text-sm bg-brand-soft/20 px-3 py-0.5 rounded-lg border border-brand/20 shadow-sm shadow-brand/5">
                84/100
              </span>
            </div>
          </div>

        </div>

      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8DDFD] shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center gap-3 text-brand border-b border-slate-100 pb-3 mb-4">
              <Download className="w-5 h-5 shrink-0" />
              <h3 className="text-slate-950 font-black text-sm">Exportar Relatório BCI</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-[#FAF8FF] border border-[#E8DDFD]/60 p-3.5 rounded-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none">Filtros aplicados</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] font-bold text-slate-700">
                  <div><span className="text-slate-400 font-medium">Período:</span> {filterPeriod === '7d' ? 'Últimos 7 dias' : filterPeriod === '30d' ? 'Últimos 30 dias' : filterPeriod}</div>
                  <div><span className="text-slate-400 font-medium">Sistema:</span> {filterSystem}</div>
                  <div><span className="text-slate-400 font-medium">Checkout:</span> {filterCheckout}</div>
                  <div><span className="text-slate-400 font-medium">Método:</span> {filterMethod}</div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Formato de exportação</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'csv', label: 'CSV', desc: 'Dados brutos' },
                    { id: 'excel', label: 'Excel', desc: 'Planilha formatada' },
                    { id: 'pdf', label: 'PDF', desc: 'Documento impresso' }
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => setExportFormat(fmt.id as 'csv' | 'excel' | 'pdf')}
                      className={cn(
                        "p-2.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer",
                        exportFormat === fmt.id 
                          ? "bg-brand/10 border-brand/40 text-brand"
                          : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
                      )}
                    >
                      <span className="font-black leading-none">{fmt.label}</span>
                      <span className="text-[8px] font-medium text-slate-400 leading-none">{fmt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Seções para incluir</label>
                <div className="space-y-2">
                  {[
                    { id: 'friction', label: 'Fricções & Recomendações da IA' },
                    { id: 'performance', label: 'Desempenho A/B & Histórico de Versões' },
                    { id: 'activity', label: 'Auditoria, Benchmarks & Eventos' }
                  ].map((sec) => {
                    const isChecked = exportSections.includes(sec.id);
                    return (
                      <label key={sec.id} className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setExportSections([...exportSections, sec.id]);
                            } else {
                              setExportSections(exportSections.filter(s => s !== sec.id));
                            }
                          }}
                          className="rounded border-border text-brand focus:ring-brand cursor-pointer w-4 h-4"
                        />
                        {sec.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-1.5 border border-[#E8DDFD] hover:bg-slate-50 transition-all rounded-xl text-[10.5px] font-black text-slate-700 uppercase tracking-tight h-[32px] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmExport}
                className="px-4 py-1.5 bg-brand text-white hover:bg-brand-deep transition-all rounded-xl text-[10.5px] font-black uppercase tracking-tight h-[32px] cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Confirmar e Baixar
              </button>
            </div>
          </div>
        </div>
      )}

    </PageLayout>
  );
}
