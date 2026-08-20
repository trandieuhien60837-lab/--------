import React from 'react';
import { 
  PlusCircle, 
  Layers, 
  BarChart3, 
  UserCheck, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight,
  Megaphone,
  Gift,
  Settings,
  MessageSquare,
  Users,
  Crown,
  TrendingUp,
  Receipt,
  Sliders
} from 'lucide-react';
import { PageType } from '../types';

interface SidebarProps {
  currentPage: PageType;
  onSelectPage: (page: PageType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingAuditCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  collapsed,
  onToggleCollapse,
  pendingAuditCount
}) => {
  const allianceMenuItems = [
    {
      id: 'create-activity' as PageType,
      label: '创建联盟活动',
      icon: PlusCircle,
      description: '配置多商户跨店满单激励'
    },
    {
      id: 'activity-list' as PageType,
      label: '活动管理列表',
      icon: Layers,
      description: '全生命周期活动管控'
    },
    {
      id: 'activity-dashboard' as PageType,
      label: '活动数据看板',
      icon: BarChart3,
      description: '拉新留存与行为分析'
    },
    {
      id: 'merchant-audit' as PageType,
      label: '商家报名审核',
      icon: UserCheck,
      badge: pendingAuditCount > 0 ? pendingAuditCount : undefined,
      description: '商户准入与资质审批'
    },
    {
      id: 'settlement' as PageType,
      label: '结算对账管理',
      icon: CreditCard,
      description: '券补贴与商家分摊'
    }
  ];

  const newcomerMenuItems = [
    {
      id: 'newcomer-rules' as PageType,
      label: '规则配置',
      icon: Settings,
      description: '迎新红包组合与发放逻辑'
    },
    {
      id: 'wechat-binding' as PageType,
      label: '公众号绑定',
      icon: MessageSquare,
      description: '服务号接入与凭证配置'
    },
    {
      id: 'inactive-recall' as PageType,
      label: '不活跃召回策略',
      icon: Users,
      description: '沉睡用户流失召回与定时推送'
    }
  ];

  const memberMenuItems = [
    {
      id: 'member-config' as PageType,
      label: '活动配置',
      icon: Sliders,
      description: '售价、红包组合与补贴规则'
    },
    {
      id: 'member-analytics' as PageType,
      label: '数据监控',
      icon: TrendingUp,
      description: '购买核销趋势与商户收益'
    },
    {
      id: 'member-settlement' as PageType,
      label: '补贴结算管理',
      icon: Receipt,
      description: '商户补贴账单对账与打款'
    }
  ];

  return (
    <aside 
      id="admin-sidebar"
      className={`bg-[#001529] flex flex-col transition-all duration-300 select-none z-30 shrink-0 border-r border-[#002140] ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 justify-between border-b border-gray-800/80 bg-[#002140]/60">
        {!collapsed ? (
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded bg-[#1890ff] flex items-center justify-center text-white shrink-0 font-bold shadow-sm">
              <Megaphone className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>管理后台</span>
                <span className="text-[10px] bg-[#1890ff]/20 text-[#1890ff] font-medium px-1.5 py-0.2 rounded border border-[#1890ff]/30">
                  营销中台
                </span>
              </div>
              <div className="text-[11px] text-gray-400 font-mono">Marketing Platform</div>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-8 h-8 rounded bg-[#1890ff] flex items-center justify-center text-white font-bold shadow-sm">
            <Megaphone className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-4 space-y-5 overflow-y-auto">
        {/* Group 1: 联盟活动 */}
        <div>
          {!collapsed && (
            <div className="px-5 mb-2 text-xs uppercase tracking-wider text-gray-400 font-medium">
              跨商户联盟活动
            </div>
          )}
          <nav className="space-y-0.5">
            {allianceMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onSelectPage(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    collapsed ? 'justify-center px-2 py-2.5' : 'px-5 py-2.5'
                  } text-sm font-medium transition-colors relative group ${
                    isActive
                      ? 'bg-[#1890ff] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    } ${collapsed ? '' : 'mr-3'}`}
                  />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between text-left truncate">
                      <span className="truncate text-[13px]">{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                  {collapsed && item.badge !== undefined && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Group 2: 新人红包 (一级入口) */}
        <div>
          {!collapsed && (
            <div className="px-5 mb-2 text-xs uppercase tracking-wider text-gray-400 font-medium flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-rose-400" />
              <span>新人红包</span>
            </div>
          )}
          {collapsed && (
            <div className="h-[1px] bg-gray-800 mx-4 my-2" />
          )}
          <nav className="space-y-0.5">
            {newcomerMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onSelectPage(item.id)}
                  title={collapsed ? `新人红包 - ${item.label}` : undefined}
                  className={`w-full flex items-center ${
                    collapsed ? 'justify-center px-2 py-2.5' : 'px-5 py-2.5'
                  } text-sm font-medium transition-colors relative group ${
                    isActive
                      ? 'bg-[#1890ff] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    } ${collapsed ? '' : 'mr-3'}`}
                  />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between text-left truncate">
                      <span className="truncate text-[13px]">{item.label}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Group 3: 会员红包 (一级入口) */}
        <div>
          {!collapsed && (
            <div className="px-5 mb-2 text-xs uppercase tracking-wider text-amber-400 font-medium flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>会员红包</span>
            </div>
          )}
          {collapsed && (
            <div className="h-[1px] bg-gray-800 mx-4 my-2" />
          )}
          <nav className="space-y-0.5">
            {memberMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onSelectPage(item.id)}
                  title={collapsed ? `会员红包 - ${item.label}` : undefined}
                  className={`w-full flex items-center ${
                    collapsed ? 'justify-center px-2 py-2.5' : 'px-5 py-2.5'
                  } text-sm font-medium transition-colors relative group ${
                    isActive
                      ? 'bg-[#1890ff] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    } ${collapsed ? '' : 'mr-3'}`}
                  />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between text-left truncate">
                      <span className="truncate text-[13px]">{item.label}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / User Profile & Version */}
      <div className="p-3 border-t border-gray-800 bg-[#001020] space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-gray-300">
            <div className="w-7 h-7 rounded bg-[#1890ff] flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">管理员 · 营销中台</div>
              <div className="text-[10px] text-gray-400 truncate">admin@company.com</div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between px-1 text-xs text-gray-500">
          {!collapsed && <span className="font-mono text-[11px]">v2.4.0-Stable</span>}
          <button
            id="toggle-sidebar-btn"
            onClick={onToggleCollapse}
            className="flex items-center justify-center p-1 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors"
            title={collapsed ? '展开导航' : '收起导航'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
