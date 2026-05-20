// Basileia Trust Radar - Scoring System
import type { Scene } from './types';

export interface TrustIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  message: string;
  suggestion: string;
}

export interface TrustScore {
  score: number;
  maxScore: 100;
  issues: TrustIssue[];
  breakdown: Record<string, number>;
}

export function analyzeTrust(scene: Scene): TrustScore {
  const issues: TrustIssue[] = [];
  const breakdown: Record<string, number> = {};

  // Check for payment button
  const hasButton = Object.values(scene.nodes).some(n => n.kind === 'element' && n.component === 'button');
  if (!hasButton) {
    issues.push({ id: 'no_button', severity: 'critical', category: 'Conversion', message: 'Nenhum botao de pagamento encontrado', suggestion: 'Adicione um botao com texto claro como "Pagar agora"' });
  }
  breakdown.button = hasButton ? 15 : 0;

  // Check for price display
  const hasPrice = Object.values(scene.nodes).some(n => n.kind === 'element' && n.component === 'summary');
  if (!hasPrice) {
    issues.push({ id: 'no_price', severity: 'critical', category: 'Clarity', message: 'Valor nao esta visivel', suggestion: 'Adicione um resumo com o valor total' });
  }
  breakdown.price = hasPrice ? 15 : 0;

  // Check for security badges
  const hasSecurity = Object.values(scene.nodes).some(n => n.kind === 'element' && (n.component === 'badge' || n.component === 'text') && /SSL|seguro|garantia/i.test(n.content || ''));
  if (!hasSecurity) {
    issues.push({ id: 'no_security', severity: 'warning', category: 'Trust', message: 'Sem indicadores de seguranca visiveis', suggestion: 'Adicione badges de SSL e garantia' });
  }
  breakdown.security = hasSecurity ? 15 : 0;

  // Check for mobile-friendly (width check)
  const hasWideContent = Object.values(scene.nodes).some(n => n.props?.width?.base === '100%' && n.kind === 'section');
  breakdown.mobile = hasWideContent ? 15 : 10;

  // Check for payment methods
  const hasPix = Object.values(scene.nodes).some(n => n.kind === 'element' && n.component === 'pix-block');
  const hasCard = Object.values(scene.nodes).some(n => n.kind === 'element' && n.component === 'card-form');
  breakdown.methods = (hasPix ? 10 : 0) + (hasCard ? 10 : 0);
  if (!hasPix && !hasCard) {
    issues.push({ id: 'no_methods', severity: 'critical', category: 'Payment', message: 'Nenhum metodo de pagamento configurado', suggestion: 'Adicione Pix e/ou Cartao' });
  }

  // Check for clear CTA text
  const buttons = Object.values(scene.nodes).filter(n => n.kind === 'element' && n.component === 'button');
  const hasClearCta = buttons.some(b => /pagar|comprar|finalizar|confirmar/i.test(b.content || ''));
  breakdown.cta = hasClearCta ? 15 : 5;
  if (!hasClearCta && buttons.length > 0) {
    issues.push({ id: 'unclear_cta', severity: 'warning', category: 'Conversion', message: 'Botao sem texto claro de acao', suggestion: 'Use "Pagar R$ XX,XX" ou "Finalar compra"' });
  }

  // Check for form fields complexity
  const inputs = Object.values(scene.nodes).filter(n => n.kind === 'element' && n.component === 'input');
  breakdown.fricction = inputs.length <= 3 ? 15 : inputs.length <= 6 ? 10 : 5;
  if (inputs.length > 6) {
    issues.push({ id: 'too_many_fields', severity: 'warning', category: 'Friction', message: 'Muitos campos podem reduzir conversao', suggestion: 'Reduza para no maximo 3-4 campos' });
  }

  // Check for social proof
  const hasSocial = Object.values(scene.nodes).some(n => n.kind === 'element' && /depoimento|avaliacao|cliente/i.test(n.content || ''));
  breakdown.social = hasSocial ? 10 : 0;

  const score = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return { score: Math.min(score, 100), maxScore: 100, issues, breakdown };
}
