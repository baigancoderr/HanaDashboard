import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export const CONTRACT_ADDRESSES = {
  bscTestnet: {
    hanaToken: '0x7A3F9D21B4C8E510F332A12B90F12E88C44DEBD4',
    usdtToken: '0x55d398326f99059fF775485246999027B3191ec7',
    stakingContract: '0x9F12A7AC58B4D29004E8A331C2B84F19D8007F2D',
    explorerBase: 'https://testnet.bscscan.com',
    chainIdHex: '0x61',
    chainName: 'BNB Smart Chain (Testnet)',
  },
  bscMainnet: {
    hanaToken: '0x8C2B4F91D2047E3A91C8F30E12D44C809A11E4B0',
    usdtToken: '0x55d398326f99059fF775485246999027B3197955',
    stakingContract: '0x4E91C22D9B3A18F0C4219D0E8A71B3F4C9028A15',
    explorerBase: 'https://bscscan.com',
    chainIdHex: '0x38',
    chainName: 'BNB Smart Chain',
  },
};

export const STAKING_PACKAGES = [
  { id: 'starter', tier: 'Starter', name: 'Starter', amount: 100, dailyRate: 'Daily • 2X Cap', dailyPercent: 1.0, capMultiplier: 2, durationDays: 200 },
  { id: 'bronze', tier: 'Bronze', name: 'Bronze', amount: 250, dailyRate: 'Daily • 2X Cap', dailyPercent: 1.2, capMultiplier: 2, durationDays: 200 },
  { id: 'silver', tier: 'Silver', name: 'Silver', amount: 500, dailyRate: 'Daily • 2X Cap', dailyPercent: 1.5, capMultiplier: 2, popular: true, durationDays: 200 },
  { id: 'gold', tier: 'Gold', name: 'Gold', amount: 1000, dailyRate: 'Daily • 2X Cap', dailyPercent: 1.75, capMultiplier: 2, durationDays: 200 },
  { id: 'platinum', tier: 'Platinum', name: 'Platinum', amount: 2500, dailyRate: 'Daily • 2X Cap', dailyPercent: 2.0, capMultiplier: 2, durationDays: 200 },
];

export const RANK_TIERS = [
  { no: 1, name: 'Bronze', selfContribution: 500, directTeam: 5, requiredLegs: 3, matchingBusiness: 5000, qualificationPeriod: '1 Month', weeklyReward: 100, status: 'Achieved' },
  { no: 2, name: 'Silver', selfContribution: 1000, directTeam: 10, requiredLegs: 4, matchingBusiness: 10000, qualificationPeriod: '3 Months', weeklyReward: 250, status: 'Current' },
  { no: 3, name: 'Gold', selfContribution: 2500, directTeam: 15, requiredLegs: 5, matchingBusiness: 25000, qualificationPeriod: '6 Months', weeklyReward: 500, status: 'Upcoming' },
  { no: 4, name: 'Platinum', selfContribution: 5000, directTeam: 20, requiredLegs: 6, matchingBusiness: 50000, qualificationPeriod: '9 Months', weeklyReward: 1000, status: 'Upcoming' },
  { no: 5, name: 'Diamond', selfContribution: 10000, directTeam: 30, requiredLegs: 8, matchingBusiness: 100000, qualificationPeriod: '12 Months', weeklyReward: 2500, status: 'Upcoming' },
];

const INITIAL_STAKING_POSITIONS = [
  {
    id: 'pos-1',
    packageTier: 'Silver',
    packageName: 'Growth Package',
    invested: 500,
    totalClaimed: 850,
    capAmount: 1000,
    pendingRoi: 120,
    dailyRate: 'Daily (1.50%)',
    startedAt: 'Oct 25, 2026 10:24 AM',
    expiresAt: 'Dec 26, 2026',
    txHash: '0x8F3d9A12B4C8E71F20A9C4410D55E891A92E',
  },
  {
    id: 'pos-2',
    packageTier: 'Gold',
    packageName: 'Gold Accelerator',
    invested: 500,
    totalClaimed: 340,
    capAmount: 1000,
    pendingRoi: 45,
    dailyRate: 'Daily (1.75%)',
    startedAt: 'Oct 24, 2026 06:11 PM',
    expiresAt: 'Jan 18, 2027',
    txHash: '0x4B91C22E8F04D3A1B992014F67E310889C3F',
  },
];

