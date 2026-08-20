import React, { useState } from 'react';
import { 
  Calendar, 
  HelpCircle, 
  Store, 
  Check, 
  AlertCircle, 
  Smartphone, 
  Sparkles, 
  FileText, 
  Tag, 
  X, 
  Plus, 
  Ticket, 
  Info,
  CheckCircle2,
  RefreshCw,
  Search,
  ArrowRight
} from 'lucide-react';
import { ActivityItem } from '../types';
import { AVAILABLE_MERCHANTS_LIST } from '../mockData';

interface CreateActivityPageProps {
  onSaveActivity: (activity: ActivityItem, isDraft: boolean) => void;
  onNavigateToList: () => void;
}

export const CreateActivityPage: React.FC<CreateActivityPageProps> = ({
  onSaveActivity,
  onNavigateToList
}) => {
  // Form State initialized with realistic defaults / requirements
  const [formData, setFormData] = useState({
    name: '跨店满3单送5元券',
    startTime: '2025-01-01 00:00:00',
    endTime: '2025-01-31 23:59:59',
    thresholdOrders: 3,
    couponAmount: 5,
    couponConditionType: 'min_amount' as 'no_threshold' | 'min_amount',
    couponMinSpend: 25,
    validityType: 'days_from_grant' as 'fixed' | 'days_from_grant',
    validityDays: 7,
    validityFixedEnd: '2025-02-15 23:59:59',
    merchantScope: 'specific' as 'all' | 'specific' | 'open_enroll',
    selectedMerchants: ['瑞幸咖啡(全城门店)', '蜜雪冰城(万达店)', '喜茶(正佳广场店)', '霸王茶姬(天河城店)'],
    perUserLimit: 1 as number | null,
    minOrderAmount: 0,
    totalCouponsCap: 5000 as number | null,
    userRestrictions: ['device', 'phone'] as ('device' | 'phone')[]
  });

  const [isMerchantModalOpen, setIsMerchantModalOpen] = useState(false);
  const [merchantSearchQuery, setMerchantSearchQuery] = useState('');
  const [tempSelectedMerchants, setTempSelectedMerchants] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState<{ visible: boolean; message: string; type: 'draft' | 'publish' }>({
    visible: false,
    message: '',
    type: 'publish'
  });

  // Handle Input Changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleUserRestrictionToggle = (restriction: 'device' | 'phone') => {
    setFormData(prev => {
      const exists = prev.userRestrictions.includes(restriction);
      const nextRestrictions = exists
        ? prev.userRestrictions.filter(r => r !== restriction)
        : [...prev.userRestrictions, restriction];
      return { ...prev, userRestrictions: nextRestrictions };
    });
  };

  // Open Merchant Picker Modal
  const openMerchantModal = () => {
    setTempSelectedMerchants([...formData.selectedMerchants]);
    setIsMerchantModalOpen(true);
  };

  const toggleMerchantInModal = (merchantName: string) => {
    setTempSelectedMerchants(prev => 
      prev.includes(merchantName)
        ? prev.filter(m => m !== merchantName)
        : [...prev, merchantName]
    );
  };

  const confirmMerchantSelection = () => {
    setFormData(prev => ({ ...prev, selectedMerchants: tempSelectedMerchants }));
    setIsMerchantModalOpen(false);
  };

  const removeSelectedMerchant = (merchantName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedMerchants: prev.selectedMerchants.filter(m => m !== merchantName)
    }));
  };

  // Reset to sample template
  const handleFillStandardExample = () => {
    setFormData({
      name: '跨店满3单送5元券',
      startTime: '2025-01-01 00:00:00',
      endTime: '2025-01-31 23:59:59',
      thresholdOrders: 3,
      couponAmount: 5,
      couponConditionType: 'min_amount',
      couponMinSpend: 25,
      validityType: 'days_from_grant',
      validityDays: 7,
      validityFixedEnd: '2025-02-15 23:59:59',
      merchantScope: 'specific',
      selectedMerchants: ['瑞幸咖啡(全城门店)', '蜜雪冰城(万达店)', '喜茶(正佳广场店)', '霸王茶姬(天河城店)', '绝味鸭脖(天河北店)', '麦当劳(天河直营店)'],
      perUserLimit: 1,
      minOrderAmount: 0,
      totalCouponsCap: 5000,
      userRestrictions: ['device', 'phone']
    });
    setFormErrors({});
  };

  // Validation
  const validateForm = (isDraft: boolean) => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = '请输入活动名称';
    }
    if (!formData.startTime || !formData.endTime) {
      errors.time = '请设置有效的活动起止时间';
    }
    if (!isDraft) {
      if (formData.thresholdOrders <= 0) {
        errors.thresholdOrders = '累计订单门槛必须大于0';
      }
      if (formData.couponAmount <= 0) {
        errors.couponAmount = '优惠券面额必须大于0';
      }
      if (formData.couponConditionType === 'min_amount' && (formData.couponMinSpend || 0) <= 0) {
        errors.couponMinSpend = '请输入使用门槛金额';
      }
      if (formData.merchantScope === 'specific' && formData.selectedMerchants.length === 0) {
        errors.selectedMerchants = '请至少选择一家参与商家';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (isDraft: boolean) => {
    if (!validateForm(isDraft)) {
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const newActivity: ActivityItem = {
        id: `ACT-${Date.now().toString().slice(-8)}`,
        name: formData.name,
        startTime: formData.startTime,
        endTime: formData.endTime,
        thresholdOrders: Number(formData.thresholdOrders),
        couponAmount: Number(formData.couponAmount),
        couponConditionType: formData.couponConditionType,
        couponMinSpend: formData.couponConditionType === 'min_amount' ? Number(formData.couponMinSpend) : undefined,
        validityType: formData.validityType,
        validityDays: formData.validityType === 'days_from_grant' ? Number(formData.validityDays) : undefined,
        validityFixedEnd: formData.validityType === 'fixed' ? formData.validityFixedEnd : undefined,
        merchantScope: formData.merchantScope,
        selectedMerchants: formData.merchantScope === 'specific' ? formData.selectedMerchants : undefined,
        merchantCount: formData.merchantScope === 'all' ? 120 : formData.merchantScope === 'specific' ? formData.selectedMerchants.length : 0,
        perUserLimit: formData.perUserLimit ? Number(formData.perUserLimit) : null,
        minOrderAmount: Number(formData.minOrderAmount || 0),
        totalCouponsCap: formData.totalCouponsCap ? Number(formData.totalCouponsCap) : null,
        userRestrictions: formData.userRestrictions,
        issuedCoupons: 0,
        verifiedCoupons: 0,
        status: isDraft ? 'draft' : 'active',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      onSaveActivity(newActivity, isDraft);
      setSubmitting(false);
      setShowSuccessToast({
        visible: true,
        message: isDraft ? '草稿已成功保存至活动列表' : '活动创建成功并已正式发布！',
        type: isDraft ? 'draft' : 'publish'
      });
    }, 400);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8e8e8]">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>营销中心</span>
            <span>/</span>
            <span>联盟活动</span>
            <span>/</span>
            <span className="text-[#1890ff] font-medium">创建活动</span>
          </div>
          <h1 className="text-xl font-bold text-[#262626] tracking-tight flex items-center gap-2">
            <span>创建联盟活动</span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-[#1890ff] font-medium border border-blue-100">
              跨店集单激励
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            配置跨店满单激励策略，引导用户多商户下单，沉淀高价值留存与拉新流量。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillStandardExample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1890ff] bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1890ff]" />
            <span>一键填入需求示例数据</span>
          </button>
          <button
            type="button"
            onClick={onNavigateToList}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-[#d9d9d9] rounded hover:border-[#1890ff] hover:text-[#1890ff] transition-colors"
          >
            返回活动列表
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {showSuccessToast.visible && (
        <div className="bg-emerald-50 border border-emerald-200 rounded p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-emerald-900">{showSuccessToast.message}</div>
              <div className="text-xs text-emerald-700 mt-0.5">
                可前往「活动管理列表」随时启停或监控活动，或进入「活动数据看板」查看拉新与留存表现。
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToList}
              className="px-3 py-1.5 text-xs font-semibold bg-[#1890ff] text-white rounded hover:bg-blue-600 transition-colors"
            >
              查看活动列表
            </button>
            <button
              onClick={() => setShowSuccessToast({ visible: false, message: '', type: 'publish' })}
              className="p-1 text-emerald-600 hover:text-emerald-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Left Form Area (65%) + Right Preview & Estimation Card (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Container */}
        <div className="lg:col-span-8 bg-white border border-[#e8e8e8] rounded shadow-xs divide-y divide-[#f0f0f0]">
          
          {/* Section 1: 基本信息 */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#f0f0f0]">
              <div className="w-1 h-3.5 bg-[#1890ff] rounded-xs"></div>
              <h2 className="text-sm font-bold text-[#262626]">1. 基本信息配置</h2>
            </div>

            {/* 活动名称 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-rose-500 mr-1">*</span>活动名称
              </label>
              <div className="relative">
                <input
                  id="field-activity-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="请输入活动名称，例如：跨店满3单送5元券"
                  className={`w-full px-3 py-2 text-xs bg-white border ${
                    formErrors.name ? 'border-rose-400 focus:border-rose-500' : 'border-[#d9d9d9] focus:border-[#1890ff]'
                  } rounded outline-none transition-all text-[#262626]`}
                />
              </div>
              {formErrors.name && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.name}
                </p>
              )}
              <p className="text-[11px] text-gray-400">将在客户端活动聚合页、跨店进度条及优惠券包中向用户展示。</p>
            </div>

            {/* 活动时间 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-rose-500 mr-1">*</span>活动起止时间
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">开始</span>
                  <input
                    type="text"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    placeholder="2025-01-01 00:00:00"
                    className="w-full pl-12 pr-3 py-1.5 text-xs font-mono bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff]"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">结束</span>
                  <input
                    type="text"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    placeholder="2025-01-31 23:59:59"
                    className="w-full pl-12 pr-3 py-1.5 text-xs font-mono bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff]"
                  />
                </div>
              </div>
              {formErrors.time && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.time}
                </p>
              )}
            </div>
          </div>

          {/* Section 2: 门槛与优惠券奖励 */}
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#f0f0f0]">
              <div className="w-1 h-3.5 bg-[#1890ff] rounded-xs"></div>
              <h2 className="text-sm font-bold text-[#262626]">2. 门槛与优惠奖励规则</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* 累计订单门槛 */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">
                  <span className="text-rose-500 mr-1">*</span>累计订单门槛
                </label>
                <div className="relative">
                  <input
                    id="field-threshold-orders"
                    type="number"
                    min="1"
                    value={formData.thresholdOrders}
                    onChange={(e) => handleInputChange('thresholdOrders', e.target.value)}
                    placeholder="3"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-[#262626]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                    单 (跨商户)
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">用户需在参与商户中累计消费达标单数。</p>
              </div>

              {/* 优惠券面额 */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">
                  <span className="text-rose-500 mr-1">*</span>优惠券面额
                </label>
                <div className="relative">
                  <input
                    id="field-coupon-amount"
                    type="number"
                    min="1"
                    value={formData.couponAmount}
                    onChange={(e) => handleInputChange('couponAmount', e.target.value)}
                    placeholder="5"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-[#262626]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1890ff]">
                    元
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">达标后自动发放到用户券包的现金抵扣面额。</p>
              </div>
            </div>

            {/* 订单最小金额 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                订单最小金额要求
              </label>
              <div className="relative">
                <input
                  id="field-min-order-amount"
                  type="number"
                  min="0"
                  value={formData.minOrderAmount}
                  onChange={(e) => handleInputChange('minOrderAmount', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-[#262626]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                  元 (默认 0 表示无限制)
                </span>
              </div>
              <p className="text-[11px] text-gray-400">仅实付金额大于等于该数值的订单才计入跨店累计单数。</p>
            </div>

            {/* 优惠券使用门槛 (单选：无门槛 / 满X元可用) */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-rose-500 mr-1">*</span>优惠券使用门槛
              </label>
              <div className="space-y-2.5">
                <label className="flex items-center gap-3 p-3 rounded border border-[#d9d9d9] hover:border-[#1890ff] cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="couponConditionType"
                    checked={formData.couponConditionType === 'no_threshold'}
                    onChange={() => handleInputChange('couponConditionType', 'no_threshold')}
                    className="w-4 h-4 text-[#1890ff]"
                  />
                  <div>
                    <div className="text-xs font-semibold text-[#262626]">无门槛</div>
                    <div className="text-[11px] text-gray-400">下单立减，无需达到指定订单金额</div>
                  </div>
                </label>

                <label className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded border border-[#d9d9d9] hover:border-[#1890ff] cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="couponConditionType"
                      checked={formData.couponConditionType === 'min_amount'}
                      onChange={() => handleInputChange('couponConditionType', 'min_amount')}
                      className="w-4 h-4 text-[#1890ff]"
                    />
                    <div>
                      <div className="text-xs font-semibold text-[#262626]">满额可用</div>
                      <div className="text-[11px] text-gray-400">需满足指定订单门槛后方可使用抵扣</div>
                    </div>
                  </div>

                  {formData.couponConditionType === 'min_amount' && (
                    <div className="flex items-center gap-2 pl-7 sm:pl-0">
                      <span className="text-xs text-gray-600 whitespace-nowrap">满</span>
                      <div className="relative w-28">
                        <input
                          id="field-coupon-min-spend"
                          type="number"
                          min="1"
                          value={formData.couponMinSpend}
                          onChange={(e) => handleInputChange('couponMinSpend', e.target.value)}
                          placeholder="25"
                          className="w-full px-2 py-1 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-[#262626]"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">元可用</span>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* 优惠券有效期 (单选：固定有效期 / 自发放起X天有效) */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-rose-500 mr-1">*</span>优惠券有效期
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`p-3 rounded border cursor-pointer transition-all ${
                  formData.validityType === 'days_from_grant'
                    ? 'border-[#1890ff] bg-blue-50/20'
                    : 'border-[#d9d9d9] hover:border-gray-400'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="validityType"
                        checked={formData.validityType === 'days_from_grant'}
                        onChange={() => handleInputChange('validityType', 'days_from_grant')}
                        className="w-4 h-4 text-[#1890ff]"
                      />
                      <span className="text-xs font-semibold text-[#262626]">自发放起相对天数</span>
                    </div>
                    <span className="text-[10px] text-[#1890ff] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">推荐</span>
                  </div>
                  {formData.validityType === 'days_from_grant' && (
                    <div className="flex items-center gap-2 pl-6 mt-2">
                      <span className="text-xs text-gray-600">自发放起</span>
                      <input
                        type="number"
                        min="1"
                        value={formData.validityDays}
                        onChange={(e) => handleInputChange('validityDays', e.target.value)}
                        className="w-16 px-2 py-1 text-xs border border-[#d9d9d9] rounded bg-white text-center font-bold text-[#1890ff] outline-none focus:border-[#1890ff]"
                      />
                      <span className="text-xs text-gray-600">天内有效</span>
                    </div>
                  )}
                </label>

                <label className={`p-3 rounded border cursor-pointer transition-all ${
                  formData.validityType === 'fixed'
                    ? 'border-[#1890ff] bg-blue-50/20'
                    : 'border-[#d9d9d9] hover:border-gray-400'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="validityType"
                      checked={formData.validityType === 'fixed'}
                      onChange={() => handleInputChange('validityType', 'fixed')}
                      className="w-4 h-4 text-[#1890ff]"
                    />
                    <span className="text-xs font-semibold text-[#262626]">固定截止日期</span>
                  </div>
                  {formData.validityType === 'fixed' && (
                    <div className="pl-6 mt-2">
                      <input
                        type="text"
                        value={formData.validityFixedEnd}
                        onChange={(e) => handleInputChange('validityFixedEnd', e.target.value)}
                        placeholder="2025-02-15 23:59:59"
                        className="w-full px-2 py-1 text-xs border border-[#d9d9d9] rounded bg-white font-mono outline-none focus:border-[#1890ff]"
                      />
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: 参与商家范围与风控规则 */}
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#f0f0f0]">
              <div className="w-1 h-3.5 bg-[#1890ff] rounded-xs"></div>
              <h2 className="text-sm font-bold text-[#262626]">3. 参与商家范围与限领风控</h2>
            </div>

            {/* 参与商家范围 */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-gray-700">
                <span className="text-rose-500 mr-1">*</span>参与商家范围
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`p-3 rounded border cursor-pointer transition-all ${
                  formData.merchantScope === 'all'
                    ? 'border-[#1890ff] bg-blue-50/20 text-[#1890ff] font-medium'
                    : 'border-[#d9d9d9] hover:border-gray-400'
                }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="merchantScope"
                      checked={formData.merchantScope === 'all'}
                      onChange={() => handleInputChange('merchantScope', 'all')}
                      className="w-4 h-4 text-[#1890ff]"
                    />
                    <span className="text-xs font-semibold text-[#262626]">全部商家</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 pl-6">平台全量已签约商户自动参与</p>
                </label>

                <label className={`p-3 rounded border cursor-pointer transition-all ${
                  formData.merchantScope === 'specific'
                    ? 'border-[#1890ff] bg-blue-50/20 text-[#1890ff] font-medium'
                    : 'border-[#d9d9d9] hover:border-gray-400'
                }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="merchantScope"
                      checked={formData.merchantScope === 'specific'}
                      onChange={() => handleInputChange('merchantScope', 'specific')}
                      className="w-4 h-4 text-[#1890ff]"
                    />
                    <span className="text-xs font-semibold text-[#262626]">指定商家 (多选)</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 pl-6">仅限选定的联盟商圈或重点品牌</p>
                </label>

                <label className={`p-3 rounded border cursor-pointer transition-all ${
                  formData.merchantScope === 'open_enroll'
                    ? 'border-[#1890ff] bg-blue-50/20 text-[#1890ff] font-medium'
                    : 'border-[#d9d9d9] hover:border-gray-400'
                }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="merchantScope"
                      checked={formData.merchantScope === 'open_enroll'}
                      onChange={() => handleInputChange('merchantScope', 'open_enroll')}
                      className="w-4 h-4 text-[#1890ff]"
                    />
                    <span className="text-xs font-semibold text-[#262626]">开放商家报名</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 pl-6">商家在商户端报名经平台审核</p>
                </label>
              </div>

              {/* 指定商家列表展开 */}
              {formData.merchantScope === 'specific' && (
                <div className="p-4 bg-[#fafafa] border border-[#e8e8e8] rounded space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#1890ff]" />
                      <span className="text-xs font-semibold text-[#262626]">
                        已选联盟商家 ({formData.selectedMerchants.length} 家)
                      </span>
                    </div>
                    <button
                      type="button"
                      id="btn-select-merchants"
                      onClick={openMerchantModal}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#1890ff] bg-white border border-[#1890ff]/40 rounded hover:bg-blue-50 transition-colors shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>选择/添加商家</span>
                    </button>
                  </div>

                  {formData.selectedMerchants.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedMerchants.map((merchant) => (
                        <span
                          key={merchant}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-white text-gray-800 border border-[#d9d9d9] shadow-xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1890ff]"></span>
                          <span>{merchant}</span>
                          <button
                            type="button"
                            onClick={() => removeSelectedMerchant(merchant)}
                            className="text-gray-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs text-gray-400 border border-dashed border-[#d9d9d9] rounded">
                      暂未选择商家，请点击右上角按钮添加指定参与商户
                    </div>
                  )}
                  {formErrors.selectedMerchants && (
                    <p className="text-xs text-rose-500">{formErrors.selectedMerchants}</p>
                  )}
                </div>
              )}
            </div>

            {/* 限领次数 & 总发券量上限 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* 限领次数 */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">
                  每人限领次数
                </label>
                <div className="relative">
                  <input
                    id="field-per-user-limit"
                    type="number"
                    min="1"
                    value={formData.perUserLimit ?? ''}
                    onChange={(e) => handleInputChange('perUserLimit', e.target.value === '' ? null : Number(e.target.value))}
                    placeholder="留空表示不限制领取次数"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-[#262626]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                    次 (示例：1)
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">活动周期内单个用户累计可触发达成奖励的上限。</p>
              </div>

              {/* 总发券量上限 */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">
                  总发券量预算上限
                </label>
                <div className="relative">
                  <input
                    id="field-total-coupons-cap"
                    type="number"
                    min="1"
                    value={formData.totalCouponsCap ?? ''}
                    onChange={(e) => handleInputChange('totalCouponsCap', e.target.value === '' ? null : Number(e.target.value))}
                    placeholder="留空表示不限总量"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-[#262626]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                    张 (示例：5000)
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">发券达到该数量后活动将自动暂停，防止预算超支。</p>
              </div>
            </div>

            {/* 用户参与限制 */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-medium text-gray-700">
                用户参与限制 (多选风控维度)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label 
                  className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-all ${
                    formData.userRestrictions.includes('device')
                      ? 'border-[#1890ff] bg-blue-50/20 text-[#1890ff]'
                      : 'border-[#d9d9d9] hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.userRestrictions.includes('device')}
                    onChange={() => handleUserRestrictionToggle('device')}
                    className="w-4 h-4 text-[#1890ff] rounded"
                  />
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#1890ff]" />
                    <div>
                      <div className="text-xs font-semibold text-[#262626]">同一设备限制</div>
                      <div className="text-[11px] text-gray-400">同一终端设备仅能按限领规则参与一次</div>
                    </div>
                  </div>
                </label>

                <label 
                  className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-all ${
                    formData.userRestrictions.includes('phone')
                      ? 'border-[#1890ff] bg-blue-50/20 text-[#1890ff]'
                      : 'border-[#d9d9d9] hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.userRestrictions.includes('phone')}
                    onChange={() => handleUserRestrictionToggle('phone')}
                    className="w-4 h-4 text-[#1890ff] rounded"
                  />
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#1890ff]" />
                    <div>
                      <div className="text-xs font-semibold text-[#262626]">同一手机号限制</div>
                      <div className="text-[11px] text-gray-400">同一注册手机号按账号维度限制参与</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 bg-[#fafafa] rounded-b flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-gray-400 shrink-0" />
              <span>提交发布后将立即同步至 C端联盟活动中心，商家可开始核销。</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id="btn-save-draft"
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit(true)}
                className="flex-1 sm:flex-none px-4 py-1.5 text-xs font-medium text-gray-700 bg-white border border-[#d9d9d9] rounded hover:border-[#1890ff] hover:text-[#1890ff] transition-all disabled:opacity-50"
              >
                保存草稿
              </button>

              <button
                id="btn-submit-publish"
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit(false)}
                className="flex-1 sm:flex-none px-5 py-1.5 text-xs font-medium text-white bg-[#1890ff] rounded hover:bg-blue-600 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-xs"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>处理中...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>提交发布</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Configuration Preview & Estimation Cards */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: 移动端/用户端卡片实时效果预览 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0]">
              <span className="text-xs font-bold text-[#262626] flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-[#1890ff]" />
                C端券面渲染模拟
              </span>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">实时联动</span>
            </div>

            {/* Simulated Mobile Voucher */}
            <div className="relative rounded overflow-hidden bg-[#1890ff] text-white p-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-medium">
                    跨店集单奖励
                  </span>
                  <div className="text-sm font-bold mt-1 tracking-tight">
                    {formData.name || '活动名称预览'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold tracking-tight">
                    ¥{formData.couponAmount || 0}
                  </div>
                  <div className="text-[10px] opacity-80">
                    {formData.couponConditionType === 'no_threshold' ? '无门槛立减' : `满 ¥${formData.couponMinSpend || 0} 可用`}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] opacity-90">
                <div>
                  {formData.validityType === 'days_from_grant' ? `自领取起 ${formData.validityDays} 天内有效` : '指定日期前有效'}
                </div>
                <div className="bg-white text-[#1890ff] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                  去使用
                </div>
              </div>
            </div>

            {/* Rule Summary */}
            <div className="bg-[#fafafa] rounded p-3 space-y-2 text-xs border border-[#f0f0f0]">
              <div className="text-[#262626] font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#1890ff]" />
                <span>活动触发规则摘要</span>
              </div>
              <ul className="space-y-1 text-gray-600 text-[11px] list-disc list-inside">
                <li>累计门槛：跨店完成 <span className="font-semibold text-[#262626]">{formData.thresholdOrders}</span> 单</li>
                <li>最低单笔金额：<span className="font-semibold text-[#262626]">¥{formData.minOrderAmount}</span></li>
                <li>参与范围：<span className="font-semibold text-[#262626]">
                  {formData.merchantScope === 'all' ? '全部商户' : formData.merchantScope === 'specific' ? `${formData.selectedMerchants.length} 家指定商家` : '开放报名审核制'}
                </span></li>
                <li>每人限领：<span className="font-semibold text-[#262626]">{formData.perUserLimit ? `${formData.perUserLimit} 次` : '不限'}</span></li>
                <li>发券上限：<span className="font-semibold text-[#262626]">{formData.totalCouponsCap ? `${formData.totalCouponsCap} 张` : '不设上限'}</span></li>
              </ul>
            </div>
          </div>

          {/* Card 2: 预算与效益预估 */}
          <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs space-y-3">
            <div className="text-xs font-bold text-[#262626]">
              活动成本与流量拉动预估
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-[#fafafa] rounded border border-[#f0f0f0]">
                <div className="text-[10px] text-gray-400 font-medium">最大营销预算</div>
                <div className="text-base font-bold text-[#262626] mt-0.5">
                  ¥{((formData.totalCouponsCap || 1000) * (formData.couponAmount || 5)).toLocaleString()}
                </div>
              </div>

              <div className="p-2.5 bg-[#fafafa] rounded border border-[#f0f0f0]">
                <div className="text-[10px] text-gray-400 font-medium">预估拉动总订单</div>
                <div className="text-base font-bold text-[#1890ff] mt-0.5">
                  {((formData.totalCouponsCap || 1000) * (formData.thresholdOrders || 3)).toLocaleString()} 单
                </div>
              </div>
            </div>

            <div className="text-[11px] text-gray-400 leading-relaxed">
              基于历史同类型跨店联盟活动，预计次日留存可提升 12.8%，新客占比可达 30%~40%。
            </div>
          </div>
        </div>
      </div>

      {/* Modal: 指定商家选择弹窗 */}
      {isMerchantModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-2xl overflow-hidden border border-[#e8e8e8]">
            <div className="px-5 py-3 border-b border-[#e8e8e8] flex items-center justify-between bg-[#fafafa]">
              <div>
                <h3 className="text-sm font-bold text-[#262626]">选择参与活动的指定商家</h3>
                <p className="text-xs text-gray-500 mt-0.5">勾选参与该跨店满单激励的商户与门店</p>
              </div>
              <button
                onClick={() => setIsMerchantModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={merchantSearchQuery}
                  onChange={(e) => setMerchantSearchQuery(e.target.value)}
                  placeholder="搜索商家名称、类目..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff]"
                />
              </div>

              {/* Merchant Grid List */}
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {AVAILABLE_MERCHANTS_LIST
                  .filter(m => m.name.includes(merchantSearchQuery) || m.category.includes(merchantSearchQuery))
                  .map((merchant) => {
                    const isChecked = tempSelectedMerchants.includes(merchant.name);
                    return (
                      <div
                        key={merchant.id}
                        onClick={() => toggleMerchantInModal(merchant.name)}
                        className={`flex items-center justify-between p-2.5 rounded border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-[#1890ff] bg-blue-50/30'
                            : 'border-[#d9d9d9] hover:border-gray-400 hover:bg-[#fafafa]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 text-[#1890ff] rounded"
                          />
                          <div>
                            <div className="text-xs font-semibold text-[#262626]">{merchant.name}</div>
                            <div className="text-[11px] text-gray-400">
                              类目：{merchant.category} · 覆盖门店：{merchant.branchCount} 家
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] text-gray-500 bg-white border border-[#d9d9d9] px-2 py-0.5 rounded">
                          {merchant.id}
                        </span>
                      </div>
                    );
                  })}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f0] text-xs text-gray-500">
                <span>已选中 <strong className="text-[#1890ff]">{tempSelectedMerchants.length}</strong> 家商家</span>
                <button
                  type="button"
                  onClick={() => setTempSelectedMerchants(AVAILABLE_MERCHANTS_LIST.map(m => m.name))}
                  className="text-[#1890ff] hover:underline"
                >
                  全选所有候选商家
                </button>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#fafafa] border-t border-[#e8e8e8] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsMerchantModalOpen(false)}
                className="px-4 py-1.5 text-xs font-medium text-gray-700 bg-white border border-[#d9d9d9] rounded hover:border-[#1890ff]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmMerchantSelection}
                className="px-4 py-1.5 text-xs font-medium text-white bg-[#1890ff] rounded hover:bg-blue-600 shadow-xs"
              >
                确认选择 ({tempSelectedMerchants.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
