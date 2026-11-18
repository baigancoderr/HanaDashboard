import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HanaProvider } from './context/HanaContext';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { InvestmentPage } from './pages/InvestmentPage';
import { StakingPage } from './pages/StakingPage';
import { CompoundingPage } from './pages/CompoundingPage';
import { DaoPage } from './pages/DaoPage';
import { TokenPage } from './pages/TokenPage';
import { MyTeamPage } from './pages/MyTeamPage';
import { DirectIncomePage } from './pages/DirectIncomePage';
import { LevelIncomePage } from './pages/LevelIncomePage';
import { RewardsPage } from './pages/RewardsPage';
import { RankPage } from './pages/RankPage';
import { WithdrawPage } from './pages/WithdrawPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { SettingsPage } from './pages/SettingsPage';
import {
  PackagesPage,
  ReferralPage,
  IncomeReportPage,
  RankRewardsPage,
  ResourcesPage,
  SupportPage,
} from './pages/SecondaryPages';

export default function App() {
  return (
    <BrowserRouter>
      <HanaProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/investment" element={<InvestmentPage />} />
            <Route path="/staking" element={<StakingPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/compounding" element={<CompoundingPage />} />
            <Route path="/dao" element={<DaoPage />} />
            <Route path="/token" element={<TokenPage />} />
            <Route path="/team" element={<MyTeamPage />} />
            <Route path="/referral" element={<ReferralPage />} />
            <Route path="/direct-income" element={<DirectIncomePage />} />
            <Route path="/level-income" element={<LevelIncomePage />} />
            <Route path="/income-report" element={<IncomeReportPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/rank" element={<RankPage />} />
            <Route path="/rank-rewards" element={<RankRewardsPage />} />
            <Route path="/withdraw" element={<WithdrawPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </HanaProvider>
    </BrowserRouter>
  );
}
