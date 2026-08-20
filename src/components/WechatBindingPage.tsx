import React, { useState } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  Link2,
  KeyRound,
  Save,
  FileText,
  Eye,
  X,
  ShieldCheck,
  AlertCircle,
  Copy,
  Smartphone,
  Bell,
  Package
} from 'lucide-react';
import { WechatBindingConfig, WechatTemplateConfig, PageType } from '../types';

interface WechatBindingPageProps {
  onNavigateToTab?: (page: PageType) => void;
}

const INITIAL_BINDING: WechatBindingConfig = {
  accountName: '营销联盟福利社',
  appId: 'wx1a2b3c4d5e6f7a8b',
  appSecret: 'c9f8e7d6a5b4c3d2e1f0a9b8c7d6e5f4',
  avatarUrl: '',
  isBound: true,
  boundAt: '2025-01-15 10:24:00',
  callbackUrl: 'https://api.yxlm.com/wechat/callback',
  token: 'yxlm2025_token',
  encodingAesKey: 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEF',
  templates: [
    {
      id: 'tpl-red',
      type: 'red_packet',
      title: '新人红包到账提醒',
      templateId: 'TM00123-REDPACKET',
      exampleContent: '恭喜您获得新人专享红包 ¥3.00，点击立即领取>>',
      variables: ['红包金额', '红包数量', '有效期', '领取链接'],
      lastTestedAt: '2025-01-16 09:30:00'
    },
    {
      id: 'tpl-order',
      type: 'order_status',
      title: '订单核销状态通知',
      templateId: 'TM00456-ORDER',
      exampleContent: '您的订单已核销成功，红包已到账，欢迎再次光临>>',
      variables: ['订单号', '核销门店', '核销时间'],
      lastTestedAt: '2025-01-16 09:35:00'
    },
    {
      id: 'tpl-recall',
      type: 'recall_packet',
      title: '不活跃用户召回红包',
      templateId: 'TM00789-RECALL',
      exampleContent: '您有一张 ¥2.00 召回红包待领取，满 ¥15 可用，点击立即使用>>',
      variables: ['红包金额', '使用门槛', '有效期', '使用链接'],
      lastTestedAt: '2025-01-16 09:40:00'
    }
  ]
};

