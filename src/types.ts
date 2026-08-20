export type PageType = 
  | 'create-activity' 
  | 'activity-list' 
  | 'activity-dashboard' 
  | 'merchant-audit' 
  | 'settlement'
  | 'newcomer-rules'
  | 'wechat-binding'
  | 'inactive-recall'
  | 'member-config'
  | 'member-analytics'
  | 'member-settlement';

export type ActivityStatus = 'draft' | 'not_started' | 'active' | 'paused' | 'ended';

export interface MemberPacketConfig {
  enabled: boolean; // 活动开关
  price: number; // 红包包售价 (元)，示例1.8
  packetCount: number; // 红包数量 (张)，示例2
  packetAmount: number; // 每张红包面额 (元)，示例2
  minSpend: number; // 使用门槛 (元)，示例满20元
  validityDays: number; // 有效期 (天)，示例30天
  monthlyLimitPerUser: number; // 每月每人限购次数，示例1
  subsidyPerPacket: number; // 每张红包补贴金额，示例0.9元
  merchantScope: 'all' | 'specific' | 'open_enroll'; // 全部商家 / 指定商家 / 开放报名
  selectedMerchants?: string[]; // 选中的指定商家
}

export interface MemberAnalyticsMetric {
  buyersCount: number; // 购买人数 2,500
  purchaseCount: number; // 购买次数 2,800
  issuedPackets: number; // 发放红包数 5,600
  usageRate: number; // 红包使用率 68%
  totalRevenue: number; // 购买收入 ¥5,040
  subsidyExpense: number; // 补贴支出 ¥3,780
  netIncome: number; // 净收入 ¥1,260
}

export interface MemberMerchantStat {
  id: string;
  merchantName: string;
  category: string;
  verifiedPackets: number; // 核销红包数
  subsidyAmount: number; // 平台补贴金额
  merchantCost: number; // 商家实际承担成本
  orderCount: number;
  totalGmv: number;
}

export interface MemberSettlementRecord {
  id: string;
  merchantId: string;
  merchantName: string;
  category: string;
  settlementPeriod: string; // 结算周期，如 "2025-02-01 ~ 2025-02-28"
  verifiedPackets: number; // 核销红包数
  subsidyAmount: number; // 补贴金额 (元)
  merchantCost: number; // 商家承担 (元)
  status: 'pending' | 'settled'; // 待结算 / 已结算
  settledAt?: string;
  bankAccount: string;
  details?: {
    orderNo: string;
    usedAt: string;
    orderAmount: number;
    couponDeduction: number;
    platformSubsidy: number;
    merchantShare: number;
  }[];
}

export interface RedPacketItemConfig {
  id: string;
  name: string;
  amount: number; // 面额 (元)
  minSpend: number; // 使用门槛 (元)
  validityDays: number; // 有效期 (天)
}

export interface NewcomerRulesConfig {
  enabled: boolean;
  packets: RedPacketItemConfig[];
  dispatchMethod: 'all_immediate' | 'first_immediate_rest_first_order'; // 关注后立即全部发放 / 关注后先发第一张，其余完成首单后发放
  newUserDefinitions: ('first_register' | 'first_order' | 'registered_no_order')[]; // 首次注册 / 首次下单 / 注册且未下单
  scopeType: 'all' | 'specific_goods' | 'specific_merchants'; // 全平台 / 指定商品 / 指定商家
  selectedGoods?: string[];
  selectedMerchants?: string[];
  limitPerUser: number; // 限领次数，默认1
}

export interface WechatTemplateConfig {
  id: string;
  type: 'red_packet' | 'order_status' | 'recall_packet';
  title: string;
  templateId: string;
  exampleContent: string;
  variables: string[];
  lastTestedAt?: string;
}

export interface WechatBindingConfig {
  accountName: string;
  appId: string;
  appSecret: string;
  avatarUrl: string;
  isBound: boolean;
  boundAt: string;
  callbackUrl: string;
  token: string;
  encodingAesKey: string;
  templates: WechatTemplateConfig[];
}

export interface InactiveRecallConfig {
  enabled: boolean;
  inactiveDays: number; // 超过 N 天未下单，示例15
  couponAmount: number; // 2元
  couponMinSpend: number; // 满15元
  validityDays: number; // 3天
  pushChannel: string; // 公众号模板消息 (默认)
  monthlyLimitPerUser: number; // 每用户每月最多接收次数，默认1
  pushContent: string; // 【专属福利】您已有一张2元红包待领取，点击立即使用>>
  triggerTime: string; // 每日 10:00
  whitelistCount: number;
  blacklistCount: number;
}

export interface ActivityItem {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  thresholdOrders: number; // 累计订单门槛
  couponAmount: number; // 优惠券面额 (元)
  couponConditionType: 'no_threshold' | 'min_amount'; // 无门槛 / 满X元可用
  couponMinSpend?: number; // 满X元
  validityType: 'fixed' | 'days_from_grant'; // 固定有效期 / 自发放起X天有效
  validityDays?: number; // 如 7天
  validityFixedEnd?: string;
  merchantScope: 'all' | 'specific' | 'open_enroll'; // 全部商家 / 指定商家 / 开放报名
  selectedMerchants?: string[]; // 选中的商家列表
  merchantCount: number;
  perUserLimit: number | null; // 限领次数，null表示不限
  minOrderAmount: number; // 订单最小金额，默认0
  totalCouponsCap: number | null; // 总发券量上限，null表示不限
  userRestrictions: ('device' | 'phone')[]; // 用户参与限制: 设备 / 手机号
  issuedCoupons: number; // 已发券数
  verifiedCoupons: number; // 核销数
  status: ActivityStatus;
  createdAt: string;
}

export interface MerchantAuditItem {
  id: string;
  merchantName: string;
  merchantLogo?: string;
  category: string;
  activityId: string;
  activityName: string;
  contactPerson: string;
  contactPhone: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  qualificationDocs?: string[];
  rejectReason?: string;
  storeCount: number;
  auditRemark?: string;
}

export interface UserBehaviorItem {
  id: string;
  userId: string;
  isNewUser: boolean;
  firstOrderTime: string;
  totalOrders: number;
  issuedCoupons: number;
  verifiedCoupons: number;
  lastActiveTime: string;
  userLevel: 'VIP1' | 'VIP2' | 'VIP3' | '普通用户';
  phoneMasked: string;
}

export interface RetentionDataPoint {
  date: string;
  day1: number;
  day3: number;
  day7: number;
  day14: number;
  day30: number;
  repurchaseRate: number;
}

export interface AcquisitionChannel {
  name: string;
  value: number;
  count: number;
  conversionRate: string;
  color: string;
}

export interface SettlementItem {
  id: string;
  userId: string;
  merchantId: string;
  merchantName: string;
  orderNumber: string;
  couponAmount: number;
  merchantShare: number; // 商家承担
  platformSubsidy: number; // 平台补贴
  verifiedAt: string;
  status: 'settled' | 'pending' | 'refunded';
  activityName: string;
}
