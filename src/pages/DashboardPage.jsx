import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  Coins,
  Users,
  ChevronRight,
  ArrowRight,
  Copy,
  Share2,
  TrendingUp,
  Layers,
  Crown,
  BarChart3,
  Clock,
  Zap,
  Link2,
  UserPlus,
} from 'lucide-react';
import { useHana, formatShortAddress } from '../context/HanaContext';
import { HANA_IMAGES } from '../assets/images';
import {
  GoldButton,
  SectionCard,
  StatCard,
  StatusBadge,
} from '../components/common/UiPrimitives';
import { RankMedalIcon, UsdtBadgeIcon, HanaCoinBadgeIcon } from '../components/common/Icons3D';

export function DashboardPage() {
  const navigate = useNavigate();
  const {
    usdtBalance,
    hanaBalance,
    withdrawableHana,
    totalStaked,
    totalEarned,
    positions,
    transactions,
    directIncomeEvents,
    levelIncomeEvents,
    teamMembers,
    referralLink,
    copyToClipboard,
  } = useHana();

  const totalRoiClaimed = positions.reduce((sum, p) => sum + p.totalClaimed, 0);
  const validDirects = teamMembers.filter((m) => m.level === 1).length;
  const directIncomeUsd = directIncomeEvents.reduce((sum, e) => sum + e.usdtIncome, 0);
  const levelIncomeUsd = levelIncomeEvents.reduce((sum, e) => sum + e.usdtIncome, 0);
  const daoEarningsUsd = transactions
    .filter((t) => t.type === 'DAO Stake')
    .reduce((sum, t) => sum + t.amountUsd * 0.025, 0);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join HANA Blockchain MLM',
          text: 'Join my HANA decentralized staking network!',
          url: referralLink,
        });
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }
    copyToClipboard(referralLink, 'Referral link copied to share');
  };

  const breakdown = [
    { label: 'Direct Income', amount: directIncomeUsd || 850, pct: 29.8, color: '#FFD700' },
    { label: 'Level Income', amount: levelIncomeUsd || 1250, pct: 43.9, color: '#0755E8' },
    { label: 'Rank Income', amount: 500, pct: 17.5, color: '#F59E0B' },
    { label: 'Reward & Bonus', amount: 250, pct: 8.8, color: '#94A3B8' },
  ];

  const radius = 38;
  const circ = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="space-y-5">
      {/* Hero Banner with Full-Width Panoramic Illustration, Referral Link Box, and Rank Box */}
      <div className="hana-hero-banner relative overflow-hidden rounded-2xl p-5 text-white sm:p-7">
        <img
          src={HANA_IMAGES.bannerDashboard}
          alt="HANA Royal Crown Wealth Podium"
          referrerPolicy="no-referrer"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#032B91]/70 via-[#0436AE]/36 to-transparent sm:w-3/5" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#032B91]/35 via-transparent to-[#032B91]/35" />

        <div className="relative z-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="max-w-xl flex-1 space-y-3.5">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-balance drop-shadow sm:text-4xl">
              Build • Grow • <span className="text-[#FFD700]">Earn</span>
            </h1>

            {/* Referral Link Box */}
            <div className="rounded-2xl border border-white/25 bg-[#032B91]/65 p-3.5 backdrop-blur-md">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#FFE98A]">
                <Link2 className="h-4 w-4" />
                <span>Your Referral Link</span>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center overflow-hidden rounded-xl border border-white/25 bg-white">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="w-full bg-transparent px-3 py-2 font-mono text-xs font-bold text-[#032B91] focus:outline-none"
                    aria-label="Your referral link"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(referralLink, 'Referral link copied')}
                    className="flex h-9 w-10 shrink-0 items-center justify-center bg-[#0755E8] text-white hover:bg-[#0645C5] cursor-pointer"
                    aria-label="Copy referral link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <GoldButton onClick={handleShare} className="px-4 py-2 text-xs sm:text-sm">
                  Share Link <Share2 className="h-3.5 w-3.5" />
                </GoldButton>
                <GoldButton onClick={() => navigate('/staking')} className="px-4 py-2 text-xs sm:text-sm">
                  Invest Now →
                </GoldButton>
              </div>
            </div>

            {/* Rank Box right below Referral Link */}
            <div
              onClick={() => navigate('/rank')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/rank')}
              className="flex flex-col gap-3 rounded-2xl border border-[#FFD700]/45 bg-[#032B91]/70 p-3.5 backdrop-blur-md transition hover:border-[#FFD700] cursor-pointer sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <RankMedalIcon tier="Silver" size={44} />
                <div>
                  <p className="text-[11px] font-bold tracking-wide text-[#FFE98A] uppercase">Current Rank</p>
                  <p className="font-display text-lg font-extrabold text-white leading-tight">
                    Silver <span className="text-xs font-semibold text-blue-100">· $250 / Week</span>
                  </p>
                </div>
              </div>

              <div className="flex-1 sm:max-w-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-blue-100">Next Rank: <strong className="text-[#FFD700]">Gold</strong></span>
                  <span className="text-[#FFE98A] tabular-nums">68%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full border border-white/25 bg-[#061B50]/80 p-0.5">
                  <div className="hana-progress-gold h-full rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              <span className="hidden sm:inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-[#FFD700]">
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Core Wallet & Staking Metric Boxes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<UsdtBadgeIcon size={36} />}
          label="USDT Balance"
          value={`$${usdtBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtext="Wallet balance"
        />
        <StatCard
          icon={<HanaCoinBadgeIcon size={36} />}
          imageSrc={HANA_IMAGES.tokenCoin}
          label="HANA Balance"
          value={hanaBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          subtext="Tokens allotted"
          goldAccent
        />
        <StatCard
          icon={<Layers className="h-6 w-6" />}
          imageSrc={HANA_IMAGES.securityVault}
          label="Total Staked"
          value={`$${totalStaked.toLocaleString('en-US')}`}
          subtext={`${positions.length} active position${positions.length === 1 ? '' : 's'}`}
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          imageSrc={HANA_IMAGES.heroCrownPodium}
          label="Total ROI Claimed"
          value={`$${totalRoiClaimed.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
          subtext="Direct contract earnings"
          goldAccent
        />
        <StatCard
          icon={<Users className="h-6 w-6" />}
          imageSrc={HANA_IMAGES.networkPyramid}
          label="Valid Directs"
          value={`${validDirects}`}
          subtext="Level qualified members"
        />
        <StatCard
          icon={<HanaCoinBadgeIcon size={36} />}
          imageSrc={HANA_IMAGES.tokenCoin}
          label="Withdrawable Amount"
          value={`${withdrawableHana.toFixed(2)}`}
          subtext="HANA balance"
          goldAccent
        />
      </div>
      {/* All Income Boxes Below Earnings Breakdown */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div
          onClick={() => navigate('/direct-income')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/direct-income')}
          className="cursor-pointer"
        >
          <StatCard
            icon={<UserPlus className="h-6 w-6" />}
            imageSrc={HANA_IMAGES.tokenCoin}
            label="Direct Income"
            value={`$${directIncomeUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
            subtext="5% direct referral"
            goldAccent
          />
        </div>
        <div
          onClick={() => navigate('/level-income')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/level-income')}
          className="cursor-pointer"
        >
          <StatCard
            icon={<TrendingUp className="h-6 w-6" />}
            imageSrc={HANA_IMAGES.networkPyramid}
            label="Level Income"
            value={`$${levelIncomeUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
            subtext="Downline ROI matching"
          />
        </div>
        <div
          onClick={() => navigate('/dao')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/dao')}
          className="cursor-pointer"
        >
          <StatCard
            icon={<Crown className="h-6 w-6" />}
            imageSrc={HANA_IMAGES.daoCrest}
            label="DAO Earnings"
            value={`$${daoEarningsUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
            subtext="Weekly pool share"
            goldAccent
          />
        </div>
      </div>

      {/* Earnings Breakdown Chart + Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <SectionCard
          className="lg:col-span-7"
          title="Earnings Breakdown"
          icon={<BarChart3 className="h-4 w-4" />}
        >
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90">
                {breakdown.map((item) => {
                  const dash = (item.pct / 100) * circ;
                  const currentOffset = offset;
                  offset += dash;
                  return (
                    <circle
                      key={item.label}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth="14"
                      strokeDasharray={`${dash} ${circ - dash}`}
                      strokeDashoffset={-currentOffset}
                    />
                  );
                })}
              </svg>
              <div className="absolute text-center">
                <p className="font-display text-base font-extrabold text-[#061B50] tabular-nums">
                  ${totalEarned.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-[10px] font-bold text-[#0645C5]">Total Earnings</p>
              </div>
            </div>

            <div className="w-full space-y-2 text-xs sm:text-sm">
              {breakdown.map((b) => (
                <div key={b.label} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-semibold text-[#032B91]">
                    <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: b.color }} />
                    {b.label}
                  </span>
                  <span className="font-bold text-[#061B50] tabular-nums">
                    ${b.amount.toFixed(2)}{' '}
                    <span className="text-[#0645C5]/75">({b.pct}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          className="lg:col-span-5"
          title="Quick Actions"
          icon={<Zap className="h-4 w-4" />}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Invest', icon: Coins, to: '/staking' },
              { label: 'Withdraw', icon: Wallet, to: '/withdraw' },
              { label: 'My Team', icon: Users, to: '/team' },
              { label: 'Rank', icon: Crown, to: '/rank' },
            ].map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.label}
                  type="button"
                  onClick={() => navigate(act.to)}
                  className="hana-blue-btn flex flex-col items-center justify-center gap-2 rounded-2xl px-3 py-5 text-center cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-[#FFD700]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-white">{act.label}</span>
                </button>
              );
            })}
          </div>
        </SectionCard>
      </div>

      

      {/* Full-Width Recent Transactions */}
      <SectionCard
        title="Recent Transactions"
        icon={<Clock className="h-4 w-4" />}
        rightSlot={
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#D89500] hover:text-[#0755E8] cursor-pointer"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-xs">
            <thead>
              <tr className="border-b border-[#0755E8]/15 text-[#0645C5]">
                <th className="py-2.5 pr-3 font-bold">#</th>
                <th className="py-2.5 pr-3 font-bold">Type</th>
                <th className="py-2.5 pr-3 font-bold">Amount</th>
                <th className="py-2.5 pr-3 font-bold">Details</th>
                <th className="py-2.5 pr-3 font-bold">TX Hash</th>
                <th className="py-2.5 pr-3 font-bold">Date</th>
                <th className="py-2.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0755E8]/10">
              {transactions.slice(0, 6).map((tx, index) => (
                <tr key={tx.id} className="hover:bg-[#EAF4FF]/60">
                  <td className="py-2.5 pr-3 font-bold text-[#032B91] tabular-nums">{index + 1}</td>
                  <td className="py-2.5 pr-3 font-bold text-[#061B50]">{tx.type}</td>
                  <td className="py-2.5 pr-3 font-extrabold text-emerald-700 tabular-nums">{tx.amountLabel}</td>
                  <td className="py-2.5 pr-3 text-[#0645C5]">{tx.details || 'Smart contract execution'}</td>
                  <td className="py-2.5 pr-3 font-mono text-[#0755E8]">{formatShortAddress(tx.txHash)}</td>
                  <td className="py-2.5 pr-3 text-[#032B91]/80 tabular-nums">{tx.date}</td>
                  <td className="py-2.5">
                    <StatusBadge status={tx.status} />
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
