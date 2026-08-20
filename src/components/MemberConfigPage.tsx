import React, { useState } from 'react';
import { 
  Crown, 
  CheckCircle2, 
  Settings, 
  ShoppingBag, 
  DollarSign, 
  Layers, 
  Clock, 
  ShieldAlert, 
  Building2, 
  Smartphone, 
  Calculator, 
  Info,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  Sparkles,
  Percent
} from 'lucide-react';
import { MemberPacketConfig, PageType } from '../types';

interface MemberConfigPageProps {
  onNavigateToTab?: (page: PageType) => void;
}

const DEFAULT_CONFIG: MemberPacketConfig = {
  enabled: true,
  price: 1.8,
  packetCount: 2,
  packetAmount: 2,
  minSpend: 20,
  validityDays: 30,
  monthlyLimitPerUser: 1,
  subsidyPerPacket: 0.9,
  merchantScope: 'all',
  selectedMerchants: ['奈雪的茶 (高新万达店)', '霸王茶姬 (软件园店)', '海底捞火锅 (锦华店)']
};

const AVAILABLE_MERCHANTS = [
  '奈雪的茶 (高新万达店)',
  '霸王茶姬 (软件园店)',
  '海底捞火锅 (锦华店)',
  '瑞幸咖啡 (天府三街店)',
  '肯德基 (大悦城店)',
  '太二酸菜鱼 (万象城店)',
  '喜茶 (太古里店)',
  '盒马鲜生 (天府广场店)'
];

