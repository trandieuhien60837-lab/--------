import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  Percent, 
  TrendingUp, 
  Download, 
  Calendar, 
  Search, 
  Filter, 
  Share2, 
  Layers, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  Info,
  Compass,
  PieChart as PieIcon,
  LineChart as LineIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { ActivityItem, UserBehaviorItem, RetentionDataPoint } from '../types';
import { INITIAL_USER_BEHAVIORS, RETENTION_TREND, ACQUISITION_CHANNELS } from '../mockData';

interface ActivityDashboardPageProps {
  activities: ActivityItem[];
  currentSelectedActivityId?: string;
}

export const ActivityDashboardPage: React.FC<ActivityDashboardPageProps> = ({
  activities,
  currentSelectedActivityId
}) => {
  // Activity Selection Filter
  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    currentSelectedActivityId || (activities[0]?.id ?? 'ACT-20250101')
  );
  
  // Time Range Filter
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d' | 'all'>('30d');

  // User Behavior Table Search and Filters
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'new' | 'old'>('all');
  
  // Metric toggle for retention chart
  const [retentionMetric, setRetentionMetric] = useState<'all' | 'day1' | 'day7' | 'repurchase'>('all');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedActivity = activities.find(a => a.id === selectedActivityId) || activities[0];

  // Filtered user behavior list
  const filteredUsers = INITIAL_USER_BEHAVIORS.filter((u) => {
    const matchSearch = u.userId.includes(userSearchQuery) || u.phoneMasked.includes(userSearchQuery);
    const matchType = userTypeFilter === 'all' 
      ? true 
      : userTypeFilter === 'new' ? u.isNewUser : !u.isNewUser;
    return matchSearch && matchType;
  });

  const handleExportUserBehavior = () => {
    showToast(`已成功导出「${selectedActivity?.name || '活动'}」用户行为与拉新明细表 (.CSV)`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded border border-[#e8e8e8] shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* 活动下拉选择 */}
          <div className="relative">
            <select
              id="dashboard-activity-select"
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              className="border border-[#d9d9d9] rounded px-3 py-1.5 text-xs text-[#262626] bg-white outline-none focus:border-[#1890ff]"
            >
              {activities.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.name} ({act.status === 'active' ? '进行中' : act.status === 'ended' ? '已结束' : '已暂停'})
                </option>
              ))}
            </select>
          </div>

          {/* 时间范围显示 */}
          <div className="flex items-center border border-[#d9d9d9] rounded overflow-hidden text-xs bg-white">
            <input 
              type="text" 
              value={selectedActivity?.startDate || '2025-01-01'} 
              className="w-24 px-2.5 py-1.5 text-xs text-gray-700 outline-none" 
              readOnly 
            />
            <span className="bg-[#fafafa] px-2 py-1.5 text-gray-400 text-xs border-x border-[#d9d9d9]">至</span>
            <input 
              type="text" 
              value={selectedActivity?.endDate || '2025-01-31'} 
              className="w-24 px-2.5 py-1.5 text-xs text-gray-700 outline-none" 
              readOnly 
            />
          </div>

          {/* 时间周期筛选 */}
          <div className="flex items-center border border-[#d9d9d9] rounded overflow-hidden text-xs bg-white">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1.5 text-xs transition-colors ${
                timeRange === '7d' ? 'bg-[#1890ff] text-white font-medium' : 'text-gray-600 hover:text-gray-900 bg-white'
              }`}
            >
              近7天
            </button>
            <button
              onClick={() => setTimeRange('14d')}
              className={`px-2.5 py-1.5 text-xs border-l border-[#d9d9d9] transition-colors ${
                timeRange === '14d' ? 'bg-[#1890ff] text-white font-medium' : 'text-gray-600 hover:text-gray-900 bg-white'
              }`}
            >
              近14天
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1.5 text-xs border-l border-[#d9d9d9] transition-colors ${
                timeRange === '30d' ? 'bg-[#1890ff] text-white font-medium' : 'text-gray-600 hover:text-gray-900 bg-white'
              }`}
            >
              近30天
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-2.5 py-1.5 text-xs border-l border-[#d9d9d9] transition-colors ${
                timeRange === 'all' ? 'bg-[#1890ff] text-white font-medium' : 'text-gray-600 hover:text-gray-900 bg-white'
              }`}
            >
              全周期
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => showToast('已刷新最新看板统计数据')}
            className="px-4 py-1.5 bg-[#1890ff] text-white rounded text-xs hover:bg-blue-600 font-medium transition-colors"
          >
            查询
          </button>
          <button
            type="button"
            onClick={handleExportUserBehavior}
            className="px-4 py-1.5 border border-[#d9d9d9] bg-white rounded text-xs text-gray-700 hover:border-[#1890ff] hover:text-[#1890ff] transition-colors"
          >
            导出
          </button>
        </div>
      </div>

      {/* 核心指标卡片 (横排展示 4张) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. 活动参与用户数 */}
        <div className="bg-white p-4 rounded border border-[#e8e8e8] shadow-xs">
          <div className="text-gray-500 text-xs mb-1">活动参与用户数</div>
          <div className="text-2xl font-bold text-[#262626] flex items-baseline gap-2">
            <span>3,520</span>
            <span className="text-xs font-normal text-emerald-500">+12%</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-1">较昨日跨店活跃提升</div>
        </div>

        {/* 2. 新增用户数 */}
        <div className="bg-white p-4 rounded border border-[#e8e8e8] shadow-xs">
          <div className="text-gray-500 text-xs mb-1">新增用户数</div>
          <div className="text-2xl font-bold text-[#262626] flex items-baseline gap-2">
            <span>1,240</span>
            <span className="text-xs font-normal text-emerald-500">+5.4%</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-1">拉新目标达成率 124%</div>
        </div>

        {/* 3. 老用户数 */}
        <div className="bg-white p-4 rounded border border-[#e8e8e8] shadow-xs">
          <div className="text-gray-500 text-xs mb-1">老用户数</div>
          <div className="text-2xl font-bold text-[#262626] flex items-baseline gap-2">
            <span>2,280</span>
            <span className="text-xs font-normal text-gray-400">-1.2%</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-1">活跃复购留存稳定</div>
        </div>

        {/* 4. 新客占比 */}
        <div className="bg-white p-4 rounded border border-[#e8e8e8] shadow-xs">
          <div className="text-gray-500 text-xs mb-1">新客占比</div>
          <div className="text-2xl font-bold text-[#262626] flex items-baseline gap-2">
            <span>35.2%</span>
            <span className="text-xs font-normal text-[#1890ff]">优于均值</span>
          </div>
          <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#1890ff] h-1.5 rounded-full" style={{ width: '35.2%' }}></div>
          </div>
        </div>
      </div>

      {/* Middle Section: 1. 留存趋势分析 & 2. 新客来源分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 留存趋势分析 (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded border border-[#e8e8e8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-sm font-bold text-[#262626] mb-3 flex justify-between items-center">
              <span>留存趋势分析</span>
              <div className="flex items-center space-x-3 text-xs font-normal text-gray-500">
                <span className="flex items-center gap-1 text-[#1890ff]">
                  <span className="w-2 h-2 rounded-full bg-[#1890ff]"></span> 次日留存
                </span>
                <span className="flex items-center gap-1 text-[#fa8c16]">
                  <span className="w-2 h-2 rounded-full bg-[#fa8c16]"></span> 7日留存
                </span>
                <span className="flex items-center gap-1 text-[#52c41a]">
                  <span className="w-2 h-2 rounded-full bg-[#52c41a]"></span> 期间复购
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-2.5 bg-[#fafafa] rounded border border-[#f0f0f0]">
                <div className="text-[11px] text-gray-500">次日留存率</div>
                <div className="text-base font-bold text-[#1890ff]">45.0%</div>
              </div>
              <div className="p-2.5 bg-[#fafafa] rounded border border-[#f0f0f0]">
                <div className="text-[11px] text-gray-500">7日留存率</div>
                <div className="text-base font-bold text-[#fa8c16]">28.0%</div>
              </div>
              <div className="p-2.5 bg-[#fafafa] rounded border border-[#f0f0f0]">
                <div className="text-[11px] text-gray-500">活动期间复购率</div>
                <div className="text-base font-bold text-[#52c41a]">38.0%</div>
              </div>
            </div>

            <div className="h-48 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={RETENTION_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8c8c8c' }} axisLine={{ stroke: '#d9d9d9' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#8c8c8c' }} domain={[0, 60]} unit="%" axisLine={false} />
                  <Tooltip
                    contentStyle={{ fontSize: '11px', borderRadius: '4px', border: '1px solid #d9d9d9', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    formatter={(value: any) => [`${value}%`, '']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="day1" 
                    name="次日留存率" 
                    stroke="#1890ff" 
                    strokeWidth={2} 
                    dot={{ r: 2.5, fill: '#1890ff' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="day7" 
                    name="7日留存率" 
                    stroke="#fa8c16" 
                    strokeWidth={2} 
                    dot={{ r: 2.5, fill: '#fa8c16' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="repurchaseRate" 
                    name="活动期间复购率" 
                    stroke="#52c41a" 
                    strokeWidth={2} 
                    strokeDasharray="4 4"
                    dot={{ r: 2.5, fill: '#52c41a' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 新客来源分布 (1 Col) */}
        <div className="bg-white p-5 rounded border border-[#e8e8e8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-sm font-bold text-[#262626] mb-3 flex items-center justify-between">
              <span>新客来源分布</span>
              <span className="text-xs text-[#1890ff] font-normal">转化率: 62%</span>
            </div>
            
            <div className="flex flex-col space-y-3.5 pt-1">
              <div className="flex items-center">
                <div className="w-20 text-xs text-gray-500">自然流量</div>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-[45%] h-full bg-[#1890ff] rounded-full"></div>
                </div>
                <div className="w-10 text-right text-xs font-bold text-[#262626] ml-2">45%</div>
              </div>

              <div className="flex items-center">
                <div className="w-20 text-xs text-gray-500">活动分享</div>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-[30%] h-full bg-[#52c41a] rounded-full"></div>
                </div>
                <div className="w-10 text-right text-xs font-bold text-[#262626] ml-2">30%</div>
              </div>

              <div className="flex items-center">
                <div className="w-20 text-xs text-gray-500">外部渠道</div>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-[15%] h-full bg-[#fa8c16] rounded-full"></div>
                </div>
                <div className="w-10 text-right text-xs font-bold text-[#262626] ml-2">15%</div>
              </div>

              <div className="flex items-center">
                <div className="w-20 text-xs text-gray-500">其他引流</div>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-[10%] h-full bg-gray-300 rounded-full"></div>
                </div>
                <div className="w-10 text-right text-xs font-bold text-[#262626] ml-2">10%</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f0f0f0] text-[11px] text-gray-400 flex justify-between">
            <span>总新客样本数：1,240 人</span>
            <span>更新时间：实时</span>
          </div>
        </div>
      </div>

      {/* Module C: 用户行为明细表 */}
      <div className="bg-white rounded border border-[#e8e8e8] shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-[#fafafa] border-b border-[#e8e8e8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#262626]">用户行为明细</span>
            <span className="text-xs text-gray-400 hidden sm:inline">跨店订单、领券与核销转化记录</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative w-44">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="搜索用户ID / 手机..."
                className="w-full pl-7 pr-2.5 py-1 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff]"
              />
            </div>

            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value as any)}
              className="px-2.5 py-1 text-xs bg-white border border-[#d9d9d9] rounded text-gray-700 outline-none"
            >
              <option value="all">全部客群</option>
              <option value="new">仅新客</option>
              <option value="old">仅老客</option>
            </select>

            <button
              onClick={handleExportUserBehavior}
              className="px-3 py-1 text-xs text-[#1890ff] hover:bg-blue-50 rounded border border-[#1890ff]/30 transition-colors"
            >
              查看完整数据
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs" id="user-behavior-table">
            <thead className="bg-[#fafafa] text-gray-500">
              <tr className="border-b border-[#e8e8e8]">
                <th className="px-4 py-2.5 font-medium">用户ID</th>
                <th className="px-4 py-2.5 font-medium">是否新客</th>
                <th className="px-4 py-2.5 font-medium">首单时间</th>
                <th className="px-4 py-2.5 font-medium text-center">累计订单</th>
                <th className="px-4 py-2.5 font-medium text-center">发券/核销</th>
                <th className="px-4 py-2.5 font-medium">最近活跃</th>
                <th className="px-4 py-2.5 font-medium text-center">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 transition-colors"
                  id={`user-row-${user.userId}`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#262626] flex items-center gap-1.5">
                      <span>{user.userId}</span>
                      {user.userId === '用户1001' && (
                        <span className="text-[10px] bg-blue-50 text-[#1890ff] px-1.5 py-0.2 rounded border border-blue-100">
                          示例
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-400">{user.phoneMasked}</div>
                  </td>

                  <td className="px-4 py-3">
                    {user.isNewUser ? (
                      <span className="px-2 py-0.5 bg-blue-50 text-[#1890ff] rounded text-[10px] font-medium border border-blue-100">
                        新客
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">
                        老客
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">
                    {user.firstOrderTime}
                  </td>

                  <td className="px-4 py-3 text-center font-medium text-[#262626]">
                    {user.totalOrders} 单
                  </td>

                  <td className="px-4 py-3 text-center font-mono">
                    <span className="text-gray-700">{user.issuedCoupons}</span>
                    <span className="text-gray-300 mx-1">/</span>
                    <span className={user.verifiedCoupons > 0 ? "text-[#52c41a] font-bold" : "text-gray-400"}>
                      {user.verifiedCoupons}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">
                    {user.lastActiveTime}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {user.verifiedCoupons > 0 ? (
                      <span className="text-[#52c41a] font-medium text-xs">● 已激活</span>
                    ) : (
                      <span className="text-[#fa8c16] font-medium text-xs">● 待核销</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-[#fafafa] border-t border-[#e8e8e8] flex items-center justify-between text-xs text-gray-500">
          <div>共 {filteredUsers.length} 条用户明细记录</div>
          <button
            onClick={handleExportUserBehavior}
            className="text-xs text-[#1890ff] hover:underline"
          >
            导出完整用户明细 (CSV)
          </button>
        </div>
      </div>
    </div>
  );
};
