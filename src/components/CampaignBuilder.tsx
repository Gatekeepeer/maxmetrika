import React, { useState, useMemo } from 'react';
import { Channel, Category } from '../types';
import { buildCampaignSplit, formatNumber, formatCurrency, formatPercent } from '../utils/analytics';
import { 
  Flame, 
  Layers, 
  Users, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Coins, 
  Percent, 
  Zap, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';

interface CampaignBuilderProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

const CATEGORIES: ('Все' | Category)[] = [
  'Все',
  'Бизнес и финансы',
  'Маркетинг и PR',
  'IT и разработка',
  'Криптовалюты',
  'Недвижимость',
  'E-commerce & Селлеры',
  'Новости и медиа',
  'Дизайн и креатив',
];

export const CampaignBuilder: React.FC<CampaignBuilderProps> = ({
  channels,
  onSelectChannel,
}) => {
  const [budget, setBudget] = useState<number>(75000);
  const [selectedCategory, setSelectedCategory] = useState<'Все' | Category>('Все');

  const campaign = useMemo(() => {
    return buildCampaignSplit(channels, budget, selectedCategory);
  }, [channels, budget, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>Умный сплит рекламной кампании</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Автоподбор связки каналов под ваш бюджет
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Укажите сумму бюджета, и алгоритм распределит средства по топ-каналам с минимальным пересечением аудитории для получения максимального чистого охвата (Reach).
          </p>
        </div>

        {/* Interactive Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Budget */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300 font-medium">
              <span>Общий бюджет кампании:</span>
              <span className="font-mono text-blue-400 font-bold text-sm">
                {formatCurrency(budget)}
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="200000"
              step="5000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>20 000 ₽</span>
              <span>200 000 ₽</span>
            </div>
          </div>

          {/* Category */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
            <label className="text-slate-300 font-medium">Целевая тематика:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900">
                  {cat}
                </option>
              ))}
            </select>
            <div className="text-[10px] text-slate-400">
              Выбираются только верифицированные каналы с антифрод-скором &gt; 70%
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-400 font-medium">Каналов в сплите</div>
          <div className="text-xl font-bold text-white font-mono mt-1 tabular-nums">
            {campaign.channels.length}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Оптимальный сплит
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-400 font-medium">Уникальный охват</div>
          <div className="text-xl font-bold text-blue-400 font-mono mt-1 tabular-nums">
            {formatNumber(campaign.estimatedUniqueReach)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            С учетом скидки пересечения
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-400 font-medium">Пересечение аудит.</div>
          <div className="text-xl font-bold text-amber-400 font-mono mt-1 tabular-nums">
            {campaign.audienceOverlapPercent}%
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
            Минимальный дубляж
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-400 font-medium">Прогноз переходов</div>
          <div className="text-xl font-bold text-indigo-300 font-mono mt-1 tabular-nums">
            {formatNumber(campaign.estimatedClicks)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            CTR ~4.2%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-400 font-medium">Прогноз подписчиков</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1 tabular-nums">
            +{formatNumber(campaign.estimatedSubscribersGained)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            CPF ~{formatCurrency(campaign.averageCPF)}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-400 font-medium">Использовано бюджета</div>
          <div className="text-xl font-bold text-slate-200 font-mono mt-1 tabular-nums">
            {formatCurrency(campaign.allocatedBudget)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            из {formatCurrency(campaign.totalBudget)}
          </div>
        </div>
      </div>

      {/* Selected Channels List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white font-display">
          Сформированный медиаплан размещений
        </h3>

        <div className="space-y-3">
          {campaign.channels.map((ch, index) => (
            <div
              key={ch.id}
              className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4 flex-wrap hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <div>
                  <button
                    onClick={() => onSelectChannel(ch)}
                    className="font-semibold text-white hover:text-blue-400 transition-colors text-sm text-left cursor-pointer"
                  >
                    {ch.title}
                  </button>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-mono text-slate-500">@{ch.username}</span>
                    <span>·</span>
                    <span>{ch.category}</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-mono">Доверие {ch.fraudTrustScore}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono">
                <div>
                  <div className="text-slate-500">Охват поста</div>
                  <div className="text-slate-200 font-semibold">{formatNumber(ch.avgReachPerPost)}</div>
                </div>

                <div>
                  <div className="text-slate-500">ER вовлеченность</div>
                  <div className="text-blue-400 font-semibold">{ch.er}%</div>
                </div>

                <div>
                  <div className="text-slate-500">Стоимость 1/24</div>
                  <div className="text-emerald-400 font-bold">{formatCurrency(ch.adPrice1_24)}</div>
                </div>

                <button
                  onClick={() => onSelectChannel(ch)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  Детали
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