const INITIAL_TRANSACTIONS = [
  { id: 'tx-1', type: 'Investment', amountLabel: '$500.00', amountUsd: 500, txHash: '0x8F3d77C19A204E88B11D4201F884A92E', date: 'Oct 26, 2026 10:24 AM', status: 'Success', details: 'Silver Growth Package Activated' },
  { id: 'tx-2', type: 'Level Income', amountLabel: '$150.00', amountUsd: 150, txHash: '0x4B91E88D2190F441C920B771E3129C3F', date: 'Oct 25, 2026 06:11 PM', status: 'Success', details: 'Level 1 Commission Credited' },
  { id: 'tx-3', type: 'Withdraw USDT', amountLabel: '$200.00', amountUsd: 200, txHash: '0x7D21A409F182C330E941B662D119EBB4', date: 'Oct 24, 2026 11:37 AM', status: 'Success', details: 'Net Payout $190.00 USDT to Wallet' },
  { id: 'tx-4', type: 'Direct Income', amountLabel: '$50.00', amountUsd: 50, txHash: '0x9F12C33E7104A228D551F901B4427AC5', date: 'Oct 24, 2026 11:37 AM', status: 'Success', details: '5% Direct Referral Reward +50 HANA' },
  { id: 'tx-5', type: 'Staking', amountLabel: '$1,000.00', amountUsd: 1000, txHash: '0x2A88B11F4092E771C330A619D8024F11', date: 'Oct 22, 2026 03:15 PM', status: 'Success', details: 'Gold Staking Position Opened' },
  { id: 'tx-6', type: 'Buy HANA', amountLabel: '500.00 HANA', amountUsd: 366.25, txHash: '0x6E19D44C2088F119A302B774E5518C20', date: 'Oct 20, 2026 09:42 AM', status: 'Success', details: 'Swapped 366.25 USDT for HANA' },
];

const INITIAL_DIRECT_INCOME_EVENTS = [
  { id: 'di-1', fromMember: '0x7A3F9D21B4C8E510F332A12B90F12EBD4', stakeAmount: 1000, packageTier: 'Gold', usdtIncome: 50, hanaCredited: 50, date: 'Oct 26, 2026 10:24 AM', txHash: '0x8F3d77C19A204E88B11D4201F884A92E' },
  { id: 'di-2', fromMember: '0x4B91E88D2190F441C920B771E3129C3F', stakeAmount: 500, packageTier: 'Silver', usdtIncome: 25, hanaCredited: 25, date: 'Oct 25, 2026 06:11 PM', txHash: '0x7D21A409F182C330E941B662D119EBD4' },
  { id: 'di-3', fromMember: '0x7D21A409F182C330E941B662D119EBD4', stakeAmount: 1000, packageTier: 'Gold', usdtIncome: 50, hanaCredited: 50, date: 'Oct 24, 2026 11:37 AM', txHash: '0x9F12C33E7104A228D551F901B4427AC5' },
];

const INITIAL_LEVEL_INCOME_EVENTS = [
  { id: 'li-1', fromMember: '0x7A3F9D21B4C8E510F332A12B90F12EBD4', level: 1, stakeAmount: 1000, packageTier: 'Gold', usdtIncome: 50, hanaCredited: 100, date: 'Oct 26, 2026 10:24 AM', txHash: '0x8F3d77C19A204E88B11D4201F884A92E' },
  { id: 'li-2', fromMember: '0x4B91E88D2190F441C920B771E3129C3F', level: 2, stakeAmount: 1500, packageTier: 'Gold', usdtIncome: 75, hanaCredited: 150, date: 'Oct 25, 2026 06:11 PM', txHash: '0x7D21A409F182C330E941B662D119EBD4' },
  { id: 'li-3', fromMember: '0x9F12A7AC58B4D29004E8A331C2B84F7F2D', level: 3, stakeAmount: 2000, packageTier: 'Platinum', usdtIncome: 100, hanaCredited: 200, date: 'Oct 24, 2026 11:37 AM', txHash: '0x9F12C33E7104A228D551F901B4427AC5' },
  { id: 'li-4', fromMember: '0x3C41B90E12F8A3309D11E442F8093A12', level: 4, stakeAmount: 1000, packageTier: 'Silver', usdtIncome: 40, hanaCredited: 80, date: 'Oct 22, 2026 04:08 PM', txHash: '0x3C41B90E12F8A3309D11E442F8093A12' },
  { id: 'li-5', fromMember: '0x6A19D44C2088F119A302B774E5518C20', level: 5, stakeAmount: 1200, packageTier: 'Gold', usdtIncome: 35, hanaCredited: 70, date: 'Oct 20, 2026 01:55 PM', txHash: '0x6A19D44C2088F119A302B774E5518C20' },
];

