import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  Gift, 
  Percent, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter, 
  Search, 
  ArrowUpRight, 
  Building2, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { PageType, MemberMerchantStat } from '../types';

interface MemberAnalyticsPageProps {
  onNavigateToTab?: (page: PageType) => void;
}

const MOCK_MERCHANTS_DATA: MemberMerchantStat[] = [
  {
    id: 'm1',
    merchantName: '奈雪的茶 (高新万达店)',
    category: '茶饮甜品',
    verifiedPackets: 1240,
    subsidyAmount: 1116,
    merchantCost: 1364,
    orderCount: 1240,
    totalGmv: 34720
  },
  {
    id: 'm2',
    merchantName: '霸王茶姬 (软件园店)',
    category: '茶饮甜品',
    verifiedPackets: 980,
    subsidyAmount: 882,
    merchantCost: 1078,
    orderCount: 980,
    totalGmv: 27440
  },
  {
    id: 'm3',
    merchantName: '海底捞火锅 (锦华店)',
    category: '正餐餐饮',
    verifiedPackets: 650,
    subsidyAmount: 585,
    merchantCost: 715,
    orderCount: 650,
    totalGmv: 182000
  },
  {
    id: 'm4',
    merchantName: '瑞幸咖啡 (天府三街店)',
    category: '咖啡轻食',
    verifiedPackets: 520,
    subsidyAmount: 468,
    merchantCost: 572,
    orderCount: 520,
    totalGmv: 13520
  },
  {
    id: 'm5',
    merchantName: '肯德基 (大悦城店)',
    category: '快餐简餐',
    verifiedPackets: 418,
    subsidyAmount: 376.2,
    merchantCost: 459.8,
    orderCount: 418,
    totalGmv: 16720
  }
];

const TREND_DATA_7D = [
  { date: '02-13', buyers: 310, purchases: 340, verified: 420, revenue: 612, subsidy: 378 },
  { date: '02-14', buyers: 450, purchases: 520, verified: 680, revenue: 936, subsidy: 612 },
  { date: '02-15', buyers: 380, purchases: 410, verified: 560, revenue: 738, subsidy: 504 },
  { date: '02-16', buyers: 290, purchases: 320, verified: 480, revenue: 576, subsidy: 432 },
  { date: '02-17', buyers: 340, purchases: 380, verified: 530, revenue: 684, subsidy: 477 },
  { date: '02-18', buyers: 360, purchases: 410, verified: 570, revenue: 738, subsidy: 513 },
  { date: '02-19', buyers: 370, purchases: 420, verified: 568, revenue: 756, subsidy: 511.2 }
];

const TREND_DATA_30D = [
  { date: '01-21', buyers: 210, purchases: 230, verified: 310, revenue: 414, subsidy: 279 },
  { date: '01-25', buyers: 280, purchases: 310, verified: 420, revenue: 558, subsidy: 378 },
  { date: '01-30', buyers: 350, purchases: 390, verified: 540, revenue: 702, subsidy: 486 },
  { date: '02-05', buyers: 390, purchases: 440, verified: 610, revenue: 792, subsidy: 549 },
  { date: '02-10', buyers: 420, purchases: 470, verified: 650, revenue: 846, subsidy: 585 },
  { date: '02-15', buyers: 410, purchases: 460, verified: 630, revenue: 828, subsidy: 567 },
  { date: '02-19', buyers: 440, purchases: 500, verified: 648, revenue: 900, subsidy: 583.2 }
];

