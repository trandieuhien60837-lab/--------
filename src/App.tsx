import React, { useState } from 'react';
import { PageType, ActivityItem, MerchantAuditItem, ActivityStatus } from './types';
import { INITIAL_ACTIVITIES, INITIAL_MERCHANTS_AUDIT } from './mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CreateActivityPage } from './components/CreateActivityPage';
import { ActivityListPage } from './components/ActivityListPage';
import { ActivityDashboardPage } from './components/ActivityDashboardPage';
import { MerchantAuditPage } from './components/MerchantAuditPage';
import { SettlementPage } from './components/SettlementPage';
import { NewcomerRulesPage } from './components/NewcomerRulesPage';
import { WechatBindingPage } from './components/WechatBindingPage';
import { InactiveRecallPage } from './components/InactiveRecallPage';
import { MemberConfigPage } from './components/MemberConfigPage';
import { MemberAnalyticsPage } from './components/MemberAnalyticsPage';
import { MemberSettlementPage } from './components/MemberSettlementPage';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageType>('create-activity');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Activities State
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  
  // Merchant Audit State
  const [merchantsAudit, setMerchantsAudit] = useState<MerchantAuditItem[]>(INITIAL_MERCHANTS_AUDIT);
  
  // Active activity selected for dashboard drilldown
  const [dashboardActivityId, setDashboardActivityId] = useState<string>('ACT-20250101');

  // Handle Save from Create Form
  const handleSaveActivity = (newActivity: ActivityItem, isDraft: boolean) => {
    setActivities(prev => [newActivity, ...prev]);
  };

  // Handle Update Status
  const handleUpdateActivityStatus = (id: string, newStatus: ActivityStatus) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  // Handle Terminate
  const handleTerminateActivity = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status: 'ended' } : a));
  };

  // Handle Merchant Audit Status Change
  const handleAuditStatusChange = (id: string, newStatus: 'approved' | 'rejected', reason?: string) => {
    setMerchantsAudit(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: newStatus,
          rejectReason: reason || m.rejectReason
        };
      }
      return m;
    }));
  };

  // Navigate to Dashboard with specific activity
  const handleNavigateToDashboard = (activityId: string) => {
    setDashboardActivityId(activityId);
    setCurrentPage('activity-dashboard');
  };

  const pendingAuditCount = merchantsAudit.filter(m => m.status === 'pending').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f0f2f5] font-sans text-[#262626] antialiased selection:bg-[#1890ff] selection:text-white">
      {/* Left Navigation Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page) => setCurrentPage(page)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        pendingAuditCount={pendingAuditCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#f0f2f5]">
        {/* Top Header */}
        <Header
          currentPage={currentPage}
          onSelectPage={(page) => setCurrentPage(page)}
        />

        {/* Dynamic Page Rendering */}
        <main className="flex-1 overflow-y-auto">
          {currentPage === 'create-activity' && (
            <CreateActivityPage
              onSaveActivity={handleSaveActivity}
              onNavigateToList={() => setCurrentPage('activity-list')}
            />
          )}

          {currentPage === 'activity-list' && (
            <ActivityListPage
              activities={activities}
              onNavigateToCreate={() => setCurrentPage('create-activity')}
              onNavigateToDashboard={handleNavigateToDashboard}
              onUpdateActivityStatus={handleUpdateActivityStatus}
              onDeleteOrTerminate={handleTerminateActivity}
            />
          )}

          {currentPage === 'activity-dashboard' && (
            <ActivityDashboardPage
              activities={activities}
              currentSelectedActivityId={dashboardActivityId}
            />
          )}

          {currentPage === 'merchant-audit' && (
            <MerchantAuditPage
              merchants={merchantsAudit}
              activities={activities}
              onAuditStatusChange={handleAuditStatusChange}
            />
          )}

          {currentPage === 'settlement' && (
            <SettlementPage
              activities={activities}
            />
          )}

          {currentPage === 'newcomer-rules' && (
            <NewcomerRulesPage
              onNavigateToTab={(page) => setCurrentPage(page)}
            />
          )}

          {currentPage === 'wechat-binding' && (
            <WechatBindingPage
              onNavigateToTab={(page) => setCurrentPage(page)}
            />
          )}

          {currentPage === 'inactive-recall' && (
            <InactiveRecallPage
              onNavigateToTab={(page) => setCurrentPage(page)}
            />
          )}

          {currentPage === 'member-config' && (
            <MemberConfigPage
              onNavigateToTab={(page) => setCurrentPage(page)}
            />
          )}

          {currentPage === 'member-analytics' && (
            <MemberAnalyticsPage
              onNavigateToTab={(page) => setCurrentPage(page)}
            />
          )}

          {currentPage === 'member-settlement' && (
            <MemberSettlementPage
              onNavigateToTab={(page) => setCurrentPage(page)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
