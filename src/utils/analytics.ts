import { Channel, CampaignSplitResult, RoiPredictionResult } from '../types';

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(Math.round(num));
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatPercent(num: number): string {
  return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
}

/**
 * Predicts campaign performance and ROI for a specific channel
 */
export function calculateRoiPrediction(
  channel: Channel,
  targetNiche: string,
  budget: number,
  productPrice: number = 3500,
  conversionRatePercent: number = 2.5
): RoiPredictionResult {
  // Base views derived from budget vs channel ad price
  const postsCount = Math.max(1, Math.round(budget / (channel.adPrice1_24 || 25000)));
  const totalViews = channel.avgReachPerPost * postsCount;
  
  // Quality & Fraud modifier
  const qualityFactor = channel.fraudTrustScore / 100;
  
  // CTR estimation based on channel ER
  const baseCTR = (channel.er / 100) * 0.12 * qualityFactor;
  const expectedClicks = Math.round(totalViews * Math.max(0.015, Math.min(0.08, baseCTR)));
  
  // Cost Per Click
  const costPerClick = expectedClicks > 0 ? budget / expectedClicks : 0;
  
  // Follower conversion (approx 35% of clicks follow or stay in funnel)
  const expectedFollowers = Math.round(expectedClicks * 0.38);
  const costPerFollower = expectedFollowers > 0 ? budget / expectedFollowers : 0;
  
  // Leads and Sales
  const expectedLeads = Math.round(expectedClicks * 0.18);
  const expectedSales = Math.max(1, Math.round(expectedClicks * (conversionRatePercent / 100)));
  
  const estimatedRevenue = expectedSales * productPrice;
  const estimatedROI = budget > 0 ? ((estimatedRevenue - budget) / budget) * 100 : 0;
  
  let riskLevel: 'Низкий' | 'Умеренный' | 'Высокий' = 'Низкий';
  if (channel.fraudTrustScore < 75 || channel.er < 15) {
    riskLevel = 'Высокий';
  } else if (channel.fraudTrustScore < 90 || channel.cpm > 1200) {
    riskLevel = 'Умеренный';
  }
  
  const aiRecommendations: string[] = [
    `Рекомендуемый формат размещения: ${channel.er > 30 ? 'Нативный пост с личной рекомендацией автора' : '1/24 в пиковый час активности (18:00–21:00)'}.`,
    `Ожидаемая стоимость подписчика (CPF): ${formatCurrency(costPerFollower)} — ${costPerFollower < 80 ? 'отличный показатель для ниши' : 'в пределах рыночной нормы'}.`,
    `Уровень чистоты аудитории: ${channel.fraudTrustScore}% (${channel.fraudTrustScore >= 90 ? 'боты не обнаружены' : 'требуется внимательная проверка ночных срезов'}).`,
  ];
  
  if (channel.heatMap && channel.heatMap.length > 0) {
    aiRecommendations.push('Лучший день для публикации: Вторник или Среда, максимальный отклик с 18:00 до 20:30.');
  }

  return {
    channel,
    targetNiche,
    budget,
    expectedViews: totalViews,
    expectedClicks,
    expectedLeads,
    expectedSales,
    estimatedRevenue,
    estimatedROI: Math.round(estimatedROI),
    costPerClick: Math.round(costPerClick),
    costPerFollower: Math.round(costPerFollower),
    riskLevel,
    aiRecommendations,
  };
}

/**
 * Optimizes channel campaign split based on budget and target category
 */
export function buildCampaignSplit(
  allChannels: Channel[],
  budget: number,
  categoryFilter?: string
): CampaignSplitResult {
  let eligible = allChannels.filter(c => c.fraudTrustScore >= 70);
  if (categoryFilter && categoryFilter !== 'Все') {
    eligible = eligible.filter(c => c.category === categoryFilter);
  }
  if (eligible.length === 0) {
    eligible = allChannels.filter(c => c.fraudTrustScore >= 70);
  }

  // Sort by cost-effectiveness (ER / CPM)
  const scored = [...eligible].sort((a, b) => {
    const scoreA = (a.er * 10) / (a.cpm || 800);
    const scoreB = (b.er * 10) / (b.cpm || 800);
    return scoreB - scoreA;
  });

  const selected: Channel[] = [];
  let currentSpent = 0;

  for (const ch of scored) {
    if (currentSpent + ch.adPrice1_24 <= budget * 1.15) {
      selected.push(ch);
      currentSpent += ch.adPrice1_24;
    }
    if (selected.length >= 4) break;
  }

  // Fallback if none selected
  if (selected.length === 0 && scored.length > 0) {
    selected.push(scored[0]);
    currentSpent = scored[0].adPrice1_24;
  }

  const totalSubs = selected.reduce((acc, c) => acc + c.subscribers, 0);
  const totalReach = selected.reduce((acc, c) => acc + c.avgReachPerPost, 0);
  
  // Overlap calculation: each additional channel has ~8-15% audience overlap in same niche
  const overlapRatio = Math.min(0.28, Math.max(0.05, (selected.length - 1) * 0.07));
  const uniqueReach = Math.round(totalReach * (1 - overlapRatio));
  
  const estimatedClicks = Math.round(uniqueReach * 0.042);
  const estimatedSubsGained = Math.round(estimatedClicks * 0.35);
  const avgCPM = uniqueReach > 0 ? Math.round((currentSpent / uniqueReach) * 1000) : 0;
  const avgCPF = estimatedSubsGained > 0 ? Math.round(currentSpent / estimatedSubsGained) : 0;

  return {
    channels: selected,
    totalBudget: budget,
    allocatedBudget: currentSpent,
    totalSubscribers: totalSubs,
    estimatedTotalReach: totalReach,
    estimatedUniqueReach: uniqueReach,
    estimatedClicks,
    estimatedSubscribersGained: estimatedSubsGained,
    averageCPM: avgCPM,
    averageCPF: avgCPF,
    audienceOverlapPercent: Math.round(overlapRatio * 100),
  };
}