const INITIAL_TEAM_MEMBERS = [
  { id: 'tm-1', level: 1, wallet: '0x8F3d77C19A204E88B11D4201F884A92E', sponsor: '0x7A3F9D21B4C8E510F332A12B90F129D21', isDao: true, totalBusiness: 2500, lastStake: 'Oct 26, 2026', lastPackage: 'Gold', joined: 'Oct 20, 2026', regTx: '0x8F3d77C19A204E88B11D4201F884A92E' },
  { id: 'tm-2', level: 1, wallet: '0x4B91E88D2190F441C920B771E3129C3F', sponsor: '0x7A3F9D21B4C8E510F332A12B90F129D21', isDao: false, totalBusiness: 1850, lastStake: 'Oct 25, 2026', lastPackage: 'Silver', joined: 'Oct 18, 2026', regTx: '0x4B91E88D2190F441C920B771E3129C3F' },
  { id: 'tm-3', level: 1, wallet: '0x7D21A409F182C330E941B662D119EBD4', sponsor: '0x8F3d77C19A204E88B11D4201F884A92E', isDao: false, totalBusiness: 1200, lastStake: 'Oct 24, 2026', lastPackage: 'Bronze', joined: 'Oct 17, 2026', regTx: '0x7D21A409F182C330E941B662D119EBD4' },
  { id: 'tm-4', level: 1, wallet: '0x9F12C33E7104A228D551F901B4427AC5', sponsor: '0x4B91E88D2190F441C920B771E3129C3F', isDao: false, totalBusiness: 1000, lastStake: 'Oct 23, 2026', lastPackage: 'Bronze', joined: 'Oct 15, 2026', regTx: '0x9F12C33E7104A228D551F901B4427AC5' },
  { id: 'tm-5', level: 1, wallet: '0x3A19F88C7120B442E901D334A712C8E1', sponsor: '0x7A3F9D21B4C8E510F332A12B90F129D21', isDao: true, totalBusiness: 1950, lastStake: 'Oct 22, 2026', lastPackage: 'Gold', joined: 'Oct 14, 2026', regTx: '0x3A19F88C7120B442E901D334A712C8E1' },
  { id: 'tm-6', level: 2, wallet: '0x5D02A44F1190C882E301F772B609D12A', sponsor: '0x8F3d77C19A204E88B11D4201F884A92E', isDao: true, totalBusiness: 5000, lastStake: 'Oct 25, 2026', lastPackage: 'Diamond', joined: 'Oct 19, 2026', regTx: '0x5D02A44F1190C882E301F772B609D12A' },
  { id: 'tm-7', level: 2, wallet: '0x6C44E11B2098A774F312D881C903E44B', sponsor: '0x4B91E88D2190F441C920B771E3129C3F', isDao: false, totalBusiness: 1400, lastStake: 'Oct 21, 2026', lastPackage: 'Silver', joined: 'Oct 16, 2026', regTx: '0x6C44E11B2098A774F312D881C903E44B' },
  { id: 'tm-8', level: 3, wallet: '0x1E89C22D4011F773B209A441D882C31F', sponsor: '0x5D02A44F1190C882E301F772B609D12A', isDao: false, totalBusiness: 2200, lastStake: 'Oct 20, 2026', lastPackage: 'Gold', joined: 'Oct 12, 2026', regTx: '0x1E89C22D4011F773B209A441D882C31F' },
  { id: 'tm-9', level: 4, wallet: '0x2B77F90A1134D662C801E339A502F88C', sponsor: '0x1E89C22D4011F773B209A441D882C31F', isDao: true, totalBusiness: 3100, lastStake: 'Oct 19, 2026', lastPackage: 'Platinum', joined: 'Oct 10, 2026', regTx: '0x2B77F90A1134D662C801E339A502F88C' },
  { id: 'tm-10', level: 5, wallet: '0x9A03D55E8821B114C709F228E401A99D', sponsor: '0x2B77F90A1134D662C801E339A502F88C', isDao: false, totalBusiness: 1600, lastStake: 'Oct 18, 2026', lastPackage: 'Silver', joined: 'Oct 08, 2026', regTx: '0x9A03D55E8821B114C709F228E401A99D' },
];

