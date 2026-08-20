import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Download, 
  Search, 
  Filter, 
  Building2, 
  FileText, 
  Check, 
  X, 
  Eye, 
  Calendar, 
  AlertCircle,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { MemberSettlementRecord, PageType } from '../types';

interface MemberSettlementPageProps {
  onNavigateToTab?: (page: PageType) => void;
}

const INITIAL_SETTLEMENTS: MemberSettlementRecord[] = [
  {
    id: 'SETTLE_202502_001',
    merchantId: 'm1',
    merchantName: '奈雪的茶 (高新万达店)',
    category: '茶饮甜品',
    settlementPeriod: '2025-02-01 ~ 2025-02-28',
    verifiedPackets: 1240,
    subsidyAmount: 1116.00,
    merchantCost: 1364.00,
    status: 'pending',
    bankAccount: '招商银行 (尾号 4892)',
    details: [
      { orderNo: 'ORD_20250218_9821', usedAt: '2025-02-18 14:20:11', orderAmount: 38.00, couponDeduction: 2.00, platformSubsidy: 0.90, merchantShare: 1.10 },
      { orderNo: 'ORD_20250218_9835', usedAt: '2025-02-18 15:45:00', orderAmount: 26.50, couponDeduction: 2.00, platformSubsidy: 0.90, merchantShare: 1.10 },
      { orderNo: 'ORD_20250218_9890', usedAt: '2025-02-18 17:12:34', orderAmount: 42.00, couponDeduction: 2.00, platformSubsidy: 0.90, merchantShare: 1.10 },
      { orderNo: 'ORD_20250219_1002', usedAt: '2025-02-19 11:05:22', orderAmount: 29.00, couponDeduction: 2.00, platformSubsidy: 0.90, merchantShare: 1.10 }
    ]
  },
  {
    id: 'SETTLE_202502_002',
    merchantId: 'm2',
    merchantName: '霸王茶姬 (软件园店)',
    category: '茶饮甜品',
    settlementPeriod: '2025-02-01 ~ 2025-02-28',
    verifiedPackets: 980,
    subsidyAmount: 882.00,
    merchantCost: 1078.00,
    status: 'pending',
    bankAccount: '建设银行 (尾号 6712)',
    details: [
      { orderNo: 'ORD_20250217_7712', usedAt: '2025-02-17 12:10:00', orderAmount: 22.00, couponDeduction: 2.00, platformSubsidy: 0.90, merchantShare: 1.10 },
      { orderNo: 'ORD_20250217_7745', usedAt: '2025-02-17 16:30:19', orderAmount: 45.00, couponDeduction: 2.00, platformSubsidy: 0.90, merchantShare: 1.10 }
    ]
  },
  {
    id: 'SETTLE_202502_003',
    merchantId: 'm3',
    merchantName: '海底捞火锅 (锦华店)',
    category: '正餐餐饮',
    settlementPeriod: '2025-02-01 ~ 2025-02-28',
    verifiedPackets: 650,
    subsidyAmount: 585.00,
    merchantCost: 715.00,
    status: 'pending',
    bankAccount: '工商银行 (尾号 1098)',
    details: [
      { orderNo: 'ORD_20250216_5521', usedAt: '2025-02-16 19:40:02', orderAmount: 280.00, couponDeduction: 2.00, platformSubsidy: 0.90, merchantShare: 1.10 }
    ]
  },
  {
    id: 'SETTLE_202501_001',
    merchantId: 'm1',
    merchantName: '奈雪的茶 (高新万达店)',
    category: '茶饮甜品',
    settlementPeriod: '2025-01-01 ~ 2025-01-31',
    verifiedPackets: 1100,
    subsidyAmount: 990.00,
    merchantCost: 1210.00,
    status: 'settled',
    settledAt: '2025-02-05 10:30:00',
    bankAccount: '招商银行 (尾号 4892)',
    details: [
      { orderNo: 'ORD_20250128_3311', usedAt: '2025-01-28 14:15:00', orderAmount: 35.00, couponDeduction: 2.00, platformSubsidy: 0.90, merchantShare: 1.10 }
    ]
  },
  {
    id: 'SETTLE_202501_002',
    merchantId: 'm2',
    merchantName: '霸王茶姬 (软件园店)',
    category: '茶饮甜品',
    settlementPeriod: '2025-01-01 ~ 2025-01-31',
    verifiedPackets: 850,
    subsidyAmount: 765.00,
    merchantCost: 935.00,
    status: 'settled',
    settledAt: '2025-02-05 10:32:00',
    bankAccount: '建设银行 (尾号 6712)',
    details: [
      { orderNo: 'ORD_20250125_2211', usedAt: '2025-01-25 15:20:00', orderAmount: 28.00, couponDeduction: 2.00, platformSubsidy: 0.90, merchantShare: 1.10 }
    ]
  },
  {
    id: 'SETTLE_202501_004',
    merchantId: 'm4',
    merchantName: '瑞幸咖啡 (天府三街店)',
    category: '咖啡轻食',
    settlementPeriod: '2025-01-01 ~ 2025-01-31',
    verifiedPackets: 480,
    subsidyAmount: 432.00,
    merchantCost: 528.00,
    status: 'settled',
    settledAt: '2025-02-05 10:35:00',
    bankAccount: '农业银行 (尾号 8831)',
    details: []
  }
];

