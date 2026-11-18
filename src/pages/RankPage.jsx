import React, { useState } from 'react';
import {
  Award,
  Handshake,
  Star,
  Network,
  Coins,
  Target,
  Crown,
  Scale,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import { RANK_TIERS, useHana, formatShortAddress } from '../context/HanaContext';
import { HANA_IMAGES } from '../assets/images';
import {
  HeroBanner,
  PackageBadge,
  ProgressBar,
  SectionCard,
  StatCard,
  StatusBadge,
  TxHashChip,
} from '../components/common/UiPrimitives';
import { RankMedalIcon } from '../components/common/Icons3D';

export function RankPage() {
  const { directLegs } = useHana();
  const [filter, setFilter] = useState('All Ranks');

  const filteredRanks = RANK_TIERS.filter((r) => {
    if (filter === 'Achieved') return r.status === 'Achieved' || r.status === 'Current';
    if (filter === 'Upcoming') return r.status === 'Upcoming';
    return true;
  });

  return (
    <div className="space-y-5">
      <HeroBanner
        title="Rank &"
        highlight="Incentives"
        subtitle="Achieve higher ranks and earn weekly leadership rewards across qualified legs"
        imageSrc={HANA_IMAGES.bannerRank}
        imageAlt="HANA Rank and Incentives Crown"
      />

      {/* 5 KPI Cards Row */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={<Award className="h-5 w-5" />}
          label="Current Rank"
          value="Silver"
          subtext="$250/WK · 3 Months"
          goldAccent
        />
        <StatCard
          icon={<Handshake className="h-5 w-5" />}
          label="Matching Business"
          value="$12,850.00"
          trend="+12.8%"
        />
        <StatCard
          icon={<Star className="h-5 w-5" />}
          label="Strong Leg Business"
          value="$8,520.00"
        />
        <StatCard
          icon={<Network className="h-5 w-5" />}
          label="Weak Leg(s) Business"
          value="$6,330.00"
        />
        <StatCard
          icon={<Coins className="h-5 w-5" />}
          label="Rank Income"
          value="$1,250.00"
          trend="+8.5%"
          goldAccent
        />
      </div>

      {/* Rank Achievement Status & Next Milestone Target */}
      <SectionCard>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-4">
            <h2 className="font-display text-base font-bold text-[#032B91]">Your Rank Achievement Status</h2>
            <div className="flex items-center gap-4">
              <RankMedalIcon tier="Silver" size={84} />
              <div className="space-y-1">
                <span className="inline-block rounded-full bg-[#032B91] px-2.5 py-0.5 text-[11px] font-bold text-[#FFE98A]">
                  Current Rank
                </span>
                <p className="font-display text-2xl font-extrabold text-[#061B50]">Silver</p>
                <p className="text-xs font-bold text-[#0645C5]">$250 / Week · 3 Months</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-8">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-display text-base font-bold text-[#032B91]">
                <Target className="h-5 w-5 text-red-500" />
                Next Milestone Target (Gold Rank)
              </span>
            </div>
            <ProgressBar percent={68} variant="gold" height="h-4" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-[#0755E8]/20 bg-white/90 p-3 text-center">
                <p className="text-xs font-semibold text-[#0645C5]">Self-Contribution</p>
                <p className="mt-1 font-display text-sm font-extrabold text-[#061B50] tabular-nums">
                  $5,000 / $7,500
                </p>
              </div>
              <div className="rounded-xl border border-[#0755E8]/20 bg-white/90 p-3 text-center">
                <p className="text-xs font-semibold text-[#0645C5]">Direct Team</p>
                <p className="mt-1 font-display text-sm font-extrabold text-[#061B50] tabular-nums">12 / 15</p>
              </div>
              <div className="rounded-xl border border-[#0755E8]/20 bg-white/90 p-3 text-center">
                <p className="text-xs font-semibold text-[#0645C5]">Matching Business</p>
                <p className="mt-1 font-display text-sm font-extrabold text-[#061B50] tabular-nums">
                  $12,850 / $15,000
                </p>
              </div>
              <div className="rounded-xl border border-[#0755E8]/20 bg-white/90 p-3 text-center">
                <p className="text-xs font-semibold text-[#0645C5]">Leg Rank Criteria</p>
                <p className="mt-1 font-display text-sm font-extrabold text-[#061B50] tabular-nums">4 / 5</p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Rank Achievement Structure Table */}
      <SectionCard
        title="Rank Achievement Structure"
        icon={<Crown className="h-4 w-4" />}
        rightSlot={
          <div className="flex items-center gap-1 rounded-full border border-[#0755E8]/25 bg-white p-1">
            {['All Ranks', 'Achieved', 'Upcoming'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                  filter === tab
                    ? 'hana-nav-active text-[#061B50]'
                    : 'text-[#0645C5] hover:bg-[#EAF4FF]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-xs">
            <thead>
              <tr className="border-b border-[#0755E8]/15 text-[#0645C5]">
                <th className="py-2.5 pr-3 font-bold">No.</th>
                <th className="py-2.5 pr-3 font-bold">Rank</th>
                <th className="py-2.5 pr-3 font-bold">Self-Contribution</th>
                <th className="py-2.5 pr-3 font-bold">Direct Team</th>
                <th className="py-2.5 pr-3 font-bold">Required Legs</th>
                <th className="py-2.5 pr-3 font-bold">Matching Business</th>
                <th className="py-2.5 pr-3 font-bold">Qualification</th>
                <th className="py-2.5 pr-3 font-bold">Weekly Reward</th>
                <th className="py-2.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0755E8]/10">
              {filteredRanks.map((r) => (
                <tr
                  key={r.no}
                  className={
                    r.status === 'Current'
                      ? 'bg-gradient-to-r from-[#FFF7D6] via-[#FFF0B3] to-[#FFF7D6] font-bold'
                      : 'hover:bg-[#EAF4FF]/60'
                  }
                >
                  <td className="py-3 pr-3 font-bold text-[#032B91] tabular-nums">{r.no}</td>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2 font-bold text-[#061B50]">
                      <RankMedalIcon tier={r.name} size={24} />
                      <span>{r.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-3 font-bold tabular-nums">${r.selfContribution.toLocaleString()}</td>
                  <td className="py-3 pr-3 font-bold tabular-nums">{r.directTeam}</td>
                  <td className="py-3 pr-3 font-bold tabular-nums">{r.requiredLegs} Legs</td>
                  <td className="py-3 pr-3 font-bold tabular-nums">${r.matchingBusiness.toLocaleString()}</td>
                  <td className="py-3 pr-3 font-semibold">{r.qualificationPeriod}</td>
                  <td className="py-3 pr-3 font-extrabold text-[#032B91] tabular-nums">${r.weeklyReward.toLocaleString()}</td>
                  <td className="py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Strong Leg & Weak Leg Business */}
      <SectionCard title="Strong Leg & Weak Leg Business" icon={<Scale className="h-4 w-4" />}>
        <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-6">
            <div>
              <p className="text-xs font-semibold text-[#0645C5]">Total Team Business</p>
              <p className="mt-1 font-display text-xl font-extrabold text-[#061B50] tabular-nums">$12,850.00</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0645C5]">Active Direct Legs</p>
              <p className="mt-1 flex items-center gap-1.5 font-display text-xl font-extrabold text-emerald-700 tabular-nums">
                <CheckCircle2 className="h-5 w-5" /> 2 / 2
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0645C5]">2-Leg Rule</p>
              <p className="mt-1 flex items-center gap-1.5 font-display text-xl font-extrabold text-emerald-700">
                <CheckCircle2 className="h-5 w-5" /> Qualified
              </p>
            </div>
          </div>

          <div className="space-y-3 lg:col-span-6">
            <div className="grid grid-cols-[110px_1fr] items-center gap-3">
              <span className="text-xs font-bold text-[#032B91]">Strong Leg</span>
              <ProgressBar percent={66} variant="gold" />
            </div>
            <div className="grid grid-cols-[110px_1fr] items-center gap-3">
              <span className="text-xs font-bold text-[#032B91]">Weak Leg(s)</span>
              <ProgressBar percent={34} variant="blue" />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Direct Legs Business Breakdown */}
      <SectionCard title="Direct Legs Business Breakdown" icon={<BarChart3 className="h-4 w-4" />}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[740px] text-left text-xs">
            <thead>
              <tr className="border-b border-[#0755E8]/15 text-[#0645C5]">
                <th className="py-2.5 pr-3 font-bold">Leg Role</th>
                <th className="py-2.5 pr-3 font-bold">Direct Partner</th>
                <th className="py-2.5 pr-3 font-bold">Direct Stake</th>
                <th className="py-2.5 pr-3 font-bold">Downline Business</th>
                <th className="py-2.5 pr-3 font-bold">Total Leg Business</th>
                <th className="py-2.5 pr-3 font-bold">Leg Rank</th>
                <th className="py-2.5 pr-3 font-bold">Team Members</th>
                <th className="py-2.5 font-bold">Reg Tx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0755E8]/10">
              {directLegs.map((leg) => (
                <tr key={leg.id} className="hover:bg-[#EAF4FF]/60">
                  <td className="py-3 pr-3 font-bold text-[#032B91]">{leg.role}</td>
                  <td className="py-3 pr-3 font-mono font-semibold text-[#061B50]">
                    {formatShortAddress(leg.directPartner)}
                  </td>
                  <td className="py-3 pr-3 font-bold tabular-nums">${leg.directStake.toLocaleString()}.00</td>
                  <td className="py-3 pr-3 font-bold tabular-nums">${leg.downlineBusiness.toLocaleString()}.00</td>
                  <td className="py-3 pr-3 font-extrabold text-emerald-700 tabular-nums">
                    ${leg.totalLegBusiness.toLocaleString()}.00
                  </td>
                  <td className="py-3 pr-3">
                    <PackageBadge tier={leg.legRank} />
                  </td>
                  <td className="py-3 pr-3 font-bold tabular-nums">{leg.teamMembers}</td>
                  <td className="py-3">
                    <TxHashChip hash={leg.regTx} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
