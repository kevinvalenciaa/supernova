"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BarChart3,
  Calendar,
  Clock,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
  Play,
  Download,
  Share,
  Settings,
  User,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Archive,
  LayoutGrid,
  Search,
  Filter,
  ExternalLink,
  Brain,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Clock3,
  Hash,
  MoreHorizontal,
  Copy,
  Plus,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data for the dashboard
const mockAnalyticsData = {
  kpis: {
    growthDriver: { 
      platform: 'LinkedIn', 
      metric: 'Posts', 
      value: '+847% engagement',
      trend: 847,
      direction: 'up',
      insight: 'Your "behind the scenes" content is crushing it'
    },
    engagementRate: { value: 7.2, trend: 12.5, direction: 'up', benchmark: 5.4 },
    contentROI: { 
      value: 3.4, 
      trend: 28.5, 
      direction: 'up',
      description: 'Posts per engagement point',
      heatColor: 'hot'
    },
    // Secondary metrics that can be swapped in
    secondaryMetrics: {
      followers: { value: 2850, trend: 12.3, benchmark: 1200 },
      ctr: { value: 4.8, trend: 15.2, benchmark: 3.2 },
      watchTime: { value: '2.4m', trend: 22.1, benchmark: '1.8m' }
    }
  },
  
  timeSeriesData: [
    { 
      date: 'Mon', 
      reach: 8200, 
      engagement: 650, 
      clicks: 120, 
      likes: 450, 
      comments: 80,
      annotation: null
    },
    { 
      date: 'Tue', 
      reach: 12400, 
      engagement: 890, 
      clicks: 180, 
      likes: 620, 
      comments: 90,
      annotation: null
    },
    { 
      date: 'Wed', 
      reach: 15600, 
      engagement: 1240, 
      clicks: 220, 
      likes: 850, 
      comments: 170,
      annotation: 'Product launch clip posted →'
    },
    { 
      date: 'Thu', 
      reach: 9800, 
      engagement: 780, 
      clicks: 140, 
      likes: 520, 
      comments: 120,
      annotation: null
    },
    { 
      date: 'Fri', 
      reach: 18200, 
      engagement: 1460, 
      clicks: 280, 
      likes: 980, 
      comments: 200,
      annotation: null
    },
    { 
      date: 'Sat', 
      reach: 14500, 
      engagement: 1150, 
      clicks: 190, 
      likes: 760, 
      comments: 200,
      annotation: null
    },
    { 
      date: 'Sun', 
      reach: 11200, 
      engagement: 840, 
      clicks: 160, 
      likes: 580, 
      comments: 100,
      annotation: null
    },
  ],

  // Enhanced platform data with more detailed metrics
  platforms: [
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      color: '#0077B5',
      reach: 65400,
      engagement: 4680,
      posts: 12,
      engagementRate: 7.2,
      watchTime: 95, // percentage
      avgWatchTime: '2.4m',
      formatSplit: { posts: 8, carousels: 3, videos: 1 },
      topHashtags: [
        { tag: '#startups', performance: 92 },
        { tag: '#ai', performance: 87 },
        { tag: '#productivity', performance: 76 }
      ],
      bestTiming: 'Tue-Thu 9AM EST',
      insights: 'Your "problem → solution" posts outperform others by 28%',
      hookScore: 8.4,
      ctaEffectiveness: 12.3
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      color: '#E4405F',
      reach: 42800,
      engagement: 3420,
      posts: 8,
      engagementRate: 8.0,
      watchTime: 78,
      avgWatchTime: '1.8m',
      formatSplit: { reels: 5, stories: 2, posts: 1 },
      topHashtags: [
        { tag: '#startup', performance: 89 },
        { tag: '#founder', performance: 82 },
        { tag: '#tech', performance: 79 }
      ],
      bestTiming: 'Mon-Wed 6PM EST',
      insights: 'Reels with captions get 45% more engagement than without',
      hookScore: 7.8,
      ctaEffectiveness: 9.7
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      color: '#000000',
      reach: 28900,
      engagement: 2890,
      posts: 6,
      engagementRate: 10.0,
      watchTime: 65,
      avgWatchTime: '0.8m',
      formatSplit: { videos: 6 },
      topHashtags: [
        { tag: '#entrepreneur', performance: 94 },
        { tag: '#tech', performance: 88 },
        { tag: '#startup', performance: 85 }
      ],
      bestTiming: 'Fri-Sun 7PM EST',
      insights: 'Short-form educational content performs 3x better',
      hookScore: 9.1,
      ctaEffectiveness: 15.2
    },
    { 
      id: 'twitter', 
      name: 'X (Twitter)', 
      color: '#000000',
      reach: 18400,
      engagement: 1470,
      posts: 15,
      engagementRate: 8.0,
      watchTime: null,
      avgWatchTime: null,
      formatSplit: { posts: 10, threads: 5 },
      topHashtags: [
        { tag: '#buildinpublic', performance: 91 },
        { tag: '#startup', performance: 86 },
        { tag: '#ai', performance: 83 }
      ],
      bestTiming: 'Mon-Fri 11AM EST',
      insights: 'Threads with 3-5 tweets get highest engagement',
      hookScore: 7.5,
      ctaEffectiveness: 8.9
    }
  ],

  // Enhanced posts data with more AI insights
  posts: [
    {
      id: 1,
      date: '2024-01-15',
      platform: 'linkedin',
      title: 'Building in Public: Day 30',
      caption: 'Just hit a major milestone in our AI journey. Here\'s what we learned about product-market fit...',
      thumbnail: '/api/placeholder/60/60',
      reach: 12400,
      engagement: 890,
      likes: 620,
      comments: 90,
      shares: 180,
      clicks: 45,
      saves: 23,
      engagementRate: 7.2,
      watchTime: 85,
      score: 95,
      hookScore: 9.2,
      ctaEffectiveness: 14.5,
      sentiment: 'positive',
      aiInsights: [
        'Hook "Just hit a major milestone" drove 3x more opens',
        'Question format in comments boosted engagement by 45%',
        'Post at 9AM for 23% more reach'
      ]
    },
    {
      id: 2,
      date: '2024-01-14',
      platform: 'instagram',
      title: 'Behind the scenes: Content creation',
      caption: 'Here\'s how we create viral content in under 30 minutes using AI...',
      thumbnail: '/api/placeholder/60/60',
      reach: 8900,
      engagement: 712,
      likes: 580,
      comments: 132,
      shares: 89,
      clicks: 32,
      saves: 67,
      engagementRate: 8.0,
      watchTime: 72,
      score: 88,
      hookScore: 8.1,
      ctaEffectiveness: 11.2,
      sentiment: 'positive',
      aiInsights: [
        'Behind-the-scenes content gets 40% more saves',
        'Add captions for 45% more engagement',
        'Tutorial format drives highest watch time'
      ]
    },
    {
      id: 3,
      date: '2024-01-13',
      platform: 'tiktok',
      title: 'AI Content Creation in 30 seconds',
      caption: 'Watch me create viral content with AI. Link in bio for the tool I used 👆',
      thumbnail: '/api/placeholder/60/60',
      reach: 15600,
      engagement: 1560,
      likes: 1200,
      comments: 240,
      shares: 120,
      clicks: 78,
      saves: 45,
      engagementRate: 10.0,
      watchTime: 68,
      score: 92,
      hookScore: 9.5,
      ctaEffectiveness: 16.8,
      sentiment: 'very positive',
      aiInsights: [
        'Fast-paced tutorials perform 3x better on TikTok',
        '"Link in bio" CTA drove 78 clicks (2x average)',
        'Post between 7-9PM for maximum reach'
      ]
    }
  ],

  // Enhanced AI insights with growth coaching focus
  aiInsights: [
    {
      type: 'gap',
      icon: AlertTriangle,
      color: 'text-orange-600 bg-orange-50',
      title: "No TikTok content in 6 days",
      description: 'Your TikTok posts drive 3x more leads per view. Ready-to-post idea generated.',
      action: 'Post TikTok Idea',
      actionLink: '/dashboard?tab=create&platform=tiktok&idea=ready',
      priority: 'high'
    },
    {
      type: 'optimization',
      icon: Brain,
      color: 'text-blue-600 bg-blue-50',
      title: 'CTAs with verbs perform 28% better',
      description: 'Switch from "Link in bio" to "Get the tool" for higher clicks.',
      action: 'Apply to Next Post',
      actionLink: '/dashboard?tab=create&cta=verb',
      priority: 'medium'
    },
    {
      type: 'audience',
      icon: Users,
      color: 'text-purple-600 bg-purple-50',
      title: 'DMs surged after "tip #3" post',
      description: 'Your audience loves numbered tips. Create a tip series to drive more DMs.',
      action: 'Create Tip Series',
      actionLink: '/dashboard?tab=create&format=tips',
      priority: 'high'
    },
    {
      type: 'strategy',
      icon: Target,
      color: 'text-emerald-600 bg-emerald-50',
      title: 'Auto Strategy: Next Week\'s Plan',
      description: 'AI generated 5 posts based on your best performers. Ready to schedule.',
      action: 'Review & Schedule',
      actionLink: '/dashboard?tab=strategy&week=next',
      priority: 'medium'
    },
    {
      type: 'timing',
      icon: Clock3,
      color: 'text-yellow-600 bg-yellow-50',
      title: 'Best posting window: 2 hours',
      description: 'Your audience is most active Tue-Thu 8-10AM EST. Schedule next 3 posts here.',
      action: 'Auto-Schedule',
      actionLink: '/dashboard?tab=schedule&window=optimal',
      priority: 'low'
    }
  ],

  // Benchmark data comparing to similar startups
  benchmark: {
    segment: 'SaaS startups (1-10k followers)',
    metrics: {
      reach: { you: 7.2, average: 4.8, status: 'outperforming' },
      clicks: { you: 4.1, average: 5.2, status: 'underperforming' },
      comments: { you: 8.9, average: 6.1, status: 'outperforming' },
      shares: { you: 3.4, average: 3.8, status: 'average' },
      saves: { you: 6.7, average: 4.9, status: 'outperforming' }
    }
  },

  // Goals tracking
  goals: [
    {
      id: 1,
      title: '1k LinkedIn followers by Sept',
      current: 847,
      target: 1000,
      deadline: '2024-09-30',
      progress: 84.7,
      onTrack: true
    },
    {
      id: 2,
      title: '50 DMs per week',
      current: 38,
      target: 50,
      deadline: 'weekly',
      progress: 76,
      onTrack: false
    }
  ]
}

