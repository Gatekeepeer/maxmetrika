import React, { useState, useMemo } from 'react';
import { Channel, Category } from '../types';
import { formatNumber, formatCurrency, formatPercent } from '../utils/analytics';
import { 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Scale, 
  Share2, 
  ExternalLink, 
  ChevronRight,
  Filter,
  CheckCircle2,
  Users,
  Eye,
  Percent,
  Coins
} from 'lucide-react';

interface ChannelCatalogProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  onOpenRoiPredictor: (channel: Channel) => void;
  onOpenFraudScanner: (channel: Channel) => void;
  onOpenMediaKit: (channel: Channel) => void;
  comparedChannels: Channel[];
  onToggleCompare: (channel: Channel) => void;
  searchQuery: string;
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

type SortField = 'subscribers' | 'avgReachPerPost' | 'er' | 'citationIndex' | 'fraudTrustScore' | 'adPrice1_24' | 'cpm';

export const ChannelCatalog: React.FC<ChannelCatalogProps> = ({
  channels,
  onSelectChannel,
  onOpenRoiPredictor,
  onOpenFraudScanner,
  onOpenMediaKit,
  comparedChannels,
  onToggleCompare,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Все' | Category>('Все');
  const [sortField, setSortField] = useState<SortField>('citationIndex');
  const [sortAsc, setSortAsc] = useState(false);
  const [minTrustScore, setMinTrustScore] = useState<number>(0);

  const filteredChannels = useMemo(() => {
    return channels.filter((ch) => {
      const matchesCategory = selectedCategory === 'Все' || ch.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTrust = ch.fraudTrustScore >= minTrustScore;
      return matchesCategory && matchesSearch && matchesTrust;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (sortAsc) {
        return (valA as number) - (valB as number);
      }
      return (valB as number) - (valA as number);
    });
  }, [channels, selectedCategory, searchQuery, minTrustScore, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Insights */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Официальный индекс каналов мессенджера MAX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Аналитика каналов MAX, проверка ботов и оценка емкости рынка
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Поиск перспективных каналов в экосистеме MAX, почасовой аудит удержания просмотров, расчет вовлеченности и AI-прогноз окупаемости рекламных интеграций.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Синхронизация с платформой MAX в реальном времени</span>
            </div>
            <span>·</span>
            <span>{channels.length} каналов в каталоге</span>
            <span>·</span>
            <span>Антифрод MAX Radar v2.4</span>
          </div>
        </div>
      </div>

      {/* Category Filter Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Чистота трафика:</span>
            <select
              value={minTrustScore}
              onChange={(e) => setMinTrustScore(Number(e.target.value))}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value={0} className="bg-slate-900">Все каналы</option>
              <option value={80} className="bg-slate-900">&gt; 80% (Надежные)</option>
              <option value={95} className="bg-slate-900">&gt; 95% (Идеально чистые)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Channels Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Канал / Тематика</th>
                <th 
                  onClick={() => handleSort('subscribers')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Подписчики</span>
                    {sortField === 'subscribers' && (
                      <span className="text-blue-400">{sortAsc ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('avgReachPerPost')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Охват 1 поста</span>
                    {sortField === 'avgReachPerPost' && (
                      <span className="text-blue-400">{sortAsc ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('er')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>ER / ERR</span>
                    {sortField === 'er' && (
                      <span className="text-blue-400">{sortAsc ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('citationIndex')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Индекс ИЦ</span>
                    {sortField === 'citationIndex' && (
                      <span className="text-blue-400">{sortAsc ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('fraudTrustScore')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200 transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Антифрод</span>
                    {sortField === 'fraudTrustScore' && (
                      <span className="text-blue-400">{sortAsc ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('adPrice1_24')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Цена 1/24 (CPM)</span>
                    {sortField === 'adPrice1_24' && (
                      <span className="text-blue-400">{sortAsc ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Инструменты</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredChannels.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    Каналы по заданным фильтрам не найдены. Попробуйте изменить параметры поиска.
                  </td>
                </tr>
              ) : (
                filteredChannels.map((channel, idx) => {
                  const isCompared = comparedChannels.some((c) => c.id === channel.id);
                  const isTrustHigh = channel.fraudTrustScore >= 90;
                  const isTrustMedium = channel.fraudTrustScore >= 75 && channel.fraudTrustScore < 90;

                  return (
                    <tr 
                      key={channel.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Index */}
                      <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      {/* Title & Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => onSelectChannel(channel)}
                            className="text-left group/title cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-100 group-hover/title:text-blue-400 transition-colors text-sm">
                                {channel.title}
                              </span>
                              {channel.verified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span className="font-mono text-slate-500">@{channel.username}</span>
                              <span>·</span>
                              <span className="text-slate-400">{channel.category}</span>
                            </div>
                          </button>
                        </div>
                      </td>

                      {/* Subscribers & Growth */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-semibold text-slate-200 tabular-nums">
                          {formatNumber(channel.subscribers)}
                        </div>
                        <div className={`text-[10px] font-mono ${channel.subscribersGrowth24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {channel.subscribersGrowth24h >= 0 ? `+${channel.subscribersGrowth24h}` : channel.subscribersGrowth24h} / 24ч
                        </div>
                      </td>

                      {/* Reach */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-semibold text-slate-200 tabular-nums">
                          {formatNumber(channel.avgReachPerPost)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {Math.round((channel.avgReachPerPost / channel.subscribers) * 100)}% от подп.
                        </div>
                      </td>

                      {/* ER / ERR */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-semibold text-blue-300 tabular-nums">
                          {channel.er.toFixed(1)}%
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ERR {channel.err.toFixed(1)}%
                        </div>
                      </td>

                      {/* Citation Index */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-semibold text-amber-300 tabular-nums">
                          {channel.citationIndex}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          ИЦ рейтинг
                        </div>
                      </td>

                      {/* Fraud Trust Score */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onOpenFraudScanner(channel)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                            isTrustHigh
                              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                              : isTrustMedium
                              ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                          }`}
                        >
                          {isTrustHigh ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          <span>{channel.fraudTrustScore}%</span>
                        </button>
                      </td>

                      {/* Ad Price / CPM */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-semibold text-slate-100 tabular-nums">
                          {formatCurrency(channel.adPrice1_24)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          CPM {channel.cpm} ₽
                        </div>
                      </td>

                      {/* Tools & Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectChannel(channel)}
                            title="Подробная аналитика канала"
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onOpenRoiPredictor(channel)}
                            title="AI-прогноз окупаемости рекламы"
                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onOpenMediaKit(channel)}
                            title="Медиакит для рекламодателей"
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onToggleCompare(channel)}
                            title={isCompared ? 'Удалить из сравнения' : 'Добавить в батл каналов'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isCompared
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                          >
                            <Scale className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