export const MemberConfigPage: React.FC<MemberConfigPageProps> = ({ onNavigateToTab }) => {
  const [config, setConfig] = useState<MemberPacketConfig>(DEFAULT_CONFIG);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [tempSelectedMerchants, setTempSelectedMerchants] = useState<string[]>(DEFAULT_CONFIG.selectedMerchants || []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    setIsSaved(true);
    showToast('会员红包包活动配置已成功保存并同步生效！');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    showToast('已重置为默认配置');
  };

  // Calculations
  const totalValue = config.packetCount * config.packetAmount;
  const userSaving = Math.max(0, totalValue - config.price);
  const totalSubsidy = config.packetCount * config.subsidyPerPacket;
  const merchantCostPerPacket = Math.max(0, config.packetAmount - config.subsidyPerPacket);
  const subsidyPercent = config.packetAmount > 0 ? Math.round((config.subsidyPerPacket / config.packetAmount) * 100) : 0;

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
            <span className="text-[#1890ff] font-medium">活动配置</span>
          </div>
          <h1 className="text-xl font-bold text-[#262626] tracking-tight flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <span>会员红包包 - 活动配置</span>
            <span className={`text-xs px-2 py-0.5 rounded font-medium border ${
              config.enabled 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}>
              {config.enabled ? '● 活动售卖中' : '○ 活动已下架'}
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            配置付费会员专享特权红包包售价、红包组合、核销门槛、平台补贴比例及适用商家范围。
          </p>
        </div>

        {/* Quick Sub-Tab Navigation Switcher */}
        {onNavigateToTab && (
          <div className="flex items-center bg-[#fafafa] p-1 rounded border border-[#d9d9d9] text-xs">
            <button
              onClick={() => onNavigateToTab('member-config')}
              className="px-3 py-1.5 rounded font-medium bg-[#1890ff] text-white shadow-xs"
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
              className="px-3 py-1.5 rounded font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              3. 补贴结算管理
            </button>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 8 cols */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1. 活动开关 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                  <span>活动开关</span>
                  <span className="text-xs font-normal text-gray-500">（售卖总控开关）</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  开启后，前端会员中心与结算收银台将展示会员红包包购买入口，支持会员付费解锁。
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => {
                    setConfig(prev => ({ ...prev, enabled: e.target.checked }));
                    showToast(e.target.checked ? '会员红包包已开启售卖' : '会员红包包已关闭售卖');
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1890ff]"></div>
              </label>
            </div>
          </div>

          {/* 2. 核心售卖与红包面额组合 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#e8e8e8]">
              <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#1890ff]" />
                <span>红包包定价与券包内容</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                设定红包包售卖标价、包含的红包张数及每张红包的面额门槛。
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 红包包售价 */}
              <div className="p-3.5 bg-[#fafafa] border border-[#e8e8e8] rounded space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                  <span>红包包售价</span>
                  <span className="text-[11px] text-gray-400 font-normal">示例 1.8 元</span>
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1890ff]">¥</span>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={config.price}
                    onChange={(e) => setConfig(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full pl-7 pr-8 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] font-bold text-[#1890ff]"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">元</span>
                </div>
                <div className="text-[10px] text-gray-400">用户购买所需支付的现金金额</div>
              </div>

              {/* 红包数量 */}
              <div className="p-3.5 bg-[#fafafa] border border-[#e8e8e8] rounded space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                  <span>包含红包数量</span>
                  <span className="text-[11px] text-gray-400 font-normal">示例 2 张</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={config.packetCount}
                    onChange={(e) => setConfig(prev => ({ ...prev, packetCount: Math.max(1, Number(e.target.value)) }))}
                    className="w-full pl-3 pr-8 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] font-bold text-gray-800"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">张</span>
                </div>
                <div className="text-[10px] text-gray-400">购买单包后一次性发放到用户账户</div>
              </div>

              {/* 红包面额 */}
              <div className="p-3.5 bg-[#fafafa] border border-[#e8e8e8] rounded space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                  <span>每张红包面额</span>
                  <span className="text-[11px] text-gray-400 font-normal">示例 2 元</span>
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-rose-500">¥</span>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={config.packetAmount}
                    onChange={(e) => setConfig(prev => ({ ...prev, packetAmount: Number(e.target.value) }))}
                    className="w-full pl-7 pr-8 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] font-bold text-rose-600"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">元/张</span>
                </div>
                <div className="text-[10px] text-gray-400">
                  礼包总价值：<strong className="text-rose-600 font-bold">¥{totalValue}</strong>（为用户省 ¥{userSaving}）
                </div>
              </div>

              {/* 使用门槛 */}
              <div className="p-3.5 bg-[#fafafa] border border-[#e8e8e8] rounded space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                  <span>红包使用门槛</span>
                  <span className="text-[11px] text-gray-400 font-normal">示例 满20元</span>
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">满</span>
                  <input
                    type="number"
                    min="0"
                    value={config.minSpend}
                    onChange={(e) => setConfig(prev => ({ ...prev, minSpend: Number(e.target.value) }))}
                    className="w-full pl-7 pr-12 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-800 font-medium"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">元可用</span>
                </div>
                <div className="text-[10px] text-gray-400">0元为无门槛立减</div>
              </div>
            </div>
          </div>

          {/* 3. 有效期 & 限购次数 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#e8e8e8]">
              <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1890ff]" />
                <span>有效期与频次风控限制</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 有效期 */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">
                  券有效期（天数）
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={config.validityDays}
                    onChange={(e) => setConfig(prev => ({ ...prev, validityDays: Number(e.target.value) }))}
                    className="w-full pl-3 pr-8 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-800 font-medium"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">天</span>
                </div>
                <div className="text-[10px] text-gray-400">自购买发放之日起计算有效天数，示例 30 天</div>
              </div>

              {/* 限购次数 */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">
                  限购次数（每月每人）
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">每月每人限购</span>
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
                <div className="text-[10px] text-gray-400">结合账号与实名设备风控拦截刷单，示例 1 次</div>
              </div>
            </div>
          </div>

          {/* 4. 补贴比例与金额分摊 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#e8e8e8] flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>平台与商家成本补贴分摊</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  设定每张红包由平台与商家各自承担的资金补贴比例。
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-blue-50 text-[#1890ff] font-medium border border-blue-200">
                平台补贴率: {subsidyPercent}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 每张红包补贴金额 */}
              <div className="p-3.5 bg-emerald-50/40 border border-emerald-200 rounded space-y-1">
                <label className="text-xs font-semibold text-emerald-900 block">
                  平台补贴金额 (每张)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700">¥</span>
                  <input
                    type="number"
                    min="0"
                    max={config.packetAmount}
                    step="0.1"
                    value={config.subsidyPerPacket}
                    onChange={(e) => setConfig(prev => ({ ...prev, subsidyPerPacket: Math.min(config.packetAmount, Math.max(0, Number(e.target.value))) }))}
                    className="w-full pl-7 pr-8 py-1.5 text-xs bg-white border border-emerald-300 rounded outline-none focus:border-emerald-500 font-bold text-emerald-700"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-emerald-600">元/张</span>
                </div>
                <div className="text-[10px] text-emerald-700">单包总补贴: ¥{totalSubsidy.toFixed(2)}</div>
              </div>

              {/* 商家承担金额 */}
              <div className="p-3.5 bg-blue-50/40 border border-blue-200 rounded space-y-1">
                <label className="text-xs font-semibold text-blue-900 block">
                  商家承担金额 (每张)
                </label>
                <div className="text-lg font-bold text-[#1890ff] font-mono pt-1">
                  ¥{merchantCostPerPacket.toFixed(2)} <span className="text-xs text-gray-500 font-normal">/张</span>
                </div>
                <div className="text-[10px] text-blue-700">占比 {(100 - subsidyPercent)}%（核销时商户让利）</div>
              </div>

              {/* 平台售包净盈亏测算 */}
              <div className="p-3.5 bg-amber-50/40 border border-amber-200 rounded space-y-1">
                <label className="text-xs font-semibold text-amber-900 block">
                  平台售卖净收入测算
                </label>
                <div className="text-lg font-bold text-amber-700 font-mono pt-1">
                  +¥{(config.price - totalSubsidy).toFixed(2)} <span className="text-xs text-gray-500 font-normal">/包</span>
                </div>
                <div className="text-[10px] text-amber-700">（售价 ¥{config.price} - 补贴 ¥{totalSubsidy.toFixed(2)}）</div>
              </div>
            </div>
          </div>

          {/* 5. 参与商家范围 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#e8e8e8]">
              <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#1890ff]" />
                <span>参与商家范围</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                支持全平台全量商户通用、定向指定KA商户或开放商户自主报名参与。
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 全部商家 */}
                <label 
                  className={`p-3 rounded border cursor-pointer flex items-start gap-3 transition-all ${
                    config.merchantScope === 'all' 
                      ? 'border-[#1890ff] bg-blue-50/30' 
                      : 'border-[#d9d9d9] hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="merchantScope"
                    checked={config.merchantScope === 'all'}
                    onChange={() => setConfig(prev => ({ ...prev, merchantScope: 'all' }))}
                    className="mt-0.5 text-[#1890ff] focus:ring-[#1890ff]"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">全部商家</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">全平台所有在售商户默认通用支持核销</div>
                  </div>
                </label>

                {/* 指定商家 */}
                <label 
                  className={`p-3 rounded border cursor-pointer flex items-start gap-3 transition-all ${
                    config.merchantScope === 'specific' 
                      ? 'border-[#1890ff] bg-blue-50/30' 
                      : 'border-[#d9d9d9] hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="merchantScope"
                    checked={config.merchantScope === 'specific'}
                    onChange={() => setConfig(prev => ({ ...prev, merchantScope: 'specific' }))}
                    className="mt-0.5 text-[#1890ff] focus:ring-[#1890ff]"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">指定商家</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">仅限平台选定的头部优质/签约商户</div>
                  </div>
                </label>

                {/* 开放报名 */}
                <label 
                  className={`p-3 rounded border cursor-pointer flex items-start gap-3 transition-all ${
                    config.merchantScope === 'open_enroll' 
                      ? 'border-[#1890ff] bg-blue-50/30' 
                      : 'border-[#d9d9d9] hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="merchantScope"
                    checked={config.merchantScope === 'open_enroll'}
                    onChange={() => setConfig(prev => ({ ...prev, merchantScope: 'open_enroll' }))}
                    className="mt-0.5 text-[#1890ff] focus:ring-[#1890ff]"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">开放报名</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">商户可在商家后台自主报名，审核通过后加入</div>
                  </div>
                </label>
              </div>

              {/* 当选择指定商家时展示已选清单 */}
              {config.merchantScope === 'specific' && (
                <div className="p-3 bg-[#fafafa] border border-[#e8e8e8] rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">
                      已指定参与商家（{(config.selectedMerchants || []).length} 家）
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setTempSelectedMerchants(config.selectedMerchants || []);
                        setShowMerchantModal(true);
                      }}
                      className="text-xs text-[#1890ff] hover:underline font-medium"
                    >
                      + 管理指定商家
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(config.selectedMerchants || []).map((m, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-[#d9d9d9] text-xs text-gray-700"
                      >
                        <span>{m}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setConfig(prev => ({
                              ...prev,
                              selectedMerchants: (prev.selectedMerchants || []).filter(item => item !== m)
                            }));
                          }}
                          className="text-gray-400 hover:text-rose-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 6. 底部操作按钮 */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              id="btn-save-member-config"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-6 py-2 text-xs font-medium text-white bg-[#1890ff] rounded hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>保存活动配置</span>
            </button>

            <button
              type="button"
              id="btn-cancel-member-config"
              onClick={handleReset}
              className="px-5 py-2 text-xs font-medium text-gray-700 bg-white border border-[#d9d9d9] rounded hover:border-gray-400 transition-colors"
            >
              取消 / 恢复默认
            </button>

            {isSaved && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                配置已成功保存并实时生效
              </span>
            )}
          </div>

        </div>

        {/* Right Insight & Mobile Preview: 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          <div className="sticky top-20 space-y-4">
            
            {/* Mobile Purchasing Card Mockup */}
            <div className="bg-white border border-[#e8e8e8] rounded shadow-xs overflow-hidden">
              <div className="p-3 bg-[#fafafa] border-b border-[#e8e8e8] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#262626]">
                  <Smartphone className="w-4 h-4 text-[#1890ff]" />
                  <span>移动端用户购买页预览</span>
                </div>
                <span className="text-[10px] text-gray-400">真实渲染效果</span>
              </div>

              <div className="p-4 bg-gradient-to-b from-amber-500/10 to-[#f5f5f5] space-y-3">
                {/* Member VIP Card banner */}
                <div className="bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] text-white p-3.5 rounded-lg shadow-sm space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                      <Crown className="w-4 h-4 fill-amber-400" />
                      <span>会员特权红包包</span>
                    </div>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30">
                      限购 {config.monthlyLimitPerUser} 次/月
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-2xl font-black text-amber-400 font-mono">¥{config.price}</span>
                      <span className="text-[11px] text-gray-400 line-through ml-1.5">¥{totalValue}</span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold">
                      立省 ¥{userSaving}
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-300">
                    包含 <strong className="text-white font-bold">{config.packetCount} 张 ¥{config.packetAmount}</strong> 会员专享红包（满{config.minSpend}元可用）
                  </div>
                </div>

                {/* Packet List in Phone */}
                <div className="space-y-2">
                  {Array.from({ length: config.packetCount }).map((_, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded border border-dashed border-rose-300 flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded bg-rose-50 border border-rose-100 flex flex-col items-center justify-center text-rose-600">
                          <span className="text-xs font-bold">¥{config.packetAmount}</span>
                          <span className="text-[8px]">会员券</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900">会员专享抵扣红包</div>
                          <div className="text-[10px] text-gray-400">满 {config.minSpend} 元可用 · 有效期 {config.validityDays} 天</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#1890ff] font-medium px-2 py-0.5 bg-blue-50 rounded">
                        待解锁
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-white/80 rounded text-[11px] text-gray-500 border border-gray-200 text-center">
                  适用范围：{config.merchantScope === 'all' ? '全平台所有商家通用' : config.merchantScope === 'specific' ? `指定 ${(config.selectedMerchants || []).length} 家精选大牌通用` : '签约参与商户通用'}
                </div>
              </div>
            </div>

            {/* Business Model Summary */}
            <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs space-y-3">
              <div className="text-xs font-bold text-[#262626] flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#1890ff]" />
                <span>单包经济学测算模型 (Unit Economics)</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-[#f0f0f0]">
                  <span className="text-gray-500">用户实付售价</span>
                  <span className="font-bold text-gray-900 font-mono">¥{config.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#f0f0f0]">
                  <span className="text-gray-500">平台单包总补贴支出</span>
                  <span className="font-bold text-rose-600 font-mono">- ¥{totalSubsidy.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#f0f0f0]">
                  <span className="text-gray-500">商家核销总承担成本</span>
                  <span className="font-bold text-blue-600 font-mono">¥{(merchantCostPerPacket * config.packetCount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-1.5 text-sm">
                  <span className="font-bold text-gray-800">平台售卖净收入</span>
                  <span className="font-extrabold text-emerald-600 font-mono">
                    +¥{(config.price - totalSubsidy).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal: 管理指定商家 */}
      {showMerchantModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#e8e8e8] shadow-xl w-full max-w-md overflow-hidden space-y-4 p-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8]">
              <span className="text-sm font-bold text-[#262626]">选择会员红包可用商家</span>
              <button 
                onClick={() => setShowMerchantModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {AVAILABLE_MERCHANTS.map((merchant, i) => {
                const isChecked = tempSelectedMerchants.includes(merchant);
                return (
                  <label 
                    key={i}
                    className={`flex items-center justify-between p-2.5 rounded border text-xs cursor-pointer transition-colors ${
                      isChecked ? 'bg-blue-50 border-[#1890ff] text-[#1890ff] font-medium' : 'border-[#e8e8e8] hover:bg-gray-50'
                    }`}
                  >
                    <span>{merchant}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTempSelectedMerchants(prev => [...prev, merchant]);
                        } else {
                          setTempSelectedMerchants(prev => prev.filter(m => m !== merchant));
                        }
                      }}
                      className="text-[#1890ff] focus:ring-[#1890ff] rounded"
                    />
                  </label>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#e8e8e8] flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowMerchantModal(false)}
                className="px-4 py-1.5 text-gray-600 bg-white border border-[#d9d9d9] rounded hover:border-gray-400"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfig(prev => ({ ...prev, selectedMerchants: tempSelectedMerchants }));
                  setShowMerchantModal(false);
                  showToast(`已更新指定商家列表（共 ${tempSelectedMerchants.length} 家）`);
                }}
                className="px-5 py-1.5 text-white bg-[#1890ff] rounded font-medium hover:bg-blue-600"
              >
                确认已选 ({tempSelectedMerchants.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
