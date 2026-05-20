// Basileia Checkout Templates
import type { Scene } from './types';
import { genId } from './sceneReducer';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'pix' | 'card' | 'subscription' | 'event' | 'donation';
  preview: string;
  scene: Scene;
}

function createBaseScene(): Omit<Scene, 'rootId' | 'nodes'> {
  return {};
}

export const TEMPLATES: Template[] = [
  {
    id: 'tpl_pix_premium',
    name: 'Pix Premium Dark',
    description: 'Checkout escuro com foco em Pix, ideal para produtos digitais',
    category: 'pix',
    preview: 'dark-pix',
    scene: buildPixPremiumTemplate(),
  },
  {
    id: 'tpl_card_minimal',
    name: 'Cartao Minimal',
    description: 'Checkout limpo focado em cartao de credito',
    category: 'card',
    preview: 'minimal-card',
    scene: buildCardMinimalTemplate(),
  },
  {
    id: 'tpl_subscription',
    name: 'Assinatura Recorrente',
    description: 'Checkout para assinaturas com Pix automatico',
    category: 'subscription',
    preview: 'subscription',
    scene: buildSubscriptionTemplate(),
  },
];

function buildPixPremiumTemplate(): Scene {
  const page = genId('page');
  const hero = genId('s');
  const payment = genId('s');
  const trust = genId('s');
  const badge = genId('e');
  const heading = genId('e');
  const subtext = genId('e');
  const timer = genId('e');
  const summary = genId('e');
  const pixBlock = genId('e');
  const trustBadge1 = genId('e');
  const trustBadge2 = genId('e');
  const footer = genId('e');
  return {
    rootId: page,
    nodes: {
      [page]: { id: page, kind: 'page', name: 'Pix Premium', children: [hero, payment, trust], props: { width: { base: '100%' }, display: { base: 'flex' }, flexDirection: { base: 'column' }, alignItems: { base: 'center' }, bgColor: { base: '#020617' }, padding: { base: 0 } } },
      [hero]: { id: hero, kind: 'section', role: 'hero', parentId: page, children: [badge, heading, subtext, timer], props: { width: { base: '100%' }, display: { base: 'flex' }, flexDirection: { base: 'column' }, alignItems: { base: 'center' }, padding: { base: 48, mobile: 24 }, gap: { base: 16 }, bgColor: { base: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #020617 100%)' } } },
      [badge]: { id: badge, kind: 'element', component: 'badge', parentId: hero, children: [], content: 'OFERTA EXCLUSIVA', props: { fontSize: { base: 11 }, fontWeight: { base: 800 }, textColor: { base: '#a78bfa' }, bgColor: { base: 'rgba(167,139,250,0.12)' }, padding: { base: 8 }, borderRadius: { base: 999 } } },
      [heading]: { id: heading, kind: 'element', component: 'heading', parentId: hero, children: [], content: 'Produto Premium', props: { fontSize: { base: 32, mobile: 22 }, fontWeight: { base: 900 }, textColor: { base: '#f1f5f9' } } },
      [subtext]: { id: subtext, kind: 'element', component: 'text', parentId: hero, children: [], content: 'Acesso completo com suporte prioritario', props: { fontSize: { base: 15, mobile: 13 }, textColor: { base: '#94a3b8' } } },
      [timer]: { id: timer, kind: 'element', component: 'timer', parentId: hero, children: [], content: '09:59', props: { fontSize: { base: 18 }, fontWeight: { base: 800 }, textColor: { base: '#f97316' } } },
      [payment]: { id: payment, kind: 'section', role: 'payment', parentId: page, children: [summary, pixBlock], props: { width: { base: '480px', mobile: '100%' }, display: { base: 'flex' }, flexDirection: { base: 'column' }, gap: { base: 20 }, padding: { base: 32, mobile: 20 }, bgColor: { base: 'rgba(15,23,42,0.6)' }, borderRadius: { base: 20 } } },
      [summary]: { id: summary, kind: 'element', component: 'summary', parentId: payment, children: [], content: 'R$ 197,00', props: { fontSize: { base: 28 }, fontWeight: { base: 900 }, textColor: { base: '#e5e7eb' } }, meta: { originalPrice: 'R$ 394,00', label: 'Total a pagar' } },
      [pixBlock]: { id: pixBlock, kind: 'element', component: 'pix-block', parentId: payment, children: [], props: { padding: { base: 20 }, bgColor: { base: '#022c22' }, borderRadius: { base: 16 } } },
      [trust]: { id: trust, kind: 'section', role: 'trust', parentId: page, children: [trustBadge1, trustBadge2, footer], props: { width: { base: '480px', mobile: '100%' }, display: { base: 'flex' }, flexDirection: { base: 'row', mobile: 'column' }, justifyContent: { base: 'center' }, gap: { base: 20 }, padding: { base: 32, mobile: 20 } } },
      [trustBadge1]: { id: trustBadge1, kind: 'element', component: 'badge', parentId: trust, children: [], content: 'SSL Seguro', props: { fontSize: { base: 11 }, fontWeight: { base: 700 }, textColor: { base: '#64748b' } } },
      [trustBadge2]: { id: trustBadge2, kind: 'element', component: 'badge', parentId: trust, children: [], content: 'Garantia 7 dias', props: { fontSize: { base: 11 }, fontWeight: { base: 700 }, textColor: { base: '#64748b' } } },
      [footer]: { id: footer, kind: 'element', component: 'text', parentId: trust, children: [], content: 'Powered by Basileia', props: { fontSize: { base: 10 }, textColor: { base: '#334155' } } },
    },
  };
}

function buildCardMinimalTemplate(): Scene {
  const page = genId('page');
  const heading = genId('e');
  const summary = genId('e');
  const cardForm = genId('e');
  const btn = genId('e');
  return {
    rootId: page,
    nodes: {
      [page]: { id: page, kind: 'page', name: 'Cartao Minimal', children: [heading, summary, cardForm, btn], props: { width: { base: '100%' }, display: { base: 'flex' }, flexDirection: { base: 'column' }, alignItems: { base: 'center' }, bgColor: { base: '#ffffff' }, padding: { base: 40 } } },
      [heading]: { id: heading, kind: 'element', component: 'heading', parentId: page, children: [], content: 'Finalizar Compra', props: { fontSize: { base: 28 }, fontWeight: { base: 800 }, textColor: { base: '#1e293b' } } },
      [summary]: { id: summary, kind: 'element', component: 'summary', parentId: page, children: [], content: 'R$ 99,90', props: { fontSize: { base: 24 }, fontWeight: { base: 700 }, textColor: { base: '#64748b' } } },
      [cardForm]: { id: cardForm, kind: 'element', component: 'card-form', parentId: page, children: [], props: { padding: { base: 24 }, bgColor: { base: '#f8fafc' }, borderRadius: { base: 12 } } },
      [btn]: { id: btn, kind: 'element', component: 'button', parentId: page, children: [], content: 'Pagar R$ 99,90', props: { padding: { base: 16 }, bgColor: { base: '#8b5cf6' }, textColor: { base: '#ffffff' }, fontSize: { base: 16 }, fontWeight: { base: 700 }, borderRadius: { base: 999 } } },
    },
  };
}

function buildSubscriptionTemplate(): Scene {
  const page = genId('page');
  const hero = genId('s');
  const payment = genId('s');
  const heading = genId('e');
  const subtext = genId('e');
  const summary = genId('e');
  const pixBlock = genId('e');
  return {
    rootId: page,
    nodes: {
      [page]: { id: page, kind: 'page', name: 'Assinatura', children: [hero, payment], props: { width: { base: '100%' }, display: { base: 'flex' }, flexDirection: { base: 'column' }, alignItems: { base: 'center' }, bgColor: { base: '#f0f9ff' }, padding: { base: 0 } } },
      [hero]: { id: hero, kind: 'section', role: 'hero', parentId: page, children: [heading, subtext], props: { width: { base: '100%' }, display: { base: 'flex' }, flexDirection: { base: 'column' }, alignItems: { base: 'center' }, padding: { base: 48, mobile: 24 }, gap: { base: 12 }, bgColor: { base: '#0ea5e9' } } },
      [heading]: { id: heading, kind: 'element', component: 'heading', parentId: hero, children: [], content: 'Plano Mensal', props: { fontSize: { base: 32 }, fontWeight: { base: 900 }, textColor: { base: '#ffffff' } } },
      [subtext]: { id: subtext, kind: 'element', component: 'text', parentId: hero, children: [], content: 'Cobranca automatica via Pix todo mes', props: { fontSize: { base: 16 }, textColor: { base: 'rgba(255,255,255,0.9)' } } },
      [payment]: { id: payment, kind: 'section', role: 'payment', parentId: page, children: [summary, pixBlock], props: { width: { base: '480px', mobile: '100%' }, display: { base: 'flex' }, flexDirection: { base: 'column' }, gap: { base: 20 }, padding: { base: 32 }, bgColor: { base: '#ffffff' }, borderRadius: { base: 20 }, shadow: { base: 'md' } } },
      [summary]: { id: summary, kind: 'element', component: 'summary', parentId: payment, children: [], content: 'R$ 49,90/mes', props: { fontSize: { base: 28 }, fontWeight: { base: 900 }, textColor: { base: '#1e293b' } }, meta: { label: 'Assinatura mensal' } },
      [pixBlock]: { id: pixBlock, kind: 'element', component: 'pix-block', parentId: payment, children: [], props: { padding: { base: 20 }, bgColor: { base: '#f0fdf4' }, borderRadius: { base: 16 } } },
    },
  };
}
