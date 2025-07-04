"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BarChart3,
  Filter,
  Youtube,
  Instagram,
  Linkedin,
  Twitter,
  Music,
  FileText,
  Calendar,
  Clock,
  Plus,
  Folder,
  Settings,
  User,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

// Platform configuration with icons and colors
const platforms = [
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: Linkedin, 
    color: '#0077B5',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: Instagram, 
    color: '#E4405F',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700'
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: Youtube, 
    color: '#FF0000',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700'
  },
  { 
    id: 'x', 
    name: 'X (Twitter)', 
    icon: Twitter, 
    color: '#000000',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700'
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: Music, 
    color: '#000000',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700'
  },
  { 
    id: 'blog', 
    name: 'Blog', 
    icon: FileText, 
    color: '#6B46C1',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  },
]

// Mock data for demonstration
const mockData = {
  totalReach: 245600,
  totalEngagement: 18450,
  totalFollowers: 12850,
  totalPosts: 89,
  engagementRate: 7.5,
  reachGrowth: 12.5,
  followerGrowth: 8.3,
  postGrowth: 15.2,
  
  weeklyData: [
    { name: 'Mon', reach: 12000, engagement: 890, followers: 45 },
    { name: 'Tue', reach: 15200, engagement: 1200, followers: 62 },
    { name: 'Wed', reach: 18500, engagement: 1450, followers: 78 },
    { name: 'Thu', reach: 16800, engagement: 1280, followers: 55 },
    { name: 'Fri', reach: 21000, engagement: 1680, followers: 95 },
    { name: 'Sat', reach: 19200, engagement: 1520, followers: 72 },
    { name: 'Sun', reach: 17300, engagement: 1380, followers: 68 },
  ],
  
  platformData: [
    { name: 'LinkedIn', value: 35, count: 4200, color: '#0077B5' },
    { name: 'Instagram', value: 25, count: 3100, color: '#E4405F' },
    { name: 'YouTube', value: 20, count: 2800, color: '#FF0000' },
    { name: 'X (Twitter)', value: 12, count: 1650, color: '#000000' },
    { name: 'TikTok', value: 5, count: 750, color: '#000000' },
    { name: 'Blog', value: 3, count: 350, color: '#6B46C1' },
  ],
  
  monthlyGrowth: [
    { month: 'Jan', followers: 8200, engagement: 12500 },
    { month: 'Feb', followers: 8650, engagement: 13200 },
    { month: 'Mar', followers: 9200, engagement: 14800 },
    { month: 'Apr', followers: 10100, engagement: 16200 },
    { month: 'May', followers: 11200, engagement: 17800 },
    { month: 'Jun', followers: 12850, engagement: 18450 },
  ],
  
  topPosts: [
    { title: 'Building AI Products: Lessons Learned', platform: 'linkedin', reach: 15600, engagement: 1280 },
    { title: 'Behind the Scenes: Content Creation Setup', platform: 'instagram', reach: 12400, engagement: 980 },
    { title: 'The Future of Social Media Marketing', platform: 'youtube', reach: 8900, engagement: 750 },
    { title: 'Quick Tips for Better Engagement', platform: 'x', reach: 6200, engagement: 420 },
  ]
}

