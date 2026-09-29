import React, { useState } from 'react';
import { Channel } from '../types';
import { formatNumber, formatCurrency, formatPercent } from '../utils/analytics';
import { 
  X, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  Clock, 
  Eye, 
  Users, 
  MessageCircle, 
  Share2, 
  FileDown, 
  CheckCircle2, 
  Coins, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';

interface ChannelDetailModalProps {
  channel: Channel;
  onClose: () => void;
  onOpenRoiPredictor: (channel: Channel) => void;
  onOpenFraudScanner: (channel: Channel) => void;
  onOpenMediaKit: (channel: Channel) => void;
}

export const ChannelDetailModal: React.FC<ChannelDetailModalProps> = ({
  channel,
  onClose,
  onOpenRoiPredictor,
  onOpenFraudScanner,
  onOpenMediaKit,
}) => {
  const [activeTab, setActiveTab] = useState<'dynamics' | 'retention' | 'heatmap' | 'posts' | 'ad_pricing'>('dynamics');
  const [copiedManager, setCopiedManager] = useState(false);

  const handleCopyManager = () => {
    navigator.clipboard.writeText(channel.contacts.manager);
    setCopiedManager(true);
    setTimeout(() => setCopiedManager(false), 2000);
  };

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  // Calculate SVG points for subscriber history
  const maxSub = Math.max(...channel.history.map((h) => h.subscribers));
  const minSub = Math.min(...channel.history.map((h) => h.subscribers)) * 0.998;
  const rangeSub = maxSub - minSub || 1;

  const svgPoints = channel.history
    .map((point, index) => {
      const x = (index / (channel.history.length - 1)) * 500;
      const y = 140 - ((point.subscribers - minSub) / rangeSub) * 110;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,140 ${svgPoints} 500,140`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg font-display shadow-md shadow-blue-500/20 shrink-0">
              {channel.title.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white font-display">
                  {channel.title}
                </h2>
                {channel.verified && (
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                )}
                <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">
                  @{channel.username}
                </span>
                <span className="text-xs text-slate-400">
                  {channel.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {channel.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenMediaKit(channel)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 rounded-lg transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              Медиакит
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 p-4 bg-slate-950/20 border-b border-slate-800 text-xs">
          <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl">
            <div className="text-slate-500 font-medium">Подписчики</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5 tabular-nums">
              {formatNumber(channel.subscribers)}
            </div>
            <div className={`text-[11px] font-mono ${channel.subscribersGrowth24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {channel.subscribersGrowth24h >= 0 ? `+${channel.subscribersGrowth24h}` : channel.subscribersGrowth24h} (24ч)
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl">
            <div className="text-slate-500 font-medium">Охват 1 поста</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5 tabular-nums">
              {formatNumber(channel.avgReachPerPost)}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              ERR {channel.err}%
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl">
            <div className="text-slate-500 font-medium">Вовлеченность ER</div>
            <div className="text-lg font-bold text-blue-400 font-mono mt-0.5 tabular-nums">
              {channel.er}%
            </div>
            <div className="text-[11px] text-slate-400">
              Высокая органика
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl">
            <div className="text-slate-500 font-medium">Индекс ИЦ</div>
            <div className="text-lg font-bold text-amber-400 font-mono mt-0.5 tabular-nums">
              {channel.citationIndex}
            </div>
            <div className="text-[11px] text-slate-400">
              Авторитетность
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl">
            <div className="text-slate-500 font-medium">Антифрод рейтинг</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-lg font-bold font-mono ${channel.fraudTrustScore >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {channel.fraudTrustScore}%
              </span>
              {channel.fraudTrustScore >= 90 ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div className="text-[11px] text-slate-400">
              {channel.fraudTrustScore >= 90 ? 'Чистый трафик' : 'Есть аномалии'}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl">
            <div className="text-slate-500 font-medium">Цена рекламы (CPM)</div>
            <div className="text-lg font-bold text-slate-200 font-mono mt-0.5 tabular-nums">
              {formatCurrency(channel.adPrice1_24)}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              CPM {channel.cpm} ₽
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-950/30 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dynamics')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dynamics'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Динамика подписчиков
          </button>

          <button
            onClick={() => setActiveTab('retention')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'retention'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Почасовой набор просмотров
          </button>

          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'heatmap'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Тепловая карта времени
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'posts'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Топ-публикации
          </button>

          <button
            onClick={() => setActiveTab('ad_pricing')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ad_pricing'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Прайс-лист & Бронь
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: Dynamics */}
          {activeTab === 'dynamics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    История роста аудитории за последние 7 дней
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Стабильный прирост без резких просадок указывает на органический рост.
                  </p>
                </div>
                <div className="text-xs text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                  +{channel.subscribersGrowth7d} подписчиков за 7 дней
                </div>
              </div>

              {/* SVG Line Chart */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="h-44 w-full">
                  <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="subGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polygon points={areaPoints} fill="url(#subGradient)" />
                    <polyline
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={svgPoints}
                    />
                    {channel.history.map((point, idx) => {
                      const x = (idx / (channel.history.length - 1)) * 500;
                      const y = 140 - ((point.subscribers - minSub) / rangeSub) * 110;
                      return (
                        <g key={point.date}>
                          <circle cx={x} cy={y} r="4" fill="#60a5fa" stroke="#1e293b" strokeWidth="2" />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* X Axis Labels */}
                <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-3 border-t border-slate-800">
                  {channel.history.map((h) => (
                    <div key={h.date} className="text-center">
                      <div>{h.date.slice(5)}</div>
                      <div className="text-slate-300 font-semibold">{formatNumber(h.subscribers)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Retention / Hourly */}
          {activeTab === 'retention' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Динамика набора просмотров в первые 24 часа
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Сравнение реального графика (синий) с эталонной органической моделью (серый пунктир).
                  </p>
                </div>
                {channel.fraudFlags.nightSpikesDetected && (
                  <div className="text-xs text-rose-400 font-mono bg-rose-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Обнаружена аномалия
                  </div>
                )}
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  {channel.hourlyViewsFirst24h.map((point) => (
                    <div key={point.hour} className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                      <div className="text-slate-500 font-mono">{point.hour} ч. после поста</div>
                      <div className="text-sm font-bold text-white font-mono mt-1">
                        {formatNumber(point.views)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Норма: {formatNumber(point.expectedOrganic)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-slate-400 p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-200">Вывод антифрод-системы: </span>
                  {channel.fraudFlags.warningNote || 'График просмотров полностью повторяет естественное поведение живой русскоязычной аудитории (пик в первые 2 часа с плавным затуханием к 24 часам).'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Heatmap */}
          {activeTab === 'heatmap' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Тепловая карта активности аудитории (24/7)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Чем ярче ячейка, тем выше процент прочтений и реакций в данный час.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 overflow-x-auto">
                <div className="min-w-[550px] space-y-1.5">
                  {/* Hours Header */}
                  <div className="grid grid-cols-25 text-[10px] text-slate-500 font-mono text-center">
                    <div className="text-left font-medium">День</div>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i}>{i}</div>
                    ))}
                  </div>

                  {/* Days */}
                  {channel.heatMap.map((dayRow, dayIdx) => (
                    <div key={dayIdx} className="grid grid-cols-25 items-center gap-1">
                      <div className="text-xs font-semibold text-slate-400 text-left">
                        {daysOfWeek[dayIdx]}
                      </div>
                      {dayRow.map((val, hIdx) => {
                        const bgIntensity =
                          val > 80
                            ? 'bg-blue-500 text-white'
                            : val > 55
                            ? 'bg-blue-600/70 text-white'
                            : val > 30
                            ? 'bg-blue-800/40 text-blue-200'
                            : val > 10
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-slate-900/60 text-slate-600';

                        return (
                          <div
                            key={hIdx}
                            title={`${daysOfWeek[dayIdx]} в ${hIdx}:00 — активность ${val}%`}
                            className={`h-6 rounded text-[9px] font-mono flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${bgIntensity}`}
                          >
                            {val > 40 ? val : ''}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Top Posts */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Лучшие публикации канала с наивысшим ERR
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Показатели репостов и вовлеченности на самых вирусных материалах.
                </p>
              </div>

              <div className="space-y-3">
                {channel.topPosts.map((post) => (
                  <div key={post.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono">{post.date}</span>
                      <span className="text-blue-400 font-mono font-semibold">ERR {post.err}%</span>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                      {post.preview}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1 font-mono">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatNumber(post.views)} просмотров</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono">
                        <Share2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>{formatNumber(post.forwards)} репостов</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{post.comments} коммент.</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Ad Pricing & Booking */}
          {activeTab === 'ad_pricing' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Форматы рекламных размещений и расценки
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Официальные цены от владельца канала с расчетом CPM по охвату.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {channel.adFormats.map((fmt) => (
                  <div key={fmt.format} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{fmt.format}</span>
                      <span className="font-mono font-bold text-blue-400 text-sm">
                        {formatCurrency(fmt.price)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{fmt.description}</p>
                    <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800/60">
                      Расчетный CPM: <span className="text-slate-300 font-semibold">{fmt.cpm} ₽</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-950/20 border border-blue-900/40 rounded-xl flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs text-blue-300 font-medium">Контакт для бронирования рекламы:</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {channel.contacts.manager}
                  </div>
                </div>
                <button
                  onClick={handleCopyManager}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {copiedManager ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedManager ? 'Скопировано!' : 'Скопировать контакт'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenRoiPredictor(channel)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Рассчитать окупаемость рекламы (AI)
            </button>

            <button
              onClick={() => onOpenFraudScanner(channel)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-lg transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Антифрод-аудит
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
