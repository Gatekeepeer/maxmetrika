import React, { useState } from 'react';
import { Channel } from './types';
import { INITIAL_CHANNELS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { ChannelCatalog } from './components/ChannelCatalog';
import { ChannelDetailModal } from './components/ChannelDetailModal';
import { AntiFraudScanner } from './components/AntiFraudScanner';
import { AdRoiPredictor } from './components/AdRoiPredictor';
import { CampaignBuilder } from './components/CampaignBuilder';
import { MediaKitModal } from './components/MediaKitModal';
import { ChannelCompareBattle } from './components/ChannelCompareBattle';
import { PricingModal } from './components/PricingModal';
import { AddChannelModal } from './components/AddChannelModal';
import { 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  LayoutGrid, 
  Scale, 
  Heart,
  TrendingUp
} from 'lucide-react';

export default function App() {
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [activeTab, setActiveTab] = useState<'catalog' | 'fraud' | 'predictor' | 'campaign' | 'compare'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Active Selections
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [mediaKitChannel, setMediaKitChannel] = useState<Channel | null>(null);
  const [fraudAuditChannel, setFraudAuditChannel] = useState<Channel | null>(null);
  const [roiPredictorChannel, setRoiPredictorChannel] = useState<Channel | null>(null);
  const [comparedChannels, setComparedChannels] = useState<Channel[]>([
    INITIAL_CHANNELS[0],
    INITIAL_CHANNELS[1],
  ]);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Toggle Compare
  const handleToggleCompare = (channel: Channel) => {
    if (comparedChannels.some((c) => c.id === channel.id)) {
      setComparedChannels(comparedChannels.filter((c) => c.id !== channel.id));
    } else {
      if (comparedChannels.length >= 4) {
        alert('Максимально можно сравнивать до 4 каналов одновременно.');
        return;
      }
      setComparedChannels([...comparedChannels, channel]);
    }
  };

  const handleOpenRoiPredictor = (channel: Channel) => {
    setRoiPredictorChannel(channel);
    setActiveTab('predictor');
  };

  const handleOpenFraudScanner = (channel: Channel) => {
    setFraudAuditChannel(channel);
    setActiveTab('fraud');
  };

  const handleOpenMediaKit = (channel: Channel) => {
    setMediaKitChannel(channel);
  };

  const handleChannelAdded = (newChannel: Channel) => {
    setChannels([newChannel, ...channels]);
    setSelectedChannel(newChannel);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500/20 selection:text-blue-300">
      {/* Navigation Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenPricingModal={() => setIsPricingModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        comparedCount={comparedChannels.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* TAB: Catalog */}
        {activeTab === 'catalog' && (
          <ChannelCatalog
            channels={channels}
            onSelectChannel={(ch) => setSelectedChannel(ch)}
            onOpenRoiPredictor={handleOpenRoiPredictor}
            onOpenFraudScanner={handleOpenFraudScanner}
            onOpenMediaKit={handleOpenMediaKit}
            comparedChannels={comparedChannels}
            onToggleCompare={handleToggleCompare}
            searchQuery={searchQuery}
          />
        )}

        {/* TAB: AntiFraud Scanner */}
        {activeTab === 'fraud' && (
          <AntiFraudScanner
            channels={channels}
            selectedChannel={fraudAuditChannel}
            onSelectChannel={(ch) => setSelectedChannel(ch)}
            onOpenRoiPredictor={handleOpenRoiPredictor}
          />
        )}

        {/* TAB: AI Predictor */}
        {activeTab === 'predictor' && (
          <AdRoiPredictor
            channels={channels}
            selectedChannel={roiPredictorChannel}
            onSelectChannel={(ch) => setSelectedChannel(ch)}
          />
        )}

        {/* TAB: Campaign Builder */}
        {activeTab === 'campaign' && (
          <CampaignBuilder
            channels={channels}
            onSelectChannel={(ch) => setSelectedChannel(ch)}
          />
        )}

        {/* TAB: Channel Battle Compare */}
        {activeTab === 'compare' && (
          <ChannelCompareBattle
            channels={channels}
            comparedChannels={comparedChannels}
            onRemoveCompare={(ch) => handleToggleCompare(ch)}
            onSelectChannel={(ch) => setSelectedChannel(ch)}
            onOpenRoiPredictor={handleOpenRoiPredictor}
            onAddChannelToCompare={(ch) => handleToggleCompare(ch)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-white tracking-tight">MaxMetrika</span>
            <span>·</span>
            <span>Платформа сквозной аналитики каналов и блогов в мессенджере MAX (maxmetrika.ru)</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button onClick={() => setIsPricingModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">
              Тарифы SaaS
            </button>
            <button onClick={() => setActiveTab('fraud')} className="hover:text-white transition-colors cursor-pointer">
              Антифрод MAX Radar
            </button>
            <button onClick={() => setActiveTab('predictor')} className="hover:text-white transition-colors cursor-pointer">
              AI-Предиктор ROI
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">
              Добавить канал MAX
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Deep Channel Analytics Modal */}
      {selectedChannel && (
        <ChannelDetailModal
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
          onOpenRoiPredictor={handleOpenRoiPredictor}
          onOpenFraudScanner={handleOpenFraudScanner}
          onOpenMediaKit={handleOpenMediaKit}
        />
      )}

      {/* 2. MediaKit Modal */}
      {mediaKitChannel && (
        <MediaKitModal
          channel={mediaKitChannel}
          onClose={() => setMediaKitChannel(null)}
        />
      )}

      {/* 3. Pricing SaaS Modal */}
      {isPricingModalOpen && (
        <PricingModal onClose={() => setIsPricingModalOpen(false)} />
      )}

      {/* 4. Add Channel Modal */}
      {isAddModalOpen && (
        <AddChannelModal
          onClose={() => setIsAddModalOpen(false)}
          onChannelAdded={handleChannelAdded}
        />
      )}
    </div>
  );
}
