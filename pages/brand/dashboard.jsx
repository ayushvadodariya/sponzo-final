import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useUserStore from "@/store/useUserStore";
import Image from "next/image";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { 
  FiTrendingUp, 
  FiUsers, 
  FiDollarSign, 
  FiShoppingBag,
  FiEye,
  FiHeart,
  FiMessageCircle,
  FiShare2,
} from "react-icons/fi";

const BrandDashboard = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState(null);

  // Demo data for charts
  const campaignPerformance = [
    { month: "Jan", campaigns: 4, reach: 45000, engagement: 3200, sales: 12000 },
    { month: "Feb", campaigns: 6, reach: 62000, engagement: 4100, sales: 18000 },
    { month: "Mar", campaigns: 5, reach: 58000, engagement: 3800, sales: 16000 },
    { month: "Apr", campaigns: 8, reach: 78000, engagement: 5200, sales: 24000 },
    { month: "May", campaigns: 7, reach: 72000, engagement: 4800, sales: 21000 },
    { month: "Jun", campaigns: 9, reach: 95000, engagement: 6400, sales: 32000 },
  ];

  const platformData = [
    { name: "Instagram", value: 45, color: "#E1306C" },
    { name: "YouTube", value: 30, color: "#FF0000" },
    { name: "TikTok", value: 15, color: "#000000" },
    { name: "Facebook", value: 10, color: "#1877F2" },
  ];

  const influencerCategories = [
    { category: "Fashion", count: 12, spending: 45000 },
    { category: "Beauty", count: 8, spending: 32000 },
    { category: "Lifestyle", count: 15, spending: 52000 },
    { category: "Food", count: 6, spending: 18000 },
    { category: "Travel", count: 4, spending: 28000 },
    { category: "Tech", count: 5, spending: 22000 },
  ];

  const recentCampaigns = [
    {
      id: 1,
      name: "Summer Collection Launch",
      influencer: "Sarah Johnson",
      platform: "Instagram",
      status: "Active",
      reach: 45000,
      engagement: 3200,
      budget: 15000,
      image: "https://randomuser.me/api/portraits/women/23.jpg",
    },
    {
      id: 2,
      name: "Product Review Video",
      influencer: "Mike Thompson",
      platform: "YouTube",
      status: "Completed",
      reach: 82000,
      engagement: 5600,
      budget: 25000,
      image: "https://randomuser.me/api/portraits/men/54.jpg",
    },
    {
      id: 3,
      name: "Brand Awareness Campaign",
      influencer: "Emma Davis",
      platform: "TikTok",
      status: "Active",
      reach: 125000,
      engagement: 8900,
      budget: 18000,
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
  ];

  const topInfluencers = [
    {
      id: 1,
      name: "Sarah Johnson",
      category: "Fashion",
      followers: "245K",
      engagement: "4.2%",
      campaigns: 5,
      totalReach: 1200000,
      image: "https://randomuser.me/api/portraits/women/23.jpg",
    },
    {
      id: 2,
      name: "Mike Thompson",
      category: "Tech",
      followers: "380K",
      engagement: "3.8%",
      campaigns: 3,
      totalReach: 980000,
      image: "https://randomuser.me/api/portraits/men/54.jpg",
    },
    {
      id: 3,
      name: "Emma Davis",
      category: "Lifestyle",
      followers: "520K",
      engagement: "5.1%",
      campaigns: 7,
      totalReach: 2100000,
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
  ];

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "brand") {
      router.push("/");
      return;
    }

    // Simulate loading brand data
    setTimeout(() => {
      setBrandData({
        totalCampaigns: 39,
        activeCampaigns: 8,
        totalSpent: 197000,
        totalReach: 4280000,
        totalEngagement: 287000,
        avgEngagementRate: 4.3,
        influencersWorkedWith: 24,
        totalSales: 123000,
      });
      setLoading(false);
    }, 1000);
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          {change && (
            <p className={`text-sm mt-2 ${change > 0 ? "text-green-600" : "text-red-600"}`}>
              {change > 0 ? "↑" : "↓"} {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Brand Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name || "Brand"}!</p>
            </div>
            <div className="flex gap-3">
              <Link href="/explore">
                <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                  Find Influencers
                </button>
              </Link>
              <Link href="/brand/profilesetup">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Edit Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FiShoppingBag}
            title="Total Campaigns"
            value={brandData.totalCampaigns}
            change={12.5}
            color="bg-blue-500"
          />
          <StatCard
            icon={FiDollarSign}
            title="Total Spent"
            value={`₹${(brandData.totalSpent / 1000).toFixed(0)}K`}
            change={8.2}
            color="bg-green-500"
          />
          <StatCard
            icon={FiEye}
            title="Total Reach"
            value={`${(brandData.totalReach / 1000000).toFixed(1)}M`}
            change={15.3}
            color="bg-purple-500"
          />
          <StatCard
            icon={FiHeart}
            title="Engagement Rate"
            value={`${brandData.avgEngagementRate}%`}
            change={2.1}
            color="bg-pink-500"
          />
        </div>

        {/* Campaign Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Campaign Performance</h2>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Last 6 Months</option>
                <option>Last 3 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={campaignPerformance}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="reach"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorReach)"
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorEngagement)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Platform Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {platformData.map((platform, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: platform.color }}
                    ></div>
                    <span className="text-gray-700">{platform.name}</span>
                  </div>
                  <span className="font-semibold">{platform.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Influencer Category Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={influencerCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Campaigns" />
              <Bar yAxisId="right" dataKey="spending" fill="#82ca9d" name="Spending (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Campaigns & Top Influencers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Campaigns */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Campaigns</h2>
              <Link href="/brand/campaigns" className="text-indigo-600 hover:text-indigo-800 text-sm">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={campaign.image}
                        alt={campaign.influencer}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{campaign.name}</h3>
                        <p className="text-sm text-gray-600">{campaign.influencer} • {campaign.platform}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        campaign.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-600">Reach</p>
                      <p className="text-sm font-semibold">{(campaign.reach / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Engagement</p>
                      <p className="text-sm font-semibold">{(campaign.engagement / 1000).toFixed(1)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Budget</p>
                      <p className="text-sm font-semibold">₹{(campaign.budget / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Influencers */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Top Performing Influencers</h2>
              <Link href="/explore" className="text-indigo-600 hover:text-indigo-800 text-sm">
                Find More →
              </Link>
            </div>
            <div className="space-y-4">
              {topInfluencers.map((influencer, index) => (
                <div
                  key={influencer.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Image
                          src={influencer.image}
                          alt={influencer.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{influencer.name}</h3>
                        <p className="text-sm text-gray-600">{influencer.category}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-600">Followers</p>
                      <p className="text-sm font-semibold">{influencer.followers}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Engagement</p>
                      <p className="text-sm font-semibold">{influencer.engagement}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Campaigns</p>
                      <p className="text-sm font-semibold">{influencer.campaigns}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/explore">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer">
                <FiUsers className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                <p className="font-semibold text-gray-800">Find Influencers</p>
              </div>
            </Link>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer">
              <FiShoppingBag className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <p className="font-semibold text-gray-800">New Campaign</p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer">
              <FiTrendingUp className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <p className="font-semibold text-gray-800">View Analytics</p>
            </div>
            <Link href="/brand/profilesetup">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer">
                <FiMessageCircle className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                <p className="font-semibold text-gray-800">Settings</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDashboard;
