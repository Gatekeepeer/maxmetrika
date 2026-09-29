import React, { useState } from 'react';
import { Channel, Category } from '../types';
import { 
  X, 
  Plus, 
  Search, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Layers
} from 'lucide-react';

interface AddChannelModalProps {
  onClose: () => void;
  onChannelAdded: (channel: Channel) => void;
}

const CATEGORIES: Category[] = [
  'Бизнес и финансы',
  'Маркетинг и PR',
  'IT и разработка',
  'Криптовалюты',
  'Недвижимость',
  'E-commerce & Селлеры',
  'Новости и медиа',
  'Дизайн и креатив',
];

export const AddChannelModal: React.FC<AddChannelModalProps> = ({
  onClose,
  onChannelAdded,
}) => {
  const [channelInput, setChannelInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Бизнес и финансы');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelInput.trim()) return;

    const rawUsername = channelInput
      .replace('https://t.me/', '')
      .replace('@', '')
      .trim();

    setIsScanning(true);
    setScanStep('Подключение к API мессенджера...');

    setTimeout(() => {
      setScanStep('Сбор истории публикаций и срезов просмотров...');
    }, 800);

    setTimeout(() => {
      setScanStep('Антифрод-анализ: проверка ночных просмотров и ботов...');
    }, 1600);

    setTimeout(() => {
      // Generate synthetic metrics based on input name
      const cleanTitle = rawUsername
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const subs = Math.floor(Math.random() * 80000) + 25000;
      const reach = Math.floor(subs * (0.28 + Math.random() * 0.15));
      const er = Math.round((reach / subs) * 100 * 10) / 10;
      const err = Math.round((er * 0.55) * 10) / 10;
      const adPrice = Math.round((reach * 0.75) / 1000) * 1000;
      const cpm = Math.round((adPrice / reach) * 1000);

      const newChannel: Channel = {
        id: `ch-custom-${Date.now()}`,
        title: cleanTitle || 'Новый канал',
        username: rawUsername,
        category: selectedCategory,
        description: `Официальный канал ${cleanTitle}. Авторские материалы, кейсы и новости индустрии.`,
        subscribers: subs,
        subscribersGrowth24h: Math.floor(Math.random() * 300) + 50,
        subscribersGrowth7d: Math.floor(Math.random() * 1800) + 400,
        avgReachPerPost: reach,
        er: er,
        err: err,
        citationIndex: Math.floor(Math.random() * 600) + 200,
        fraudTrustScore: 94,
        adPrice1_24: adPrice,
        cpm: cpm,
        totalPosts: Math.floor(Math.random() * 1200) + 300,
        postsPerDay: 2.1,
        verified: true,
        languages: ['RU'],
        maleRatio: 60,
        topAgeGroup: '22-38 лет (66%)',
        tags: [selectedCategory.toLowerCase(), 'аналитика', 'новости'],
        contacts: {
          manager: `@${rawUsername}_manager`,
        },
        fraudFlags: {
          nightSpikesDetected: false,
          suddenSubscriberJumps: false,
          botViewPatterns: false,
        },
        adFormats: [
          { format: '1/24', price: adPrice, cpm: cpm, description: '1 час в топе, 24 часа в ленте' },
          { format: '2/48', price: Math.round(adPrice * 1.4), cpm: Math.round(cpm * 0.9), description: '2 часа в топе, 48 часов в ленте' },
          { format: 'Нативный пост', price: Math.round(adPrice * 1.8), cpm: Math.round(cpm * 1.15), description: 'Авторская нативная подача' },
        ],
        history: [
          { date: '2026-09-22', subscribers: subs - 1200, viewsPerPost: reach - 800, er: er - 0.4, growth: 180 },
          { date: '2026-09-23', subscribers: subs - 1000, viewsPerPost: reach - 600, er: er - 0.3, growth: 200 },
          { date: '2026-09-24', subscribers: subs - 780, viewsPerPost: reach - 400, er: er - 0.2, growth: 220 },
          { date: '2026-09-25', subscribers: subs - 540, viewsPerPost: reach - 200, er: er - 0.1, growth: 240 },
          { date: '2026-09-26', subscribers: subs - 300, viewsPerPost: reach - 100, er: er, growth: 240 },
          { date: '2026-09-27', subscribers: subs - 100, viewsPerPost: reach, er: er, growth: 200 },
          { date: '2026-09-28', subscribers: subs, viewsPerPost: reach, er: er, growth: 100 },
        ],
        hourlyViewsFirst24h: [
          { hour: 1, views: Math.round(reach * 0.34), expectedOrganic: Math.round(reach * 0.33) },
          { hour: 2, views: Math.round(reach * 0.52), expectedOrganic: Math.round(reach * 0.50) },
          { hour: 4, views: Math.round(reach * 0.72), expectedOrganic: Math.round(reach * 0.70) },
          { hour: 8, views: Math.round(reach * 0.88), expectedOrganic: Math.round(reach * 0.86) },
          { hour: 24, views: reach, expectedOrganic: reach },
        ],
        heatMap: [
          [8, 3, 1, 0, 0, 2, 14, 38, 58, 68, 76, 80, 72, 60, 50, 56, 68, 82, 90, 84, 66, 45, 26, 12],
          [7, 3, 1, 0, 0, 2, 16, 42, 62, 72, 80, 84, 76, 64, 54, 60, 72, 88, 92, 86, 68, 48, 25, 10],
          [10, 4, 1, 0, 0, 3, 18, 45, 66, 76, 82, 86, 78, 66, 56, 64, 76, 90, 94, 88, 70, 50, 28, 14],
          [8, 3, 1, 0, 0, 3, 15, 40, 60, 70, 78, 82, 74, 62, 52, 58, 70, 84, 88, 82, 65, 44, 23, 11],
          [9, 4, 1, 0, 0, 2, 12, 35, 54, 64, 72, 75, 68, 55, 48, 52, 62, 76, 80, 74, 58, 40, 24, 15],
          [12, 6, 3, 1, 0, 1, 6, 16, 28, 40, 50, 56, 60, 54, 48, 52, 58, 64, 68, 62, 50, 35, 24, 18],
          [14, 8, 4, 1, 0, 1, 5, 14, 25, 36, 46, 52, 56, 50, 45, 48, 54, 66, 70, 65, 52, 38, 26, 16],
        ],
        topPosts: [
          {
            id: `p-${Date.now()}-1`,
            date: 'Сегодня, 11:30',
            preview: `Главный разбор недели: тренды и аналитика ниши ${selectedCategory}...`,
            views: Math.round(reach * 1.3),
            forwards: Math.round(reach * 0.04),
            reactions: Math.round(reach * 0.05),
            comments: 84,
            err: Math.round(err * 1.3 * 10) / 10,
          },
        ],
      };

      onChannelAdded(newChannel);
      setIsScanning(false);
      onClose();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Добавить канал на мониторинг
              </h2>
              <p className="text-xs text-slate-400">
                Мгновенный сбор статистики и запуск антифрод-проверки
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

        <form onSubmit={handleStartScan} className="p-6 space-y-4">
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-medium">Ссылка на канал или @username:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="например, @tech_pulse или https://t.me/tech_pulse"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                disabled={isScanning}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-medium">Категория:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category)}
              disabled={isScanning}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {isScanning && (
            <div className="p-4 bg-blue-950/30 border border-blue-800/40 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-blue-400 font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{scanStep}</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isScanning}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Отмена
            </button>

            <button
              type="submit"
              disabled={isScanning || !channelInput.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-500/20 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Сканирование...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Сканировать и добавить</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