export default function AnalyticsDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedMetric, setSelectedMetric] = useState('engagement')
  const [selectedHeroMetric, setSelectedHeroMetric] = useState('growth')
  const [activePlatformTab, setActivePlatformTab] = useState('linkedin')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const getMetricData = () => {
    return mockAnalyticsData.timeSeriesData.map(item => ({
      ...item,
      value: item[selectedMetric as keyof typeof item] as number
    }))
  }

  const getBenchmarkColor = (status: string) => {
    switch (status) {
      case 'outperforming': return 'text-emerald-600'
      case 'underperforming': return 'text-red-600'
      default: return 'text-amber-600'
    }
  }

  const getROIHeatColor = (heatColor: string) => {
    switch (heatColor) {
      case 'hot': return 'from-red-50 to-orange-50 border-red-200'
      case 'warm': return 'from-orange-50 to-yellow-50 border-orange-200'
      default: return 'from-blue-50 to-indigo-50 border-blue-200'
    }
  }

  const renderHeroMetric = () => {
    const { kpis } = mockAnalyticsData
    
    switch (selectedHeroMetric) {
      case 'growth':
        return (
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-indigo-700 mb-1">Growth Driver</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-indigo-900">{kpis.growthDriver.platform}</span>
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                      {kpis.growthDriver.metric}
                    </Badge>
                  </div>
                  <p className="text-lg font-semibold text-indigo-600 mt-1">{kpis.growthDriver.value}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-emerald-600 mb-2">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{kpis.growthDriver.trend}%</span>
                  </div>
                  <div className="w-20 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-indigo-600 italic">"{kpis.growthDriver.insight}"</p>
            </CardContent>
          </Card>
        )
      
      case 'followers':
        const followers = kpis.secondaryMetrics.followers
        return (
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-emerald-700 mb-1">Total Followers</p>
                  <div className="text-2xl font-bold text-emerald-900">{formatNumber(followers.value)}</div>
                  <div className="flex items-center text-emerald-600 mt-1">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    <span className="text-sm">+{followers.trend}% vs last month</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-600 mb-1">Benchmark</p>
                  <p className="text-sm font-medium text-emerald-700">{formatNumber(followers.benchmark)}</p>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 mt-1">
                    +{Math.round(((followers.value - followers.benchmark) / followers.benchmark) * 100)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      
      case 'ctr':
        const ctr = kpis.secondaryMetrics.ctr
        return (
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">Click-Through Rate</p>
                  <div className="text-2xl font-bold text-purple-900">{ctr.value}%</div>
                  <div className="flex items-center text-purple-600 mt-1">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    <span className="text-sm">+{ctr.trend}% vs benchmark</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-purple-600 mb-1">Industry Avg</p>
                  <p className="text-sm font-medium text-purple-700">{ctr.benchmark}%</p>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 mt-1">
                    Above Avg
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:fixed inset-y-0 left-0 z-50 ${
          isSidebarCollapsed ? "w-16" : "w-64"
        } bg-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out group h-screen`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-slate-300 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className={`flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 ${
                isSidebarCollapsed ? "justify-center group-hover:opacity-0" : ""
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {!isSidebarCollapsed && <span className="text-xl font-bold">supernova</span>}
            </button>
            
            {isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="absolute inset-0 flex items-center justify-center p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Expand Sidebar"
              >
                <PanelLeftOpen className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {!isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="hidden lg:flex p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            <li>
              <button
                className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors bg-indigo-600 text-white"
                title={isSidebarCollapsed ? "Dashboard" : ""}
              >
                <LayoutGrid className="w-4 h-4" />
                {!isSidebarCollapsed && <span className="text-sm">Dashboard</span>}
              </button>
            </li>
            <li className="px-3 py-1">
              <div className="w-full h-px bg-slate-600/30"></div>
            </li>
            <li>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                title={isSidebarCollapsed ? "Create" : ""}
              >
                <Sparkles className="w-4 h-4" />
                {!isSidebarCollapsed && <span className="text-sm">Create</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                title={isSidebarCollapsed ? "Library" : ""}
              >
                <Archive className="w-4 h-4" />
                {!isSidebarCollapsed && <span className="text-sm">Library</span>}
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-3 border-t border-slate-700 space-y-1">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
            title={isSidebarCollapsed ? "Settings" : ""}
          >
            <Settings className="w-4 h-4" />
            {!isSidebarCollapsed && <span className="text-sm">Settings</span>}
          </button>
          
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-2 px-3 py-1.5">
              <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                <User className="w-3 h-3" />
              </div>
              <span className="text-xs text-slate-300">Kevin Valencia</span>
            </div>
          )}
          
          {isSidebarCollapsed && (
            <div className="flex justify-center px-3 py-1.5" title="Kevin Valencia">
              <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                <User className="w-3 h-3" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 min-w-0 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300`}>
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">supernova</span>
          </button>
          <div className="w-10" />
        </div>

        {/* Enhanced Main Header - Founder-First Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Growth Analytics</h1>
              <p className="text-gray-600 mt-1">Your growth co-pilot • Real-time insights & strategy</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quick Platform Switch */}
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🌐 All Platforms</SelectItem>
                  <SelectItem value="linkedin">🔵 LinkedIn</SelectItem>
                  <SelectItem value="instagram">📸 Instagram</SelectItem>
                  <SelectItem value="tiktok">🎵 TikTok</SelectItem>
                  <SelectItem value="twitter">🐦 X (Twitter)</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Time Range Filter */}
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Action Buttons */}
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
              
              {/* Primary CTA - Generate New Post */}
              <Button 
                onClick={() => window.location.href = '/dashboard?tab=create'}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center space-x-2 shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Generate New Post</span>
              </Button>
            </div>
          </div>
          
          {/* Quick Stats Bar */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600">Last updated: 2 minutes ago</span>
              </div>
              <div className="text-slate-600">
                <span className="font-medium text-slate-900">{mockAnalyticsData.posts.length}</span> posts analyzed
              </div>
              <div className="text-slate-600">
                <span className="font-medium text-slate-900">4</span> platforms connected
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                ↗️ Growth trending up
              </Badge>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View Weekly Digest →
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 1. Hero KPI Cards - Founder-First Growth Focus */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dynamic Hero Metric - Swappable Growth Driver */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-900">Key Growth Metric</h2>
                <Select value={selectedHeroMetric} onValueChange={setSelectedHeroMetric}>
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="growth">Growth Driver</SelectItem>
                    <SelectItem value="followers">Followers</SelectItem>
                    <SelectItem value="ctr">Click Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {renderHeroMetric()}
            </div>

            {/* Engagement Rate with Benchmark */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-blue-700 mb-1">Engagement Rate</p>
                    <div className="text-2xl font-bold text-blue-900">{mockAnalyticsData.kpis.engagementRate.value}%</div>
                    <div className="flex items-center text-blue-600 mt-1">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      <span className="text-sm">+{mockAnalyticsData.kpis.engagementRate.trend}% vs last month</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-600 mb-1">Benchmark</p>
                    <p className="text-sm font-medium text-blue-700">{mockAnalyticsData.kpis.engagementRate.benchmark}%</p>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 mt-1">
                      Above Avg
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content ROI with Heat Color */}
            <Card className={`bg-gradient-to-br ${getROIHeatColor(mockAnalyticsData.kpis.contentROI.heatColor)}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-1">Content ROI</p>
                    <div className="text-2xl font-bold text-red-900">{mockAnalyticsData.kpis.contentROI.value}x</div>
                    <p className="text-xs text-red-600 mt-1">{mockAnalyticsData.kpis.contentROI.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-emerald-600 mb-2">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">+{mockAnalyticsData.kpis.contentROI.trend}%</span>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2. Enhanced Time Series Graph with Annotations */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                    Engagement Trends
                  </CardTitle>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <span className="text-sm text-slate-600 capitalize">{selectedMetric}</span>
                    </div>
                    <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engagement">📊 Engagement</SelectItem>
                        <SelectItem value="reach">👥 Reach</SelectItem>
                        <SelectItem value="clicks">🔗 Clicks</SelectItem>
                        <SelectItem value="likes">❤️ Likes</SelectItem>
                        <SelectItem value="comments">💬 Comments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={getMetricData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                          fontSize: '14px'
                        }}
                        formatter={(value: any, name: any) => [
                          formatNumber(value),
                          name.charAt(0).toUpperCase() + name.slice(1)
                        ]}
                        labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        fill="url(#blueGradient)" 
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}
                        activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}
                      />
                      <defs>
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                  
                  {/* Annotations for spikes */}
                  <div className="absolute top-4 left-4 right-4">
                    {mockAnalyticsData.timeSeriesData.map((item, index) => {
                      if (item.annotation) {
                        return (
                          <div 
                            key={index} 
                            className="absolute bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium border border-purple-200 shadow-sm"
                            style={{ 
                              left: `${(index / (mockAnalyticsData.timeSeriesData.length - 1)) * 100}%`,
                              transform: 'translateX(-50%)'
                            }}
                          >
                            {item.annotation}
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
                
                {/* Growth Insights */}
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">Growth Insight</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Your {selectedMetric} spiked <strong>+67%</strong> on Wednesday after the product launch content. 
                    Similar behind-the-scenes posts could drive consistent growth.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 3. Enhanced AI Strategy Panel with Growth Coaching */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  Growth Coaching
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAnalyticsData.aiInsights.slice(0, 4).map((insight, index) => {
                  const Icon = insight.icon
                  const priorityColors = {
                    high: 'border-l-red-400 bg-red-50',
                    medium: 'border-l-yellow-400 bg-yellow-50',
                    low: 'border-l-green-400 bg-green-50'
                  }
                  return (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${priorityColors[insight.priority as keyof typeof priorityColors]} transition-all hover:shadow-md`}>
                      <div className="flex items-start space-x-3">
                        <Icon className={`w-5 h-5 mt-1 ${insight.color.split(' ')[0]}`} />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900 mb-2">{insight.title}</p>
                          <p className="text-xs text-slate-600 mb-3 leading-relaxed">{insight.description}</p>
                          <Button size="sm" variant="outline" className="text-xs h-7 bg-white hover:bg-slate-50">
                            {insight.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {/* Goals Tracker */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Goals Tracker</h4>
                  {mockAnalyticsData.goals.map((goal) => (
                    <div key={goal.id} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-slate-700">{goal.title}</p>
                        <Badge variant={goal.onTrack ? "default" : "secondary"} className="text-xs">
                          {goal.onTrack ? "On Track" : "Behind"}
                        </Badge>
                      </div>
                      <Progress value={goal.progress} className="h-2 mb-1" />
                      <p className="text-xs text-slate-500">
                        {goal.current}/{goal.target} ({goal.progress.toFixed(0)}%)
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benchmark Panel */}
          <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-slate-600" />
                Benchmark: {mockAnalyticsData.benchmark.segment}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(mockAnalyticsData.benchmark.metrics).map(([metric, data]) => (
                  <div key={metric} className="text-center p-4 bg-white rounded-lg border">
                    <p className="text-xs font-medium text-slate-600 mb-2 capitalize">{metric}</p>
                    <div className="space-y-1">
                      <p className={`text-lg font-bold ${getBenchmarkColor(data.status)}`}>
                        {data.you.toFixed(1)}%
                      </p>
                      <p className="text-xs text-slate-500">vs {data.average.toFixed(1)}%</p>
                      <Badge 
                        variant={data.status === 'outperforming' ? 'default' : data.status === 'underperforming' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {data.status === 'outperforming' ? '↗️ Above' : data.status === 'underperforming' ? '↘️ Below' : '➡️ Average'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Key Insight:</strong> You're outperforming on comments and reach, but underperforming on clicks. 
                  Focus on stronger CTAs to drive more click-through.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 4. Enhanced Platform Performance with Tabs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Platform Performance</CardTitle>
                <div className="flex items-center space-x-2">
                  {mockAnalyticsData.platforms.map((platform) => (
                    <Button
                      key={platform.id}
                      variant={activePlatformTab === platform.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActivePlatformTab(platform.id)}
                      className="text-xs"
                    >
                      {platform.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const platform = mockAnalyticsData.platforms.find(p => p.id === activePlatformTab)
                if (!platform) return null
                
                return (
                  <div className="space-y-6">
                    {/* Platform Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="border-slate-200">
                        <CardContent className="p-4 text-center">
                          <div 
                            className="w-3 h-3 rounded-full mx-auto mb-2" 
                            style={{ backgroundColor: platform.color }}
                          />
                          <p className="text-sm font-medium text-slate-600">Reach</p>
                          <p className="text-xl font-bold text-slate-900">{formatNumber(platform.reach)}</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-slate-200">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm font-medium text-slate-600">Engagement Rate</p>
                          <p className="text-xl font-bold text-slate-900">{platform.engagementRate}%</p>
                          <p className="text-xs text-emerald-600 mt-1">+2.1% vs avg</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-slate-200">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm font-medium text-slate-600">Hook Score</p>
                          <p className="text-xl font-bold text-slate-900">{platform.hookScore}/10</p>
                          <Progress value={platform.hookScore * 10} className="h-1 mt-2" />
                        </CardContent>
                      </Card>
                      
                      <Card className="border-slate-200">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm font-medium text-slate-600">CTA Rate</p>
                          <p className="text-xl font-bold text-slate-900">{platform.ctaEffectiveness}%</p>
                          <p className="text-xs text-blue-600 mt-1">Click-through</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Format Split & Top Hashtags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-3">Format Performance</h4>
                        <div className="space-y-2">
                          {Object.entries(platform.formatSplit).map(([format, count]) => (
                            <div key={format} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                              <span className="text-sm capitalize text-slate-700">{format}</span>
                              <Badge variant="secondary">{count} posts</Badge>
                            </div>
                          ))}
                        </div>
                        {platform.watchTime && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-slate-600 mb-2">Avg Watch Time</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={platform.watchTime} className="h-2 flex-1" />
                              <span className="text-sm font-medium text-slate-900">{platform.watchTime}%</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{platform.avgWatchTime} average</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-3">Top Hashtags</h4>
                        <div className="space-y-2">
                          {platform.topHashtags.map((hashtag, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                              <span className="text-sm text-slate-700">{hashtag.tag}</span>
                              <div className="flex items-center space-x-2">
                                <Progress value={hashtag.performance} className="h-1 w-16" />
                                <span className="text-xs font-medium text-slate-600">{hashtag.performance}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700 font-medium mb-1">Best Timing</p>
                          <p className="text-sm text-blue-800">{platform.bestTiming}</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights for Platform */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                      <div className="flex items-start space-x-2">
                        <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-purple-900 mb-1">AI Insight</p>
                          <p className="text-sm text-purple-800 italic">"{platform.insights}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          {/* 5. Enhanced Post Performance Table with AI Insights */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Content Library with AI Insights</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.posts.map((post) => (
                  <Card key={post.id} className="border border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        {/* Post Info */}
                        <div className="lg:col-span-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <img 
                              src={post.thumbnail} 
                              alt={post.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-slate-900 text-sm">{post.title}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {post.platform}
                                </Badge>
                                <span className="text-xs text-slate-500">{post.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{post.caption}</p>
                        </div>

                        {/* Performance Metrics */}
                        <div className="lg:col-span-1">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-2 bg-slate-50 rounded">
                              <p className="text-xs text-slate-600">Reach</p>
                              <p className="text-sm font-bold text-slate-900">{formatNumber(post.reach)}</p>
                            </div>
                            <div className="text-center p-2 bg-slate-50 rounded">
                              <p className="text-xs text-slate-600">Engagement</p>
                              <p className="text-sm font-bold text-slate-900">{formatNumber(post.engagement)}</p>
                            </div>
                            <div className="text-center p-2 bg-slate-50 rounded">
                              <p className="text-xs text-slate-600">Hook Score</p>
                              <p className="text-sm font-bold text-slate-900">{post.hookScore}/10</p>
                            </div>
                            <div className="text-center p-2 bg-slate-50 rounded">
                              <p className="text-xs text-slate-600">CTA Rate</p>
                              <p className="text-sm font-bold text-slate-900">{post.ctaEffectiveness}%</p>
                            </div>
                          </div>
                        </div>

                        {/* AI Insights */}
                        <div className="lg:col-span-1">
                          <h5 className="text-xs font-semibold text-slate-900 mb-2">AI Insights</h5>
                          <div className="space-y-1">
                            {post.aiInsights.slice(0, 2).map((insight, index) => (
                              <p key={index} className="text-xs text-slate-600 leading-relaxed">
                                • {insight}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-1 flex flex-col space-y-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            <Brain className="w-3 h-3 mr-1" />
                            Regenerate Caption
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            <Copy className="w-3 h-3 mr-1" />
                            Remix for IG
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            <Hash className="w-3 h-3 mr-1" />
                            Make Thread
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 