import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Eye, 
  Search, 
  Filter, 
  Building2, 
  Clock, 
  FileText, 
  Phone, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Download,
  Store,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { MerchantAuditItem, ActivityItem } from '../types';

interface MerchantAuditPageProps {
  merchants: MerchantAuditItem[];
  activities: ActivityItem[];
  onAuditStatusChange: (id: string, newStatus: 'approved' | 'rejected', reason?: string) => void;
}

export const MerchantAuditPage: React.FC<MerchantAuditPageProps> = ({
  merchants,
  activities,
  onAuditStatusChange
}) => {
  // Filters
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected merchant for view modal
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantAuditItem | null>(null);

  // Reject modal
  const [rejectMerchantId, setRejectMerchantId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('未提供《食品经营许可证》或门店跨店系统未联调通过');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter list
  const filteredMerchants = merchants.filter((m) => {
    const matchSearch = m.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchActivity = activityFilter === 'all' || m.activityId === activityFilter || m.activityName.includes(activityFilter);
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchSearch && matchActivity && matchStatus;
  });

  const handleApprove = (item: MerchantAuditItem) => {
    onAuditStatusChange(item.id, 'approved');
    showToast(`已审核通过商家 [${item.merchantName}] 的报名申请`);
  };

  const handleConfirmReject = () => {
    if (!rejectMerchantId) return;
    const target = merchants.find(m => m.id === rejectMerchantId);
    onAuditStatusChange(rejectMerchantId, 'rejected', rejectReason);
    setRejectMerchantId(null);
    showToast(`已驳回商家 [${target?.merchantName || ''}] 的报名申请`);
  };

  const getStatusBadge = (status: MerchantAuditItem['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" />
            待审核
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            已通过
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-500" />
            已拒绝
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

      {/* Top Banner / Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8e8e8]">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>营销中心</span>
            <span>/</span>
            <span>商家准入</span>
            <span>/</span>
            <span className="text-[#1890ff] font-medium">商家报名审核</span>
          </div>
          <h1 className="text-xl font-bold text-[#262626] tracking-tight flex items-center gap-2">
            <span>商家报名审核</span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium border border-amber-200">
              待审 {merchants.filter(m => m.status === 'pending').length} 家
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            审核商户自愿加入跨店联盟活动的报名资质，把关商户真实性与履约能力。
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* 搜索 */}
          <div className="sm:col-span-4 relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索商家名称、联系人..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-[#262626]"
            />
          </div>

          {/* 活动名称筛选 */}
          <div className="sm:col-span-4">
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-700"
            >
              <option value="all">全部关联活动</option>
              {activities.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.name}
                </option>
              ))}
            </select>
          </div>

          {/* 审核状态筛选 */}
          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-700"
            >
              <option value="all">全部审核状态</option>
              <option value="pending">待审核 (Pending)</option>
              <option value="approved">已通过 (Approved)</option>
              <option value="rejected">已拒绝 (Rejected)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#e8e8e8] rounded shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="merchant-audit-table">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e8e8e8] text-[11px] font-semibold text-gray-500 uppercase">
                <th className="py-3 px-4">商家名称</th>
                <th className="py-3 px-3">报名所属活动</th>
                <th className="py-3 px-3">联系人 / 电话</th>
                <th className="py-3 px-3">报名时间</th>
                <th className="py-3 px-3 text-center">状态</th>
                <th className="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0] text-xs text-gray-700">
              {filteredMerchants.map((merchant) => (
                <tr 
                  key={merchant.id} 
                  className={`hover:bg-blue-50/40 transition-colors ${
                    merchant.merchantName === '某某旗舰店' ? 'bg-amber-50/40' : ''
                  }`}
                  id={`merchant-row-${merchant.id}`}
                >
                  {/* 商家名称 */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#262626] flex items-center gap-1.5">
                      <span>{merchant.merchantName}</span>
                      {merchant.merchantName === '某某旗舰店' && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-medium">
                          需求示例商家
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {merchant.category} · 门店数: {merchant.storeCount} 家
                    </div>
                  </td>

                  {/* 报名所属活动 */}
                  <td className="py-3 px-3">
                    <div className="font-medium text-[#262626]">{merchant.activityName}</div>
                    <div className="text-[11px] text-gray-400 font-mono">{merchant.activityId}</div>
                  </td>

                  {/* 联系人 / 电话 */}
                  <td className="py-3 px-3">
                    <div className="text-[#262626] font-medium">{merchant.contactPerson}</div>
                    <div className="text-[11px] text-gray-400 font-mono">{merchant.contactPhone}</div>
                  </td>

                  {/* 报名时间 */}
                  <td className="py-3 px-3 font-mono text-[11px] text-gray-600 whitespace-nowrap">
                    {merchant.appliedAt}
                  </td>

                  {/* 状态 */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {getStatusBadge(merchant.status)}
                  </td>

                  {/* 操作 (通过、拒绝、查看) */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* 查看 */}
                      <button
                        onClick={() => setSelectedMerchant(merchant)}
                        className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-[#d9d9d9] rounded hover:border-[#1890ff] hover:text-[#1890ff] transition-colors"
                        title="查看资质详情"
                      >
                        查看
                      </button>

                      {/* 待审核时显示通过和拒绝 */}
                      {merchant.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(merchant)}
                            className="px-2.5 py-1 text-xs font-medium text-white bg-emerald-600 rounded hover:bg-emerald-700 transition-colors shadow-xs"
                          >
                            通过
                          </button>
                          <button
                            onClick={() => setRejectMerchantId(merchant.id)}
                            className="px-2.5 py-1 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded hover:bg-rose-100 transition-colors"
                          >
                            拒绝
                          </button>
                        </>
                      )}

                      {merchant.status === 'approved' && (
                        <span className="text-[11px] text-emerald-600 font-medium px-2 py-0.5">
                          已准入
                        </span>
                      )}

                      {merchant.status === 'rejected' && (
                        <button
                          onClick={() => handleApprove(merchant)}
                          className="text-[11px] text-[#1890ff] hover:underline"
                        >
                          重新通过
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#fafafa] border-t border-[#e8e8e8] flex items-center justify-between text-xs text-gray-500">
          <div>共检索到 {filteredMerchants.length} 家商户报名记录</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                merchants.filter(m => m.status === 'pending').forEach(m => onAuditStatusChange(m.id, 'approved'));
                showToast('已批量审核通过所有待审商家！');
              }}
              className="px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 transition-colors"
            >
              一键批量通过待审核
            </button>
          </div>
        </div>
      </div>

      {/* Modal: 查看商家资质详情 */}
      {selectedMerchant && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-lg overflow-hidden border border-[#e8e8e8]">
            <div className="px-5 py-3.5 border-b border-[#e8e8e8] flex items-center justify-between bg-[#fafafa]">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#1890ff]" />
                <h3 className="text-sm font-bold text-[#262626]">商户报名详情与资质</h3>
              </div>
              <button onClick={() => setSelectedMerchant(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-[#fafafa] rounded border border-[#e8e8e8]">
                <div>
                  <div className="text-sm font-bold text-[#262626]">{selectedMerchant.merchantName}</div>
                  <div className="text-gray-500 mt-0.5">{selectedMerchant.category} · 门店规模 {selectedMerchant.storeCount} 家</div>
                </div>
                <div>{getStatusBadge(selectedMerchant.status)}</div>
              </div>

              <div className="space-y-2 divide-y divide-[#f0f0f0]">
                <div className="pt-2 flex justify-between">
                  <span className="text-gray-400">申请活动</span>
                  <span className="font-semibold text-[#262626]">{selectedMerchant.activityName}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-gray-400">申请人 / 联系电话</span>
                  <span className="text-gray-800">{selectedMerchant.contactPerson} ({selectedMerchant.contactPhone})</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-gray-400">提交申请时间</span>
                  <span className="font-mono text-gray-800">{selectedMerchant.appliedAt}</span>
                </div>
              </div>

              {/* 资质材料列表 */}
              <div className="space-y-1.5 pt-2">
                <span className="font-semibold text-gray-700 block">资质审查凭证</span>
                <div className="space-y-1.5">
                  {(selectedMerchant.qualificationDocs || ['统一社会信用代码证.pdf', '食品经营卫生许可证.pdf']).map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-[#fafafa] rounded border border-[#e8e8e8]">
                      <span className="flex items-center gap-1.5 text-gray-700">
                        <FileText className="w-3.5 h-3.5 text-[#1890ff]" />
                        {doc}
                      </span>
                      <span className="text-[11px] text-[#1890ff] cursor-pointer hover:underline">预览材料</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 驳回原因展示（若已拒绝） */}
              {selectedMerchant.rejectReason && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-800">
                  <div className="font-semibold">驳回原因：</div>
                  <div className="mt-0.5">{selectedMerchant.rejectReason}</div>
                </div>
              )}
            </div>

            <div className="px-5 py-3 bg-[#fafafa] border-t border-[#e8e8e8] flex items-center justify-end gap-2">
              {selectedMerchant.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      const mId = selectedMerchant.id;
                      setSelectedMerchant(null);
                      setRejectMerchantId(mId);
                    }}
                    className="px-3 py-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded hover:bg-rose-100 font-medium"
                  >
                    拒绝报名
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedMerchant);
                      setSelectedMerchant(null);
                    }}
                    className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded hover:bg-emerald-700 shadow-xs"
                  >
                    通过审核
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedMerchant(null)}
                className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-[#d9d9d9] rounded hover:border-gray-400"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 驳回理由填写 */}
      {rejectMerchantId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-md p-6 space-y-4 border border-[#e8e8e8]">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>填写驳回/拒绝原因</span>
            </div>
            <p className="text-xs text-gray-500">
              驳回后系统将通过商户端后台向该商家推送通知，商家可补充资质后重新提报。
            </p>
            <div className="space-y-1.5">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full p-2 text-xs border border-[#d9d9d9] rounded outline-none focus:border-rose-500"
                placeholder="请输入详细的驳回原因..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectMerchantId(null)}
                className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-[#d9d9d9] rounded"
              >
                取消
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 text-xs font-medium text-white bg-rose-600 rounded hover:bg-rose-700"
              >
                确认拒绝
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
