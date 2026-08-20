import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  Search,
  FileText,
  X,
  AlertCircle,
  TrendingUp,
  Receipt,
  RotateCcw
} from 'lucide-react';
import { SettlementItem, ActivityItem } from '../types';
import { INITIAL_SETTLEMENTS } from '../mockData';

interface SettlementPageProps {
  activities?: ActivityItem[];
}

export const SettlementPage: React.FC<SettlementPageProps> = ({ activities }) => {
  const [records, setRecords] = useState<SettlementItem[]>(INITIAL_SETTLEMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'settled' | 'pending' | 'refunded'>('all');
  const [activeDetailRecord, setActiveDetailRecord] = useState<SettlementItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 活动选项（来自传入的活动列表 + mock 数据中出现过的活动名）
  const activityOptions = useMemo(() => {
    const fromActivities = (activities || []).map(a => a.name);
    const fromRecords = Array.from(new Set(records.map(r => r.activityName)));
    return Array.from(new Set([...fromActivities, ...fromRecords]));
  }, [activities, records]);

  // 筛选
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch =
        r.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.userId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchActivity = selectedActivity === 'all' || r.activityName === selectedActivity;
      const matchStatus = selectedStatus === 'all' || r.status === selectedStatus;
      return matchSearch && matchActivity && matchStatus;
    });
  }, [records, searchTerm, selectedActivity, selectedStatus]);

  // 汇总
  const pendingTotal = useMemo(
    () => records.filter(r => r.status === 'pending').reduce((s, r) => s + r.platformSubsidy, 0),
    [records]
  );
  const settledTotal = useMemo(
    () => records.filter(r => r.status === 'settled').reduce((s, r) => s + r.platformSubsidy, 0),
    [records]
  );
  const refundedTotal = useMemo(
    () => records.filter(r => r.status === 'refunded').reduce((s, r) => s + r.platformSubsidy, 0),
    [records]
  );

  const handleExport = () => {
    showToast('正在导出【联盟活动结算对账报表】(CSV/Excel)，请稍候...');
  };

  const statusBadge = (status: SettlementItem['status']) => {
    if (status === 'settled') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          已结算
        </span>
      );
    }
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" />
          待结算
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-gray-50 text-gray-600 border border-gray-200">
        <RotateCcw className="w-3 h-3 text-gray-500" />
        已退款
      </span>
    );
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

      {/* Top Banner / Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8e8e8]">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>营销中心</span>
            <span>/</span>
            <span>联盟活动</span>
            <span>/</span>
            <span className="text-[#1890ff] font-medium">结算对账管理</span>
          </div>
          <h1 className="text-xl font-bold text-[#262626] tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#1890ff]" />
            <span>结算对账管理</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            按活动维度汇总跨店满单激励券的核销流水，核对商家承担与平台补贴分摊金额。
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 待结算 */}
        <div className="bg-white border border-amber-200 bg-amber-50/20 rounded p-4 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-amber-800 font-semibold">
            <span>待结算平台补贴</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">
            ¥{pendingTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1 border-t border-amber-100">
            <span>待结算流水：{records.filter(r => r.status === 'pending').length} 笔</span>
            <span className="text-amber-700 font-medium">对账无误后拨付</span>
          </div>
        </div>

        {/* 已结算 */}
        <div className="bg-white border border-emerald-200 bg-emerald-50/20 rounded p-4 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold">
            <span>已结算平台补贴</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            ¥{settledTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1 border-t border-emerald-100">
            <span>已结算流水：{records.filter(r => r.status === 'settled').length} 笔</span>
            <span className="text-emerald-700 font-medium">款项已直达商家账户</span>
          </div>
        </div>

        {/* 退款/规则 */}
        <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-gray-800">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#1890ff]" />
              退款冲减金额
            </span>
            <Receipt className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-extrabold text-gray-700 font-mono">
            ¥{refundedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed pt-1 border-t border-[#f0f0f0]">
            券面额按 <strong>商家承担 / 平台补贴</strong> 分摊，退券订单自动冲减对应补贴，不影响已拨付账期。
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* 搜索 */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商家 / 订单号 / 用户..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] w-56"
            />
          </div>

          {/* 活动筛选 */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">所属活动：</span>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-700"
            >
              <option value="all">全部活动</option>
              {activityOptions.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* 状态筛选 */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">状态：</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-700"
            >
              <option value="all">全部状态</option>
              <option value="settled">已结算</option>
              <option value="pending">待结算</option>
              <option value="refunded">已退款</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 bg-white border border-[#d9d9d9] rounded hover:border-[#1890ff] hover:text-[#1890ff] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出报表</span>
          </button>
        </div>
      </div>

      {/* Settlement Table */}
      <div className="bg-white border border-[#e8e8e8] rounded shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e8e8e8] text-gray-500 font-semibold">
                <th className="py-3 px-4">流水编号 / 订单号</th>
                <th className="py-3 px-4">商家名称</th>
                <th className="py-3 px-4">所属活动</th>
                <th className="py-3 px-4 text-right">券面额</th>
                <th className="py-3 px-4 text-right">商家承担</th>
                <th className="py-3 px-4 text-right">平台补贴</th>
                <th className="py-3 px-4">核销时间</th>
                <th className="py-3 px-4 text-center">结算状态</th>
                <th className="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400">
                    暂无符合条件的结算流水
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-gray-900">{item.id}</div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">{item.orderNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">{item.merchantName}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{item.userId}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{item.activityName}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600 font-mono">
                      ¥{item.couponAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-600 font-mono">
                      ¥{item.merchantShare.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600 font-mono">
                      ¥{item.platformSubsidy.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono">{item.verifiedAt}</td>
                    <td className="py-3 px-4 text-center">{statusBadge(item.status)}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setActiveDetailRecord(item)}
                        className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium text-[11px]"
                      >
                        查看明细
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Info Bar */}
        <div className="p-4 border-t border-[#e8e8e8] bg-[#fafafa] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-500">
              共 <strong className="text-[#1890ff]">{filteredRecords.length}</strong> 笔核销流水
            </span>
            <span className="text-gray-500">
              当前筛选平台补贴合计：
              <strong className="text-emerald-600 font-mono font-bold">
                ¥{filteredRecords.reduce((s, r) => s + r.platformSubsidy, 0).toFixed(2)}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-1.5 text-xs font-medium text-gray-700 bg-white border border-[#d9d9d9] rounded hover:border-gray-400 transition-colors"
            >
              导出报表
            </button>
          </div>
        </div>
      </div>

      {/* Modal: 查看明细 */}
      {activeDetailRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#e8e8e8] shadow-xl w-full max-w-lg p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8]">
              <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1890ff]" />
                <span>结算流水明细</span>
              </div>
              <button
                onClick={() => setActiveDetailRecord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-blue-50/40 border border-blue-100 rounded space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">商家名称：</span>
                  <span className="font-bold text-gray-900">{activeDetailRecord.merchantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">所属活动：</span>
                  <span className="text-gray-700">{activeDetailRecord.activityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">订单号：</span>
                  <span className="font-mono text-gray-700">{activeDetailRecord.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">核销时间：</span>
                  <span className="font-mono text-gray-700">{activeDetailRecord.verifiedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">用户：</span>
                  <span className="font-mono text-gray-700">{activeDetailRecord.userId}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-[#fafafa] rounded border border-[#e8e8e8]">
                <div>
                  <div className="text-gray-500">券面额</div>
                  <div className="font-bold text-rose-600 font-mono text-sm mt-0.5">
                    ¥{activeDetailRecord.couponAmount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">商家承担</div>
                  <div className="font-bold text-gray-700 font-mono text-sm mt-0.5">
                    ¥{activeDetailRecord.merchantShare.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">平台补贴</div>
                  <div className="font-bold text-emerald-600 font-mono text-sm mt-0.5">
                    ¥{activeDetailRecord.platformSubsidy.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-gray-500 p-3 bg-amber-50 border border-amber-200 rounded">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  该流水当前状态为「{activeDetailRecord.status === 'settled' ? '已结算' : activeDetailRecord.status === 'pending' ? '待结算' : '已退款'}」。
                  {activeDetailRecord.status === 'refunded' && ' 退券订单平台补贴已自动冲减，不参与本期拨付。'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#e8e8e8] flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveDetailRecord(null)}
                className="px-4 py-1.5 text-gray-600 bg-white border border-[#d9d9d9] rounded hover:border-gray-400"
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
