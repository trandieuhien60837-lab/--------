import React from 'react';
import { 
  Bell, 
  Search, 
  HelpCircle, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { PageType } from '../types';

interface HeaderProps {
  currentPage: PageType;
  onSelectPage: (page: PageType) => void;
  onQuickResetData?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onSelectPage,
  onQuickResetData
}) => {
  const getBreadcrumb = () => {
    switch (currentPage) {
      case 'create-activity':
        return [
          { label: '营销中心', href: '#' },
          { label: '联盟活动', href: '#' },
          { label: '创建活动', current: true }
        ];
      case 'activity-list':
        return [
          { label: '营销中心', href: '#' },
          { label: '联盟活动', href: '#' },
          { label: '活动管理列表', current: true }
        ];
      case 'activity-dashboard':
        return [
          { label: '营销中心', href: '#' },
          { label: '数据分析', href: '#' },
          { label: '活动数据看板 (含拉新/留存)', current: true }
        ];
      case 'merchant-audit':
        return [
          { label: '营销中心', href: '#' },
          { label: '商家准入', href: '#' },
          { label: '商家报名审核', current: true }
        ];
      case 'settlement':
        return [
          { label: '营销中心', href: '#' },
          { label: '财务对账', href: '#' },
          { label: '结算管理', current: true }
        ];
      case 'newcomer-rules':
        return [
          { label: '营销中心', href: '#' },
          { label: '新人红包', href: '#' },
          { label: '规则配置', current: true }
        ];
      case 'wechat-binding':
        return [
          { label: '营销中心', href: '#' },
          { label: '新人红包', href: '#' },
          { label: '公众号绑定设置', current: true }
        ];
      case 'inactive-recall':
        return [
          { label: '营销中心', href: '#' },
          { label: '新人红包', href: '#' },
          { label: '不活跃用户召回策略', current: true }
        ];
      case 'member-config':
        return [
          { label: '营销中心', href: '#' },
          { label: '会员红包包', href: '#' },
          { label: '活动配置', current: true }
        ];
      case 'member-analytics':
        return [
          { label: '营销中心', href: '#' },
          { label: '会员红包包', href: '#' },
          { label: '数据监控', current: true }
        ];
      case 'member-settlement':
        return [
          { label: '营销中心', href: '#' },
          { label: '会员红包包', href: '#' },
          { label: '补贴结算管理', current: true }
        ];
    }
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header className="h-16 bg-white border-b border-[#e8e8e8] px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              {idx > 0 && <span className="text-gray-400 font-normal">/</span>}
              {crumb.current ? (
                <span className="text-gray-900 font-medium">
                  {crumb.label}
                </span>
              ) : (
                <span className="text-gray-500 hover:text-[#1890ff] cursor-pointer transition-colors">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Search & Actions */}
      <div className="flex items-center space-x-4">
        {/* Quick Page Quick Switcher (for evaluation) */}
        <div className="hidden xl:flex items-center bg-[#f0f2f5] p-1 rounded border border-[#d9d9d9] text-xs">
          <button
            onClick={() => onSelectPage('create-activity')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              currentPage === 'create-activity'
                ? 'bg-white text-[#1890ff] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            1. 创建活动
          </button>
          <button
            onClick={() => onSelectPage('activity-list')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              currentPage === 'activity-list'
                ? 'bg-white text-[#1890ff] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            2. 活动列表
          </button>
          <button
            onClick={() => onSelectPage('activity-dashboard')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              currentPage === 'activity-dashboard'
                ? 'bg-white text-[#1890ff] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            3. 数据看板
          </button>
          <button
            onClick={() => onSelectPage('merchant-audit')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              currentPage === 'merchant-audit'
                ? 'bg-white text-[#1890ff] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            4. 商家审核
          </button>
          <button
            onClick={() => onSelectPage('settlement')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              currentPage === 'settlement'
                ? 'bg-white text-[#1890ff] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            5. 结算管理
          </button>
        </div>

        {/* Global Search */}
        <div className="relative hidden md:block w-44">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索活动 / 商家..."
            className="w-full pl-8 pr-3 py-1 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]/20 text-[#262626]"
          />
        </div>

        {/* User profile capsule */}
        <div className="flex items-center space-x-3 border-l border-[#e8e8e8] pl-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1890ff] text-xs font-bold">
              AD
            </div>
            <span className="text-sm font-medium text-gray-800 hidden sm:inline">管理员</span>
          </div>

          <button 
            title="通知公告"
            className="relative p-1.5 text-gray-500 hover:text-[#1890ff] hover:bg-gray-50 rounded transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#1890ff] rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