const INITIAL_DIRECT_LEGS = [
  { id: 'leg-1', role: 'Strong Leg', directPartner: '0x7A3F9D21B4C8E510F332A12B90F129D21', directStake: 5000, downlineBusiness: 7850, totalLegBusiness: 12850, legRank: 'Gold', teamMembers: 24, regTx: '0x8F3d77C19A204E88B11D4201F884A92E' },
  { id: 'leg-2', role: 'Weak Leg 1', directPartner: '0x4B91E88D2190F441C920B771E3129C3F', directStake: 5000, downlineBusiness: 1330, totalLegBusiness: 6330, legRank: 'Silver', teamMembers: 18, regTx: '0x7D21A409F182C330E941B662D119EBD4' },
];

const INITIAL_COMPOUNDS = [
  { id: 'cmp-1', amount: 250, lockTerm: '90 Days', bonusBoost: '+12% APY Boost', projectedReturn: 312.5, date: 'Oct 18, 2026', txHash: '0x5A11D22E4098C771B302F884E119C70A', status: 'Active' },
  { id: 'cmp-2', amount: 150, lockTerm: '30 Days', bonusBoost: '+5% APY Boost', projectedReturn: 168.75, date: 'Oct 02, 2026', txHash: '0x1C99F33B8821D440A612E901B334F20E', status: 'Matured' },
];

const INITIAL_REWARDS = [
  { id: 'rew-1', title: 'Silver Rank Weekly Payout', category: 'Rank Bonus', rewardUsd: 250, rewardHana: 150, requirement: 'Maintain Silver Rank ($10,000 Matching Business)', progress: 100, status: 'Claimable' },
  { id: 'rew-2', title: '10 Direct Stakers Milestone', category: 'Milestone', rewardUsd: 150, rewardHana: 200, requirement: '12 / 10 Active Direct Stakers', progress: 100, status: 'Claimable' },
  { id: 'rew-3', title: 'Bronze Rank Achievement Bonus', category: 'Rank Bonus', rewardUsd: 100, rewardHana: 100, requirement: 'Reached Bronze Tier', progress: 100, status: 'Claimed' },
  { id: 'rew-4', title: 'Gold Rank Leadership Pool', category: 'Leadership', rewardUsd: 500, rewardHana: 500, requirement: '68% toward Gold Rank ($25,000 Matching)', progress: 68, status: 'In Progress' },
];

const INITIAL_NOTIFICATIONS = [
  { id: 'n-1', title: 'ROI Ready to Claim', message: 'You have $165.00 USDT pending ROI across your active staking positions.', time: '5 mins ago', read: false },
  { id: 'n-2', title: 'Direct Income Credited', message: 'Received +$50.00 USDT and +50.00 HANA from 0x7A3...EBD4.', time: '2 hours ago', read: false },
  { id: 'n-3', title: 'Weekly Rank Reward Unlocked', message: 'Silver Rank weekly reward ($250.00) is ready to claim.', time: '1 day ago', read: true },
];

export const LEVEL_COUNTS_MAP = {
  1: 12, 2: 8, 3: 6, 4: 4, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1, 10: 1,
  11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0,
};

const DEFAULT_STATE = {
  network: 'bscTestnet',
  walletConnected: true,
  walletAddress: '0x7A3F9D21B4C8E510F332A12B90F12E88C44D9D21',
  sponsorAddress: '0x4B91E88D2190F441C920B771E3129C3F',
  userName: '0x7A3F...9D21',
  referralCode: 'SHL123',
  usdtBalance: 1250,
  hanaBalance: 1250,
  withdrawableUsdt: 1250,
  withdrawableHana: 128.75,
  totalInvested: 1000,
  totalStaked: 1000,
  totalEarned: 2850,
  totalWithdrawn: 1250,
  usdtReserve: 245320,
  hanaPool: 335420,
  daoMember: true,
  daoValidDays: 500,
  daoMembersCount: 124,
  positions: INITIAL_STAKING_POSITIONS,
  transactions: INITIAL_TRANSACTIONS,
  directIncomeEvents: INITIAL_DIRECT_INCOME_EVENTS,
  levelIncomeEvents: INITIAL_LEVEL_INCOME_EVENTS,
  teamMembers: INITIAL_TEAM_MEMBERS,
  directLegs: INITIAL_DIRECT_LEGS,
  compounds: INITIAL_COMPOUNDS,
  rewards: INITIAL_REWARDS,
  notifications: INITIAL_NOTIFICATIONS,
};

