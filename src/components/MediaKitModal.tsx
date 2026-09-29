import React, { useState } from 'react';
import { Channel } from '../types';
import { formatNumber, formatCurrency } from '../utils/analytics';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  Users, 
  Calendar, 
  DollarSign,
  ExternalLink
} from 'lucide-react';

interface MediaKitModalProps {
  channel: Channel;
  onClose: () => void;
}

export const MediaKitModal: React.FC<MediaKitModalProps> = ({
  channel,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const mediaKitUrl = `https://maxmetrika.ru/kit/@${channel.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mediaKitUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Официальный Медиакит канала
              </h2>
              <p className="text-xs text-slate-400">
                Публичная визитка с подтвержденной статистикой для рекламодателей
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Link Bar */}
        <div className="p-4 bg-blue-950/20 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden text-slate-300">
            <span className="text-slate-500 font-mono">Ссылка:</span>
            <span className="font-mono text-blue-400 truncate">{mediaKitUrl}</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink ? 'Скопировано!' : 'Копировать ссылку'}
          </button>
        </div>

        {/* MediaKit Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Card Presentation */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold font-display shadow-lg shadow-blue-500/20">
                  {channel.title.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white font-display">
                      {channel.title}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    @{channel.username} · {channel.category}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold rounded-lg">
                <ShieldCheck className="w-4 h-4" />
                <span>Верифицированная статистика PulseStat</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {channel.description}
            </p>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="text-slate-500 font-medium">Аудитория</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {formatNumber(channel.subscribers)}
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="text-slate-500 font-medium">Средний охват</div>
                <div className="text-base font-bold text-blue-400 font-mono mt-0.5">
                  {formatNumber(channel.avgReachPerPost)}
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="text-slate-500 font-medium">Вовлеченность ER</div>
                <div className="text-base font-bold text-indigo-300 font-mono mt-0.5">
                  {channel.er}%
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="text-slate-500 font-medium">Демография</div>
                <div className="text-base font-bold text-slate-200 font-mono mt-0.5">
                  {channel.maleRatio}% М / {100 - channel.maleRatio}% Ж
                </div>
              </div>
            </div>

            {/* Ad Price List */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-white font-display">
                Официальные форматы и стоимость
              </h4>

              <div className="space-y-2">
                {channel.adFormats.map((fmt) => (
                  <div
                    key={fmt.format}
                    className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{fmt.format}</div>
                      <div className="text-slate-400 text-[11px]">{fmt.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-blue-400 text-sm">
                        {formatCurrency(fmt.price)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        CPM {fmt.cpm} ₽
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Booking Contact */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs text-slate-400">Прямой контакт для бронирования:</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {channel.contacts.manager}
                </div>
              </div>

              <a
                href={`https://t.me/${channel.contacts.manager.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Написать менеджеру</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
