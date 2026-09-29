import React, { useState, useMemo } from 'react';
import { Channel } from '../types';
import { calculateRoiPrediction, formatNumber, formatCurrency, formatPercent } from '../utils/analytics';
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Zap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface AdRoiPredictorProps {
  channels: Channel[];
  selectedChannel?: Channel | null;
  onSelectChannel: (channel: Channel) => void;
}

const NICHES = [
  'Онлайн-образование и курсы',
  'B2B Сервисы и IT-продукты',
  'E-commerce & Селлеры',
  'Недвижимость и инвестиции',
  'Услуги для бизнеса / Маркетинг',
  'Криптовалюты и FinTech',
  'Личный бренд / Блог',
];

export const AdRoiPredictor: React.FC<AdRoiPredictorProps> = ({
  channels,
  selectedChannel: propChannel,
  onSelectChannel,
}) => {
  const [activeChannelId, setActiveChannelId] = useState<string>(
    propChannel?.id || channels[0]?.id || ''
  );
  const [selectedNiche, setSelectedNiche] = useState<string>(NICHES[0]);
  const [budget, setBudget] = useState<number>(35000);
  const [productPrice, setProductPrice] = useState<number>(4900);
  const [conversionRate, setConversionRate] = useState<number>(2.5);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  const prediction = useMemo(() => {
    if (!activeChannel) return null;
    return calculateRoiPrediction(activeChannel, selectedNiche, budget, productPrice, conversionRate);
  }, [activeChannel, selectedNiche, budget, productPrice, conversionRate]);

  if (!activeChannel || !prediction) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI-Предиктор эффективности рекламы</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Расчет окупаемости и стоимости подписчика (CPF & ROI)
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Смоделируйте воронку продаж перед закупкой рекламы: прогноз охватов, переходов, лидов, окупаемости инвестиций и персональные рекомендации по креативу.
          </p>
        </div>

        {/* Channel Switcher */}
        <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-2">
          <span className="text-xs text-slate-400 whitespace-nowrap">Целевой канал:</span>
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannelId(ch.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeChannel.id === ch.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{ch.title}</span>
              <span className="text-[10px] font-mono text-slate-400">{formatCurrency(ch.adPrice1_24)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Parameters & Prediction Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Parameters Form (4 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-base font-bold text-white font-display">
            Параметры рекламной кампании
          </h3>

          <div className="space-y-4 text-xs">
            {/* Niche */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Ниша вашего продукта:</label>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {NICHES.map((n) => (
                  <option key={n} value={n} className="bg-slate-900">
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300 font-medium">
                <span>Бюджет на рекламу:</span>
                <span className="font-mono text-blue-400 font-bold">{formatCurrency(budget)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="250000"
                step="5000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10 000 ₽</span>
                <span>250 000 ₽</span>
              </div>
            </div>

            {/* Product Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300 font-medium">
                <span>Средний чек продажи (LTV):</span>
                <span className="font-mono text-emerald-400 font-bold">{formatCurrency(productPrice)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>500 ₽</span>
                <span>50 000 ₽</span>
              </div>
            </div>

            {/* Target Conversion Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300 font-medium">
                <span>Конверсия посадочной страницы / бота в оплату:</span>
                <span className="font-mono text-amber-400 font-bold">{conversionRate.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.5% (Холодный трафик)</span>
                <span>10% (Прогретый)</span>
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400 font-medium">Площадка для размещения:</div>
            <div className="text-white font-semibold flex items-center justify-between">
              <span>{activeChannel.title}</span>
              <span className="text-blue-400 font-mono">ER {activeChannel.er}%</span>
            </div>
          </div>
        </div>

        {/* Right Col: Funnel & AI Forecast (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Funnel Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-slate-400 font-medium flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-blue-400" />
                <span>Охват поста</span>
              </div>
              <div className="text-lg font-bold text-white font-mono mt-1 tabular-nums">
                {formatNumber(prediction.expectedViews)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                CPM ~{activeChannel.cpm} ₽
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-slate-400 font-medium flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Клики / Переходы</span>
              </div>
              <div className="text-lg font-bold text-amber-300 font-mono mt-1 tabular-nums">
                {formatNumber(prediction.expectedClicks)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                CPC ~{formatCurrency(prediction.costPerClick)}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-slate-400 font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Цена подписчика</span>
              </div>
              <div className="text-lg font-bold text-indigo-300 font-mono mt-1 tabular-nums">
                {formatCurrency(prediction.costPerFollower)}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                CPF прогноз
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-slate-400 font-medium flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ожидаемый ROI</span>
              </div>
              <div className={`text-lg font-bold font-mono mt-1 tabular-nums ${
                prediction.estimatedROI > 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {prediction.estimatedROI > 0 ? `+${prediction.estimatedROI}%` : `${prediction.estimatedROI}%`}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Выручка: {formatCurrency(prediction.estimatedRevenue)}
              </div>
            </div>
          </div>

          {/* Detailed Funnel Visualization */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white font-display">
              Воронка конверсии из просмотра в оплату
            </h4>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 font-mono">
                  <span>1. Просмотры публикации</span>
                  <span className="text-white font-semibold">{formatNumber(prediction.expectedViews)}</span>
                </div>
                <div className="h-2 bg-blue-500 rounded-full w-full" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 font-mono">
                  <span>2. Переходы по ссылке (CTR ~3.8%)</span>
                  <span className="text-amber-300 font-semibold">{formatNumber(prediction.expectedClicks)} чел.</span>
                </div>
                <div className="h-2 bg-amber-500 rounded-full w-[45%]" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 font-mono">
                  <span>3. Лиды / Заявки в бота</span>
                  <span className="text-indigo-300 font-semibold">{formatNumber(prediction.expectedLeads)} заявок</span>
                </div>
                <div className="h-2 bg-indigo-500 rounded-full w-[25%]" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 font-mono">
                  <span>4. Продажи и оплаты ({conversionRate}%)</span>
                  <span className="text-emerald-400 font-semibold">{prediction.expectedSales} продаж ({formatCurrency(prediction.estimatedRevenue)})</span>
                </div>
                <div className="h-2 bg-emerald-500 rounded-full w-[12%]" />
              </div>
            </div>
          </div>

          {/* AI Recommendations Box */}
          <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-900/50 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI-Ассистент: рекомендации под аудиторию канала</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              {prediction.aiRecommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">›</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