export const MemberSettlementPage: React.FC<MemberSettlementPageProps> = ({ onNavigateToTab }) => {
  const [records, setRecords] = useState<MemberSettlementRecord[]>(INITIAL_SETTLEMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'settled'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeDetailRecord, setActiveDetailRecord] = useState<MemberSettlementRecord | null>(null);
  const [settleConfirmRecord, setSettleConfirmRecord] = useState<MemberSettlementRecord | null>(null);
  const [isBatchConfirming, setIsBatchConfirming] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch = r.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPeriod = selectedPeriod === 'all' || r.settlementPeriod.includes(selectedPeriod);
      const matchStatus = selectedStatus === 'all' || r.status === selectedStatus;
      return matchSearch && matchPeriod && matchStatus;
    });
  }, [records, searchTerm, selectedPeriod, selectedStatus]);

  // Summaries
  const pendingTotal = useMemo(() => {
    return records.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.subsidyAmount, 0);
  }, [records]);

  const settledTotal = useMemo(() => {
    return records.filter(r => r.status === 'settled').reduce((sum, r) => sum + r.subsidyAmount, 0);
  }, [records]);

  // Handle single settle
  const handleExecuteSettle = (record: MemberSettlementRecord) => {
    setRecords(prev => prev.map(r => {
      if (r.id === record.id) {
        return {
          ...r,
          status: 'settled',
          settledAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
      }
      return r;
    }));
    setSettleConfirmRecord(null);
    showToast(`商家【${record.merchantName}】的补贴款 ¥${record.subsidyAmount.toFixed(2)} 已成功拨付结算！`);
  };

  // Handle batch settle
  const handleBatchSettle = () => {
    if (selectedIds.length === 0) {
      showToast('请先勾选待结算的商家账单');
      return;
    }
    setRecords(prev => prev.map(r => {
      if (selectedIds.includes(r.id) && r.status === 'pending') {
        return {
          ...r,
          status: 'settled',
          settledAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
      }
      return r;
    }));
    const count = selectedIds.length;
    setSelectedIds([]);
    setIsBatchConfirming(false);
    showToast(`已成功批量结算 ${count} 笔商家补贴款账单！`);
  };

  const handleExport = () => {
    showToast('正在导出【会员红包补贴结算报表】(CSV/Excel)，请稍候...');
  };

  // Selection toggle
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pendingIds = filteredRecords.filter(r => r.status === 'pending').map(r => r.id);
      setSelectedIds(pendingIds);
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
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
            <span>会员红包包</span>
            <span>/</span>
            <span className="text-[#1890ff] font-medium">补贴结算管理</span>
          </div>
          <h1 className="text-xl font-bold text-[#262626] tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#1890ff]" />
            <span>补贴结算管理</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            管理各参与商户会员红包核销补贴的账期对账、结算审核与资金拨付。
          </p>
        </div>

        {/* Quick Sub-Tab Navigation Switcher */}
        {onNavigateToTab && (
          <div className="flex items-center bg-[#fafafa] p-1 rounded border border-[#d9d9d9] text-xs">
            <button
              onClick={() => onNavigateToTab('member-config')}
              className="px-3 py-1.5 rounded font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              1. 活动配置
            </button>
            <button
              onClick={() => onNavigateToTab('member-analytics')}
              className="px-3 py-1.5 rounded font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              2. 数据监控
            </button>
            <button
              onClick={() => onNavigateToTab('member-settlement')}
              className="px-3 py-1.5 rounded font-medium bg-[#1890ff] text-white shadow-xs"
            >
              3. 补贴结算管理
            </button>
          </div>
        )}
      </div>

      {/* Summary Cards: 待结算金额 vs 已结算金额 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 待结算金额 */}
        <div className="bg-white border border-amber-200 bg-amber-50/20 rounded p-4 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-amber-800 font-semibold">
            <span>待结算补贴总额</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">
            ¥{pendingTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1 border-t border-amber-100">
            <span>待结账单：{records.filter(r => r.status === 'pending').length} 笔</span>
            <span className="text-amber-700 font-medium">需财务复核后拨付</span>
          </div>
        </div>

        {/* 已结算金额 */}
        <div className="bg-white border border-emerald-200 bg-emerald-50/20 rounded p-4 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold">
            <span>已结算补贴累计总额</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            ¥{settledTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1 border-t border-emerald-100">
            <span>已结账单：{records.filter(r => r.status === 'settled').length} 笔</span>
            <span className="text-emerald-700 font-medium">款项已直达商家账户</span>
          </div>
        </div>

        {/* 结算规则提示 */}
        <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs flex flex-col justify-between space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
            <Receipt className="w-4 h-4 text-[#1890ff]" />
            <span>结算周期与对账规则</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            平台按月（或按自然周）汇总商家已核销红包明细，单张红包按设定比例（¥0.9/张）自动生成补贴账单。
          </p>
          <div className="text-[10px] text-gray-400">
            结算时系统自动打款至商家登记的企业对公或法人银行账户。
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* 商家名称搜索 */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商家名称 / 结算账单号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] w-56"
            />
          </div>

          {/* 结算周期筛选 */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">结算周期：</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-700"
            >
              <option value="all">全部账期</option>
              <option value="2025-02">2025年02月 (当前月)</option>
              <option value="2025-01">2025年01月</option>
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
              <option value="pending">待结算</option>
              <option value="settled">已结算</option>
            </select>
          </div>
        </div>

        {/* Right Action Buttons */}
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
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredRecords.filter(r => r.status === 'pending').length > 0 &&
                      filteredRecords.filter(r => r.status === 'pending').every(r => selectedIds.includes(r.id))
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="text-[#1890ff] focus:ring-[#1890ff] rounded"
                  />
                </th>
                <th className="py-3 px-4">账单单号 / 商家名称</th>
                <th className="py-3 px-4">结算周期</th>
                <th className="py-3 px-4 text-right">核销红包数</th>
                <th className="py-3 px-4 text-right">补贴金额 (平台应付)</th>
                <th className="py-3 px-4 text-right">商家让利成本</th>
                <th className="py-3 px-4 text-center">结算状态</th>
                <th className="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    暂无符合条件的结算账单
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  return (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          disabled={item.status === 'settled'}
                          checked={isChecked}
                          onChange={() => toggleSelectOne(item.id)}
                          className="text-[#1890ff] focus:ring-[#1890ff] rounded disabled:opacity-30"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{item.merchantName}</div>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">{item.id}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono">
                        {item.settlementPeriod}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#1890ff] font-mono">
                        {item.verifiedPackets.toLocaleString()} 张
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-rose-600 font-mono text-sm">
                        ¥{item.subsidyAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-600 font-mono">
                        ¥{item.merchantCost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.status === 'settled' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            已结算
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            待结算
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center space-x-2 whitespace-nowrap">
                        {item.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => setSettleConfirmRecord(item)}
                            className="px-2.5 py-1 rounded bg-[#1890ff] text-white hover:bg-blue-600 transition-colors font-medium text-[11px]"
                          >
                            结算
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setActiveDetailRecord(item)}
                          className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium text-[11px]"
                        >
                          查看明细
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Batch Bar */}
        <div className="p-4 border-t border-[#e8e8e8] bg-[#fafafa] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-500">
              已勾选 <strong className="text-[#1890ff]">{selectedIds.length}</strong> 笔账单
            </span>
            {selectedIds.length > 0 && (
              <span className="text-gray-700">
                勾选待结算总额：
                <strong className="text-rose-600 font-mono font-bold">
                  ¥{records.filter(r => selectedIds.includes(r.id)).reduce((s, r) => s + r.subsidyAmount, 0).toFixed(2)}
                </strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={() => setIsBatchConfirming(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#1890ff] rounded hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>批量结算 ({selectedIds.length})</span>
            </button>
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

      {/* Modal: 单笔结算确认 */}
      {settleConfirmRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#e8e8e8] shadow-xl w-full max-w-md p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8]">
              <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#1890ff]" />
                <span>确认拨付结算补贴款</span>
              </div>
              <button 
                onClick={() => setSettleConfirmRecord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-blue-50/40 border border-blue-100 rounded space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">结算商家：</span>
                  <span className="font-bold text-gray-900">{settleConfirmRecord.merchantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">账单编号：</span>
                  <span className="font-mono text-gray-700">{settleConfirmRecord.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">结算周期：</span>
                  <span className="font-mono text-gray-700">{settleConfirmRecord.settlementPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">核销总张数：</span>
                  <span className="font-mono font-bold text-[#1890ff]">{settleConfirmRecord.verifiedPackets} 张</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-blue-200 text-sm">
                  <span className="font-bold text-gray-800">应拨付补贴金额：</span>
                  <span className="font-mono font-extrabold text-rose-600">¥{settleConfirmRecord.subsidyAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-500">
                收款对公账户：<strong className="text-gray-800">{settleConfirmRecord.bankAccount}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-[#e8e8e8] flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSettleConfirmRecord(null)}
                className="px-4 py-1.5 text-gray-600 bg-white border border-[#d9d9d9] rounded hover:border-gray-400"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => handleExecuteSettle(settleConfirmRecord)}
                className="px-5 py-1.5 text-white bg-[#1890ff] rounded font-medium hover:bg-blue-600"
              >
                确认立即结算
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 批量结算确认 */}
      {isBatchConfirming && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#e8e8e8] shadow-xl w-full max-w-md p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8]">
              <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#1890ff]" />
                <span>批量结算确认</span>
              </div>
              <button 
                onClick={() => setIsBatchConfirming(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>您即将批量结算选中的 <strong>{selectedIds.length}</strong> 笔商家补贴账单，系统将自动发起批量资金拨付流程。</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-[#fafafa] rounded border border-[#e8e8e8]">
                <span className="font-semibold text-gray-700">批量拨付总金额：</span>
                <span className="font-bold font-mono text-rose-600 text-base">
                  ¥{records.filter(r => selectedIds.includes(r.id)).reduce((s, r) => s + r.subsidyAmount, 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#e8e8e8] flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsBatchConfirming(false)}
                className="px-4 py-1.5 text-gray-600 bg-white border border-[#d9d9d9] rounded hover:border-gray-400"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleBatchSettle}
                className="px-5 py-1.5 text-white bg-[#1890ff] rounded font-medium hover:bg-blue-600"
              >
                确认批量打款
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 查看明细 */}
      {activeDetailRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#e8e8e8] shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in">
            <div className="p-4 border-b border-[#e8e8e8] flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1890ff]" />
                  <span>核销明细 - {activeDetailRecord.merchantName}</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5 font-mono">
                  账单编号: {activeDetailRecord.id} | 账期: {activeDetailRecord.settlementPeriod}
                </div>
              </div>
              <button 
                onClick={() => setActiveDetailRecord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              {/* Top summary in detail modal */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-[#fafafa] rounded border border-[#e8e8e8]">
                <div>
                  <div className="text-gray-500">累计核销红包</div>
                  <div className="font-bold text-[#1890ff] font-mono text-sm mt-0.5">
                    {activeDetailRecord.verifiedPackets} 张
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">平台应补贴</div>
                  <div className="font-bold text-rose-600 font-mono text-sm mt-0.5">
                    ¥{activeDetailRecord.subsidyAmount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">商家让利承担</div>
                  <div className="font-bold text-gray-800 font-mono text-sm mt-0.5">
                    ¥{activeDetailRecord.merchantCost.toFixed(2)}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-700 mb-2">核销订单流水抽样</div>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 font-medium">
                      <th className="py-2 px-3">订单号</th>
                      <th className="py-2 px-3">核销时间</th>
                      <th className="py-2 px-3 text-right">订单金额</th>
                      <th className="py-2 px-3 text-right">红包抵扣</th>
                      <th className="py-2 px-3 text-right">平台补贴</th>
                      <th className="py-2 px-3 text-right">商家承担</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f0]">
                    {(activeDetailRecord.details && activeDetailRecord.details.length > 0) ? (
                      activeDetailRecord.details.map((d, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="py-2 px-3 font-mono text-gray-800">{d.orderNo}</td>
                          <td className="py-2 px-3 text-gray-500">{d.usedAt}</td>
                          <td className="py-2 px-3 text-right font-mono">¥{d.orderAmount.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-mono text-rose-600">-¥{d.couponDeduction.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-mono text-emerald-600">+¥{d.platformSubsidy.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-mono text-gray-600">¥{d.merchantShare.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-gray-400">
                          暂无更多详细流水
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 border-t border-[#e8e8e8] bg-[#fafafa] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveDetailRecord(null)}
                className="px-4 py-1.5 text-xs text-gray-600 bg-white border border-[#d9d9d9] rounded hover:border-gray-400"
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
