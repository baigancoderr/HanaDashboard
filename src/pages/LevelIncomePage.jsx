import React, { useState, useRef } from 'react';
import {
  TrendingUp,
  Coins,
  Users,
  Layers,
  Crown,
  FileText,
  RefreshCw,
  ArrowRight,
  Trophy,
} from 'lucide-react';
import { useHana, formatShortAddress } from '../context/HanaContext';
import { HANA_IMAGES } from '../assets/images';
import {
  BlueButton,
  HeroBanner,
  PackageBadge,
  SectionCard,
  StatCard,
  TxHashChip,
} from '../components/common/UiPrimitives';
import { RankMedalIcon } from '../components/common/Icons3D';

const LEVEL_SUMMARIES = [
  { level: 1, usd: 250, hana: 500, tier: 'Starter' },
  { level: 2, usd: 300, hana: 600, tier: 'Silver' },
  { level: 3, usd: 275, hana: 550, tier: 'Gold' },
  { level: 4, usd: 200, hana: 400, tier: 'Diamond' },
  { level: 5, usd: 225, hana: 450, tier: 'Platinum' },
];

export function LevelIncomePage() {
  const { levelIncomeEvents, showToast } = useHana();
  const [selectedLevel, setSelectedLevel] = useState('all');
  const logRef = useRef(null);

  const filteredEvents =
    selectedLevel === 'all'
      ? levelIncomeEvents
      : levelIncomeEvents.filter((e) => e.level === selectedLevel);

  return (
    <div className="space-y-5">
      <HeroBanner
        title="Level"
        highlight="Income"
        subtitle="Earn Multi-Level Rewards from Your Network across 20 unlocked levels"
        ctaLabel="View Event Logs →"
        onCtaClick={() => logRef.current?.scrollIntoView({ behavior: 'smooth' })}
        imageSrc={HANA_IMAGES.bannerNetwork}
        imageAlt="HANA Multi-Level Network Rewards"
      />

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          label="Total Level Income"
          value="$1,250.00"
          subtext="4 on-chain income events"
        />
        <StatCard
          icon={<Coins className="h-6 w-6" />}
          label="HANA Credited"
          value="2,450.00 HANA"
          subtext="Across all levels"
          goldAccent
        />
        <StatCard
          icon={<Users className="h-6 w-6" />}
          label="Open Levels"
          value="5"
          subtext="Valid directs: 12"
        />
        <StatCard
          icon={<Layers className="h-6 w-6" />}
          label="Income Events"
          value="24"
          subtext="Verified on-chain"
          goldAccent
        />
      </div>

      {/* Level-Wise Earnings Summary */}
      {/* <SectionCard
        title="Level-Wise Earnings Summary"
        subtitle="Aggregated directly from on-chain LevelIncomeAllotted events"
        icon={<Crown className="h-4 w-4" />}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {LEVEL_SUMMARIES.map((lvl) => {
            const active = selectedLevel === lvl.level;
            return (
              <button
                key={lvl.level}
                type="button"
                onClick={() => setSelectedLevel(lvl.level)}
                className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left transition cursor-pointer ${
                  active
                    ? 'border-2 border-[#FFB800] bg-gradient-to-b from-[#FFFDF2] to-[#FFF1C2] shadow-md'
                    : 'border-[#0755E8]/20 bg-white/90 hover:border-[#0755E8]/50'
                }`}
              >
                <RankMedalIcon tier={lvl.tier} size={36} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#0645C5]">Level {lvl.level}</p>
                  <p className="font-display text-base font-extrabold text-[#061B50] tabular-nums">
                    ${lvl.usd.toFixed(2)}
                  </p>
                  <p className="text-[11px] font-bold text-[#D89500] tabular-nums">+{lvl.hana} HANA</p>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setSelectedLevel('all')}
            className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left transition cursor-pointer ${
              selectedLevel === 'all'
                ? 'hana-card-gold border-2 border-[#FFB800] shadow-md'
                : 'border-[#FFB800]/50 bg-[#FFFDF5] hover:bg-[#FFF6D6]'
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFE98A] to-[#FFB800] text-[#061B50] shadow">
              <Trophy className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-[#032B91]">All Levels</p>
              <p className="font-display text-base font-extrabold text-[#061B50] tabular-nums">$1,250.00</p>
              <p className="text-[11px] font-bold text-[#D89500] tabular-nums">+2,450 HANA</p>
            </div>
          </button>
        </div>
      </SectionCard> */}

      {/* Level Income Event Log */}
      <div ref={logRef}>
        <SectionCard
          title="Level Income Event Log"
          subtitle="Verified level commissions credited to your wallet on BSC Testnet"
          icon={<FileText className="h-4 w-4" />}
          rightSlot={
            <div className="flex items-center gap-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="rounded-full border border-[#0755E8]/30 bg-white px-3.5 py-1.5 text-xs font-bold text-[#032B91] focus:outline-none cursor-pointer"
                aria-label="Filter level income by level"
              >
                <option value="all">All Levels</option>
                {[1, 2, 3, 4, 5].map((l) => (
                  <option key={l} value={l}>
                    Level {l}
                  </option>
                ))}
              </select>
              <BlueButton
                onClick={() => showToast('Level Logs Refreshed', 'Queried latest LevelIncomeAllotted events.', 'info')}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </BlueButton>
            </div>
          }
        >
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-[#FFB800]/45 bg-[#FFF8DF] px-3 py-2 text-xs font-semibold text-[#032B91]">
            <ArrowRight className="h-4 w-4 shrink-0 text-[#D89500]" />
            <span>
              Multi-level network commissions earned by your wallet are queried directly from on-chain
              LevelIncomeAllotted event logs with transaction hashes.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead>
                <tr className="border-b border-[#0755E8]/15 text-[#0645C5]">
                  <th className="py-2.5 pr-3 font-bold">From Member</th>
                  <th className="py-2.5 pr-3 font-bold">Level</th>
                  <th className="py-2.5 pr-3 font-bold">USDT Income</th>
                  <th className="py-2.5 pr-3 font-bold">HANA Credited</th>
                  <th className="py-2.5 pr-3 font-bold">Date &amp; Time</th>
                  <th className="py-2.5 font-bold">Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0755E8]/10">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-[#EAF4FF]/60">
                    <td className="py-3 pr-3 font-mono font-bold text-[#032B91]">
                      {formatShortAddress(ev.fromMember)}
                    </td>
                    <td className="py-3 pr-3">
                      <PackageBadge tier={`Level ${ev.level}`} />
                    </td>
                    <td className="py-3 pr-3 font-extrabold text-emerald-600 tabular-nums">
                      +${ev.usdtIncome.toFixed(2)} USDT
                    </td>
                    <td className="py-3 pr-3 font-extrabold text-[#D89500] tabular-nums">
                      +{ev.hanaCredited.toFixed(2)} HANA
                    </td>
                    <td className="py-3 pr-3 text-[#032B91]/80 tabular-nums">{ev.date}</td>
                    <td className="py-3">
                      <TxHashChip hash={ev.txHash} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
