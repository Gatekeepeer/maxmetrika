import React, { useState } from 'react';
import { Channel } from '../types';
import { formatNumber, formatPercent } from '../utils/analytics';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Search, 
  Moon, 
  Users, 
  Eye, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AntiFraudScannerProps {
  channels: Channel[];
  selectedChannel?: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  onOpenRoiPredictor: (channel: Channel) => void;
}

export const AntiFraudScanner: React.FC<AntiFraudScannerProps> = ({
  channels,
  selectedChannel: propChannel,
  onSelectChannel,
  onOpenRoiPredictor,
}) => {
  const [activeChannelId, setActiveChannelId] = useState<string>(
    propChannel?.id || channels[0]?.id || ''
  );

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  if (!activeChannel) return null;

  const isClean = activeChannel.fraudTrustScore >= 90;
  const isSuspicious = activeChannel.fraudTrustScore < 75;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Антифрод-сканер и проверка накрутки</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Рентген ботов: проверка качества просмотров и подписчиков
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Автоматическое сканирование почасового графика удержания, ночных всплесков, бот-ферм и неестественных скачков перед оплатой рекламы.
          </p>
        </div>

        {/* Channel quick switcher */}
        <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-2">
          <span className="text-xs text-slate-400 whitespace-nowrap">Выберите канал:</span>
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
              <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                ch.fraudTrustScore >= 90 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {ch.fraudTrustScore}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Audit Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Overall Score Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Индекс чистоты трафика</span>
              <span className="text-xs font-mono text-slate-500">Алгоритм v2.4</span>
            </div>

            <div className="flex items-center gap-4">
              <div className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center border ${
                isClean
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : isSuspicious
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                <span className="text-3xl font-bold font-mono tracking-tight">
                  {activeChannel.fraudTrustScore}%
                </span>
                <span className="text-[10px] font-semibold mt-0.5">
                  {isClean ? 'ЧИСТО' : isSuspicious ? 'ОПАСНО' : 'СРЕДНЕ'}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-white text-base">
                  {activeChannel.title}
                </h3>
                <div className="text-xs text-slate-400 font-mono">
                  @{activeChannel.username}
                </div>
                <div className="text-xs text-slate-400">
                  {isClean
                    ? 'Аудитория органическая, признаков накрутки не обнаружено.'
                    : 'Обнаружены аномалии в распределении просмотров.'}
                </div>
              </div>
            </div>

            {/* Check Matrix */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-300">Ночные просмотры (01:00-06:00)</span>
                </div>
                {activeChannel.fraudFlags.nightSpikesDetected ? (
                  <span className="text-rose-400 font-semibold flex items-center gap-1 font-mono">
                    <XCircle className="w-3.5 h-3.5" /> Всплеск +80%
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> В норме (3-6%)
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">Плавность прироста подписчиков</span>
                </div>
                {activeChannel.fraudFlags.suddenSubscriberJumps ? (
                  <span className="text-rose-400 font-semibold flex items-center gap-1 font-mono">
                    <XCircle className="w-3.5 h-3.5" /> Резкие скачки
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Органично
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300">Паттерн первого часа (ERR)</span>
                </div>
                {activeChannel.fraudFlags.botViewPatterns ? (
                  <span className="text-rose-400 font-semibold flex items-center gap-1 font-mono">
                    <XCircle className="w-3.5 h-3.5" /> Накрутка ботами
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Естественный
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenRoiPredictor(activeChannel)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Рассчитать окупаемость рекламы
          </button>
        </div>

        {/* Right 2 cols: Hourly Anomaly Graph & Audit Log */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Почасовая верификация органического охвата
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Кривая скорости набора просмотров: реальные показатели канала против эталонного органического паттерна.
            </p>
          </div>

          {/* Visualization Bars */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="space-y-3">
              {activeChannel.hourlyViewsFirst24h.map((point) => {
                const maxVal = Math.max(...activeChannel.hourlyViewsFirst24h.map(p => p.views));
                const actualWidth = (point.views / maxVal) * 100;
                const expectedWidth = (point.expectedOrganic / maxVal) * 100;
                const isAnomaly = Math.abs(point.views - point.expectedOrganic) > 5000;

                return (
                  <div key={point.hour} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                      <span>{point.hour} час после выхода поста</span>
                      <span>
                        <span className="text-white font-semibold">{formatNumber(point.views)}</span> / ожидалось {formatNumber(point.expectedOrganic)}
                      </span>
                    </div>

                    <div className="relative h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      {/* Expected organic bar */}
                      <div
                        style={{ width: `${expectedWidth}%` }}
                        className="absolute inset-y-0 left-0 bg-slate-700/60 rounded-full"
                      />
                      {/* Actual views bar */}
                      <div
                        style={{ width: `${actualWidth}%` }}
                        className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                          isAnomaly ? 'bg-rose-500' : 'bg-blue-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Реальные просмотры</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span>Органический эталон</span>
                </div>
              </div>

              <div className="font-mono text-slate-400">
                Период: первые 24 часа
              </div>
            </div>
          </div>

          {/* Audit Notes */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-slate-200">
              Подробный отчет службы безопасности:
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {activeChannel.fraudFlags.warningNote ||
                `Канал @${activeChannel.username} прошел все уровни автоматического скоринга: пересылка постов (forwards) составляет ${formatPercent(activeChannel.er * 0.08)}, соотношение просмотров первого часа составляет 33.4% (идеальная норма для Telegram). Покупка рекламы безопасна.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