const STORAGE_KEY = 'hana_platform_state_v1';

const HanaContext = createContext(null);

function makeTxHash() {
  const chars = '0123456789ABCDEF';
  let hash = '0x';
  for (let i = 0; i < 32; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

function nowFormatted() {
  return 'Oct 27, 2026 ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatShortAddress(addr) {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function HanaProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_STATE;
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title, description, variant = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => {
        dismissToast(id);
      }, 4200);
    },
    [dismissToast]
  );

  const copyToClipboard = useCallback(
    async (text, label = 'Copied to clipboard') => {
      try {
        await navigator.clipboard.writeText(text);
        showToast(label, text.length > 36 ? `${text.slice(0, 18)}...${text.slice(-10)}` : text, 'info');
      } catch {
        showToast('Copy failed', 'Please copy manually from the field.', 'error');
      }
    },
    [showToast]
  );

  const switchNetwork = useCallback(
    async (net) => {
      const eth = window.ethereum;
      if (eth) {
        try {
          await eth.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CONTRACT_ADDRESSES[net].chainIdHex }],
          });
        } catch {
          // Fallback to updating app network context even if wallet extension isn't configured
        }
      }
      setState((prev) => ({ ...prev, network: net }));
      showToast('Network Switched', `Active network: ${CONTRACT_ADDRESSES[net].chainName}`, 'info');
    },
    [showToast]
  );

  const connectWallet = useCallback(async () => {
    const eth = window.ethereum;
    if (eth) {
      try {
        const accounts = await eth.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          setState((prev) => ({ ...prev, walletConnected: true, walletAddress: accounts[0] }));
          showToast('Wallet Connected', formatShortAddress(accounts[0]), 'success');
          return;
        }
      } catch {
        // User rejected or no extension unlocked; keep web3 session flow clean
      }
    }
    setState((prev) => ({ ...prev, walletConnected: true, walletAddress: DEFAULT_STATE.walletAddress }));
    showToast('Wallet Connected', formatShortAddress(DEFAULT_STATE.walletAddress), 'success');
  }, [showToast]);

  const disconnectWallet = useCallback(() => {
    setState((prev) => ({ ...prev, walletConnected: false }));
    showToast('Wallet Disconnected', 'Connect your BNB Smart Chain wallet to continue.', 'info');
  }, [showToast]);

  const stakePackage = useCallback(
    (pkg) => {
      if (!state.walletConnected) {
        showToast('Wallet Required', 'Please connect your wallet first.', 'error');
        return;
      }
      if (state.usdtBalance < pkg.amount) {
        showToast('Insufficient USDT Balance', `You need $${pkg.amount.toLocaleString()} USDT to stake ${pkg.name}.`, 'error');
        return;
      }
      const txHash = makeTxHash();
      const newPos = {
        id: `pos-${Date.now()}`,
        packageTier: pkg.tier,
        packageName: `${pkg.name} Package`,
        invested: pkg.amount,
        totalClaimed: 0,
        capAmount: pkg.amount * pkg.capMultiplier,
        pendingRoi: Number((pkg.amount * (pkg.dailyPercent / 100)).toFixed(2)),
        dailyRate: `Daily (${pkg.dailyPercent.toFixed(2)}%)`,
        startedAt: nowFormatted(),
        expiresAt: 'May 15, 2027',
        txHash,
      };
      const newTx = {
        id: `tx-${Date.now()}`,
        type: 'Staking',
        amountLabel: `$${pkg.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        amountUsd: pkg.amount,
        txHash,
        date: nowFormatted(),
        status: 'Success',
        details: `${pkg.name} Staking Position Created (2X Cap)`,
      };

      setState((prev) => ({
        ...prev,
        usdtBalance: Number((prev.usdtBalance - pkg.amount).toFixed(2)),
        totalInvested: prev.totalInvested + pkg.amount,
        totalStaked: prev.totalStaked + pkg.amount,
        positions: [newPos, ...prev.positions],
        transactions: [newTx, ...prev.transactions],
      }));
      showToast('Staking Position Activated', `Staked $${pkg.amount.toLocaleString()} USDT in ${pkg.name} Package.`, 'success');
    },
    [state.walletConnected, state.usdtBalance, showToast]
  );

  const claimRoi = useCallback(
    (positionId) => {
      const pos = state.positions.find((p) => p.id === positionId);
      if (!pos || pos.pendingRoi <= 0) {
        showToast('Nothing to Claim', 'No pending ROI is available on this position yet.', 'info');
        return;
      }
      const claimAmt = pos.pendingRoi;
      const txHash = makeTxHash();
      const newTx = {
        id: `tx-${Date.now()}`,
        type: 'ROI Claim',
        amountLabel: `$${claimAmt.toFixed(2)}`,
        amountUsd: claimAmt,
        txHash,
        date: nowFormatted(),
        status: 'Success',
        details: `Claimed ROI from ${pos.packageName}`,
      };
      setState((prev) => ({
        ...prev,
        withdrawableUsdt: Number((prev.withdrawableUsdt + claimAmt).toFixed(2)),
        totalEarned: Number((prev.totalEarned + claimAmt).toFixed(2)),
        positions: prev.positions.map((p) =>
          p.id === positionId
            ? {
                ...p,
                totalClaimed: Math.min(p.capAmount, Number((p.totalClaimed + claimAmt).toFixed(2))),
                pendingRoi: 0,
              }
            : p
        ),
        transactions: [newTx, ...prev.transactions],
      }));
      showToast('ROI Claimed On-Chain', `+$${claimAmt.toFixed(2)} USDT added to withdrawable balance.`, 'success');
    },
    [state.positions, showToast]
  );

  const withdrawUsdt = useCallback(
    (amount) => {
      if (amount <= 0 || amount > state.withdrawableUsdt || amount > 10000) {
        showToast('Invalid Withdrawal Amount', 'Enter an amount between $1 and your available limit ($10,000 max).', 'error');
        return;
      }
      const netReceive = Number((amount * 0.95).toFixed(2));
      const txHash = makeTxHash();
      const newTx = {
        id: `tx-${Date.now()}`,
        type: 'Withdraw USDT',
        amountLabel: `$${amount.toFixed(2)}`,
        amountUsd: amount,
        txHash,
        date: nowFormatted(),
        status: 'Success',
        details: `Net $${netReceive.toFixed(2)} USDT sent (5% Protocol Fee)`,
      };
      setState((prev) => ({
        ...prev,
        withdrawableUsdt: Number((prev.withdrawableUsdt - amount).toFixed(2)),
        totalWithdrawn: Number((prev.totalWithdrawn + amount).toFixed(2)),
        transactions: [newTx, ...prev.transactions],
      }));
      showToast('USDT Withdrawal Confirmed', `$${netReceive.toFixed(2)} USDT transferred to ${formatShortAddress(state.walletAddress)}.`, 'success');
    },
    [state.withdrawableUsdt, state.walletAddress, showToast]
  );

  const withdrawHana = useCallback(
    (amount) => {
      if (amount <= 0 || amount > state.withdrawableHana) {
        showToast('Invalid HANA Amount', 'Amount exceeds your withdrawable HANA balance.', 'error');
        return;
      }
      const txHash = makeTxHash();
      const hanaPrice = Number((state.usdtReserve / state.hanaPool).toFixed(4));
      const newTx = {
        id: `tx-${Date.now()}`,
        type: 'Withdraw HANA',
        amountLabel: `${amount.toFixed(2)} HANA`,
        amountUsd: Number((amount * hanaPrice).toFixed(2)),
        txHash,
        date: nowFormatted(),
        status: 'Success',
        details: `${amount.toFixed(4)} HANA sent to connected wallet`,
      };
      setState((prev) => ({
        ...prev,
        withdrawableHana: Number((prev.withdrawableHana - amount).toFixed(4)),
        hanaBalance: Number((prev.hanaBalance + amount).toFixed(4)),
        transactions: [newTx, ...prev.transactions],
      }));
      showToast('HANA Withdrawal Confirmed', `${amount.toFixed(4)} HANA transferred to your wallet.`, 'success');
    },
    [state.withdrawableHana, state.usdtReserve, state.hanaPool, showToast]
  );

  const buyHana = useCallback(
    (usdtAmount) => {
      if (usdtAmount <= 0 || usdtAmount > state.usdtBalance) {
        showToast('Invalid Swap Amount', 'Check your available USDT balance.', 'error');
        return;
      }
      const price = state.usdtReserve / state.hanaPool;
      const receivedHana = Number((usdtAmount / price).toFixed(2));
      const txHash = makeTxHash();
      const newTx = {
        id: `tx-${Date.now()}`,
        type: 'Buy HANA',
        amountLabel: `${receivedHana.toFixed(2)} HANA`,
        amountUsd: usdtAmount,
        txHash,
        date: nowFormatted(),
        status: 'Success',
        details: `Bought ${receivedHana.toFixed(2)} HANA for $${usdtAmount.toFixed(2)} USDT`,
      };
      setState((prev) => ({
        ...prev,
        usdtBalance: Number((prev.usdtBalance - usdtAmount).toFixed(2)),
        hanaBalance: Number((prev.hanaBalance + receivedHana).toFixed(2)),
        usdtReserve: Number((prev.usdtReserve + usdtAmount).toFixed(2)),
        hanaPool: Math.max(1000, Number((prev.hanaPool - receivedHana).toFixed(2))),
        transactions: [newTx, ...prev.transactions],
      }));
      showToast('HANA Purchase Executed', `Received ${receivedHana.toFixed(2)} HANA at $${price.toFixed(4)}.`, 'success');
    },
    [state.usdtBalance, state.usdtReserve, state.hanaPool, showToast]
  );

  const sellHana = useCallback(
    (hanaAmount) => {
      if (hanaAmount <= 0 || hanaAmount > state.hanaBalance) {
        showToast('Invalid HANA Amount', 'Amount exceeds your HANA token balance.', 'error');
        return;
      }
      const price = state.usdtReserve / state.hanaPool;
      const usdtOut = Number((hanaAmount * price).toFixed(2));
      const txHash = makeTxHash();
      const newTx = {
        id: `tx-${Date.now()}`,
        type: 'Sell & Burn HANA',
        amountLabel: `${hanaAmount.toFixed(2)} HANA`,
        amountUsd: usdtOut,
        txHash,
        date: nowFormatted(),
        status: 'Success',
        details: `Sold & permanently burned ${hanaAmount.toFixed(2)} HANA for $${usdtOut.toFixed(2)} USDT`,
      };
      setState((prev) => ({
        ...prev,
        hanaBalance: Number((prev.hanaBalance - hanaAmount).toFixed(2)),
        usdtBalance: Number((prev.usdtBalance + usdtOut).toFixed(2)),
        usdtReserve: Math.max(1000, Number((prev.usdtReserve - usdtOut).toFixed(2))),
        transactions: [newTx, ...prev.transactions],
      }));
      showToast('HANA Sold & Burned', `${hanaAmount.toFixed(2)} HANA burned; +$${usdtOut.toFixed(2)} USDT credited.`, 'success');
    },
    [state.hanaBalance, state.usdtReserve, state.hanaPool, showToast]
  );

  const compoundBalance = useCallback(
    (amount, lockTerm) => {
      if (amount <= 0 || amount > state.withdrawableUsdt) {
        showToast('Invalid Compound Amount', 'Amount exceeds your available compounding balance.', 'error');
        return;
      }
      const mult = lockTerm === '180 Days' ? 1.45 : lockTerm === '90 Days' ? 1.25 : 1.125;
      const boostLabel = lockTerm === '180 Days' ? '+20% APY Boost' : lockTerm === '90 Days' ? '+12% APY Boost' : '+5% APY Boost';
      const txHash = makeTxHash();
      const newCompound = {
        id: `cmp-${Date.now()}`,
        amount,
        lockTerm,
        bonusBoost: boostLabel,
        projectedReturn: Number((amount * mult).toFixed(2)),
        date: 'Oct 27, 2026',
        txHash,
        status: 'Active',
      };
      const newTx = {
        id: `tx-${Date.now()}`,
        type: 'Compound',
        amountLabel: `$${amount.toFixed(2)}`,
        amountUsd: amount,
        txHash,
        date: nowFormatted(),
        status: 'Success',
        details: `Compounded into ${lockTerm} Vault (${boostLabel})`,
      };
      setState((prev) => ({
        ...prev,
        withdrawableUsdt: Number((prev.withdrawableUsdt - amount).toFixed(2)),
        totalStaked: Number((prev.totalStaked + amount).toFixed(2)),
        compounds: [newCompound, ...prev.compounds],
        transactions: [newTx, ...prev.transactions],
      }));
      showToast('Compounding Activated', `$${amount.toFixed(2)} USDT compounded for ${lockTerm}.`, 'success');
    },
    [state.withdrawableUsdt, showToast]
  );

  const stakeDaoPackage = useCallback(() => {
    const daoCost = 5000;
    const txHash = makeTxHash();
    const newPos = {
      id: `pos-dao-${Date.now()}`,
      packageTier: 'DAO',
      packageName: 'Special $5,000 DAO Staker',
      invested: daoCost,
      totalClaimed: 0,
      capAmount: 25000,
      pendingRoi: 125,
      dailyRate: 'Daily (2.50%)',
      startedAt: nowFormatted(),
      expiresAt: 'Mar 12, 2028',
      txHash,
    };
    const newTx = {
      id: `tx-${Date.now()}`,
      type: 'DAO Stake',
      amountLabel: '$5,000.00',
      amountUsd: daoCost,
      txHash,
      date: nowFormatted(),
      status: 'Success',
      details: 'Special $5,000 DAO Staker Package (5X Cap • 500 Days)',
    };
    setState((prev) => ({
      ...prev,
      daoMember: true,
      daoValidDays: 500,
      daoMembersCount: Math.min(500, prev.daoMembersCount + 1),
      totalInvested: prev.totalInvested + daoCost,
      totalStaked: prev.totalStaked + daoCost,
      positions: [newPos, ...prev.positions],
      transactions: [newTx, ...prev.transactions],
    }));
    showToast('DAO Staker Package Activated', '5X Stake Multiplier & 500-Day DAO Membership confirmed!', 'success');
  }, [showToast]);

  const claimReward = useCallback(
    (rewardId) => {
      const reward = state.rewards.find((r) => r.id === rewardId);
      if (!reward || reward.status !== 'Claimable') return;
      const txHash = makeTxHash();
      const newTx = {
        id: `tx-${Date.now()}`,
        type: reward.category === 'Rank Bonus' ? 'Rank Reward' : 'Reward Bonus',
        amountLabel: `$${reward.rewardUsd.toFixed(2)}`,
        amountUsd: reward.rewardUsd,
        txHash,
        date: nowFormatted(),
        status: 'Success',
        details: `${reward.title} (+${reward.rewardHana} HANA)`,
      };
      setState((prev) => ({
        ...prev,
        withdrawableUsdt: Number((prev.withdrawableUsdt + reward.rewardUsd).toFixed(2)),
        withdrawableHana: Number((prev.withdrawableHana + reward.rewardHana).toFixed(2)),
        totalEarned: Number((prev.totalEarned + reward.rewardUsd).toFixed(2)),
        rewards: prev.rewards.map((r) => (r.id === rewardId ? { ...r, status: 'Claimed' } : r)),
        transactions: [newTx, ...prev.transactions],
      }));
      showToast('Reward Claimed', `+$${reward.rewardUsd.toFixed(2)} USDT & +${reward.rewardHana} HANA credited!`, 'success');
    },
    [state.rewards, showToast]
  );

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const resetDemoState = useCallback(() => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Account State Refreshed', 'Synced latest BSC Testnet snapshot.', 'info');
  }, [showToast]);

  const hanaPrice = Number((state.usdtReserve / state.hanaPool).toFixed(4));
  const shortWallet = formatShortAddress(state.walletAddress);
  const referralLink = `https://hana.io/register?ref=${state.referralCode}`;
  const activeContracts = CONTRACT_ADDRESSES[state.network];

  return (
    <HanaContext.Provider
      value={{
        ...state,
        hanaPrice,
        shortWallet,
        referralLink,
        activeContracts,
        toasts,
        showToast,
        dismissToast,
        copyToClipboard,
        switchNetwork,
        connectWallet,
        disconnectWallet,
        stakePackage,
        claimRoi,
        withdrawUsdt,
        withdrawHana,
        buyHana,
        sellHana,
        compoundBalance,
        stakeDaoPackage,
        claimReward,
        markAllNotificationsRead,
        resetDemoState,
      }}
    >
      {children}
    </HanaContext.Provider>
  );
}

export function useHana() {
  const ctx = useContext(HanaContext);
  if (!ctx) throw new Error('useHana must be used within HanaProvider');
  return ctx;
}