export const MemberAnalyticsPage: React.FC<MemberAnalyticsPageProps> = ({ onNavigateToTab }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'month' | 'custom'>('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const trendData = timeRange === '7d' ? TREND_DATA_7D : TREND_DATA_30D;

  const filteredMerchants = useMemo(() => {
    return MOCK_MERCHANTS_DATA.filter(m => {
      const matchSearch = m.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) || m.category.includes(searchTerm);
      const matchCat = selectedCategory === 'all' || m.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchTerm, selectedCategory]);

  const handleExport = () => {
    showToast('正在生成会员红包包数据监控报表 (Excel)，下载将在数秒内开始...');
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

      {/* Breadcrumbs & Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8e8e8]">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>营销中心</span>
            <span>/</span>
            <span>会员红包包</span>
            <span>/</span>
            <span className="text-[#1890ff] font-medium">数据监控</span>
          </div>
          <h1 className="text-xl font-bold text-[#262626] tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#1890ff]" />
            <span>会员红包包 - 数据监控大盘</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            实时监控会员红包包购买规模、发券核销转化率、平台补贴支出及商家维度拉动收益。
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
              className="px-3 py-1.5 rounded font-medium bg-[#1890ff] text-white shadow-xs"
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

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#e8e8e8] rounded p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            时间范围：
          </span>
          <div className="flex items-center bg-[#f5f5f5] p-0.5 rounded border border-[#e8e8e8]">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded transition-colors ${
                timeRange === '7d' ? 'bg-white text-[#1890ff] font-semibold shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              近 7 天
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded transition-colors ${
                timeRange === '30d' ? 'bg-white text-[#1890ff] font-semibold shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              近 30 天
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 rounded transition-colors ${
                timeRange === 'month' ? 'bg-white text-[#1890ff] font-semibold shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              本月至今
            </button>
          </div>
          <span className="text-[11px] text-gray-400 ml-2">统计更新时间：今日 18:45 (T+0 准实时)</span>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 bg-white border border-[#d9d9d9] rounded hover:border-[#1890ff] hover:text-[#1890ff] transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>导出监控报表</span>
        </button>
      </div>

      {/* 7 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
        {/* 1. 购买人数 */}
        <div className="bg-white border border-[#e8e8e8] rounded p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>购买人数</span>
            <Users className="w-3.5 h-3.5 text-[#1890ff]" />
          </div>
          <div className="text-xl font-bold text-gray-900 font-mono">2,500</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% 较上周期</span>
          </div>
        </div>

        {/* 2. 购买次数 */}
        <div className="bg-white border border-[#e8e8e8] rounded p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>购买次数</span>
            <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-gray-900 font-mono">2,800</div>
          <div className="text-[10px] text-gray-400">人均购买 1.12 次</div>
        </div>

        {/* 3. 发放红包数 */}
        <div className="bg-white border border-[#e8e8e8] rounded p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>发放红包数</span>
            <Gift className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-gray-900 font-mono">5,600</div>
          <div className="text-[10px] text-gray-400">单包含 2 张券</div>
        </div>

        {/* 4. 红包使用率 */}
        <div className="bg-white border border-[#e8e8e8] rounded p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>红包使用率</span>
            <Percent className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600 font-mono">68%</div>
          <div className="text-[10px] text-gray-400">已核销 3,808 张</div>
        </div>

        {/* 5. 购买收入 */}
        <div className="bg-white border border-[#e8e8e8] rounded p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>购买收入</span>
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 font-mono">¥5,040</div>
          <div className="text-[10px] text-gray-400">¥1.8 × 2,800包</div>
        </div>

        {/* 6. 补贴支出 */}
        <div className="bg-white border border-[#e8e8e8] rounded p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>补贴支出</span>
            <DollarSign className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-600 font-mono">¥3,780</div>
          <div className="text-[10px] text-gray-400">¥0.9/张 平台补贴</div>
        </div>

        {/* 7. 净收入 */}
        <div className="bg-white border border-emerald-200 bg-emerald-50/20 rounded p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
            <span>净收入</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700 font-mono">¥1,260</div>
          <div className="text-[10px] text-emerald-600 font-medium">收益率 +25.0%</div>
        </div>
      </div>

      {/* Trend Charts */}
      <div className="bg-white border border-[#e8e8e8] rounded p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8]">
          <div>
            <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#1890ff]" />
              <span>购买人数与红包核销数趋势折线图</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              直观呈现会员购包热情与线下/线上商家订单核销复购联动走势。
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#1890ff]"></span>
              <span className="text-gray-600">购买人数 (人)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500"></span>
              <span className="text-gray-600">核销红包数 (张)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#999" tick={{ fontSize: 11 }} />
              <YAxis stroke="#999" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#e8e8e8',
                  borderRadius: 4,
                  fontSize: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Line 
                type="monotone" 
                dataKey="buyers" 
                name="购买人数 (人)" 
                stroke="#1890ff" 
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#1890ff' }}
                activeDot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="verified" 
                name="核销红包数 (张)" 
                stroke="#10b981" 
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#10b981' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Merchant Breakdown Table */}
      <div className="bg-white border border-[#e8e8e8] rounded shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#e8e8e8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fafafa]">
          <div>
            <div className="text-sm font-bold text-[#262626] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1890ff]" />
              <span>商家维度核销与补贴明细</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              各签约商户承接会员红包核销张数、平台应付补贴金额及商户自身让利成本。
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索商家名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] w-48"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-[#d9d9d9] rounded outline-none focus:border-[#1890ff] text-gray-700"
            >
              <option value="all">所有品类</option>
              <option value="茶饮甜品">茶饮甜品</option>
              <option value="正餐餐饮">正餐餐饮</option>
              <option value="咖啡轻食">咖啡轻食</option>
              <option value="快餐简餐">快餐简餐</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e8e8e8] text-gray-500 font-semibold">
                <th className="py-3 px-4">商家名称</th>
                <th className="py-3 px-4">所属品类</th>
                <th className="py-3 px-4 text-right">核销红包数</th>
                <th className="py-3 px-4 text-right">平台补贴金额</th>
                <th className="py-3 px-4 text-right">实际承担成本 (商家)</th>
                <th className="py-3 px-4 text-right">带动订单数</th>
                <th className="py-3 px-4 text-right">带动 GMV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0]">
              {filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    暂无符合条件的商家数据
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-[10px]">
                        {item.merchantName.substring(0, 1)}
                      </div>
                      <span>{item.merchantName}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#1890ff] font-mono">
                      {item.verifiedPackets.toLocaleString()} 张
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600 font-mono">
                      ¥{item.subsidyAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-700 font-mono">
                      ¥{item.merchantCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-800 font-mono">
                      {item.orderCount.toLocaleString()} 笔
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600 font-mono">
                      ¥{item.totalGmv.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredMerchants.length > 0 && (
              <tfoot>
                <tr className="bg-[#fafafa] font-bold text-gray-900 border-t border-[#e8e8e8]">
                  <td className="py-3 px-4" colSpan={2}>合计汇总</td>
                  <td className="py-3 px-4 text-right font-mono text-[#1890ff]">
                    {filteredMerchants.reduce((sum, i) => sum + i.verifiedPackets, 0).toLocaleString()} 张
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600">
                    ¥{filteredMerchants.reduce((sum, i) => sum + i.subsidyAmount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gray-800">
                    ¥{filteredMerchants.reduce((sum, i) => sum + i.merchantCost, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {filteredMerchants.reduce((sum, i) => sum + i.orderCount, 0).toLocaleString()} 笔
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600">
                    ¥{filteredMerchants.reduce((sum, i) => sum + i.totalGmv, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
