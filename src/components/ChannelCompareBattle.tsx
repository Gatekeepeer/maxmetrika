import React from 'react';
import { Channel } from '../types';
import { formatNumber, formatCurrency } from '../utils/analytics';
import { 
  Scale, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ChannelCompareBattleProps {
  channels: Channel[];
  comparedChannels: Channel[];
  onRemoveCompare: (channel: Channel) => void;
  onSelectChannel: (channel: Channel) => void;
  onOpenRoiPredictor: (channel: Channel) => void;
  onAddChannelToCompare: (channel: Channel) => void;
}

export const ChannelCompareBattle: React.FC<ChannelCompareBattleProps> = ({
  channels,
  comparedChannels,
  onRemoveCompare,
  onSelectChannel,
  onOpenRoiPredictor,
  onAddChannelToCompare,
}) => {
  const availableToAdd = channels.filter(
    (c) => !comparedChannels.some((comp) => comp.id === c.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Батл каналов & Сравнение показателей</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Сравнение эффективности перед покупкой рекламы
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Сравните показатели аудитории, стоимость за тысячу показов (CPM), вовлеченность и антифрод-рейтинг для принятия взвешенного решения.
          </p>
        </div>

        {/* Quick Add Bar */}
        {availableToAdd.length > 0 && comparedChannels.length < 4 && (
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Быстро добавить:</span>
            {availableToAdd.slice(0, 5).map((ch) => (
              <button
                key={ch.id}
                onClick={() => onAddChannelToCompare(ch)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3 h-3 text-cyan-400" />
                <span>{ch.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {comparedChannels.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">
            Список для сравнения пуст
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Перейдите в каталог каналов и нажмите на иконку весов рядом с интересующими вас площадками, чтобы сравнить их бок о бок.
          </p>
        </div>
      ) : (
        /* Comparison Table Matrix */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800">
                  <th className="p-4 text-slate-400 font-medium w-48">Метрика</th>
                  {comparedChannels.map((ch) => (
                    <th key={ch.id} className="p-4 min-w-[220px]">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-white text-sm">{ch.title}</div>
                          <div className="text-[11px] text-slate-400 font-mono">@{ch.username}</div>
                        </div>
                        <button
                          onClick={() => onRemoveCompare(ch)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Удалить из сравнения"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {/* Subscribers */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium bg-slate-950/30">Подписчики</td>
                  {comparedChannels.map((ch) => (
                    <td key={ch.id} className="p-4 font-mono text-sm font-bold text-white">
                      {formatNumber(ch.subscribers)}
                      <span className={`block text-[10px] font-normal ${ch.subscribersGrowth24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {ch.subscribersGrowth24h >= 0 ? `+${ch.subscribersGrowth24h}` : ch.subscribersGrowth24h} (24ч)
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Avg Reach */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium bg-slate-950/30">Охват 1 поста</td>
                  {comparedChannels.map((ch) => (
                    <td key={ch.id} className="p-4 font-mono text-sm font-bold text-blue-400">
                      {formatNumber(ch.avgReachPerPost)}
                      <span className="block text-[10px] text-slate-500 font-normal">
                        ERR {ch.err}%
                      </span>
                    </td>
                  ))}
                </tr>

                {/* ER */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium bg-slate-950/30">Вовлеченность ER</td>
                  {comparedChannels.map((ch) => (
                    <td key={ch.id} className="p-4 font-mono text-sm font-bold text-indigo-300">
                      {ch.er}%
                    </td>
                  ))}
                </tr>

                {/* Citation Index */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium bg-slate-950/30">Индекс ИЦ</td>
                  {comparedChannels.map((ch) => (
                    <td key={ch.id} className="p-4 font-mono text-sm font-bold text-amber-400">
                      {ch.citationIndex}
                    </td>
                  ))}
                </tr>

                {/* Anti-fraud Trust */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium bg-slate-950/30">Антифрод рейтинг</td>
                  {comparedChannels.map((ch) => (
                    <td key={ch.id} className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono text-sm font-bold ${ch.fraudTrustScore >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {ch.fraudTrustScore}%
                        </span>
                        {ch.fraudTrustScore >= 90 ? (
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {ch.fraudTrustScore >= 90 ? 'Чистый трафик' : 'Аномалии'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Ad Price 1/24 */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium bg-slate-950/30">Стоимость 1/24</td>
                  {comparedChannels.map((ch) => (
                    <td key={ch.id} className="p-4 font-mono text-sm font-bold text-white">
                      {formatCurrency(ch.adPrice1_24)}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        CPM: {ch.cpm} ₽
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Direct Action */}
                <tr>
                  <td className="p-4 text-slate-400 font-medium bg-slate-950/30">Действие</td>
                  {comparedChannels.map((ch) => (
                    <td key={ch.id} className="p-4 space-y-2">
                      <button
                        onClick={() => onSelectChannel(ch)}
                        className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Полная аналитика
                      </button>

                      <button
                        onClick={() => onOpenRoiPredictor(ch)}
                        className="w-full px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        AI-прогноз ROI
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
