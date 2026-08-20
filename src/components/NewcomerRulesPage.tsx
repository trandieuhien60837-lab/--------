import React, { useState } from 'react';
import { 
  Gift, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Smartphone, 
  Layers, 
  Store, 
  ShoppingBag, 
  Globe, 
  Users, 
  Info,
  Calendar,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { NewcomerRulesConfig, RedPacketItemConfig, PageType } from '../types';

interface NewcomerRulesPageProps {
  onNavigateToTab?: (page: PageType) => void;
}

const INITIAL_RULES: NewcomerRulesConfig = {
  enabled: true,
  packets: [
    { id: 'pkt-1', name: '新人首单迎新红包', amount: 3, minSpend: 20, validityDays: 7 },
    { id: 'pkt-2', name: '跨店专享立减红包', amount: 2, minSpend: 15, validityDays: 7 },
    { id: 'pkt-3', name: '爆款尝鲜回购红包', amount: 2, minSpend: 15, validityDays: 7 }
  ],
  dispatchMethod: 'all_immediate', // 'all_immediate' | 'first_immediate_rest_first_order'
  newUserDefinitions: ['first_register', 'registered_no_order'],
  scopeType: 'all',
  selectedGoods: ['精选咖啡饮品券', '生鲜烘焙体验卡'],
  selectedMerchants: ['瑞幸咖啡(全城门店)', '喜茶联名店', '盒马鲜生直营店'],
  limitPerUser: 1
};

export const NewcomerRulesPage: React.FC<NewcomerRulesPageProps> = ({ onNavigateToTab }) => {
  const [config, setConfig] = useState<NewcomerRulesConfig>(INITIAL_RULES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Selected Scope Modals/Drawer States
  const [showGoodsSelector, setShowGoodsSelector] = useState(false);
  const [showMerchantSelector, setShowMerchantSelector] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add Red Packet
  const handleAddPacket = () => {
    const newId = `pkt-${Date.now()}`;
    const nextIdx = config.packets.length + 1;
    const newPacket: RedPacketItemConfig = {
      id: newId,
      name: `新人专属红包 ${nextIdx}`,
      amount: 2,
      minSpend: 15,
      validityDays: 7
    };
    setConfig(prev => ({
      ...prev,
      packets: [...prev.packets, newPacket]
    }));
    showToast(`已添加新红包项 (红包${nextIdx})`);
  };

  // Remove Red Packet
  const handleRemovePacket = (id: string) => {
    if (config.packets.length <= 1) {
      showToast('至少需保留 1 个新人红包配置');
      return;
    }
    setConfig(prev => ({
      ...prev,
      packets: prev.packets.filter(p => p.id !== id)
    }));
    showToast('已移除红包项');
  };

  // Update specific packet field
  const handleUpdatePacket = (id: string, field: keyof RedPacketItemConfig, val: any) => {
    setConfig(prev => ({
      ...prev,
      packets: prev.packets.map(p => p.id === id ? { ...p, [field]: val } : p)
    }));
  };

  // Toggle user definition
  const handleToggleUserDef = (def: 'first_register' | 'first_order' | 'registered_no_order') => {
    setConfig(prev => {
      const exists = prev.newUserDefinitions.includes(def);
      const updated = exists 
        ? prev.newUserDefinitions.filter(d => d !== def)
        : [...prev.newUserDefinitions, def];
      return {
        ...prev,
        newUserDefinitions: updated.length === 0 ? [def] : updated
      };
    });
  };

  // Save handler
  const handleSave = () => {
    setIsSaved(true);
    showToast('新人红包规则配置已成功保存并实时生效！');
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Reset handler
  const handleReset = () => {
    setConfig(INITIAL_RULES);
    showToast('已重置为默认配置');
  };

  const totalAmount = config.packets.reduce((sum, p) => sum + Number(p.amount || 0), 0);

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
            <span className="text-[#1890ff] font-medium">规则配置</span>
          </div>
          <h1 className="text-xl font-bold text-[#262626] tracking-tight flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#1890ff]" />
            <span>新人红包规则配置</span>
            <span className={`text-xs px-2 py-0.5 rounded font-medium border ${
              config.enabled 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}>
              {config.enabled ? '● 规则运行中' : '○ 已停用'}
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            配置新用户关注公众号后的迎新红包礼包组合、阶梯发放逻辑与适用核销边界。
          </p>
        </div>

        {/* Quick Sub-Tab Navigation Switcher */}
        {onNavigateToTab && (
          <div className="flex items-center bg-[#fafafa] p-1 rounded border border-[#d9d9d9] text-xs">
            <button
              onClick={() => onNavigateToTab('newcomer-rules')}
              className="px-3 py-1.5 rounded font-medium bg-[#1890ff] text-white shadow-xs"
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
              className="px-3 py-1.5 rounded font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              3. 不活跃召回
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout: Form + Live Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. 活动开关 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                  <span>活动开关</span>
                  <span className="text-xs font-normal text-gray-500">（控制全平台新人迎新红包发放的总阀门）</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  开启后，符合新用户定义且关注公众号的用户将自动触发红包发放与模板消息推送。
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => {
                    setConfig(prev => ({ ...prev, enabled: e.target.checked }));
                    showToast(e.target.checked ? '活动开关已开启' : '活动开关已关闭');
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1890ff]"></div>
              </label>
            </div>
          </div>

          {/* 2. 红包列表配置 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8]">
              <div>
                <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                  <span>红包列表配置</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-[#1890ff] font-medium border border-blue-100">
                    礼包总价值 ¥{totalAmount}（共 {config.packets.length} 张）
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  支持多张新人组合礼包，可分别设置面额、使用门槛和有效期天数。
                </div>
              </div>
              <button
                type="button"
                id="btn-add-red-packet"
                onClick={handleAddPacket}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1890ff] rounded hover:bg-blue-600 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加红包</span>
              </button>
            </div>

            {/* List of Red Packets */}
            <div className="space-y-3">
              {config.packets.map((pkt, index) => (
                <div 
                  key={pkt.id} 
                  className="p-4 rounded border border-[#e8e8e8] bg-[#fafafa] hover:border-[#1890ff]/40 transition-colors space-y-3"
                  id={`packet-row-${pkt.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1890ff] text-white text-[11px] font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={pkt.name}
                        onChange={(e) => handleUpdatePacket(pkt.id, 'name', e.target.value)}
                        className="text-xs font-semibold text-[#262626] bg-white border border-[#d9d9d9] px-2 py-1 rounded outline-none focus:border-[#1890ff] w-48"
                        placeholder="红包名称..."
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemovePacket(pkt.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="删除此红包"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* 面额 */}
                    <div>
                      <label className="text-[11px] font-medium text-gray-600 block mb-1">
                        红包面额 (元)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0.1"
                          step="0.5"
                          value={pkt.amount}
                          onChange={(e) => handleUpdatePacket(pkt.id, 'amount', Number(e.target.value))}
                          className="w-full pl-3 pr-7 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] font-bold text-[#1890ff]"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">元</span>
                      </div>
                    </div>

                    {/* 使用门槛 */}
                    <div>
                      <label className="text-[11px] font-medium text-gray-600 block mb-1">
                        使用门槛 (满减)
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">满</span>
                        <input
                          type="number"
                          min="0"
                          value={pkt.minSpend}
                          onChange={(e) => handleUpdatePacket(pkt.id, 'minSpend', Number(e.target.value))}
                          className="w-full pl-7 pr-12 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-800"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">元可用</span>
                      </div>
                    </div>

                    {/* 有效期 */}
                    <div>
                      <label className="text-[11px] font-medium text-gray-600 block mb-1">
                        有效天数 (发放起)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="90"
                          value={pkt.validityDays}
                          onChange={(e) => handleUpdatePacket(pkt.id, 'validityDays', Number(e.target.value))}
                          className="w-full pl-3 pr-7 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-800"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">天</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 发放方式 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-3">
            <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
              <span>发放方式</span>
              <span className="text-xs font-normal text-gray-500">（单选）</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label 
                className={`p-3.5 rounded border cursor-pointer flex items-start gap-3 transition-all ${
                  config.dispatchMethod === 'all_immediate'
                    ? 'border-[#1890ff] bg-blue-50/40 text-[#262626]'
                    : 'border-[#e8e8e8] bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="dispatchMethod"
                  checked={config.dispatchMethod === 'all_immediate'}
                  onChange={() => setConfig(prev => ({ ...prev, dispatchMethod: 'all_immediate' }))}
                  className="mt-0.5 text-[#1890ff] focus:ring-[#1890ff]"
                />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-gray-900">关注后立即全部发放</div>
                  <div className="text-gray-500 leading-relaxed">
                    用户扫码关注微信公众号后，立即一次性将上述 {config.packets.length} 张红包全部注入用户券包。
                  </div>
                </div>
              </label>

              <label 
                className={`p-3.5 rounded border cursor-pointer flex items-start gap-3 transition-all ${
                  config.dispatchMethod === 'first_immediate_rest_first_order'
                    ? 'border-[#1890ff] bg-blue-50/40 text-[#262626]'
                    : 'border-[#e8e8e8] bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="dispatchMethod"
                  checked={config.dispatchMethod === 'first_immediate_rest_first_order'}
                  onChange={() => setConfig(prev => ({ ...prev, dispatchMethod: 'first_immediate_rest_first_order' }))}
                  className="mt-0.5 text-[#1890ff] focus:ring-[#1890ff]"
                />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-gray-900">关注后先发第1张，其余完成首单后发放</div>
                  <div className="text-gray-500 leading-relaxed">
                    先发首张 3 元迎新券；待用户首单支付成功后，自动解锁发放剩余 {config.packets.length - 1} 张复购红包。
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* 4. 新用户定义 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-3">
            <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
              <span>新用户定义</span>
              <span className="text-xs font-normal text-gray-500">（多选：满足以下任意条件的判定为新用户）</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'first_register', label: '首次注册', desc: '手机号/微信在平台首次完成注册' },
                { key: 'first_order', label: '首次下单', desc: '在平台历史累计成功订单数为 0' },
                { key: 'registered_no_order', label: '注册且未下单', desc: '已注册过但从未产生任何消费' }
              ].map((item) => {
                const checked = config.newUserDefinitions.includes(item.key as any);
                return (
                  <label
                    key={item.key}
                    className={`p-3 rounded border cursor-pointer flex items-start gap-2.5 transition-all ${
                      checked 
                        ? 'border-[#1890ff] bg-blue-50/30' 
                        : 'border-[#e8e8e8] bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleUserDef(item.key as any)}
                      className="mt-0.5 rounded text-[#1890ff] focus:ring-[#1890ff]"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-gray-900">{item.label}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{item.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 5. 适用范围 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-3">
            <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
              <span>适用范围</span>
              <span className="text-xs font-normal text-gray-500">（单选）</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'all', label: '全平台', icon: Globe, desc: '适用于全平台所有商户与在线商品' },
                { key: 'specific_goods', label: '指定商品', icon: ShoppingBag, desc: '仅限指定活动类目或特定商品核销' },
                { key: 'specific_merchants', label: '指定商家', icon: Store, desc: '仅限入选新人联盟的签约商户' }
              ].map((item) => {
                const Icon = item.icon;
                const active = config.scopeType === item.key;
                return (
                  <label
                    key={item.key}
                    className={`p-3 rounded border cursor-pointer flex items-start gap-2.5 transition-all ${
                      active 
                        ? 'border-[#1890ff] bg-blue-50/40' 
                        : 'border-[#e8e8e8] bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="scopeType"
                      checked={active}
                      onChange={() => setConfig(prev => ({ ...prev, scopeType: item.key as any }))}
                      className="mt-0.5 text-[#1890ff] focus:ring-[#1890ff]"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-[#1890ff]" />
                        <span>{item.label}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{item.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Scope details when not 'all' */}
            {config.scopeType === 'specific_goods' && (
              <div className="p-3 bg-[#fafafa] rounded border border-[#e8e8e8] text-xs space-y-2">
                <div className="flex items-center justify-between font-medium text-gray-700">
                  <span>已选可用商品清单 (共 {config.selectedGoods?.length} 项)</span>
                  <button 
                    onClick={() => showToast('已打开商品选择器')} 
                    className="text-[#1890ff] hover:underline"
                  >
                    + 添加/修改商品
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {config.selectedGoods?.map((g, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white border border-[#d9d9d9] rounded text-gray-700 text-[11px]">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {config.scopeType === 'specific_merchants' && (
              <div className="p-3 bg-[#fafafa] rounded border border-[#e8e8e8] text-xs space-y-2">
                <div className="flex items-center justify-between font-medium text-gray-700">
                  <span>已选可用商家清单 (共 {config.selectedMerchants?.length} 家)</span>
                  <button 
                    onClick={() => showToast('已打开商家选择器')} 
                    className="text-[#1890ff] hover:underline"
                  >
                    + 添加/修改商家
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {config.selectedMerchants?.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white border border-[#d9d9d9] rounded text-gray-700 text-[11px]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 6. 限领次数 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-3">
            <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
              <span>限领次数</span>
              <span className="text-xs font-normal text-gray-500">（数字输入框，默认 1）</span>
            </div>

            <div className="max-w-xs relative">
              <input
                type="number"
                min="1"
                max="10"
                value={config.limitPerUser}
                onChange={(e) => setConfig(prev => ({ ...prev, limitPerUser: Math.max(1, Number(e.target.value)) }))}
                className="w-full pl-3 pr-16 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-800"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                次 / 每人终身
              </span>
            </div>
            <div className="text-[11px] text-gray-400">
              结合设备指纹 + 微信OpenID + 手机号三重风控校验，防止恶意刷券行为。
            </div>
          </div>

          {/* 7. 底部操作按钮 */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              id="btn-save-newcomer-rules"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-6 py-2 text-xs font-medium text-white bg-[#1890ff] rounded hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>保存规则配置</span>
            </button>

            <button
              type="button"
              id="btn-cancel-newcomer-rules"
              onClick={handleReset}
              className="px-5 py-2 text-xs font-medium text-gray-700 bg-white border border-[#d9d9d9] rounded hover:border-gray-400 transition-colors"
            >
              取消 / 恢复默认
            </button>

            {isSaved && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                已实时同步至发券引擎
              </span>
            )}
          </div>

        </div>

        {/* Right Preview Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="sticky top-20">
            {/* Phone Mockup Frame */}
            <div className="bg-white border border-[#e8e8e8] rounded shadow-xs overflow-hidden">
              <div className="p-3 bg-[#fafafa] border-b border-[#e8e8e8] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#262626]">
                  <Smartphone className="w-4 h-4 text-[#1890ff]" />
                  <span>用户端关注到账效果预览</span>
                </div>
                <span className="text-[10px] text-gray-400">微信公众号环境</span>
              </div>

              <div className="p-4 bg-gray-100 flex justify-center">
                {/* Phone screen */}
                <div className="w-full max-w-[280px] bg-white rounded-xl shadow-md border border-gray-300 overflow-hidden text-xs">
                  {/* Status Bar */}
                  <div className="bg-[#262626] text-white text-[10px] px-3 py-1 flex justify-between items-center">
                    <span>9:41</span>
                    <span className="font-mono">微信 · 服务号</span>
                  </div>

                  {/* Header Title */}
                  <div className="bg-[#f7f7f7] border-b border-gray-200 px-3 py-2 text-center text-xs font-bold text-gray-800">
                    美食优选官方服务号
                  </div>

                  {/* Chat flow */}
                  <div className="p-3 bg-[#ededed] space-y-3 min-h-[340px]">
                    {/* Timestamp */}
                    <div className="text-center">
                      <span className="text-[10px] text-gray-400 bg-gray-200/80 px-2 py-0.5 rounded">
                        刚刚 关注成功
                      </span>
                    </div>

                    {/* Template Card Message */}
                    <div className="bg-white rounded-lg p-3 shadow-xs border border-gray-200 space-y-2">
                      <div className="font-bold text-gray-900 text-xs flex items-center gap-1 text-rose-600">
                        <Gift className="w-3.5 h-3.5" />
                        <span>新人专属大礼包已到账</span>
                      </div>
                      
                      <div className="text-[11px] text-gray-600 leading-relaxed">
                        尊敬的微信用户，感谢您的关注！为您送上总价值 <strong className="text-rose-600">¥{totalAmount}</strong> 的迎新礼包：
                      </div>

                      {/* Red packet cards list */}
                      <div className="space-y-1.5 pt-1">
                        {config.packets.map((p, idx) => (
                          <div 
                            key={p.id} 
                            className="flex items-center justify-between p-2 rounded bg-rose-50 border border-rose-100 text-rose-700"
                          >
                            <div>
                              <div className="font-bold text-xs">{p.name}</div>
                              <div className="text-[10px] text-rose-500">满{p.minSpend}元可用 · {p.validityDays}天有效</div>
                            </div>
                            <div className="text-sm font-extrabold text-rose-600 font-mono">
                              ¥{p.amount}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#1890ff] font-medium">
                        <span>点击立即进店选购</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#fafafa] border-t border-[#e8e8e8] text-[11px] text-gray-500 space-y-1">
                <div className="flex items-center gap-1 font-medium text-gray-700">
                  <Info className="w-3 h-3 text-[#1890ff]" />
                  <span>发券与触达机制</span>
                </div>
                <p>
                  用户关注微信公众号后，后台监听 subscribe 事件，自动创建券包并通过公众号模板消息推送通知。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
