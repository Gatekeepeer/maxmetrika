import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Zap, 
  Layers,
  Crown
} from 'lucide-react';
import { formatCurrency } from '../utils/analytics';

interface PricingModalProps {
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ onClose }) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [activatedPlan, setActivatedPlan] = useState<string | null>(null);

  const handleActivate = (planName: string) => {
    setActivatedPlan(planName);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const discount = billingPeriod === 'yearly' ? 0.8 : 1;

  const plans = [
    {
      name: 'Базовый',
      price: 0,
      description: 'Для авторов и начинающих администраторов каналов',
      features: [
        'Каталог каналов и поиск',
        'Базовая статистика (подписчики, охват)',
        '1 проверка на ботов в сутки',
        'Просмотр прайс-листов',
      ],
      cta: 'Текущий план',
      highlighted: false,
    },
    {
      name: 'PRO Аналитик',
      price: Math.round(1990 * discount),
      description: 'Для маркетологов, таргетологов и закупщиков рекламы',
      features: [
        'Все функции Базового тарифа',
        'Безлимитный Антифрод-сканер (рентген ботов)',
        'AI-Предиктор окупаемости рекламы (CPF & ROI)',
        'Почасовой анализ набора просмотров и удержания',
        'Тепловая карта активности 24/7',
        'Экспорт отчетов в PDF / Excel',
      ],
      cta: 'Активировать PRO',
      highlighted: true,
      badge: 'Популярный выбор',
    },
    {
      name: 'Агентство / Enterprise',
      price: Math.round(6990 * discount),
      description: 'Для рекламных агентств и крупных брендов',
      features: [
        'Все возможности PRO тарифа',
        'Умный автоподбор сплита кампаний под бюджет',
        'Батл и сравнение до 10 каналов одновременно',
        'Пакетный экспорт медиакитов',
        'Доступ к публичному REST API (10 000 req/день)',
        'Приоритетная поддержка 24/7',
      ],
      cta: 'Подключить Enterprise',
      highlighted: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 md:p-8 text-center space-y-3 border-b border-slate-800 bg-gradient-to-b from-slate-950/80 to-slate-900">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Тарифные планы PulseStat SaaS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Инвестируйте в точную аналитику и защиту от ботов
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Окупается уже с первой успешной рекламной интеграции за счет предотвращения слива бюджета на накрученные каналы.
          </p>

          {/* Billing Switcher */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs">
            <span className={billingPeriod === 'monthly' ? 'text-white font-semibold' : 'text-slate-400'}>
              Ежемесячно
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 bg-slate-800 rounded-full p-1 transition-colors relative cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded-full bg-blue-500 transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={billingPeriod === 'yearly' ? 'text-white font-semibold' : 'text-slate-400'}>
              Годовой план <span className="text-emerald-400 font-mono font-bold">-20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 md:p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-2xl flex flex-col justify-between space-y-6 transition-all relative ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-900 border-2 border-blue-500 shadow-xl shadow-blue-500/10'
                  : 'bg-slate-950/60 border border-slate-800'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white font-mono text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-white text-base font-display">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                    {plan.price === 0 ? '0 ₽' : formatCurrency(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-xs text-slate-400 font-mono">/ мес</span>
                  )}
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-xs">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleActivate(plan.name)}
                disabled={activatedPlan === plan.name}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activatedPlan === plan.name
                    ? 'bg-emerald-600 text-white'
                    : plan.highlighted
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {activatedPlan === plan.name ? 'Тариф активирован!' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div>Безопасная оплата через онлайн-кассу. Доступ открывается мгновенно.</div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
