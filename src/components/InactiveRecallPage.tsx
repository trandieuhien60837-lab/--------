import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Gift, 
  MessageSquare, 
  Calendar, 
  Upload, 
  ShieldX, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  Smartphone, 
  ArrowRight,
  TrendingUp,
  FileText,
  X,
  Plus,
  Trash2,
  Filter,
  Check
} from 'lucide-react';
import { InactiveRecallConfig, PageType } from '../types';

interface InactiveRecallPageProps {
  onNavigateToTab?: (page: PageType) => void;
}

const INITIAL_RECALL: InactiveRecallConfig = {
  enabled: true,
  inactiveDays: 15,
  couponAmount: 2,
  couponMinSpend: 15,
  validityDays: 3,
  pushChannel: '公众号模板消息 (默认)',
  monthlyLimitPerUser: 1,
  pushContent: '【专属福利】您已有一张2元红包待领取，点击立即使用>>',
  triggerTime: '10:00',
  whitelistCount: 0,
  blacklistCount: 128
};

export const InactiveRecallPage: React.FC<InactiveRecallPageProps> = ({ onNavigateToTab }) => {
  const [config, setConfig] = useState<InactiveRecallConfig>(INITIAL_RECALL);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Blacklist / Whitelist Modals
  const [showListModal, setShowListModal] = useState<'whitelist' | 'blacklist' | null>(null);
  const [inputBatchUsers, setInputBatchUsers] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    setIsSaved(true);
    showToast('不活跃用户召回策略已保存，每日定时任务将准时执行！');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    setConfig(INITIAL_RECALL);
    showToast('已重置为默认召回策略');
  };

  const handleInsertVariable = (tag: string) => {
    setConfig(prev => ({
      ...prev,
      pushContent: prev.pushContent + tag
    }));
  };

  // Upload/Add Users to White/Black List
  const handleBatchListSubmit = () => {
    if (!inputBatchUsers.trim()) {
      showToast('请输入用户ID或手机号');
      return;
    }
    const count = inputBatchUsers.split(/[\n,，]+/).filter(Boolean).length;
    if (showListModal === 'whitelist') {
      setConfig(prev => ({ ...prev, whitelistCount: prev.whitelistCount + count }));
      showToast(`已成功导入 ${count} 名白名单用户`);
    } else if (showListModal === 'blacklist') {
      setConfig(prev => ({ ...prev, blacklistCount: prev.blacklistCount + count }));
      showToast(`已成功导入 ${count} 名黑名单排除用户`);
    }
    setInputBatchUsers('');
    setShowListModal(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
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
            <span>新人红包</span>
            <span>/</span>
            <span className="text-[#1890ff] font-medium">不活跃用户召回策略</span>
          </div>
          <h1 className="text-xl font-bold text-[#262626] tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1890ff]" />
            <span>不活跃用户召回策略</span>
            <span className={`text-xs px-2 py-0.5 rounded font-medium border ${
              config.enabled 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}>
              {config.enabled ? '● 召回策略运行中' : '○ 策略已停用'}
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            针对流失与沉睡用户，自动按周期发放专属召回红包并通过微信服务号模板消息精准触达促成复购。
          </p>
        </div>

        {/* Quick Sub-Tab Navigation Switcher */}
        {onNavigateToTab && (
          <div className="flex items-center bg-[#fafafa] p-1 rounded border border-[#d9d9d9] text-xs">
            <button
              onClick={() => onNavigateToTab('newcomer-rules')}
              className="px-3 py-1.5 rounded font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              1. 规则配置
            </button>
            <button
              onClick={() => onNavigateToTab('wechat-binding')}
              className="px-3 py-1.5 rounded font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              2. 公众号绑定
            </button>
            <button
              onClick={() => onNavigateToTab('inactive-recall')}
              className="px-3 py-1.5 rounded font-medium bg-[#1890ff] text-white shadow-xs"
            >
              3. 不活跃召回
            </button>
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1. 策略开关 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                  <span>策略开关</span>
                  <span className="text-xs font-normal text-gray-500">（启用 / 停用）</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  启用后，系统每日将在指定扫描时间检测沉睡用户，自动注券并推送召回模板消息。
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => {
                    setConfig(prev => ({ ...prev, enabled: e.target.checked }));
                    showToast(e.target.checked ? '召回策略已启用' : '召回策略已停用');
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1890ff]"></div>
              </label>
            </div>
          </div>

          {/* 2. 不活跃定义 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-3">
            <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
              <span>不活跃用户定义</span>
              <span className="text-xs font-normal text-gray-500">（判定用户处于流失风险的未下单周期）</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-700 font-medium whitespace-nowrap">超过</span>
              <div className="w-32 relative">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={config.inactiveDays}
                  onChange={(e) => setConfig(prev => ({ ...prev, inactiveDays: Math.max(1, Number(e.target.value)) }))}
                  className="w-full pl-3 pr-8 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] font-bold text-[#1890ff]"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">天</span>
              </div>
              <span className="text-xs text-gray-700 font-medium">未在全平台产生任何已支付订单</span>
            </div>

            <div className="text-[11px] text-gray-400">
              示例：设置为 15 天，则最后一次下单时间距今 ≥ 15 天且未进入黑名单的注册用户将被判定为召回目标。
            </div>
          </div>

          {/* 3. 召回红包设置 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#e8e8e8]">
              <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#1890ff]" />
                <span>召回红包设置</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                配置发送给沉睡用户的专属回流激励券参数。
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 面额 */}
              <div className="p-3.5 bg-[#fafafa] border border-[#e8e8e8] rounded space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">红包面额 (元)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={config.couponAmount}
                    onChange={(e) => setConfig(prev => ({ ...prev, couponAmount: Number(e.target.value) }))}
                    className="w-full pl-3 pr-7 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] font-bold text-[#1890ff]"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">元</span>
                </div>
                <div className="text-[10px] text-gray-400">默认 2 元</div>
              </div>

              {/* 使用门槛 */}
              <div className="p-3.5 bg-[#fafafa] border border-[#e8e8e8] rounded space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">使用门槛 (满减)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">满</span>
                  <input
                    type="number"
                    min="0"
                    value={config.couponMinSpend}
                    onChange={(e) => setConfig(prev => ({ ...prev, couponMinSpend: Number(e.target.value) }))}
                    className="w-full pl-7 pr-12 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-800"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">元可用</span>
                </div>
                <div className="text-[10px] text-gray-400">默认 满15元可用</div>
              </div>

              {/* 有效期 */}
              <div className="p-3.5 bg-[#fafafa] border border-[#e8e8e8] rounded space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">券有效期</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={config.validityDays}
                    onChange={(e) => setConfig(prev => ({ ...prev, validityDays: Number(e.target.value) }))}
                    className="w-full pl-3 pr-7 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-800"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">天</span>
                </div>
                <div className="text-[10px] text-gray-400">默认 3 天（营造紧迫感）</div>
              </div>
            </div>
          </div>

          {/* 4. 推送渠道 & 5. 推送频次 & 7. 触发时间 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 推送渠道 */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  推送渠道
                </label>
                <div className="p-2.5 bg-blue-50/50 border border-blue-200 rounded flex items-center gap-2 text-xs font-medium text-[#1890ff]">
                  <MessageSquare className="w-4 h-4" />
                  <span>公众号模板消息 (默认)</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-1">需用户已关注公众号</div>
              </div>

              {/* 推送频次 */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  推送频次上限
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">每人每月最多</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={config.monthlyLimitPerUser}
                    onChange={(e) => setConfig(prev => ({ ...prev, monthlyLimitPerUser: Math.max(1, Number(e.target.value)) }))}
                    className="w-full pl-24 pr-8 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] font-bold text-gray-800"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">次</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-1">防止对用户造成高频打扰</div>
              </div>

              {/* 触发时间 */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  每日定时扫描时间
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={config.triggerTime}
                    onChange={(e) => setConfig(prev => ({ ...prev, triggerTime: e.target.value }))}
                    className="w-full pl-3 pr-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] font-mono text-gray-800"
                  />
                </div>
                <div className="text-[10px] text-gray-400 mt-1">默认每日 10:00 执行扫描</div>
              </div>
            </div>
          </div>

          {/* 6. 推送文案 (富文本/文案编辑框) */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                  <span>推送文案配置</span>
                  <span className="text-xs font-normal text-gray-500">（模板消息主文案及引流引导词）</span>
                </div>
              </div>

              {/* Insert Tags Chips */}
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-gray-400">插入动态变量:</span>
                <button
                  type="button"
                  onClick={() => handleInsertVariable('{用户昵称}')}
                  className="px-2 py-0.5 bg-blue-50 text-[#1890ff] rounded border border-blue-100 hover:bg-blue-100"
                >
                  +{'{用户昵称}'}
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertVariable('{红包金额}')}
                  className="px-2 py-0.5 bg-blue-50 text-[#1890ff] rounded border border-blue-100 hover:bg-blue-100"
                >
                  +{'{红包金额}'}
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertVariable('{有效期}')}
                  className="px-2 py-0.5 bg-blue-50 text-[#1890ff] rounded border border-blue-100 hover:bg-blue-100"
                >
                  +{'{有效期}'}
                </button>
              </div>
            </div>

            <textarea
              rows={3}
              value={config.pushContent}
              onChange={(e) => setConfig(prev => ({ ...prev, pushContent: e.target.value }))}
              placeholder="请输入推送文案..."
              className="w-full p-3 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-800 leading-relaxed font-sans"
            />
            <div className="text-[11px] text-gray-400 flex items-center justify-between">
              <span>示例：“【专属福利】您已有一张2元红包待领取，点击立即使用&gt;&gt;”</span>
              <span>{config.pushContent.length} / 120 字符</span>
            </div>
          </div>

          {/* 8. 白名单 / 黑名单 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#e8e8e8]">
              <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#1890ff]" />
                <span>白名单 / 黑名单排除规则</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                支持批量上传指定手机号/用户ID文件，对特定客群进行定向加白或反作弊黑名单排除。
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 白名单卡片 */}
              <div className="p-4 bg-[#fafafa] border border-[#e8e8e8] rounded space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-gray-900">定向召回白名单</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                    {config.whitelistCount} 人
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  导入指定的核心老客或专属VIP名单，无视流失天数判定在指定时间强制触达。
                </p>
                <button
                  type="button"
                  onClick={() => setShowListModal('whitelist')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs text-[#1890ff] bg-white border border-[#d9d9d9] rounded hover:border-[#1890ff] transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>上传白名单 / 条件筛选</span>
                </button>
              </div>

              {/* 黑名单卡片 */}
              <div className="p-4 bg-[#fafafa] border border-[#e8e8e8] rounded space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldX className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-bold text-gray-900">风控排除黑名单</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-medium">
                    {config.blacklistCount} 人已排除
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  排除涉嫌羊毛党、频繁取消订单、退款异常或已明确退订营销消息的用户。
                </p>
                <button
                  type="button"
                  onClick={() => setShowListModal('blacklist')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs text-rose-600 bg-white border border-[#d9d9d9] rounded hover:border-rose-400 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>上传黑名单 / 管理排除列表</span>
                </button>
              </div>
            </div>
          </div>

          {/* 9. 底部操作按钮 */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              id="btn-save-inactive-recall"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-6 py-2 text-xs font-medium text-white bg-[#1890ff] rounded hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>保存策略配置</span>
            </button>

            <button
              type="button"
              id="btn-cancel-inactive-recall"
              onClick={handleReset}
              className="px-5 py-2 text-xs font-medium text-gray-700 bg-white border border-[#d9d9d9] rounded hover:border-gray-400 transition-colors"
            >
              取消 / 恢复默认
            </button>

            {isSaved && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                策略已生效，扫描时间：每日 {config.triggerTime}
              </span>
            )}
          </div>

        </div>

        {/* Right Insight & Preview Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="sticky top-20 space-y-4">
            
            {/* Real-time Audience Estimation Card */}
            <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs space-y-3">
              <div className="text-xs font-bold text-[#262626] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#1890ff]" />
                <span>今日召回客群预估 (实时计算)</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-[#f0f0f0]">
                  <span className="text-gray-500">满足未下单 &gt; {config.inactiveDays} 天</span>
                  <span className="font-bold text-gray-900 font-mono">3,548 人</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#f0f0f0]">
                  <span className="text-gray-500">已关注微信公众号</span>
                  <span className="font-bold text-gray-900 font-mono">2,890 人 (81.4%)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#f0f0f0]">
                  <span className="text-gray-500">扣除本月已达推送频次</span>
                  <span className="text-rose-600 font-mono">- 342 人</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#f0f0f0]">
                  <span className="text-gray-500">扣除黑名单排除</span>
                  <span className="text-rose-600 font-mono">- {config.blacklistCount} 人</span>
                </div>
                <div className="flex justify-between items-center pt-2 text-sm">
                  <span className="font-bold text-gray-800">预计今日实际推送量</span>
                  <span className="font-extrabold text-[#1890ff] font-mono text-base">
                    {(2890 - 342 - config.blacklistCount).toLocaleString()} 人
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50/40 rounded border border-blue-100 text-[11px] text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>预估发放总金额：</span>
                  <span className="font-bold text-gray-900">
                    ¥{((2890 - 342 - config.blacklistCount) * config.couponAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>历史召回核销率：</span>
                  <span className="font-bold text-emerald-600 font-mono">18.6%</span>
                </div>
              </div>
            </div>

            {/* Template Message Mockup */}
            <div className="bg-white border border-[#e8e8e8] rounded shadow-xs overflow-hidden">
              <div className="p-3 bg-[#fafafa] border-b border-[#e8e8e8] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#262626]">
                  <Smartphone className="w-4 h-4 text-[#1890ff]" />
                  <span>召回模板消息样式</span>
                </div>
                <span className="text-[10px] text-gray-400">微信端实收预览</span>
              </div>

              <div className="p-3.5 bg-[#f5f5f5] space-y-2.5">
                <div className="bg-white rounded p-3 shadow-xs border border-gray-200 space-y-2 text-xs">
                  <div className="font-bold text-gray-900 text-[13px] flex items-center gap-1 text-amber-600">
                    <Gift className="w-3.5 h-3.5" />
                    <span>老友专属回归礼包待领取</span>
                  </div>

                  <div className="text-[11px] text-gray-600">
                    {config.pushContent}
                  </div>

                  <div className="space-y-1 pt-1.5 border-t border-gray-100 text-[11px]">
                    <div className="flex justify-between text-gray-500">
                      <span>红包金额：</span>
                      <span className="font-bold text-rose-600 font-mono">{config.couponAmount}.00 元</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>使用门槛：</span>
                      <span className="text-gray-800">满 {config.couponMinSpend} 元可用</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>有效期限：</span>
                      <span className="text-gray-800">{config.validityDays} 天内有效</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#1890ff] font-medium">
                    <span>点击立即进店使用</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal: 白名单/黑名单批量上传 */}
      {showListModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#e8e8e8] shadow-xl w-full max-w-lg overflow-hidden space-y-4 p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8]">
              <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                {showListModal === 'whitelist' ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>上传/配置 定向召回白名单</span>
                  </>
                ) : (
                  <>
                    <ShieldX className="w-4 h-4 text-rose-600" />
                    <span>上传/配置 风控排除黑名单</span>
                  </>
                )}
              </div>
              <button 
                onClick={() => setShowListModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#fafafa] border border-dashed border-[#d9d9d9] rounded text-center space-y-1.5 cursor-pointer hover:border-[#1890ff]">
                <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                <div className="font-semibold text-gray-700">点击选择或拖拽 CSV / TXT / Excel 名单文件上传</div>
                <div className="text-[11px] text-gray-400">支持字段：用户ID、手机号、OpenID (单次支持至多 50,000 条)</div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">或直接粘贴用户ID/手机号 (一行一个)</label>
                <textarea
                  rows={5}
                  value={inputBatchUsers}
                  onChange={(e) => setInputBatchUsers(e.target.value)}
                  placeholder={`USR_100293\nUSR_100294\n13800138000\n13911223344`}
                  className="w-full p-2.5 bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] font-mono leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#e8e8e8] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowListModal(null)}
                className="px-4 py-1.5 text-xs text-gray-600 bg-white border border-[#d9d9d9] rounded hover:border-gray-400"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleBatchListSubmit}
                className={`px-5 py-1.5 text-xs text-white rounded font-medium ${
                  showListModal === 'whitelist' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                确认导入名单
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
