import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  Coins,
  Users,
  Clock,
  ArrowRight,
  Info,
  Shield,
  Package,
} from 'lucide-react';
import { STAKING_PACKAGES, useHana } from '../context/HanaContext';
import { HANA_IMAGES } from '../assets/images';
import {
  ConfirmModal,
  GoldButton,
  HeroBanner,
  PackageBadge,
  ProgressBar,
  SectionCard,
  StatCard,
  TxHashChip,
} from '../components/common/UiPrimitives';
import { RankMedalIcon } from '../components/common/Icons3D';

export function StakingPage() {
  const navigate = useNavigate();
  const {
    usdtBalance,
    totalStaked,
    totalEarned,
    positions,
    transactions,
    stakePackage,
    claimRoi,
  } = useHana();

  const [selectedPkg, setSelectedPkg] = useState(STAKING_PACKAGES[2]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const stakingTxs = transactions.filter((t) => t.type === 'Staking' || t.type === 'Investment' || t.type === 'ROI Claim');

  return (
    <div className="space-y-5">
      <HeroBanner
        title="Stake • Grow •"
        highlight="Earn"
        subtitle={`Earn rewards with HANA staking · Available Wallet Balance: $${usdtBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT`}
        ctaLabel="Stake Now →"
        onCtaClick={() => setConfirmOpen(true)}
        imageSrc={HANA_IMAGES.bannerStaking}
        imageAlt="HANA Staking Gold Coins"
      />

      {/* 4 KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Wallet className="h-6 w-6" />}
          label="Total Staked"
          value={`$${totalStaked.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        />
        <StatCard
          icon={<Coins className="h-6 w-6" />}
          label="Total Earned"
          value={`$${totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          goldAccent
        />
        <StatCard
          icon={<Users className="h-6 w-6" />}
          label="Valid Directs"
          value="124"
        />
        <StatCard
          icon={<Clock className="h-6 w-6" />}
          label="Credit Interval"
          value="12 Hours"
          goldAccent
        />
      </div>

      {/* New Staking Position Packages */}
      <SectionCard
        title="New Staking Position"
        subtitle={`Select a package to stake directly on-chain (Balance: $${usdtBalance.toLocaleString()} USDT)`}
        icon={<Package className="h-4 w-4" />}
        rightSlot={
          <GoldButton onClick={() => setConfirmOpen(true)}>
            Stake ${selectedPkg.amount.toLocaleString()} {selectedPkg.name}
          </GoldButton>
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {STAKING_PACKAGES.map((pkg) => {
            const isSelected = selectedPkg.id === pkg.id;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPkg(pkg)}
                className={`relative flex flex-col items-center rounded-2xl p-4 text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[#FFB800] bg-gradient-to-b from-[#FFFDF2] to-[#FFF1C2] shadow-[0_8px_24px_rgba(255,184,0,0.28)] -translate-y-0.5'
                    : 'border border-[#0755E8]/25 bg-white/85 hover:border-[#0755E8]/55 hover:bg-white'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2.5 rounded-full border border-[#D89500] bg-gradient-to-r from-[#FFE98A] to-[#FFB800] px-2.5 py-0.5 text-[10px] font-extrabold text-[#061B50] shadow">
                    Popular
                  </span>
                )}
                <RankMedalIcon tier={pkg.tier} size={46} />
                <p className="mt-2 font-display text-sm font-bold text-[#032B91]">{pkg.name}</p>
                <p className="mt-0.5 font-display text-xl font-extrabold text-[#061B50] tabular-nums">
                  ${pkg.amount.toLocaleString()}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[#0645C5]/80">{pkg.dailyRate}</p>
                <p className="mt-0.5 text-[10px] font-bold text-emerald-700">{pkg.dailyPercent}% / Day</p>
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Active Stakes */}
      <SectionCard
        title="Active Stakes"
        subtitle="Track 2X capping progress and claim accrued ROI rewards"
        icon={<Shield className="h-4 w-4" />}
      >
        <div className="space-y-4">
          {positions.map((pos) => {
            const pct = Math.min(100, Math.round((pos.totalClaimed / pos.capAmount) * 100));
            return (
              <div
                key={pos.id}
                className="flex flex-col gap-4 rounded-2xl border border-[#0755E8]/25 bg-white/90 p-4 shadow-sm lg:flex-row lg:items-center"
              >
                <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-[#0755E8] to-[#032B91] p-4 text-white lg:w-64 shrink-0">
                  <RankMedalIcon tier={pos.packageTier} size={48} />
                  <div>
                    <p className="font-display text-xl font-extrabold tabular-nums">
                      ${pos.invested.toLocaleString()}
                    </p>
                    <p className="text-xs font-semibold text-blue-100">{pos.packageName}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div>
                      <p className="text-xs font-semibold text-[#0645C5]/80">Invested</p>
                      <p className="font-display text-base font-extrabold text-[#061B50] tabular-nums">
                        ${pos.invested.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0645C5]/80">Total Claimed</p>
                      <p className="font-display text-base font-extrabold text-emerald-600 tabular-nums">
                        ${pos.totalClaimed.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0645C5]/80">2X Cap</p>
                      <p className="font-display text-base font-extrabold text-[#061B50] tabular-nums">
                        ${pos.capAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0645C5]/80">Pending</p>
                      <p className="font-display text-base font-extrabold text-[#0755E8] tabular-nums">
                        ${pos.pendingRoi.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <ProgressBar percent={pct} variant="gold" />
                </div>

                <div className="shrink-0">
                  <GoldButton
                    onClick={() => claimRoi(pos.id)}
                    disabled={pos.pendingRoi <= 0}
                    className="w-full lg:w-auto"
                  >
                    <Coins className="h-4 w-4" />
                    {pos.pendingRoi > 0 ? `Claim ROI ($${pos.pendingRoi.toFixed(0)})` : 'ROI Claimed'}
                  </GoldButton>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Bottom 2-Column Row: Staking Transaction History & Capping Note */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
        <SectionCard
          className="lg:col-span-8"
          title="Staking Transaction History"
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
            <table className="w-full min-w-[580px] text-left text-xs">
              <thead>
                <tr className="border-b border-[#0755E8]/15 text-[#0645C5]">
                  <th className="py-2 pr-3 font-bold">#</th>
                  <th className="py-2 pr-3 font-bold">Type</th>
                  <th className="py-2 pr-3 font-bold">Details</th>
                  <th className="py-2 pr-3 font-bold">Amount</th>
                  <th className="py-2 pr-3 font-bold">Date &amp; Time</th>
                  <th className="py-2 font-bold">Tx Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0755E8]/10">
                {stakingTxs.slice(0, 5).map((tx, idx) => (
                  <tr key={tx.id} className="hover:bg-[#EAF4FF]/60">
                    <td className="py-2.5 pr-3 font-bold text-[#032B91] tabular-nums">{idx + 1}</td>
                    <td className="py-2.5 pr-3">
                      <PackageBadge tier={tx.type === 'ROI Claim' ? 'Gold' : 'Silver'} />
                    </td>
                    <td className="py-2.5 pr-3 font-semibold text-[#061B50]">{tx.details || tx.type}</td>
                    <td className="py-2.5 pr-3 font-extrabold text-emerald-700 tabular-nums">{tx.amountLabel}</td>
                    <td className="py-2.5 pr-3 text-[#032B91]/80 tabular-nums">{tx.date}</td>
                    <td className="py-2.5">
                      <TxHashChip hash={tx.txHash} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* <SectionCard
          className="lg:col-span-4"
          title="Capping Note"
          icon={<Info className="h-4 w-4" />}
        >
          <div className="flex h-full flex-col justify-between gap-4">
            <p className="text-sm leading-relaxed font-medium text-[#032B91]">
              Level Income + ROI + Direct Referral Income count toward <strong>2X capping</strong>, while Rank Income
              and DAO Income are excluded from the standard staking cap.
            </p>
            <div className="flex items-center gap-3 rounded-xl border border-[#FFB800]/50 bg-[#FFF8DF] p-3">
              <img
                src={HANA_IMAGES.goldCoinsStack}
                alt="HANA Capping Reserve"
                referrerPolicy="no-referrer"
                className="h-14 w-14 rounded-xl object-cover border border-[#FFB800]/40"
              />
              <div className="text-xs">
                <p className="font-bold text-[#061B50]">Auto-Compound &amp; Re-Stake</p>
                <p className="text-[#0645C5]">Upgrade any package before reaching 100% of your 2X cap.</p>
              </div>
            </div>
          </div>
        </SectionCard> */}
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={`Confirm ${selectedPkg.name} Stake`}
        description={`You are about to stake $${selectedPkg.amount.toLocaleString()} USDT in the ${selectedPkg.name} Package (${selectedPkg.dailyPercent}% daily, 2X Cap).`}
        confirmLabel={`Stake $${selectedPkg.amount.toLocaleString()} USDT`}
        onConfirm={() => stakePackage(selectedPkg)}
      >
        <div className="rounded-xl border border-[#0755E8]/20 bg-[#EAF4FF] p-3.5 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#0645C5]">Package Tier</span>
            <span className="font-bold text-[#032B91]">{selectedPkg.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#0645C5]">Daily ROI</span>
            <span className="font-bold text-emerald-700">{selectedPkg.dailyPercent}% / day</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#0645C5]">Max 2X Return Cap</span>
            <span className="font-bold text-[#032B91]">${(selectedPkg.amount * 2).toLocaleString()}.00 USDT</span>
          </div>
        </div>
      </ConfirmModal>
    </div>
  );
}
