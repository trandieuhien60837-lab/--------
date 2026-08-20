import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Play, 
  Pause, 
  StopCircle, 
  Edit3, 
  Eye, 
  BarChart2, 
  Store, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  ExternalLink,
  Tag
} from 'lucide-react';
import { ActivityItem, ActivityStatus } from '../types';

interface ActivityListPageProps {
  activities: ActivityItem[];
  onNavigateToCreate: () => void;
  onNavigateToDashboard: (activityId: string) => void;
  onUpdateActivityStatus: (id: string, newStatus: ActivityStatus) => void;
  onDeleteOrTerminate: (id: string) => void;
}

export const ActivityListPage: React.FC<ActivityListPageProps> = ({
  activities,
  onNavigateToCreate,
  onNavigateToDashboard,
  onUpdateActivityStatus,
  onDeleteOrTerminate
}) => {
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  
  // Detail Drawer State
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  // Terminate Modal State
  const [terminateActivityId, setTerminateActivityId] = useState<string | null>(null);
  const [terminateReason, setTerminateReason] = useState('预算已达上限或运营策略调整');
  // Merchant list popup inside row
  const [merchantListModal, setMerchantListModal] = useState<{ activityName: string; merchants: string[] } | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    const matchSearch = act.name.toLowerCase().includes(searchQuery.toLowerCase()) || act.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || act.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Handle Export Single/Batch
  const handleExportData = (activityName?: string) => {
    const target = activityName ? `活动 [${activityName}]` : '当前筛选的所有活动';
    showToast(`已生成并导出 ${target} 的统计报表及核销流水 (.CSV)`);
  };

  const getStatusBadge = (status: ActivityStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            进行中
          </span>
        );
      case 'not_started':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-[#1890ff] border border-blue-200">
            <Clock className="w-3 h-3 text-[#1890ff]" />
            未开始
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Pause className="w-3 h-3 text-amber-500" />
            已暂停
          </span>
        );
      case 'ended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
            已结束
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            草稿中
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#262626] text-white text-xs px-4 py-2.5 rounded shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Breadcrumbs & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8e8e8]">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>营销中心</span>
            <span>/</span>
            <span>联盟活动</span>
            <span>/</span>
            <span className="text-[#1890ff] font-medium">活动管理列表</span>
          </div>
          <h1 className="text-xl font-bold text-[#262626] tracking-tight flex items-center gap-2">
            <span>联盟活动管理</span>
            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
              共 {activities.length} 个活动
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            统一管控全平台跨店满单激励活动，支持状态启停、核销追踪与数据下钻。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleExportData()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-[#d9d9d9] rounded hover:border-[#1890ff] hover:text-[#1890ff] transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>批量导出数据</span>
          </button>

          <button
            type="button"
            id="btn-create-new-activity"
            onClick={onNavigateToCreate}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#1890ff] rounded hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>创建联盟活动</span>
          </button>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* 活动名称搜索 */}
          <div className="sm:col-span-4 relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="filter-search-activity"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索活动名称 / 活动ID..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] transition-all text-[#262626]"
            />
          </div>

          {/* 状态筛选 */}
          <div className="sm:col-span-3">
            <select
              id="filter-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-700"
            >
              <option value="all">全部活动状态 (全部)</option>
              <option value="active">进行中 (Active)</option>
              <option value="not_started">未开始 (Not Started)</option>
              <option value="paused">已暂停 (Paused)</option>
              <option value="ended">已结束 (Ended)</option>
              <option value="draft">草稿 (Draft)</option>
            </select>
          </div>

          {/* 时间范围 */}
          <div className="sm:col-span-3">
            <select
              id="filter-timerange-select"
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-700"
            >
              <option value="all">全周期时间范围</option>
              <option value="2025-01">2025年01月 (新春/开年季)</option>
              <option value="2025-02">2025年02月</option>
              <option value="2025-03">2025年03月 (3.8节)</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="sm:col-span-2 flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setDateRangeFilter('all');
              }}
              className="w-full py-1.5 text-xs text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded font-medium transition-colors text-center"
            >
              重置筛选
            </button>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-[#e8e8e8] rounded shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="activity-management-table">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e8e8e8] text-[11px] font-semibold text-gray-500 uppercase">
                <th className="py-3 px-4">活动名称 / ID</th>
                <th className="py-3 px-3">活动时间</th>
                <th className="py-3 px-3">累计门槛</th>
                <th className="py-3 px-3">券面额</th>
                <th className="py-3 px-3 text-center">参与商家数</th>
                <th className="py-3 px-3 text-right">已发券数</th>
                <th className="py-3 px-3 text-right">核销数</th>
                <th className="py-3 px-3 text-center">状态</th>
                <th className="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0] text-xs text-gray-700">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((act) => {
                  const verificationRate = act.issuedCoupons > 0 
                    ? ((act.verifiedCoupons / act.issuedCoupons) * 100).toFixed(1)
                    : '0.0';

                  return (
                    <tr 
                      key={act.id} 
                      className="hover:bg-blue-50/40 transition-colors group"
                      id={`activity-row-${act.id}`}
                    >
                      {/* 活动名称 & ID */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#262626] group-hover:text-[#1890ff] transition-colors">
                          {act.name}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5 flex items-center gap-1.5">
                          <span>{act.id}</span>
                          <span className="text-gray-300">|</span>
                          <span>{act.merchantScope === 'all' ? '全平台商家' : act.merchantScope === 'specific' ? '指定商户联盟' : '开放报名审核'}</span>
                        </div>
                      </td>

                      {/* 活动时间 */}
                      <td className="py-3 px-3 font-mono text-[11px] text-gray-600 whitespace-nowrap">
                        <div>{act.startTime.split(' ')[0]}</div>
                        <div className="text-gray-400">至 {act.endTime.split(' ')[0]}</div>
                      </td>

                      {/* 累计门槛 */}
                      <td className="py-3 px-3 font-semibold text-[#262626] whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">
                          {act.thresholdOrders} 单
                        </span>
                      </td>

                      {/* 券面额 */}
                      <td className="py-3 px-3 font-bold text-[#1890ff] whitespace-nowrap">
                        {act.couponAmount} 元
                        <div className="text-[10px] text-gray-400 font-normal">
                          {act.couponConditionType === 'no_threshold' ? '无门槛' : `满${act.couponMinSpend}元`}
                        </div>
                      </td>

                      {/* 参与商家数 */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => setMerchantListModal({
                            activityName: act.name,
                            merchants: act.selectedMerchants || ['全平台商户自动接入 (共 88 家)']
                          })}
                          className="inline-flex items-center gap-1 text-gray-700 hover:text-[#1890ff] font-medium underline underline-offset-2"
                        >
                          <Store className="w-3.5 h-3.5 text-gray-400" />
                          <span>{act.merchantCount} 家</span>
                        </button>
                      </td>

                      {/* 已发券数 */}
                      <td className="py-3 px-3 text-right font-medium text-[#262626] whitespace-nowrap">
                        {act.issuedCoupons.toLocaleString()} 张
                        {act.totalCouponsCap && (
                          <div className="text-[10px] text-gray-400 font-normal">
                            上限 {act.totalCouponsCap.toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* 核销数 */}
                      <td className="py-3 px-3 text-right font-medium text-[#262626] whitespace-nowrap">
                        <span className="text-emerald-600 font-bold">{act.verifiedCoupons.toLocaleString()} 张</span>
                        <div className="text-[10px] text-gray-400 font-normal">
                          核销率 {verificationRate}%
                        </div>
                      </td>

                      {/* 状态 */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {getStatusBadge(act.status)}
                      </td>

                      {/* 操作 */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1 text-xs">
                          {/* 查看详情 */}
                          <button
                            onClick={() => setSelectedActivity(act)}
                            className="p-1 text-gray-500 hover:text-[#1890ff] hover:bg-gray-100 rounded transition-colors"
                            title="查看详情"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* 看板 */}
                          <button
                            onClick={() => onNavigateToDashboard(act.id)}
                            className="p-1 text-gray-500 hover:text-[#1890ff] hover:bg-gray-100 rounded transition-colors"
                            title="查看数据看板"
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
                          </button>

                          {/* 暂停 / 恢复 */}
                          {act.status === 'active' && (
                            <button
                              onClick={() => {
                                onUpdateActivityStatus(act.id, 'paused');
                                showToast(`已暂停活动 [${act.name}]`);
                              }}
                              className="p-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                              title="暂停活动"
                            >
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {act.status === 'paused' && (
                            <button
                              onClick={() => {
                                onUpdateActivityStatus(act.id, 'active');
                                showToast(`已恢复运行活动 [${act.name}]`);
                              }}
                              className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                              title="恢复活动"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* 终止 */}
                          {act.status !== 'ended' && (
                            <button
                              onClick={() => setTerminateActivityId(act.id)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                              title="终止活动"
                            >
                              <StopCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* 数据导出 */}
                          <button
                            onClick={() => handleExportData(act.name)}
                            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                            title="导出该活动核销数据"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">
                    未找到符合筛选条件的活动数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary Bar */}
        <div className="p-3 bg-[#fafafa] border-t border-[#e8e8e8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>显示第 1 到 {filteredActivities.length} 条</span>
            <span>·</span>
            <span>共 {filteredActivities.length} 条记录</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-[#d9d9d9] rounded bg-white hover:bg-gray-50 disabled:opacity-40" disabled>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="px-3 py-1 border border-[#1890ff] bg-blue-50 text-[#1890ff] rounded font-semibold">
              1
            </button>
            <button className="px-2 py-1 border border-[#d9d9d9] rounded bg-white hover:bg-gray-50 disabled:opacity-40" disabled>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer: 查看活动详情 */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e8e8e8]">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#1890ff]" />
                  <h3 className="text-base font-bold text-[#262626]">活动配置详情</h3>
                </div>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Name */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedActivity.status)}
                  <span className="text-xs font-mono text-gray-400">{selectedActivity.id}</span>
                </div>
                <h2 className="text-lg font-bold text-[#262626]">{selectedActivity.name}</h2>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#fafafa] rounded border border-[#e8e8e8]">
                <div>
                  <div className="text-[11px] text-gray-400">累计已发券</div>
                  <div className="text-lg font-bold text-[#262626] mt-0.5">
                    {selectedActivity.issuedCoupons.toLocaleString()} 张
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-gray-400">已核销券数</div>
                  <div className="text-lg font-bold text-emerald-600 mt-0.5">
                    {selectedActivity.verifiedCoupons.toLocaleString()} 张
                  </div>
                </div>
              </div>

              {/* Detail fields */}
              <div className="space-y-3 text-xs divide-y divide-[#f0f0f0]">
                <div className="pt-2 flex justify-between">
                  <span className="text-gray-400">活动起止时间</span>
                  <span className="font-mono text-gray-800 text-right">{selectedActivity.startTime} ~ {selectedActivity.endTime}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-gray-400">跨店累计门槛</span>
                  <span className="font-bold text-[#262626]">{selectedActivity.thresholdOrders} 单</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-gray-400">优惠券面额</span>
                  <span className="font-bold text-[#1890ff]">{selectedActivity.couponAmount} 元 (满{selectedActivity.couponMinSpend || 0}元可用)</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-gray-400">有效期规则</span>
                  <span className="text-gray-800">自发放起 {selectedActivity.validityDays || 7} 天有效</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-gray-400">参与商家数</span>
                  <span className="font-medium text-gray-800">{selectedActivity.merchantCount} 家商户</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-gray-400">每人限领</span>
                  <span className="text-gray-800">{selectedActivity.perUserLimit ? `${selectedActivity.perUserLimit} 次` : '不限'}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-gray-400">风控限制维度</span>
                  <span className="text-gray-800">{selectedActivity.userRestrictions.join(' + ')}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e8e8e8] flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedActivity(null);
                  onNavigateToDashboard(selectedActivity.id);
                }}
                className="flex-1 py-2 text-xs font-medium text-white bg-[#1890ff] rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>进入该活动数据看板</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 终止活动确认 */}
      {terminateActivityId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-md p-6 space-y-4 border border-[#e8e8e8]">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-[#262626]">确认提前终止此活动？</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              终止后，用户将无法再达成跨店满单奖励，已发放但未过期的券仍可在有效期内核销。此操作不可逆。
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">终止原因记录</label>
              <textarea
                value={terminateReason}
                onChange={(e) => setTerminateReason(e.target.value)}
                rows={2}
                className="w-full p-2 text-xs border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setTerminateActivityId(null)}
                className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-[#d9d9d9] rounded hover:border-gray-400"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onDeleteOrTerminate(terminateActivityId);
                  setTerminateActivityId(null);
                  showToast('活动已成功终止');
                }}
                className="px-4 py-1.5 text-xs font-medium text-white bg-rose-600 rounded hover:bg-rose-700 shadow-xs"
              >
                确认终止
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 商家清单列表 */}
      {merchantListModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-lg p-5 space-y-4 border border-[#e8e8e8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8]">
              <h3 className="text-sm font-bold text-[#262626] flex items-center gap-2">
                <Store className="w-4 h-4 text-[#1890ff]" />
                <span>参与商家清单 · {merchantListModal.activityName}</span>
              </h3>
              <button onClick={() => setMerchantListModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {merchantListModal.merchants.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-[#fafafa] rounded text-xs text-gray-700 border border-[#f0f0f0]">
                  <span className="font-medium">{m}</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    正常核销中
                  </span>
                </div>
              ))}
            </div>
            <div className="text-right pt-2">
              <button
                onClick={() => setMerchantListModal(null)}
                className="px-4 py-1.5 text-xs bg-white border border-[#d9d9d9] hover:border-[#1890ff] hover:text-[#1890ff] text-gray-700 rounded font-medium"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