const TYPE_LABELS: Record<WechatTemplateConfig['type'], { label: string; icon: any; color: string }> = {
  red_packet: { label: '红包通知', icon: Bell, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  order_status: { label: '订单状态', icon: Package, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  recall_packet: { label: '召回推送', icon: Smartphone, color: 'text-violet-600 bg-violet-50 border-violet-200' }
};

export const WechatBindingPage: React.FC<WechatBindingPageProps> = ({ onNavigateToTab }) => {
  const [config, setConfig] = useState<WechatBindingConfig>(INITIAL_BINDING);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<WechatTemplateConfig | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    if (!config.appId.trim() || !config.appSecret.trim()) {
      showToast('请先填写 AppID 与 AppSecret');
      return;
    }
    setIsSaved(true);
    showToast('公众号绑定配置已保存，已同步至微信开放平台。');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCopy = (text: string) => {
    showToast(`已复制：${text}`);
  };

  const handleTestTemplate = (tpl: WechatTemplateConfig) => {
    setActiveTemplate(tpl);
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
            <span>新人红包</span>
            <span>/</span>
            <span className="text-[#1890ff] font-medium">公众号绑定设置</span>
          </div>
          <h1 className="text-xl font-bold text-[#262626] tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#1890ff]" />
            <span>公众号绑定设置</span>
            <span className={`text-xs px-2 py-0.5 rounded font-medium border ${
              config.isBound
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}>
              {config.isBound ? '● 已绑定' : '○ 未绑定'}
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            接入微信服务号作为红包发放与模板消息推送通道，配置开发者凭证并维护消息模板。
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
              className="px-3 py-1.5 rounded font-medium bg-[#1890ff] text-white shadow-xs"
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Binding Credentials (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. 基础信息 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-4">
            <div>
              <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                <Link2 className="w-4 h-4 text-[#1890ff]" />
                <span>基础信息</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                填写公众号平台中「设置与开发 → 账号信息」内可见的开发者凭证。
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">公众号名称</label>
                <input
                  type="text"
                  value={config.accountName}
                  onChange={(e) => setConfig(prev => ({ ...prev, accountName: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">AppID</label>
                <div className="relative">
                  <input
                    type="text"
                    value={config.appId}
                    onChange={(e) => setConfig(prev => ({ ...prev, appId: e.target.value }))}
                    className="w-full px-3 py-2 pr-8 text-xs font-mono bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff]"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(config.appId)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1890ff]"
                    title="复制"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">AppSecret</label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={config.appSecret}
                    onChange={(e) => setConfig(prev => ({ ...prev, appSecret: e.target.value }))}
                    className="w-full px-3 py-2 pr-8 text-xs font-mono bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(v => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1890ff]"
                    title={showSecret ? '隐藏' : '显示'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">绑定时间</label>
                <input
                  type="text"
                  value={config.boundAt}
                  readOnly
                  className="w-full px-3 py-2 text-xs font-mono bg-gray-50 border border-[#e8e8e8] rounded outline-none text-gray-400"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-gray-500 p-3 bg-blue-50/40 border border-blue-100 rounded">
              <ShieldCheck className="w-4 h-4 text-[#1890ff] shrink-0 mt-0.5" />
              <span>
                AppSecret 仅用于服务端签名校验，请勿在前端代码中明文存储。此配置已加密保存，修改后 5 分钟内全局生效。
              </span>
            </div>
          </div>

          {/* 2. 接口配置 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-4">
            <div>
              <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#1890ff]" />
                <span>接口配置</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                回调地址用于接收微信服务器推送的用户关注 / 领券事件。
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">服务器回调地址 (URL)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={config.callbackUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, callbackUrl: e.target.value }))}
                    className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff]"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(config.callbackUrl)}
                    className="px-3 py-2 text-xs text-gray-600 bg-white border border-[#d9d9d9] rounded hover:border-[#1890ff] hover:text-[#1890ff] transition-colors"
                  >
                    复制
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Token (验证令牌)</label>
                  <input
                    type="text"
                    value={config.token}
                    onChange={(e) => setConfig(prev => ({ ...prev, token: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">消息加密密钥 (EncodingAESKey)</label>
                  <input
                    type="text"
                    value={config.encodingAesKey}
                    onChange={(e) => setConfig(prev => ({ ...prev, encodingAesKey: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff]"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-gray-500 p-3 bg-amber-50 border border-amber-200 rounded">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  请在微信公众平台「设置与开发 → 服务器配置」中填写上述 URL 与 Token 并启用加密模式，双向校验通过后即完成接入。
                </span>
              </div>
            </div>
          </div>

          {/* 3. 消息模板 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-4">
            <div>
              <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1890ff]" />
                <span>消息模板</span>
                <span className="text-xs font-normal text-gray-400">（共 {config.templates.length} 个）</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                模板需先在公众平台审核通过，此处维护业务映射关系。
              </p>
            </div>

            <div className="space-y-3">
              {config.templates.map((tpl) => {
                const meta = TYPE_LABELS[tpl.type];
                const Icon = meta.icon;
                return (
                  <div key={tpl.id} className="border border-[#e8e8e8] rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded border ${meta.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{tpl.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">
                            {meta.label}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1 font-mono">模板ID: {tpl.templateId}</div>
                        <div className="text-[11px] text-gray-500 mt-1">
                          示例：{tpl.exampleContent}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleTestTemplate(tpl)}
                        className="px-2.5 py-1.5 text-[11px] font-medium text-gray-700 bg-white border border-[#d9d9d9] rounded hover:border-[#1890ff] hover:text-[#1890ff] transition-colors"
                      >
                        测试发送
                      </button>
                      {tpl.lastTestedAt && (
                        <span className="text-[10px] text-gray-400">最近测试 {tpl.lastTestedAt}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save Bar */}
          <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => showToast('已重置为最近一次保存的配置')}
              className="px-4 py-2 text-xs text-gray-600 bg-white border border-[#d9d9d9] rounded hover:border-gray-400 transition-colors"
            >
              重置
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white rounded transition-colors ${
                isSaved ? 'bg-emerald-500' : 'bg-[#1890ff] hover:bg-blue-600'
              }`}
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? '已保存' : '保存配置'}</span>
            </button>
          </div>
        </div>

        {/* Right: Connection Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-4">
            <div className="text-sm font-bold text-[#262626]">接入状态</div>

            <div className="flex flex-col items-center py-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${config.isBound ? 'bg-emerald-50 border-2 border-emerald-400' : 'bg-gray-50 border-2 border-gray-300'}`}>
                <MessageSquare className={`w-7 h-7 ${config.isBound ? 'text-emerald-500' : 'text-gray-400'}`} />
              </div>
              <div className={`mt-2 text-sm font-bold ${config.isBound ? 'text-emerald-600' : 'text-gray-500'}`}>
                {config.isBound ? '服务号已绑定' : '未绑定服务号'}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">绑定时间：{config.boundAt}</div>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { label: '开发者凭证', ok: true },
                { label: '服务器配置校验', ok: true },
                { label: '消息模板接入', ok: true },
                { label: '红包发放通道', ok: true }
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-2.5 bg-[#fafafa] border border-[#e8e8e8] rounded">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    正常
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50/40 border border-blue-100 rounded p-4 space-y-2 text-xs">
            <div className="font-bold text-gray-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1890ff]" />
              使用提示
            </div>
            <ul className="text-gray-500 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>服务号每月群发次数有限，红包推送建议走「模板消息」通道。</li>
              <li>新用户关注后需在 5 分钟内完成领券，避免模板消息失效。</li>
              <li>更换 AppSecret 后，历史模板消息签名自动失效，请及时同步。</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal: 测试发送 */}
      {activeTemplate && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#e8e8e8] shadow-xl w-full max-w-md p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8]">
              <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#1890ff]" />
                <span>模板测试发送</span>
              </div>
              <button
                onClick={() => setActiveTemplate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 border border-[#e8e8e8] rounded space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">模板名称：</span>
                  <span className="font-semibold text-gray-900">{activeTemplate.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">模板ID：</span>
                  <span className="font-mono text-gray-700">{activeTemplate.templateId}</span>
                </div>
              </div>

              <div>
                <div className="text-gray-500 mb-1.5">模板变量（将自动替换为真实数据）：</div>
                <div className="flex flex-wrap gap-1.5">
                  {activeTemplate.variables.map(v => (
                    <span key={v} className="px-2 py-0.5 rounded bg-blue-50 text-[#1890ff] border border-blue-200 text-[11px]">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-gray-500 p-3 bg-amber-50 border border-amber-200 rounded">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>测试消息将发送至账号下绑定的运营管理员微信，用于校验模板内容与跳转链接。</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#e8e8e8] flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveTemplate(null)}
                className="px-4 py-1.5 text-gray-600 bg-white border border-[#d9d9d9] rounded hover:border-gray-400"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`已向管理员微信发送测试消息：${activeTemplate.title}`);
                  setActiveTemplate(null);
                }}
                className="px-5 py-1.5 text-white bg-[#1890ff] rounded font-medium hover:bg-blue-600"
              >
                发送测试
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
