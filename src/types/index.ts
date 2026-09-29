export type Category = 
  | 'Бизнес и финансы'
  | 'Маркетинг и PR'
  | 'IT и разработка'
  | 'Криптовалюты'
  | 'Недвижимость'
  | 'E-commerce & Селлеры'
  | 'Новости и медиа'
  | 'Дизайн и креатив';

export interface PostMetric {
  id: string;
  date: string;
  preview: string;
  views: number;
  forwards: number;
  reactions: number;
  comments: number;
  err: number;
  isAd?: boolean;
}

export interface HistoryPoint {
  date: string;
  subscribers: number;
  viewsPerPost: number;
  er: number;
  growth: number;
}

export interface HourlyViewPoint {
  hour: number;
  views: number;
  expectedOrganic: number;
}

export interface AdFormatPrice {
  format: '1/24' | '2/48' | 'Нативный пост' | 'Закреп 24ч' | 'Репост / Аудио';
  price: number;
  cpm: number;
  description: string;
}

export interface Channel {
  id: string;
  title: string;
  username: string;
  category: Category;
  description: string;
  avatarUrl?: string;
  subscribers: number;
  subscribersGrowth24h: number;
  subscribersGrowth7d: number;
  avgReachPerPost: number;
  er: number; // %
  err: number; // Reach ER %
  citationIndex: number; // ИЦ
  fraudTrustScore: number; // 0-100%
  adPrice1_24: number; // ₽
  cpm: number; // ₽
  totalPosts: number;
  postsPerDay: number;
  verified: boolean;
  languages: string[];
  maleRatio: number; // %
  topAgeGroup: string;
  history: HistoryPoint[];
  hourlyViewsFirst24h: HourlyViewPoint[];
  heatMap: number[][]; // 7 days x 24 hours (intensity 0-100)
  topPosts: PostMetric[];
  adFormats: AdFormatPrice[];
  contacts: {
    manager: string;
    bot?: string;
  };
  fraudFlags: {
    nightSpikesDetected: boolean;
    suddenSubscriberJumps: boolean;
    botViewPatterns: boolean;
    warningNote?: string;
  };
  tags: string[];
}

export interface CampaignSplitResult {
  channels: Channel[];
  totalBudget: number;
  allocatedBudget: number;
  totalSubscribers: number;
  estimatedTotalReach: number;
  estimatedUniqueReach: number;
  estimatedClicks: number;
  estimatedSubscribersGained: number;
  averageCPM: number;
  averageCPF: number; // Cost per follower
  audienceOverlapPercent: number;
}

export interface RoiPredictionResult {
  channel: Channel;
  targetNiche: string;
  budget: number;
  expectedViews: number;
  expectedClicks: number;
  expectedLeads: number;
  expectedSales: number;
  estimatedRevenue: number;
  estimatedROI: number; // %
  costPerClick: number; // ₽
  costPerFollower: number; // ₽
  riskLevel: 'Низкий' | 'Умеренный' | 'Высокий';
  aiRecommendations: string[];
}