export default function AnalyticsDashboard() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    platforms.map(p => p.id)
  )
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const filteredData = {
    ...mockData,
    platformData: mockData.platformData.filter(item => 
      selectedPlatforms.some(id => 
        platforms.find(p => p.id === id)?.name === item.name
      )
    ),
    topPosts: mockData.topPosts.filter(post => 
      selectedPlatforms.includes(post.platform)
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:fixed inset-y-0 left-0 z-50 ${
          isSidebarCollapsed ? "w-16" : "w-64"
        } bg-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out group h-screen`}
        onMouseEnter={() => {
          if (isSidebarCollapsed) {
            // Temporary expand on hover when collapsed
          }
        }}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-slate-300 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {/* Supernova Logo / Expand Button Container */}
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
            
            {/* Expand Button (replaces supernova icon on hover when collapsed) */}
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
          
          {/* Collapse Button */}
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

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? "justify-center px-3" : "space-x-2 px-3"
                } py-1.5 rounded-lg transition-colors text-slate-300 hover:bg-slate-700 hover:text-white`}
                title={isSidebarCollapsed ? "Create" : ""}
              >
                <Plus className="w-4 h-4" />
                {!isSidebarCollapsed && <span className="text-sm">Create</span>}
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? "justify-center px-3" : "space-x-2 px-3"
                } py-1.5 rounded-lg transition-colors bg-indigo-600 text-white`}
                title={isSidebarCollapsed ? "Analytics" : ""}
              >
                <BarChart3 className="w-4 h-4" />
                {!isSidebarCollapsed && <span className="text-sm">Analytics</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? "justify-center px-3" : "space-x-2 px-3"
                } py-1.5 rounded-lg transition-colors text-slate-300 hover:bg-slate-700 hover:text-white`}
                title={isSidebarCollapsed ? "Library" : ""}
              >
                <Folder className="w-4 h-4" />
                {!isSidebarCollapsed && <span className="text-sm">Library</span>}
              </button>
            </li>
          </ul>
        </nav>

        {/* Settings and User */}
        <div className="p-3 border-t border-slate-700 space-y-1">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className={`w-full flex items-center ${
              isSidebarCollapsed ? "justify-center px-3" : "space-x-2 px-3"
            } py-1.5 rounded-lg transition-colors text-slate-300 hover:bg-slate-700 hover:text-white`}
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
      <div className={`flex-1 min-w-0 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300 h-screen overflow-y-auto`}>
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

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="">
              <h1 className="text-2xl font-bold text-gray-900">Social Media Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your performance across all platforms</p>
            </div>
            
            {/* Platform Filter Dropdown */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 hidden sm:block">
                <Clock className="inline w-4 h-4 mr-1" />
                Last updated: {new Date().toLocaleDateString()}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Platforms ({selectedPlatforms.length})</span>
                    <span className="sm:hidden">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-2">
                  <div className="space-y-2">
                    {platforms.map((platform) => {
                      const Icon = platform.icon
                      return (
                        <DropdownMenuItem key={platform.id} className="p-0">
                          <div className="flex items-center space-x-3 w-full p-2 rounded-md hover:bg-gray-50">
                            <Checkbox
                              id={platform.id}
                              checked={selectedPlatforms.includes(platform.id)}
                              onCheckedChange={() => togglePlatform(platform.id)}
                            />
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${platform.bgColor}`}>
                              <Icon className={`w-4 h-4 ${platform.textColor}`} />
                            </div>
                            <label htmlFor={platform.id} className="flex-1 text-sm font-medium cursor-pointer">
                              {platform.name}
                            </label>
                          </div>
                        </DropdownMenuItem>
                      )
                    })}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(filteredData.totalReach)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  +{filteredData.reachGrowth}% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(filteredData.totalEngagement)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  +{filteredData.engagementRate}% rate
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(filteredData.totalFollowers)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  +{filteredData.followerGrowth}% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredData.totalPosts}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  +{filteredData.postGrowth}% from last month
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={filteredData.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="reach" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="engagement" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Platform Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={filteredData.platformData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {filteredData.platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Growth Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>6-Month Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData.monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="followers" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="engagement" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Performing Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredData.topPosts.map((post, index) => {
                  const platform = platforms.find(p => p.id === post.platform)
                  const Icon = platform?.icon || FileText
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center ${platform?.bgColor}`}>
                        <Icon className={`w-5 h-5 ${platform?.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{post.title}</h3>
                        <p className="text-sm text-gray-500 capitalize">{platform?.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">{formatNumber(post.reach)}</div>
                        <div className="text-sm text-gray-500">reach</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">{formatNumber(post.engagement)}</div>
                        <div className="text-sm text-gray-500">engagement</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 