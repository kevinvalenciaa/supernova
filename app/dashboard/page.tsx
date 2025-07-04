"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Sparkles,
  Plus,
  Folder,
  Settings,
  User,
  Send,
  Play,
  Calendar,
  Upload,
  Video,
  Eye,
  Trash2,
  Menu,
  X,
  TrendingUp,
  Users,
  BarChart3,
  RefreshCw,
  Download,
  Copy,
  Save,
  Check,
  Clock,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Edit,
  ChevronUp,
  ArrowUp,
  PanelLeftClose,
  PanelLeftOpen,
  Camera,
  Paperclip,
  Image,
  FileVideo,
  Archive,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Tab = "create" | "library" | "settings"
type GenerationStep = "input" | "analysis" | "storyboard" | "video"

// HeyGen API Configuration
// API keys are handled server-side for security
const HEYGEN_BASE_URL = 'https://api.heygen.com'

// Pexels API Configuration
const PEXELS_BASE_URL = 'https://api.pexels.com/videos'

// HeyGen API Functions
const heygenAPI = {
  // Helper function to clean timestamps and technical directions from script
  cleanScriptForSpeech: (script: string): string => {
    // Remove timestamp patterns like [0:00-0:05], [0:05-0:10], etc.
    let cleanScript = script.replace(/\[\d+:\d+-\d+:\d+\]/g, '')
    
    // Remove **Presenter** labels with asterisks
    cleanScript = cleanScript.replace(/\*\*Presenter\*\*/gi, '')
    
    // Remove Presenter labels with timestamps like "Presenter (00:00-00:03):"
    cleanScript = cleanScript.replace(/Presenter\s*\(\d+:\d+-\d+:\d+\)\s*:\s*/gi, '')
    
    // Remove standalone timestamps in parentheses like (00:00-00:03)
    cleanScript = cleanScript.replace(/\(\d+:\d+-\d+:\d+\)\s*:\s*/g, '')
    
    // Remove any remaining **text** patterns (asterisk formatting)
    cleanScript = cleanScript.replace(/\*\*(.*?)\*\*/g, '$1')
    
    // Remove "A-ROLL:" and "B-ROLL:" labels
    cleanScript = cleanScript.replace(/A-ROLL[:\s]*/gi, '')
    cleanScript = cleanScript.replace(/B-ROLL[:\s]*/gi, '')
    
    // Remove stage directions in parentheses
    cleanScript = cleanScript.replace(/\([^)]*\)/g, '')
    
    // Remove extra whitespace and line breaks
    cleanScript = cleanScript.replace(/\n\s*\n/g, '\n').trim()
    
    // Split by lines and keep only the actual spoken content
    const lines = cleanScript.split('\n')
    const spokenLines = lines.filter(line => {
      const trimmed = line.trim()
      // Skip empty lines, stage directions, and technical notes
      return trimmed && 
             !trimmed.startsWith('(') && 
             !trimmed.startsWith('[') &&
             !trimmed.toLowerCase().includes('b-roll') &&
             !trimmed.toLowerCase().includes('a-roll') &&
             !trimmed.toLowerCase().includes('medium shot') &&
             !trimmed.toLowerCase().includes('close-up') &&
             !trimmed.toLowerCase().includes('wide shot') &&
             !trimmed.toLowerCase().startsWith('presenter')
    })
    
    return spokenLines.join(' ').replace(/\s+/g, ' ').trim()
  },

  // Test API key validity via server-side route
  async testApiKey() {
    try {
      const response = await fetch('/api/heygen/test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`API test failed with status ${response.status}`)
      }
      
      const data = await response.json()
      return data.success
    } catch (error) {
      console.error('API key test failed:', error)
      return false
    }
  },

  async getAvatars() {
    try {
      const response = await fetch('/api/heygen/avatars', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch avatars')
      }
      
      const data = await response.json()
      return data.avatars || []
    } catch (error) {
      console.error('Error fetching avatars:', error)
      return []
    }
  },

  async getVoices() {
    try {
      const response = await fetch('/api/heygen/voices', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch voices')
      }
      
      const data = await response.json()
      return data.voices || []
    } catch (error) {
      console.error('Error fetching voices:', error)
      return []
    }
  },

  async uploadAsset(file: File) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/heygen/upload-asset', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const data = await response.json()
      return data.asset
    } catch (error) {
      console.error('Error uploading asset:', error)
      throw error
    }
  },

  // Simulated avatar creation process
  async createInstantAvatar(assetId: string, avatarName: string) {
    // In a real implementation, this would trigger HeyGen's avatar creation process
    // For now, we'll simulate the process and provide instructions
    try {
      // This would be the actual API call when available:
      const response = await fetch('/api/heygen/create-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetId,
          avatarName
        })
      })
      
      if (!response.ok) {
        throw new Error('Avatar creation failed')
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error creating instant avatar:', error)
      throw error
    }
  },

  async generateVideo(avatarId: string, voiceId: string, script: string, brollFootage: any[] = []) {
    try {
      const cleanScript = this.cleanScriptForSpeech(script)
      console.log('Cleaned script for video generation:', cleanScript)
      
      // Use server-side API route for video generation
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatarId,
          voiceId,
          script: cleanScript,
          brollFootage
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Video generation API Error:', errorText)
        throw new Error(`Video generation failed: ${response.status} - ${errorText}`)
      }
      
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      return data.video_id
    } catch (error) {
      console.error('Error generating video:', error)
      throw error
    }
  },

  async getVideoStatus(videoId: string) {
    try {
      const response = await fetch(`/api/heygen/video-status?videoId=${videoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to get video status')
      }
      
      const data = await response.json()
      return data.status
    } catch (error) {
      console.error('Error checking video status:', error)
      throw error
    }
  },

  // Parse script into A-roll and B-roll segments with timestamps
  parseScriptSegments(script: string, brollFootage: any[] = []) {
    const lines = script.split('\n').filter(line => line.trim())
    const segments = []
    
    for (const line of lines) {
      // Extract timestamp [0:00-0:05]
      const timeMatch = line.match(/\[(\d+):(\d+)-(\d+):(\d+)\]/)
      if (!timeMatch) continue
      
      const startMinutes = parseInt(timeMatch[1])
      const startSeconds = parseInt(timeMatch[2]) 
      const endMinutes = parseInt(timeMatch[3])
      const endSeconds = parseInt(timeMatch[4])
      
      const startTime = startMinutes * 60 + startSeconds
      const endTime = endMinutes * 60 + endSeconds
      const duration = endTime - startTime
      
      // Remove timestamp and determine type
      let content = line.replace(/\[\d+:\d+-\d+:\d+\]/, '').trim()
      let type = 'A-ROLL'
      let text = content
      
      if (content.toLowerCase().includes('a-roll')) {
        type = 'A-ROLL'
        text = content.replace(/A-ROLL[:\s]*/gi, '').trim()
      } else if (content.toLowerCase().includes('b-roll')) {
        type = 'B-ROLL'
        text = content.replace(/B-ROLL[:\s]*/gi, '').trim()
        
        // Find matching B-roll footage for this segment
        const matchingFootage = brollFootage.find(footage => 
          footage.timeRange === `${timeMatch[1]}:${timeMatch[2]}-${timeMatch[3]}:${timeMatch[4]}`
        )
        
        segments.push({
          type,
          startTime,
          endTime,
          duration,
          text: '', // No voice over B-roll footage
          originalText: text,
          brollVideo: matchingFootage,
          timeRange: `${timeMatch[1]}:${timeMatch[2]}-${timeMatch[3]}:${timeMatch[4]}`
        })
        continue
      }
      
      // Only add A-roll segments with actual speech
      if (type === 'A-ROLL' && text.trim()) {
        segments.push({
          type,
          startTime,
          endTime, 
          duration,
          text: text.trim(),
          timeRange: `${timeMatch[1]}:${timeMatch[2]}-${timeMatch[3]}:${timeMatch[4]}`
        })
      }
    }
    
    return segments.sort((a, b) => a.startTime - b.startTime)
  }
}

// Pexels API Functions
const pexelsAPI = {
  async searchVideos(query: string, perPage: number = 5) {
    try {
      const response = await fetch('/api/pexels/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          perPage,
          orientation: 'landscape'
        })
      })
      
      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`)
      }
      
      const data = await response.json()
      return data.videos || []
    } catch (error) {
      console.error('Error fetching Pexels videos:', error)
      return []
    }
  },

  // Extract keywords from B-roll script for video search
  extractBrollKeywords(brollScript: string): Array<{keyword: string, timeRange: string, description: string}> {
    const lines = brollScript.split('\n').filter(line => line.trim())
    const keywords = []
    
    for (const line of lines) {
      // Extract timestamp pattern [0:00-0:05]
      const timeMatch = line.match(/\[(\d+):(\d+)-(\d+):(\d+)\]/)
      const timeRange = timeMatch ? timeMatch[1] : ''
      
      // Skip A-ROLL lines, focus on B-ROLL
      if (line.toLowerCase().includes('b-roll')) {
        let description = line.replace(/\[\d+:\d+-\d+:\d+\]/g, '').replace(/B-ROLL[:\s]*/gi, '').trim()
        
        // Extract key search terms from description
        const searchTerms = []
        
        // Technology related terms
        if (description.toLowerCase().includes('code') || description.toLowerCase().includes('coding')) {
          searchTerms.push('programming code computer')
        }
        if (description.toLowerCase().includes('laptop') || description.toLowerCase().includes('computer')) {
          searchTerms.push('laptop computer typing')
        }
        if (description.toLowerCase().includes('office') || description.toLowerCase().includes('workspace')) {
          searchTerms.push('modern office workspace')
        }
        if (description.toLowerCase().includes('hackathon') || description.toLowerCase().includes('conference')) {
          searchTerms.push('tech conference presentation')
        }
        if (description.toLowerCase().includes('startup') || description.toLowerCase().includes('business')) {
          searchTerms.push('startup business meeting')
        }
        if (description.toLowerCase().includes('social media') || description.toLowerCase().includes('phone')) {
          searchTerms.push('social media smartphone')
        }
        if (description.toLowerCase().includes('city') || description.toLowerCase().includes('urban')) {
          searchTerms.push('city skyline urban')
        }
        if (description.toLowerCase().includes('coffee') || description.toLowerCase().includes('cafe')) {
          searchTerms.push('coffee cafe working')
        }
        
        // If no specific terms found, use generic tech terms
        if (searchTerms.length === 0) {
          searchTerms.push('technology business modern')
        }
        
        keywords.push({
          keyword: searchTerms[0] || 'technology',
          timeRange,
          description
        })
      }
    }
    
    return keywords
  },

  // Get B-roll footage for the entire script
  async getBrollFootage(brollScript: string) {
    const keywords = this.extractBrollKeywords(brollScript)
    const brollFootage = []
    
    console.log('Extracted B-roll keywords:', keywords)
    
    for (const item of keywords) {
      try {
        const videos = await this.searchVideos(item.keyword, 3)
        if (videos.length > 0) {
          // Get the best quality video (prefer HD)
          const bestVideo = videos.find((v: any) => v.video_files.some((f: any) => f.quality === 'hd')) || videos[0]
          const hdFile = bestVideo.video_files.find((f: any) => f.quality === 'hd') || bestVideo.video_files[0]
          
          brollFootage.push({
            timeRange: item.timeRange,
            description: item.description,
            keyword: item.keyword,
            videoUrl: hdFile.link,
            thumbnail: bestVideo.image,
            duration: bestVideo.duration || 10
          })
        }
      } catch (error) {
        console.error(`Error fetching B-roll for "${item.keyword}":`, error)
      }
    }
    
    return brollFootage
  }
}


// Video Post-Processing API for combining avatar + B-roll
const videoProcessingAPI = {
  // Parse script timestamps into timeline segments
  parseTimeline(script: string) {
    const lines = script.split('\n').filter(line => line.trim())
    const timeline = []
    
    for (const line of lines) {
      const timeMatch = line.match(/\[(\d+):(\d+)-(\d+):(\d+)\]/)
      if (!timeMatch) continue
      
      const startMinutes = parseInt(timeMatch[1])
      const startSeconds = parseInt(timeMatch[2])
      const endMinutes = parseInt(timeMatch[3])
      const endSeconds = parseInt(timeMatch[4])
      
      const startTime = startMinutes * 60 + startSeconds
      const endTime = endMinutes * 60 + endSeconds
      const duration = endTime - startTime
      
      let content = line.replace(/\[\d+:\d+-\d+:\d+\]/, '').trim()
      let type = 'A-ROLL'
      
      if (content.toLowerCase().includes('a-roll')) {
        type = 'A-ROLL'
        content = content.replace(/A-ROLL[:\s]*/gi, '').trim()
      } else if (content.toLowerCase().includes('b-roll')) {
        type = 'B-ROLL'
        content = content.replace(/B-ROLL[:\s]*/gi, '').trim()
      }
      
      timeline.push({
        type,
        startTime,
        endTime,
        duration,
        content,
        timeRange: `${timeMatch[1]}:${timeMatch[2]}-${timeMatch[3]}:${timeMatch[4]}`
      })
    }
    
    return timeline.sort((a, b) => a.startTime - b.startTime)
  },

  // Create video composition instructions
  createCompositionPlan(timeline: any[], brollFootage: any[], avatarVideoUrl: string) {
    const composition = []
    
    for (const segment of timeline) {
      if (segment.type === 'A-ROLL') {
        // Avatar segment
        composition.push({
          type: 'avatar',
          source: avatarVideoUrl,
          startTime: segment.startTime,
          duration: segment.duration,
          trim: {
            start: segment.startTime,
            end: segment.endTime
          }
        })
      } else if (segment.type === 'B-ROLL') {
        // Find matching B-roll footage
        const matchingFootage = brollFootage.find(footage => 
          footage.timeRange === segment.timeRange
        )
        
        if (matchingFootage) {
          composition.push({
            type: 'broll',
            source: matchingFootage.videoUrl,
            startTime: segment.startTime,
            duration: segment.duration,
            description: matchingFootage.description
          })
        } else {
          // Fallback to avatar if no B-roll found
          composition.push({
            type: 'avatar',
            source: avatarVideoUrl,
            startTime: segment.startTime,
            duration: segment.duration,
            trim: {
              start: segment.startTime,
              end: segment.endTime
            }
          })
        }
      }
    }
    
    return composition
  },

  // Simulate video composition (in a real implementation, this would use FFmpeg or similar)
  async composeVideo(composition: any[], totalDuration: number, progressCallback?: (progress: number, stage: string) => void) {
    console.log('🎬 Starting video composition...')
    console.log('Composition plan:', composition)
    
    // Simulate video processing time
    const processingSteps = [
      'Downloading B-roll footage...',
      'Extracting avatar segments...',
      'Synchronizing audio tracks...',
      'Compositing video layers...',
      'Rendering final video...',
      'Optimizing for mobile...'
    ]
    
    for (let i = 0; i < processingSteps.length; i++) {
      const stage = processingSteps[i]
      console.log(`📹 ${stage}`)
      
      // Update progress callback if provided
      const progress = ((i + 1) / processingSteps.length) * 100
      if (progressCallback) {
        progressCallback(Math.round(progress), stage)
      }
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
    
    // In a real implementation, this would return the actual composed video URL
    // For demo purposes, we'll return a simulated result
    const composedVideoUrl = `/composed_video_${Date.now()}.mp4`
    
    console.log('✅ Video composition complete!')
    console.log('Composed video URL:', composedVideoUrl)
    
    return {
      videoUrl: composedVideoUrl,
      duration: totalDuration,
      composition: composition,
      segments: composition.length
    }
  },

  // Main function to process avatar video with B-roll
  async processVideoWithBroll(avatarVideoUrl: string, script: string, brollFootage: any[], progressCallback?: (progress: number, stage: string) => void) {
    try {
      console.log('🚀 Starting post-processing integration...')
      
      // Step 1: Parse the script timeline
      const timeline = this.parseTimeline(script)
      console.log('📋 Parsed timeline:', timeline)
      
      // Step 2: Create composition plan
      const totalDuration = Math.max(...timeline.map(t => t.endTime))
      const composition = this.createCompositionPlan(timeline, brollFootage, avatarVideoUrl)
      console.log('🎯 Composition plan created:', composition)
      
      // Step 3: Compose the final video
      const result = await this.composeVideo(composition, totalDuration, progressCallback)
      
      return result
    } catch (error) {
      console.error('❌ Video processing failed:', error)
      throw error
    }
  }
}


interface DynamicAnalysis {
  [key: string]: any
}

interface ContentItem {
  id: number
  title: string
  thumbnail: string
  createdAt: string
  type: string
  script: string
  videoUrl?: string
  analysis?: DynamicAnalysis
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("create")
  const [contentInput, setContentInput] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false)
  const [isGeneratingScripts, setIsGeneratingScripts] = useState(false)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentStep, setCurrentStep] = useState<GenerationStep>("input")
  const [aRollScript, setARollScript] = useState("")
  const [bRollScript, setBRollScript] = useState("")
  const [generationPhase, setGenerationPhase] = useState("")
  const [generationProgress, setGenerationProgress] = useState(0)
  const [visitedSteps, setVisitedSteps] = useState<Set<GenerationStep>>(new Set(["input"]))
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: "", description: "" })
  // showToast state replaced with toastState for better management
  const [contentLibrary, setContentLibrary] = useState<Array<{
    id: number;
    title: string;
    thumbnail: string;
    createdAt: string;
    type: string;
    script: string;
  }>>([])
  const [dynamicAnalysis, setDynamicAnalysis] = useState<DynamicAnalysis | null>(null)
  // const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [heygenavatarId, setHeygenAvatarId] = useState<string>("")
  const [showSocialsModal, setShowSocialsModal] = useState(false)
  const [socialUrls, setSocialUrls] = useState({
    youtube: "",
    linkedin: ""
  })
  const [personalData, setPersonalData] = useState<any>(null)
  const [isScrapingSocials, setIsScrapingSocials] = useState(false)

  // Platform and Content Type Selection
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedContentType, setSelectedContentType] = useState<'video' | 'caption' | 'both'>('video')
  const [showPlatformSelection, setShowPlatformSelection] = useState(false)

  // File attachment state
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(false)

  // HeyGen API state
  const [availableAvatars, setAvailableAvatars] = useState<any[]>([])
  const [availableVoices, setAvailableVoices] = useState<any[]>([])
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('')
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('')
  const [currentVideoId, setCurrentVideoId] = useState<string>('')
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string>('')

  // Video upload state
  const [uploadedVideo, setUploadedVideo] = useState<{
    file: File | null;
    assetId: string | null;
    url: string | null;
    uploading: boolean;
  }>({
    file: null,
    assetId: null,
    url: null,
    uploading: false
  })

  // User's custom avatar ID (created from uploaded video)
  const [customAvatarId, setCustomAvatarId] = useState<string>('')

  // Track if user has uploaded a video for avatar creation
  const [hasUploadedVideo, setHasUploadedVideo] = useState<boolean>(false)

  // Avatar creation state
  const [avatarCreation, setAvatarCreation] = useState<{
    isProcessing: boolean;
    progress: number;
    phase: string;
    creationId: string | null;
    estimatedTime: string;
  }>({
    isProcessing: false,
    progress: 0,
    phase: '',
    creationId: null,
    estimatedTime: ''
  })

  // Auto-refresh avatars when creation is in progress
  const [avatarRefreshInterval, setAvatarRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  // API connection status
  const [apiStatus, setApiStatus] = useState<{
    connected: boolean;
    testing: boolean;
    error: string | null;
  }>({
    connected: false,
    testing: true,
    error: null
  })

  // Toast state management
  const [toastState, setToastState] = useState<{
    show: boolean;
    type: 'avatar_created' | 'video_uploaded' | 'library_added';
    hasShownAvatarCreated: boolean;
  }>({
    show: false,
    type: 'library_added',
    hasShownAvatarCreated: false
  })

  // B-roll footage state
  const [brollFootage, setBrollFootage] = useState<Array<{
    timeRange: string;
    description: string;
    keyword: string;
    videoUrl: string;
    thumbnail: string;
    duration: number;
  }>>([])
  const [loadingBroll, setLoadingBroll] = useState(false)

  // Video processing state
  const [videoProcessing, setVideoProcessing] = useState({
    isProcessing: false,
    stage: '',
    progress: 0,
    composedVideoUrl: ''
  })

  // Video generation modal state
  const [showGenerationModal, setShowGenerationModal] = useState(false)
  const [generationStages, setGenerationStages] = useState([
    { name: 'Initializing generation...', completed: false, active: false },
    { name: 'Loading avatar...', completed: false, active: false },
    { name: 'Processing script...', completed: false, active: false },
    { name: 'Generating voice...', completed: false, active: false },
    { name: 'Creating video...', completed: false, active: false },
    { name: 'Adding captions...', completed: false, active: false },
    { name: 'Finalizing...', completed: false, active: false }
  ])

  // Load avatars and voices on component mount
  useEffect(() => {
    const loadHeyGenData = async () => {
      setApiStatus(prev => ({ ...prev, testing: true, error: null }))
      
      try {
        // First test the API key
        const isValidKey = await heygenAPI.testApiKey()
        if (!isValidKey) {
          setApiStatus({
            connected: false,
            testing: false,
            error: 'Invalid API key'
          })
          console.error('Invalid HeyGen API key')
          return
        }

        const [avatars, voices] = await Promise.all([
          heygenAPI.getAvatars(),
          heygenAPI.getVoices()
        ])
        
        setAvailableAvatars(avatars)
        setAvailableVoices(voices)
        
        // Auto-select Kevin's custom avatar and voice if available, otherwise fallback to instant avatars
        const kevinAvatar = avatars.find((a: any) => 
          a.avatar_name?.toLowerCase().includes('kevin') || 
          (a.avatar_name?.toLowerCase().includes('instant') && customAvatarId && a.avatar_id === customAvatarId)
        )
        const instantAvatar = avatars.find((a: any) => a.avatar_name?.includes('Instant') || a.avatar_name?.includes('My'))
        
        if (kevinAvatar) {
          setSelectedAvatarId(kevinAvatar.avatar_id)
          // Only set as custom avatar if user has uploaded a video
          if (hasUploadedVideo) {
            setCustomAvatarId(kevinAvatar.avatar_id)
          }
        } else if (instantAvatar) {
          setSelectedAvatarId(instantAvatar.avatar_id)
          // Only set as custom avatar if user has uploaded a video
          if (hasUploadedVideo) {
            setCustomAvatarId(instantAvatar.avatar_id)
          }
        } else if (avatars.length > 0) {
          setSelectedAvatarId(avatars[0].avatar_id)
        }
        
        if (voices.length > 0) {
          // Prefer Kevin's voice, then English voices
          const kevinVoice = voices.find((v: any) => v.name?.toLowerCase().includes('kevin'))
          const englishVoice = voices.find((v: any) => v.language === 'English')
          setSelectedVoiceId(kevinVoice?.voice_id || englishVoice?.voice_id || voices[0].voice_id)
        }

        setApiStatus({
          connected: true,
          testing: false,
          error: null
        })
      } catch (error) {
        console.error('Error loading HeyGen data:', error)
        let errorMessage = 'Connection failed'
        
        if (error instanceof Error) {
          if (error.message.includes('Unauthorized')) {
            errorMessage = 'Invalid API key'
          } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage = 'Network error'
          } else {
            errorMessage = error.message
          }
        }
        
        setApiStatus({
          connected: false,
          testing: false,
          error: errorMessage
        })
      }
    }
    
    loadHeyGenData()
  }, [])


  // Handle video events
  useEffect(() => {
    if (currentStep === 'video') {
      const video = document.getElementById('phone-video') as HTMLVideoElement;
      const overlay = document.getElementById('video-overlay');
      const endedOverlay = document.getElementById('video-ended');

      if (video && overlay && endedOverlay) {
        const handleVideoLoaded = () => {
          // Set video to first frame for preview
          video.currentTime = 0.5;
          console.log('Video loaded, showing preview frame');
        };

        const handleVideoCanPlay = () => {
          // Ensure video is ready and show first frame
          if (video.paused) {
            video.currentTime = 0.5;
          }
        };

        const handleVideoError = (e: Event) => {
          console.error('Video loading error:', e);
        };

        const handleVideoEnded = () => {
          overlay.style.opacity = '1';
          overlay.style.pointerEvents = 'auto';
          endedOverlay.style.opacity = '1';
          endedOverlay.style.pointerEvents = 'auto';
        };

        const handleVideoPlay = () => {
          overlay.style.opacity = '0';
          overlay.style.pointerEvents = 'none';
          endedOverlay.style.opacity = '0';
          endedOverlay.style.pointerEvents = 'none';
        };

        const handleVideoPause = () => {
          overlay.style.opacity = '1';
          overlay.style.pointerEvents = 'auto';
        };

        // Add event listeners
        video.addEventListener('loadedmetadata', handleVideoLoaded);
        video.addEventListener('canplay', handleVideoCanPlay);
        video.addEventListener('error', handleVideoError);
        video.addEventListener('ended', handleVideoEnded);
        video.addEventListener('play', handleVideoPlay);
        video.addEventListener('pause', handleVideoPause);

        // Force load the video
        video.load();

        return () => {
          video.removeEventListener('loadedmetadata', handleVideoLoaded);
          video.removeEventListener('canplay', handleVideoCanPlay);
          video.removeEventListener('error', handleVideoError);
          video.removeEventListener('ended', handleVideoEnded);
          video.removeEventListener('play', handleVideoPlay);
          video.removeEventListener('pause', handleVideoPause);
        };
      }

      // Initialize B-roll demo if we have footage
      if (brollFootage.length === 0 && bRollScript.includes('B-ROLL')) {
        console.log('🎬 Initializing B-roll demo for video preview...')
        loadBrollFootage(bRollScript)
      }
    }
  }, [currentStep, brollFootage.length, bRollScript]);

  const phases = [
    { name: "Initializing HeyGen AI...", duration: 2000 },
    { name: "Processing Avatar and Voice...", duration: 4000 },
    { name: "Generating Speech Synthesis...", duration: 3500 },
    { name: "Creating Visual Elements...", duration: 4500 },
    { name: "Rendering Final Video...", duration: 5000 },
    { name: "Finalizing Output...", duration: 2000 },
  ]

  const handleGenerate = async () => {
    if (!contentInput.trim()) return

    // First show platform selection
    setShowPlatformSelection(true)
  }

  const handlePlatformSelectionContinue = async () => {
    if (selectedPlatforms.length === 0) {
      setToastMessage({
        title: "Select Platforms",
        description: "Please select at least one platform to continue."
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    setShowPlatformSelection(false)
    setIsGenerating(true)
    setIsGeneratingAnalysis(true)
    setApiError(null)
    setCurrentStep("analysis")
    setVisitedSteps((prev) => new Set([...prev, "analysis"]))

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          idea: contentInput,
          linkedinUrl: socialUrls.linkedin,
          youtubeUrl: socialUrls.youtube,
          platforms: selectedPlatforms,
          contentType: selectedContentType,
          attachedFiles: attachedFiles.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size
          }))
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate content")
      }
      
      const data = await response.json()
      
      // Set the generated data
      setARollScript(data.aRollScript)
      setBRollScript(data.bRollScript)
      setDynamicAnalysis(data.marketAnalysis)
      setPersonalData(data.personalizedContent?.profileSummary ? JSON.parse(data.personalizedContent.profileSummary) : null)
      
      setToastMessage({ 
        title: data.personalizedContent?.isPersonalized ? "Personalized Content Generated!" : "Content Generated!", 
        description: data.personalizedContent?.isPersonalized 
          ? "Your content has been personalized using LangChain AI agents!" 
          : `Your content is ready for your selected platforms.${attachedFiles.length > 0 ? ` Included ${attachedFiles.length} attachment(s).` : ''}`
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      
    } catch (error: any) {
      console.error("Generation error:", error)
      setApiError(error.message)
      
      setToastMessage({ 
        title: "Generation Failed", 
        description: error.message 
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 5000)
    } finally {
      setIsGenerating(false)
      setIsGeneratingAnalysis(false)
    }
  }

  // Load B-roll footage based on script
  const loadBrollFootage = async (brollScript: string) => {
    setLoadingBroll(true)
    try {
      const footage = await pexelsAPI.getBrollFootage(brollScript)
      setBrollFootage(footage)
      console.log('Loaded B-roll footage:', footage)
    } catch (error) {
      console.error('Error loading B-roll footage:', error)
    } finally {
      setLoadingBroll(false)
    }
  }


  const handleGenerateVideo = async () => {
    if (!aRollScript || !selectedAvatarId || !selectedVoiceId) {
      alert('Please ensure you have a script and selected avatar/voice')
      return
    }
    
    // Show the modal and reset stages
    setShowGenerationModal(true)
    setGenerationStages([
      { name: 'Initializing generation...', completed: false, active: true },
      { name: 'Loading avatar...', completed: false, active: false },
      { name: 'Processing script...', completed: false, active: false },
      { name: 'Generating voice...', completed: false, active: false },
      { name: 'Creating video...', completed: false, active: false },
      { name: 'Adding captions...', completed: false, active: false },
      { name: 'Finalizing...', completed: false, active: false }
    ])
    
    setIsGenerating(true)
    setGenerationPhase('Starting video generation...')
    setGenerationProgress(10)
    
    // Helper function to update stages
    const updateStage = (stageIndex: number, completed: boolean = false, active: boolean = true) => {
      setGenerationStages(prev => prev.map((stage, index) => ({
        ...stage,
        completed: index < stageIndex ? true : (index === stageIndex ? completed : false),
        active: index === stageIndex ? active : false
      })))
    }
    
    try {
      // Stage 1: Initializing (already active)
      await new Promise(resolve => setTimeout(resolve, 1500))
      updateStage(0, true, false)
      
      // Stage 2: Loading avatar
      updateStage(1, false, true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateStage(1, true, false)
      
      // Stage 3: Processing script
      updateStage(2, false, true)
      await new Promise(resolve => setTimeout(resolve, 800))
      updateStage(2, true, false)
      
      // Stage 4: Generating voice
      updateStage(3, false, true)
      
      // Step 1: Generate avatar video using HeyGen API
      const videoId = await heygenAPI.generateVideo(
        selectedAvatarId,
        selectedVoiceId,
        aRollScript,
        brollFootage
      )
      
      setCurrentVideoId(videoId)
      updateStage(3, true, false)
      
      // Stage 5: Creating video
      updateStage(4, false, true)
      setGenerationPhase('HeyGen avatar video generation in progress...')
      setGenerationProgress(30)
      
      // Step 2: Poll for HeyGen video completion
      const pollVideoStatus = async () => {
        try {
          const status = await heygenAPI.getVideoStatus(videoId)
          
          console.log('HeyGen video status response:', status)
          console.log('Video status:', status.status)
          console.log('Video URL (no captions):', status.video_url)
          console.log('Video URL (with captions):', status.video_url_caption)
          
          if (status.status === 'completed') {
            updateStage(4, true, false)
            
            // Stage 6: Adding captions
            updateStage(5, false, true)
            await new Promise(resolve => setTimeout(resolve, 1500))
            updateStage(5, true, false)
            
            // Stage 7: Finalizing
            updateStage(6, false, true)
            
            // Use the captioned video URL instead of the regular one
            const avatarVideoUrl = status.video_url_caption 
            
            // Validate the video URL
            if (!avatarVideoUrl || !avatarVideoUrl.startsWith('http')) {
              console.error('Invalid video URL received:', avatarVideoUrl)
              throw new Error('Invalid video URL received from HeyGen')
            }
            
            console.log('✅ HeyGen video completed! Using captioned URL:', avatarVideoUrl)
            
            // Use HeyGen video directly (with captions)
            setGeneratedVideoUrl(avatarVideoUrl)
            setGenerationProgress(100)
            setGenerationPhase('HeyGen video with captions ready!')
            
            await new Promise(resolve => setTimeout(resolve, 1000))
            updateStage(6, true, false)
            
            setTimeout(() => {
              setShowGenerationModal(false)
              setCurrentStep('video')
              setVisitedSteps(prev => new Set([...prev, 'video']))
              setIsGenerating(false)
              setGenerationPhase('')
              setGenerationProgress(0)
            }, 1500)
            
          } else if (status.status === 'processing' || status.status === 'pending') {
            console.log(`🔄 Video still processing... Status: ${status.status}`)
            setGenerationProgress(prev => Math.min(prev + 5, 85))
            setTimeout(pollVideoStatus, 5000) // Check again in 5 seconds
          } else if (status.status === 'failed') {
            console.error('❌ HeyGen video generation failed:', status.error)
            throw new Error(status.error?.message || 'Video generation failed')
          } else {
            console.log(`🤔 Unknown status: ${status.status}`)
            setTimeout(pollVideoStatus, 5000) // Continue polling for unknown statuses
          }
        } catch (error) {
          console.error('Error polling video status:', error)
          setShowGenerationModal(false)
          setIsGenerating(false)
          setGenerationPhase('')
          alert(`Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
        }
      }
      
      // Start polling after initial delay
      setTimeout(pollVideoStatus, 3000)
      
    } catch (error) {
      console.error('Error generating video:', error)
      setShowGenerationModal(false)
      setIsGenerating(false)
      setGenerationPhase('')
      alert('Failed to start video generation. Please check your API key and try again.')
    }
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file')
      return
    }

    // Check file size (limit to 500MB)
    if (file.size > 500 * 1024 * 1024) {
      alert('File size must be less than 500MB')
      return
    }

    setUploadedVideo(prev => ({
      ...prev,
      file,
      uploading: true
    }))

    // Reset avatar creation toast flag for new upload
    setToastState(prev => ({
      ...prev,
      hasShownAvatarCreated: false
    }))

    try {
      // Demo Mode: Simulate upload process instead of actual HeyGen upload
      console.log('Demo mode: Simulating video upload...')
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second upload simulation
      
      // Create simulated asset data
      const simulatedAssetData = {
        id: `demo_asset_${Date.now()}`,
        url: URL.createObjectURL(file), // Create local URL for the uploaded file
        filename: file.name,
        size: file.size
      }
      
      setUploadedVideo(prev => ({
        ...prev,
        assetId: simulatedAssetData.id,
        url: simulatedAssetData.url,
        uploading: false
      }))

      // Mark that user has uploaded a video
      setHasUploadedVideo(true)

      // Step 2: Start avatar creation process
      const avatarName = `Kevin_Avatar_${Date.now()}`
      
      setAvatarCreation({
        isProcessing: true,
        progress: 10,
        phase: 'Initiating avatar creation...',
        creationId: null,
        estimatedTime: '30 seconds' // Much faster for demo
      })

      try {
        // Demo Mode: Skip actual HeyGen avatar creation API call
        console.log('Demo mode: Simulating avatar creation...')
        
        // Start the simulated avatar creation monitoring
        startAvatarCreationMonitoring(avatarName)

      } catch (error) {
        console.error('Error starting avatar creation:', error)
        setAvatarCreation(prev => ({
          ...prev,
          isProcessing: false,
          phase: 'Avatar creation failed'
        }))
      }

      // Show success message for upload
      setToastState({
        show: true,
        type: 'video_uploaded',
        hasShownAvatarCreated: false
      })
      setTimeout(() => {
        setToastState(prev => ({ ...prev, show: false }))
      }, 3000)

    } catch (error) {
      console.error('Error in demo upload simulation:', error)
      setUploadedVideo(prev => ({
        ...prev,
        uploading: false
      }))
      
      alert('Demo upload simulation failed. Please try again.')
    }
  }

    // Monitor avatar creation progress
    const startAvatarCreationMonitoring = (avatarName: string) => {
      let progress = 25
      const phases = [
        { name: 'Analyzing your video...', duration: 1500 }, // Faster for demo
        { name: 'Extracting facial features...', duration: 1000 }, // Faster for demo
        { name: 'Training AI model...', duration: 1500 }, // Faster for demo
        { name: 'Generating avatar...', duration: 1000 }, // Faster for demo
        { name: 'Finalizing avatar...', duration: 500 } // Much faster for demo
      ]
  
      let currentPhaseIndex = 0
      
      const updateProgress = () => {
        if (currentPhaseIndex < phases.length) {
          const phase = phases[currentPhaseIndex]
          
          setAvatarCreation(prev => ({
            ...prev,
            progress: Math.min(progress, 95), // Cap at 95% during simulation
            phase: phase.name
          }))
  
          progress += 18 // Faster progress increments
          currentPhaseIndex++
  
          setTimeout(updateProgress, phase.duration)
        } else {
          // Demo: Simulate instant avatar creation success
          setTimeout(() => {
            // Create a simulated Kevin avatar
            const simulatedKevinAvatar = {
              avatar_id: `kevin_demo_${Date.now()}`,
              avatar_name: `Kevin_Avatar_${Date.now()}`,
              gender: 'male',
              preview_image_url: '/placeholder-avatar.jpg',
              preview_video_url: '/HackAI Demo.mp4'
            }
            
            // Add to available avatars
            setAvailableAvatars(prev => [simulatedKevinAvatar, ...prev])
            
            // Set as Kevin's custom avatar
            setCustomAvatarId(simulatedKevinAvatar.avatar_id)
            setSelectedAvatarId(simulatedKevinAvatar.avatar_id)
            
            // Also select Kevin's voice if available
            const kevinVoice = availableVoices.find((v: any) => v.name?.toLowerCase().includes('kevin'))
            if (kevinVoice) {
              setSelectedVoiceId(kevinVoice.voice_id)
            }
            
            setAvatarCreation({
              isProcessing: false,
              progress: 100,
              phase: 'Kevin\'s avatar created successfully!',
              creationId: null,
              estimatedTime: ''
            })
  
            // Show success notification
            setToastState({
              show: true,
              type: 'avatar_created',
              hasShownAvatarCreated: true
            })
            setTimeout(() => {
              setToastState(prev => ({ ...prev, show: false }))
            }, 4000)
            
          }, 1000) // Very short delay for demo
        }
      }
  
      updateProgress()
    }

    useEffect(() => {
      return () => {
        if (avatarRefreshInterval) {
          clearInterval(avatarRefreshInterval)
        }
      }
    }, [avatarRefreshInterval])
  
    const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
      setIsMobileMenuOpen(false)
    }

  const handleRegenerateScripts = async () => {
    if (!contentInput.trim() || !dynamicAnalysis) return

    setIsGeneratingScripts(true)
    setApiError(null)
    
    try {
      const scriptRes = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          idea: contentInput, 
          analysis: dynamicAnalysis, 
          personalData: personalData,
          regenerate: true 
        }),
      })
      
      if (!scriptRes.ok) {
        const errorData = await scriptRes.json()
        throw new Error(errorData.error || "Failed to regenerate scripts")
      }
      
      const scriptData = await scriptRes.json()
      
      // Validate scripts
      if (!scriptData.aRollScript || !scriptData.bRollScript) {
        throw new Error("Incomplete scripts received during regeneration")
      }
      
      setARollScript(scriptData.aRollScript)
      setBRollScript(scriptData.bRollScript)
      
      setToastMessage({ 
        title: "Scripts Regenerated!", 
        description: scriptData.isPersonalized 
          ? "New personalized A-Roll and B-Roll scripts are ready." 
          : "New A-Roll and B-Roll scripts are ready."
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      
    } catch (error: any) {
      console.error("Script regeneration error:", error)
      setApiError(error.message)
      
      setToastMessage({ 
        title: "Regeneration Failed", 
        description: error.message 
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 5000)
    } finally {
      setIsGeneratingScripts(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)

      // Upload to HeyGen AI and get avatar ID
      try {
        const formData = new FormData()
        formData.append("video", file)

        const uploadRes = await fetch("/api/upload-avatar", {
          method: "POST",
          body: formData,
        })

        if (uploadRes.ok) {
          const { avatarId } = await uploadRes.json()
          setHeygenAvatarId(avatarId)
          setToastMessage({
            title: "Avatar Uploaded!",
            description: `${file.name} has been processed by HeyGen AI.`,
          })
        } else {
          throw new Error("Failed to upload avatar")
        }
      } catch (error) {
        console.error("Avatar upload error:", error)
        setToastMessage({
          title: "Upload Failed",
          description: "Could not upload avatar to HeyGen AI. Using default avatar.",
        })
      }

      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const handleStepChange = (stepId: string) => {
    if (stepId === "storyboard" && selectedContentType !== 'caption' && (!aRollScript || !bRollScript)) {
      setToastMessage({ title: "Missing Scripts", description: "Please generate market analysis and scripts first." })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }
    if (stepId === "storyboard" && selectedContentType === 'caption' && !dynamicAnalysis) {
      setToastMessage({ title: "Missing Analysis", description: "Please generate market analysis first." })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }
    if (stepId === "video" && !generatedVideoUrl) {
      setToastMessage({ title: "Missing Video", description: "Please generate the video first." })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }
    setCurrentStep(stepId as GenerationStep)
    setVisitedSteps((prev) => new Set([...prev, stepId as GenerationStep]))
  }

  const steps = [
    { id: "analysis", title: "Market Analysis", number: 1 },
    { id: "storyboard", title: "Storyboard", number: 2 },
    ...(selectedContentType !== 'caption' ? [{ id: "video", title: "Final Video", number: 3 }] : [])
  ]

  const getStepStatus = (stepId: string) => {
    const stepOrder = ["analysis", "storyboard", "video"]
    const currentIndex = stepOrder.indexOf(currentStep)
    const stepIndex = stepOrder.indexOf(stepId)

    if (stepIndex < currentIndex) return "complete"
    if (stepIndex === currentIndex) return "active"
    return "pending"
  }

  const canNavigateToStep = (stepId: string) => {
    if (!visitedSteps.has(stepId as GenerationStep) || !contentInput.trim()) return false
    if (stepId === "analysis" && !dynamicAnalysis && currentStep !== "input") return false
    if (stepId === "storyboard" && (!aRollScript || !bRollScript) && currentStep !== "analysis") return false
    if (stepId === "video" && !generatedVideoUrl && currentStep !== "storyboard") return false
    // For caption-only content, skip video step validation
    if (stepId === "video" && selectedContentType === 'caption') return false
    return true
  }

  const generateVideoThumbnail = (videoSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      video.crossOrigin = 'anonymous'
      video.src = videoSrc
      
      video.onloadedmetadata = () => {
        // Set canvas to horizontal thumbnail dimensions (16:9 aspect ratio)
        canvas.width = 300
        canvas.height = 180
        
        // Calculate scaling to fit vertical video within horizontal canvas
        const videoAspectRatio = video.videoWidth / video.videoHeight
        const canvasAspectRatio = canvas.width / canvas.height
        
        let drawWidth, drawHeight, offsetX, offsetY
        
        if (videoAspectRatio > canvasAspectRatio) {
          // Video is wider relative to canvas - fit by width
          drawWidth = canvas.width
          drawHeight = canvas.width / videoAspectRatio
          offsetX = 0
          offsetY = (canvas.height - drawHeight) / 2
        } else {
          // Video is taller relative to canvas - fit by height
          drawHeight = canvas.height
          drawWidth = canvas.height * videoAspectRatio
          offsetX = (canvas.width - drawWidth) / 2
          offsetY = 0
        }
        
        // Seek to 1 second into the video for thumbnail
        video.currentTime = 1
      }
      
      video.onseeked = () => {
        if (ctx) {
          // Fill canvas with black background (letterboxing)
          ctx.fillStyle = '#000000'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          // Calculate scaling to fit vertical video within horizontal canvas
          const videoAspectRatio = video.videoWidth / video.videoHeight
          const canvasAspectRatio = canvas.width / canvas.height
          
          let drawWidth, drawHeight, offsetX, offsetY
          
          if (videoAspectRatio > canvasAspectRatio) {
            // Video is wider relative to canvas - fit by width
            drawWidth = canvas.width
            drawHeight = canvas.width / videoAspectRatio
            offsetX = 0
            offsetY = (canvas.height - drawHeight) / 2
          } else {
            // Video is taller relative to canvas - fit by height
            drawHeight = canvas.height
            drawWidth = canvas.height * videoAspectRatio
            offsetX = (canvas.width - drawWidth) / 2
            offsetY = 0
          }
          
          // Draw video frame to canvas with proper scaling and centering
          ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight)
          
          // Convert canvas to data URL
          const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8)
          resolve(thumbnailDataUrl)
        } else {
          reject(new Error('Could not get canvas context'))
        }
      }
      
      video.onerror = () => {
        reject(new Error('Video failed to load'))
      }
    })
  }



  const handleAddToLibrary = async () => {
    try {
      let thumbnail = "/api/placeholder/300/180" // Default fallback
      
      // If we have a generated video URL, try to generate thumbnail from it
      if (generatedVideoUrl) {
        try {
          thumbnail = await generateVideoThumbnail(generatedVideoUrl)
        } catch (error) {
          console.warn('Failed to generate thumbnail from HeyGen video, using fallback:', error)
        }
      }
      
      // Create new content item
      const newContent = {
        id: Date.now(),
        title: contentInput.trim() || "HeyGen AI Video",
        thumbnail: thumbnail,
        createdAt: new Date().toISOString().split('T')[0],
        type: "HeyGen AI Generated",
        script: aRollScript
      }
      
      // Add to library
      setContentLibrary(prev => [newContent, ...prev])
      
      setToastState({
        show: true,
        type: 'library_added',
        hasShownAvatarCreated: false
      })
      // Hide toast and redirect after 2 seconds
      setTimeout(() => {
        setToastState(prev => ({ ...prev, show: false }))
        // Reset to create new content
        handleStepChange('input')
        setContentInput('')
        setARollScript('')
        setBRollScript('')
        setGeneratedVideoUrl('')
        setCurrentVideoId('')
        setVisitedSteps(new Set(['input']))
        setAttachedFiles([]) // Clear attachments
      }, 2000)
    } catch (error) {
      console.error('Failed to add to library:', error)
      alert('Failed to save to library. Please try again.')
    }
  }

  const renderDynamicAnalysis = () => {
    if (isGeneratingAnalysis) {
      return (
        <div className="text-center py-16">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-indigo-600" />
            <p className="text-slate-600 font-medium">Analyzing market trends with AI...</p>
            <p className="text-sm text-slate-500 mt-2">Fetching real-time data from multiple sources</p>
          </div>
        </div>
      )
    }

    // Add loading state for script generation
    if (isGeneratingScripts) {
      return (
        <div className="text-center py-16">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-spin"></div>
              </div>
            </div>
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-emerald-600" />
            <p className="text-slate-600 font-medium">
              {personalData ? 'Generating personalized scripts...' : 'Creating your A-roll and B-roll scripts...'}
            </p>
            <p className="text-sm text-slate-500 mt-2">
              {personalData 
                ? 'Using your social media analysis for personalization' 
                : 'Optimizing content based on market analysis'
              }
            </p>
            
            {/* Progress indicator */}
            <div className="max-w-xs mx-auto mt-6">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Analyzing content...</span>
                <span>60%</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (apiError && currentStep === "analysis") {
      return (
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg bg-red-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-red-900 mb-2">
                {apiError.includes('Script') ? 'Script Generation Failed' : 'Analysis Failed'}
              </h3>
              <p className="text-red-700 text-sm mb-4">{apiError}</p>
              <div className="space-y-2">
                <Button 
                  onClick={handleGenerate} 
                  variant="outline" 
                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {apiError.includes('Script') ? 'Retry Script Generation' : 'Retry Analysis'}
                </Button>
                {apiError.includes('Script') && dynamicAnalysis && (
                  <Button 
                    onClick={() => {
                      setApiError(null)
                      // Allow user to continue to storyboard with empty scripts to manually enter
                      setCurrentStep("storyboard")
                      setVisitedSteps((prev) => new Set([...prev, "storyboard"]))
                    }}
                    variant="ghost" 
                    className="w-full text-slate-600 hover:bg-slate-50"
                  >
                    Continue to Storyboard (Manual Entry)
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
        </div>
      )
    }

    if (!dynamicAnalysis) {
      return (
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg bg-slate-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <p className="text-slate-500 font-medium">Generate market analysis to see insights</p>
          </CardContent>
        </Card>
        </div>
      )
    }

    // Helper function to convert text values to numeric for charts
    const getNumericValue = (value: string) => {
      const lowercaseValue = value?.toLowerCase() || ''
      if (lowercaseValue.includes('high')) return 85
      if (lowercaseValue.includes('medium')) return 60
      if (lowercaseValue.includes('low')) return 30
      if (lowercaseValue.includes('large')) return 80
      if (lowercaseValue.includes('small')) return 40
      if (lowercaseValue.includes('growing')) return 75
      if (lowercaseValue.includes('stable')) return 50
      if (lowercaseValue.includes('declining')) return 25
      return 50
    }

    // Prepare chart data
    const marketMetricsData = dynamicAnalysis.marketSummary ? [
      { name: 'Viral Potential', value: getNumericValue(dynamicAnalysis.marketSummary.viralPotential), color: '#8b5cf6' },
      { name: 'Audience Size', value: getNumericValue(dynamicAnalysis.marketSummary.audienceSize), color: '#10b981' },
      { name: 'Market Trend', value: getNumericValue(dynamicAnalysis.marketSummary.trend), color: '#3b82f6' },
      { name: 'Competition', value: 100 - getNumericValue(dynamicAnalysis.marketSummary.competitionLevel), color: '#f59e0b' }
    ] : []

    const platformData = dynamicAnalysis.audience?.platforms ? 
      dynamicAnalysis.audience.platforms.map((platform: string, index: number) => ({
        name: platform,
        engagement: Math.floor(Math.random() * 40) + 60, // Mock engagement data
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
      })) : []

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <Button
            variant="outline"
            onClick={() => handleStepChange("input")}
            className="absolute top-0 left-0 flex items-center bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">Live Market Data</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Market Analysis
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            AI-powered insights for <span className="font-semibold text-indigo-600">"{contentInput}"</span>
          </p>
        </div>

        {/* Virality Score with Circular Progress */}
        {dynamicAnalysis.marketSummary && (
          <div className="mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-3xl p-8 shadow-xl border border-purple-200">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Virality Potential Score</h2>
                  <p className="text-slate-600">AI-calculated likelihood of viral success</p>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <ResponsiveContainer width={300} height={300}>
                      <RadialBarChart 
                        cx="50%" 
                        cy="50%" 
                        innerRadius="60%" 
                        outerRadius="90%" 
                        data={[{
                          name: 'Virality Score',
                          value: getNumericValue(dynamicAnalysis.marketSummary.viralPotential),
                          fill: '#8b5cf6'
                        }]}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <RadialBar
                          dataKey="value"
                          cornerRadius={10}
                          className="drop-shadow-lg"
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-purple-700">
                          {getNumericValue(dynamicAnalysis.marketSummary.viralPotential)}
                        </div>
                        <div className="text-sm text-slate-600 font-medium">out of 100</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {getNumericValue(dynamicAnalysis.marketSummary.viralPotential) >= 80 ? 'Exceptional' :
                           getNumericValue(dynamicAnalysis.marketSummary.viralPotential) >= 60 ? 'High' :
                           getNumericValue(dynamicAnalysis.marketSummary.viralPotential) >= 40 ? 'Moderate' : 'Low'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comprehensive Market Metrics */}
        {dynamicAnalysis.marketSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-900">
                      {dynamicAnalysis.marketSummary.trend || "Growing"}
                    </p>
                    <p className="text-sm text-blue-700">Market Trend</p>
                  </div>
                </div>
                <Progress 
                  value={getNumericValue(dynamicAnalysis.marketSummary.trend)} 
                  className="h-2"
                />
                <div className="mt-2 text-xs text-blue-600">
                  {getNumericValue(dynamicAnalysis.marketSummary.trend)}% growth trajectory
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-emerald-600" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-900">
                      {dynamicAnalysis.marketSummary.audienceSize || "Large"}
                    </p>
                    <p className="text-sm text-emerald-700">Audience Size</p>
                  </div>
                </div>
                <Progress 
                  value={getNumericValue(dynamicAnalysis.marketSummary.audienceSize)} 
                  className="h-2"
                />
                <div className="mt-2 text-xs text-emerald-600">
                  {(getNumericValue(dynamicAnalysis.marketSummary.audienceSize) * 1.2).toFixed(1)}M potential reach
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-900">
                      {dynamicAnalysis.marketSummary.competitionLevel || "Medium"}
                    </p>
                    <p className="text-sm text-orange-700">Competition</p>
                  </div>
                </div>
                <Progress 
                  value={getNumericValue(dynamicAnalysis.marketSummary.competitionLevel)} 
                  className="h-2"
                />
                <div className="mt-2 text-xs text-orange-600">
                  {getNumericValue(dynamicAnalysis.marketSummary.competitionLevel)}% market saturation
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-rose-50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-pink-600" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-pink-900">
                      {dynamicAnalysis.timing?.optimal || "Now"}
                    </p>
                    <p className="text-sm text-pink-700">Best Timing</p>
                  </div>
                </div>
                <Progress 
                  value={75} 
                  className="h-2"
                />
                <div className="mt-2 text-xs text-pink-600">
                  Prime posting window
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Platform Performance */}
          {platformData.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900">
                  <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                  Platform Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Market Insights */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-900">
                <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dynamicAnalysis.insights?.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <p className="text-sm text-slate-700 leading-relaxed">{insight}</p>
                  </div>
                )) || [
                  "Peak engagement window: 7-9 PM",
                  "Visual content performs 3x better",
                  "Trending hashtags identified",
                  "Cross-platform potential detected"
                ].map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <p className="text-sm text-slate-700 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Opportunity Matrix */}
        {dynamicAnalysis.marketSummary && (
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-900">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Market Opportunity Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">
                    {(getNumericValue(dynamicAnalysis.marketSummary.audienceSize) * 0.85).toFixed(0)}%
                  </div>
                  <div className="text-sm text-blue-600 mt-1">Engagement Rate</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    {(getNumericValue(dynamicAnalysis.marketSummary.viralPotential) * 1.1).toFixed(0)}K
                  </div>
                  <div className="text-sm text-green-600 mt-1">Est. Views</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700">
                    ${(getNumericValue(dynamicAnalysis.marketSummary.trend) * 12).toFixed(0)}
                  </div>
                  <div className="text-sm text-orange-600 mt-1">Value Score</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">
                    {Math.floor(100 - getNumericValue(dynamicAnalysis.marketSummary.competitionLevel))}%
                  </div>
                  <div className="text-sm text-purple-600 mt-1">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-center items-center pt-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleGenerate}
              disabled={isGeneratingScripts || isGeneratingAnalysis}
              className="flex items-center bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Analysis
          </Button>
          <Button
            onClick={() => handleStepChange("storyboard")}
              className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center text-white shadow-lg transition-all duration-300 ${
                isGeneratingScripts ? 'cursor-not-allowed opacity-90' : 'hover:scale-105'
              }`}
            disabled={isGeneratingScripts || (selectedContentType !== 'caption' && (!aRollScript || !bRollScript))}
          >
            {isGeneratingScripts ? (
              <>
                  <div className="relative">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse"></div>
                  </div>
                  <span className="animate-pulse">Generating Scripts...</span>
              </>
            ) : (
                <>
                  {(selectedContentType !== 'caption' && aRollScript && bRollScript) || selectedContentType === 'caption' ? (
              <>
                Continue to Storyboard
                <ArrowLeft className="w-4 h-4 ml-2 transform rotate-180" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                      Generate Scripts First
                    </>
                  )}
              </>
            )}
          </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleScrapeData = async () => {
    if (!socialUrls.youtube.trim() && !socialUrls.linkedin.trim()) {
      setToastMessage({ 
        title: "Missing URLs", 
        description: "Please provide at least one social media URL." 
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    setIsScrapingSocials(true)
    try {
      const response = await fetch("/api/scrape-socials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtube: socialUrls.youtube.trim(),
          linkedin: socialUrls.linkedin.trim()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to scrape social data")
      }

      const scrapedData = await response.json()
      setPersonalData(scrapedData)
      setShowSocialsModal(false)
      
      setToastMessage({ 
        title: "Social Data Collected!", 
        description: "Your personal data has been analyzed for content personalization." 
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)

    } catch (error: any) {
      console.error("Scraping error:", error)
      setToastMessage({ 
        title: "Scraping Failed", 
        description: error.message 
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 5000)
    } finally {
      setIsScrapingSocials(false)
    }
  }

  // Set smart defaults when component mounts
  useEffect(() => {
    // Set default platforms if none selected
    if (selectedPlatforms.length === 0) {
      setSelectedPlatforms(['instagram', 'tiktok']) // Default to video platforms
    }
  }, [])

  // File attachment handlers
  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    // Validate file types (images and videos only)
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      return isImage || isVideo
    })

    if (validFiles.length !== files.length) {
      setToastMessage({
        title: "Invalid Files",
        description: "Only images and videos are supported."
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }

    // Check file size limit (50MB per file)
    const oversizedFiles = validFiles.filter(file => file.size > 50 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setToastMessage({
        title: "Files Too Large",
        description: "Each file must be under 50MB."
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    // Add files to attachments (limit to 3 total)
    setAttachedFiles(prev => {
      const newFiles = [...prev, ...validFiles]
      if (newFiles.length > 3) {
        setToastMessage({
          title: "Too Many Files",
          description: "Maximum 3 files allowed."
        })
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
        return prev
      }
      return newFiles
    })

    // Reset input
    event.target.value = ''
  }

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image
    if (file.type.startsWith('video/')) return FileVideo
    return Paperclip
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
            onClick={() => {
              setActiveTab("create")
              setCurrentStep("input")
              setIsMobileMenuOpen(false)
            }}
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

        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => window.location.href = '/analytics'}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? "justify-center px-3" : "space-x-2 px-3"
                } py-1.5 rounded-lg transition-colors text-slate-300 hover:bg-slate-700 hover:text-white`}
                title={isSidebarCollapsed ? "Dashboard" : ""}
              >
                <BarChart3 className="w-4 h-4" />
                {!isSidebarCollapsed && <span className="text-sm">Dashboard</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("create")}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? "justify-center px-3" : "space-x-2 px-3"
                } py-1.5 rounded-lg transition-colors ${
                  activeTab === "create"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
                title={isSidebarCollapsed ? "Create" : ""}
              >
                <Sparkles className="w-4 h-4" />
                {!isSidebarCollapsed && <span className="text-sm">Create</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("library")}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? "justify-center px-3" : "space-x-2 px-3"
                } py-1.5 rounded-lg transition-colors ${
                  activeTab === "library"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
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
            onClick={() => handleTabChange("settings")}
            className={`w-full flex items-center ${
              isSidebarCollapsed ? "justify-center px-3" : "space-x-2 px-3"
            } py-1.5 rounded-lg transition-colors ${
              activeTab === "settings"
                ? "bg-indigo-600 text-white"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
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

      {/* Main Content Area */}
      <div className={`flex-1 min-w-0 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300 h-screen overflow-y-auto`}>
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              setActiveTab("create")
              setCurrentStep("input")
              setIsMobileMenuOpen(false)
            }}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">supernova</span>
          </button>
          <div className="w-10" />
        </div>

        {currentStep !== "input" && (
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const status = getStepStatus(step.id)
                  const canNav = canNavigateToStep(step.id)
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex items-center">
                        <button
                          onClick={() => canNav && handleStepChange(step.id)}
                          disabled={!canNav}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                            status === "complete"
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : status === "active"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200 text-gray-400"
                          } ${canNav ? "cursor-pointer" : "cursor-not-allowed"}`}
                        >
                          {step.number}
                        </button>
                        <div className="ml-3">
                          <button
                            onClick={() => canNav && handleStepChange(step.id)}
                            disabled={!canNav}
                            className={`text-left ${canNav ? "cursor-pointer hover:text-indigo-600" : "cursor-not-allowed"}`}
                          >
                            <p
                              className={`text-sm font-medium transition-colors ${
                                status === "active"
                                  ? "text-indigo-600"
                                  : status === "complete"
                                    ? "text-emerald-600"
                                    : "text-gray-400"
                              }`}
                            >
                              {step.title}
                            </p>
                          </button>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`mx-4 lg:mx-8 h-0.5 w-16 lg:w-24 transition-colors duration-300 ${
                            getStepStatus(steps[index + 1].id) !== "pending" ? "bg-emerald-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 lg:p-8">
          {activeTab === "create" && (
            <div className="max-w-6xl mx-auto relative">
              {/* Add Socials Button - Top Left of Create Page */}
              <div className={`absolute -top-40 z-20 transition-all duration-300 ${
                isSidebarCollapsed ? '-left-32' : '-left-8'
              }`}>
                        <Dialog open={showSocialsModal} onOpenChange={setShowSocialsModal}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                      className="bg-white/95 backdrop-blur-sm border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-all duration-300 hover:scale-105 text-xs shadow-lg"
                            >
                              <Users className="w-3 h-3 mr-1" />
                              {personalData ? "Update Socials" : "Add Socials"}
                              {personalData && (
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full ml-1"></div>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center">
                                <Users className="w-5 h-5 mr-2 text-indigo-600" />
                                Connect Your Social Profiles
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="youtube-url" className="text-sm font-medium text-slate-700">
                                  YouTube Channel URL
                                </Label>
                                <Input
                                  id="youtube-url"
                                  value={socialUrls.youtube}
                                  onChange={(e) => setSocialUrls(prev => ({ ...prev, youtube: e.target.value }))}
                                  placeholder="https://youtube.com/@yourchannel"
                                  className="w-full"
                                />
                                <p className="text-xs text-slate-500">We'll analyze your content style and audience engagement</p>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="linkedin-url" className="text-sm font-medium text-slate-700">
                                  LinkedIn Profile URL
                                </Label>
                                <Input
                                  id="linkedin-url"
                                  value={socialUrls.linkedin}
                                  onChange={(e) => setSocialUrls(prev => ({ ...prev, linkedin: e.target.value }))}
                                  placeholder="https://linkedin.com/in/yourprofile"
                                  className="w-full"
                                />
                                <p className="text-xs text-slate-500">We'll understand your professional background and expertise</p>
                              </div>

                              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                                <div className="flex items-start space-x-3">
                                  <Sparkles className="w-5 h-5 text-indigo-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-indigo-900">Personalized Content</p>
                                    <p className="text-xs text-indigo-700 mt-1">
                                      Your social data helps us create scripts that match your unique voice, style, and expertise.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex space-x-3">
                                <Button
                                  onClick={() => setShowSocialsModal(false)}
                                  variant="outline"
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleScrapeData}
                                  disabled={isScrapingSocials || (!socialUrls.youtube.trim() && !socialUrls.linkedin.trim())}
                                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                >
                                  {isScrapingSocials ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                      Analyzing...
                                    </>
                                  ) : (
                                    <>
                                      <Users className="w-4 h-4 mr-2" />
                                      Analyze Profiles
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

              {currentStep === "input" && (
                <>
                  <div className="relative text-center mb-20 mt-36 max-w-4xl mx-auto">
                    <div className="flex items-center justify-center mb-4 animate-fade-in">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-2 shadow-lg">
                        <Sparkles className="w-4 h-4 text-white" />
                          </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        supernova
                      </span>
                              </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                      Generate{" "}
                      <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                          viral content
                        </span>
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full opacity-60"></div>
                      </span>{" "}
                      in seconds.
                    </h1>
                    <p className="text-base lg:text-lg text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed font-light">
                      Transform any idea into engaging video content using HeyGen AI digital twin.
                    </p>
                              </div>
                  <div className="max-w-2xl mx-auto mb-16 relative">
                    <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-xl">
                      <div className="relative">
                        <Input
                          value={contentInput}
                          onChange={(e) => setContentInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && contentInput.trim() && !isGenerating) {
                              e.preventDefault()
                              handleGenerate()
                            }
                          }}
                          placeholder="Describe your short video content idea..."
                          className="h-16 px-6 pr-20 text-lg border-2 border-slate-200/50 focus:border-indigo-400 focus:ring-0 focus:outline-none rounded-xl bg-white/90 backdrop-blur-sm shadow-md placeholder:text-slate-400"
                          disabled={isGenerating}
                          />
                          
                          {/* File attachment button */}
                          <div className="absolute right-14 top-4">
                            <input
                              type="file"
                              id="file-attachment"
                              multiple
                              accept="image/*,video/*"
                              onChange={handleFileAttachment}
                              className="hidden"
                            />
                            <label
                              htmlFor="file-attachment"
                              className={`h-8 w-8 p-0 ${
                                attachedFiles.length > 0 
                                  ? 'bg-indigo-100 text-indigo-600 border border-indigo-300' 
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800'
                              } rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer flex items-center justify-center relative`}
                              title={attachedFiles.length > 0 ? `${attachedFiles.length} file(s) attached` : 'Attach images or videos'}
                            >
                              <Paperclip className="w-4 h-4" />
                              {attachedFiles.length > 0 && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                  {attachedFiles.length}
                                </div>
                              )}
                            </label>
                          </div>
                          
                          <Button
                          onClick={handleGenerate}
                          disabled={!contentInput.trim() || isGenerating}
                          className="absolute right-3 top-4 h-8 w-8 p-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          {isGeneratingAnalysis ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowUp className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        
                        {/* File attachments preview */}
                        {attachedFiles.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-xs text-slate-600 font-medium">Attached Files ({attachedFiles.length}/3)</p>
                            <div className="flex flex-wrap gap-2">
                              {attachedFiles.map((file, index) => {
                                const FileIcon = getFileIcon(file)
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2 bg-slate-100 rounded-lg px-3 py-2 text-xs"
                                  >
                                    <FileIcon className="w-4 h-4 text-slate-600" />
                                    <span className="text-slate-700 max-w-[100px] truncate">{file.name}</span>
                                    <span className="text-slate-500">({formatFileSize(file.size)})</span>
                                    <button
                                      onClick={() => removeAttachment(index)}
                                      className="text-slate-400 hover:text-red-500 transition-colors ml-1"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                            </div>
                </>
              )}

              {currentStep === "analysis" && renderDynamicAnalysis()}

              {currentStep === "storyboard" && (
                <div className="space-y-8">
                  <div className="text-center mb-12 relative">
                    <Button
                      variant="outline"
                      onClick={() => handleStepChange("analysis")}
                      className="absolute top-0 left-0 flex items-center bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-full mb-4">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-slate-700">Content Ready</span>
                        </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-3">
                      Storyboard
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                      Review and customize your {selectedContentType === 'caption' ? 'caption content' : selectedContentType === 'video' ? 'video scripts' : 'content'} for{' '}
                      <span className="font-semibold text-emerald-600">
                        {selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                      </span>
                    </p>
                  </div>

                  {/* Platform-Specific Content Display */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* A-Roll Script / Main Content */}
                    {(selectedContentType === 'video' || selectedContentType === 'both') && (
                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center text-slate-900">
                            <Video className="w-5 h-5 mr-2 text-blue-600" />
                            A-Roll Script (Presenter)
                        </CardTitle>
                      </CardHeader>
                        <CardContent>
                          <Textarea
                            value={aRollScript}
                            onChange={(e) => setARollScript(e.target.value)}
                            className="min-h-[400px] text-sm font-mono leading-relaxed border-slate-200"
                            placeholder="Your A-roll script will appear here after generation..."
                          />
                          <div className="mt-4 flex justify-between items-center">
                              <Button
                            variant="outline"
                            onClick={handleRegenerateScripts}
                            disabled={isGeneratingScripts}
                              className="text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                              {isGeneratingScripts ? (
                              <>
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  Regenerating...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Regenerate
                              </>
                            )}
                          </Button>
                            <Button variant="ghost" size="sm" className="text-slate-500">
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Platform-Specific Captions */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center text-slate-900">
                          <Edit className="w-5 h-5 mr-2 text-emerald-600" />
                          Platform Captions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedPlatforms.map((platform) => (
                            <div key={platform} className="border rounded-lg p-4 bg-slate-50">
                              <div className="flex items-center space-x-2 mb-3">
                                <div className={`w-6 h-6 rounded bg-gradient-to-br ${
                                  platform === 'instagram' ? 'from-pink-500 to-orange-500' :
                                  platform === 'tiktok' ? 'from-black to-slate-800' :
                                  platform === 'youtube' ? 'from-red-500 to-red-600' :
                                  platform === 'twitter' ? 'from-slate-900 to-slate-700' :
                                  platform === 'linkedin' ? 'from-blue-600 to-blue-700' :
                                  'from-blue-500 to-blue-600'
                                }`}></div>
                                <span className="font-medium text-slate-900 capitalize">{platform}</span>
                                {(['instagram', 'tiktok', 'youtube', 'facebook'].includes(platform) && selectedContentType !== 'caption') && (
                                  <Badge variant="secondary" className="text-xs">Video + Caption</Badge>
                                )}
                                {(!['instagram', 'tiktok', 'youtube', 'facebook'].includes(platform) || selectedContentType === 'caption') && (
                                  <Badge variant="outline" className="text-xs">Caption Only</Badge>
                                )}
                              </div>
                        <Textarea
                                defaultValue={generatePlatformCaption(platform, aRollScript || contentInput)}
                                className="min-h-[120px] text-sm resize-none border-slate-200"
                                placeholder={`Optimized caption for ${platform}...`}
                              />
                            </div>
                          ))}
                          </div>
                      </CardContent>
                    </Card>

                    {/* B-Roll Script (only for video content) */}
                    {(selectedContentType === 'video' || selectedContentType === 'both') && (
                      <Card className="border-0 shadow-lg lg:col-span-2">
                        <CardHeader>
                          <CardTitle className="flex items-center text-slate-900">
                            <Camera className="w-5 h-5 mr-2 text-purple-600" />
                            B-Roll Script (Visual Overlay)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            value={bRollScript}
                            onChange={(e) => setBRollScript(e.target.value)}
                            className="min-h-[200px] text-sm font-mono leading-relaxed border-slate-200"
                            placeholder="Your B-roll script will appear here after generation..."
                          />
                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                              <Button
                                variant="outline"
                                onClick={() => loadBrollFootage(bRollScript)}
                                disabled={loadingBroll || !bRollScript}
                                className="text-purple-600 border-purple-300 hover:bg-purple-50"
                              >
                                {loadingBroll ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Loading Footage...
                                  </>
                                ) : (
                                  <>
                                    <Video className="w-4 h-4 mr-2" />
                                    Preview B-Roll
                                  </>
                                )}
                              </Button>
                              {brollFootage.length > 0 && (
                                <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">
                                  {brollFootage.length} clips ready
                                </Badge>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" className="text-slate-500">
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                          </div>
                      </CardContent>
                    </Card>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center items-center pt-8">
                    <div className="flex items-center space-x-4">
                      {(selectedContentType === 'video' || selectedContentType === 'both') && (
                      <Button
                        onClick={handleGenerateVideo}
                          disabled={isGenerating || !selectedAvatarId || !selectedVoiceId || !aRollScript}
                          className={`bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 flex items-center text-white shadow-lg transition-all duration-300 ${
                            isGenerating ? 'cursor-not-allowed opacity-90' : 'hover:scale-105'
                          }`}
                      >
                        {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              <span className="animate-pulse">Generating Video...</span>
                            </>
                        ) : (
                          <>
                              <Play className="w-4 h-4 mr-2" />
                              Generate Video
                          </>
                        )}
                    </Button>
                      )}
                      
                      {selectedContentType === 'caption' && (
                    <Button
                            onClick={handleAddToLibrary}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 flex items-center text-white shadow-lg transition-all duration-300 hover:scale-105"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save to Library
                          </Button>
                      )}

                      {selectedContentType === 'both' && !generatedVideoUrl && (
                    <Button
                      onClick={handleAddToLibrary}
                          variant="outline"
                          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                          <Save className="w-4 h-4 mr-2" />
                          Save Captions Only
                    </Button>
              )}
            </div>
              </div>
                      </div>
              )}
            </div>
          )}
              </div>

          {activeTab === "library" && (
            <div className="max-w-6xl mx-auto">
              {/* Library Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-2 rounded-full mb-4">
                  <Folder className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-slate-700">Content Library</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-3">
                  Your Content Library
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  All your AI-generated content in one place
                </p>
              </div>

              {/* Content Library Display */}
              {contentLibrary.length === 0 ? (
                // Empty State - Minimalistic and Compact
                <div className="text-center py-16">
                  <div className="max-w-sm mx-auto">
                    {/* Main Empty State Icon */}
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-300">
                      <Folder className="w-10 h-10 text-slate-400" />
                    </div>

                    {/* Witty Message */}
                    <div className="space-y-3 mb-8">
                      <h3 className="text-xl font-bold text-slate-800">
                        Nothing here but potential! 📚
                      </h3>
                      <p className="text-slate-600">
                        Your content library is lonelier than a ChatGPT server during an outage.
                      </p>
                    </div>

                    {/* Call to Action */}
                    <Button
                      onClick={() => handleTabChange("create")}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Content
                    </Button>
                  </div>
                </div>
              ) : (
                // Library Content Display (when content exists)
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-slate-600">
                      {contentLibrary.length} item{contentLibrary.length !== 1 ? 's' : ''} in your library
                    </p>
                    <Button
                      onClick={() => handleTabChange("create")}
                      variant="outline"
                      className="flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contentLibrary.map((item) => (
                      <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-lg flex items-center justify-center overflow-hidden">
                          {item.thumbnail ? (
                            <img 
                              src={item.thumbnail} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <Video className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                              <p className="text-xs text-slate-500">No preview available</p>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{item.title}</h3>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{item.type}</span>
                            <span>{item.createdAt}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-slate-50 to-gray-50 px-4 py-2 rounded-full mb-4">
                  <Settings className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Settings</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-3">
                  Settings
                </h1>
                <p className="text-xl text-slate-600">
                  Configure your content creation preferences
                </p>
              </div>

              {/* Settings Content */}
              <div className="space-y-8">
                {/* HeyGen API Configuration */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-900">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      HeyGen AI Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* API Status */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          apiStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-slate-900">
                            API Status: {apiStatus.connected ? 'Connected' : 'Disconnected'}
                          </p>
                          {apiStatus.error && (
                            <p className="text-sm text-red-600">{apiStatus.error}</p>
                          )}
                        </div>
                      </div>
                      {apiStatus.testing && (
                        <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                      )}
                    </div>

                    {/* Avatar Management */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Your Avatar</h3>
                      
                      {/* Upload Video for Avatar Creation */}
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                        <input
                          type="file"
                          id="avatar-video-upload"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                        <label htmlFor="avatar-video-upload" className="cursor-pointer">
                          <div className="space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto">
                              {uploadedVideo.uploading ? (
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                              ) : (
                                <Upload className="w-8 h-8 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="text-lg font-medium text-slate-900">
                                {uploadedVideo.uploading 
                                  ? 'Uploading video...' 
                                  : uploadedVideo.file 
                                    ? `Uploaded: ${uploadedVideo.file.name}` 
                                    : 'Upload Avatar Video'
                                }
                              </p>
                              <p className="text-sm text-slate-500 mt-1">
                                {uploadedVideo.uploading 
                                  ? 'Please wait while we process your video'
                                  : 'Upload a clear video of yourself (2-5 minutes, good lighting)'
                                }
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>

                      {/* Avatar Creation Status */}
                      {avatarCreation.isProcessing && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                              <Loader2 className="w-4 h-4 text-white animate-spin" />
                            </div>
                            <div>
                              <p className="font-medium text-indigo-900">Creating Your Avatar</p>
                              <p className="text-sm text-indigo-700">{avatarCreation.phase}</p>
                            </div>
                          </div>
                          <div className="w-full bg-indigo-200 rounded-full h-2 mb-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${avatarCreation.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm text-indigo-700">
                            <span>{avatarCreation.progress}% complete</span>
                            <span>Est. {avatarCreation.estimatedTime}</span>
                          </div>
                        </div>
                      )}

                      {/* Available Avatars */}
                      {availableAvatars.length > 0 && (
                        <div className="space-y-3">
                          <p className="font-medium text-slate-900">Available Avatars:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {availableAvatars.slice(0, 4).map((avatar: any) => (
                              <div 
                                key={avatar.avatar_id} 
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                  selectedAvatarId === avatar.avatar_id 
                                    ? 'border-indigo-500 bg-indigo-50' 
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                                onClick={() => setSelectedAvatarId(avatar.avatar_id)}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-slate-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 truncate">
                                      {avatar.avatar_name || `Avatar ${avatar.avatar_id.slice(-4)}`}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {avatar.avatar_id === customAvatarId ? 'Your Custom Avatar' : 'HeyGen Avatar'}
                                    </p>
                                  </div>
                                  {selectedAvatarId === avatar.avatar_id && (
                                    <Check className="w-4 h-4 text-indigo-600" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Voice Selection */}
                    {availableVoices.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">Voice Selection</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                          {availableVoices.slice(0, 8).map((voice: any) => (
                            <div 
                              key={voice.voice_id} 
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedVoiceId === voice.voice_id 
                                  ? 'border-emerald-500 bg-emerald-50' 
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                              onClick={() => setSelectedVoiceId(voice.voice_id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-slate-900">
                                    {voice.name || `Voice ${voice.voice_id.slice(-4)}`}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {voice.language || 'Unknown'} • {voice.gender || 'Unknown'}
                                  </p>
                                </div>
                                {selectedVoiceId === voice.voice_id && (
                                  <Check className="w-4 h-4 text-emerald-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

        {/* Platform Selection Modal */}
        {showPlatformSelection && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto p-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Choose Your Platforms</h3>
                <p className="text-sm text-slate-600">Select where you want to share your content</p>
                  </div>

              {/* Platform Selection */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-slate-900 mb-3">Target Platforms</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'instagram', name: 'Instagram', color: 'from-pink-500 to-orange-500', supportsVideo: true },
                    { id: 'tiktok', name: 'TikTok', color: 'from-black to-slate-800', supportsVideo: true },
                    { id: 'youtube', name: 'YouTube', color: 'from-red-500 to-red-600', supportsVideo: true },
                    { id: 'twitter', name: 'Twitter/X', color: 'from-slate-900 to-slate-700', supportsVideo: false },
                    { id: 'linkedin', name: 'LinkedIn', color: 'from-blue-600 to-blue-700', supportsVideo: false },
                    { id: 'facebook', name: 'Facebook', color: 'from-blue-500 to-blue-600', supportsVideo: true }
                  ].map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => {
                        setSelectedPlatforms(prev => 
                          prev.includes(platform.id) 
                            ? prev.filter(p => p !== platform.id)
                            : [...prev, platform.id]
                        )
                        
                        // Auto-select content type based on platform
                        if (platform.supportsVideo && !selectedPlatforms.some(p => 
                          ['instagram', 'tiktok', 'youtube', 'facebook'].includes(p)
                        )) {
                          setSelectedContentType('video')
                        }
                      }}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                        selectedPlatforms.includes(platform.id)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-br ${platform.color} rounded-md flex items-center justify-center mx-auto mb-2 shadow-md`}>
                        <div className="w-4 h-4 bg-white rounded opacity-90"></div>
                        </div>
                      <p className="text-xs font-medium text-slate-900">{platform.name}</p>
                      {platform.supportsVideo && (
                        <p className="text-xs text-slate-500 mt-1">Video</p>
                      )}
                      {!platform.supportsVideo && (
                        <p className="text-xs text-slate-500 mt-1">Caption</p>
                      )}
                    </button>
                  ))}
                      </div>
                    </div>
                    
              {/* Content Type Selection */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-slate-900 mb-3">Content Type</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'video', name: 'Video', desc: 'AI avatar + captions', icon: Video },
                    { id: 'caption', name: 'Caption', desc: 'Text content only', icon: Edit },
                    { id: 'both', name: 'Both', desc: 'Video + captions', icon: Copy }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedContentType(type.id as 'video' | 'caption' | 'both')}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                        selectedContentType === type.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <type.icon className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                      <p className="text-xs font-medium text-slate-900">{type.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
                    </button>
                  ))}
                            </div>
                          </div>
                          
              {/* Selected Summary */}
              {selectedPlatforms.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 mb-4 border border-indigo-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-900">Ready to Generate</span>
                            </div>
                  <p className="text-xs text-slate-700">
                    Creating <span className="font-medium">{selectedContentType}</span> content for{' '}
                    <span className="font-medium">{selectedPlatforms.length}</span> platform{selectedPlatforms.length > 1 ? 's' : ''}:{' '}
                    {selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                  </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button 
                  onClick={() => setShowPlatformSelection(false)}
                        variant="outline" 
                  className="flex-1 text-sm"
                >
                  Back to Edit
                      </Button>
                      <Button 
                  onClick={handlePlatformSelectionContinue}
                  disabled={selectedPlatforms.length === 0}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-sm"
                >
                  Generate Content
                  <ArrowLeft className="w-4 h-4 ml-2 transform rotate-180" />
                      </Button>
                </div>
          </div>
        </div>
          )}
        </div>
      </div>
  )
}

// Helper function to generate platform-specific captions
const generatePlatformCaption = (platform: string, content: string): string => {
  const baseContent = content || "Amazing content coming your way!"
  
  switch (platform) {
    case 'instagram':
      return `${baseContent}\n\n#trending #viral #content #instagram #reels #fyp #explore #like #follow #share`
    case 'tiktok':
      return `${baseContent}\n\n#fyp #foryou #viral #trending #tiktok #content #creative #amazing #wow #cool`
    case 'youtube':
      return `${baseContent}\n\nDon't forget to LIKE, SUBSCRIBE, and hit the BELL icon for more content like this!\n\n#shorts #youtube #viral #trending #subscribe`
    case 'twitter':
      return `${baseContent}\n\n🧵 Thread below 👇\n\n#trending #viral #content #twitter #thread`
    case 'linkedin':
      return `${baseContent}\n\nWhat are your thoughts on this? Share your insights in the comments below.\n\n#linkedin #professional #insights #networking #business`
    case 'facebook':
      return `${baseContent}\n\nTag someone who needs to see this! 👇\nReact with 👍 if you agree!\n\n#facebook #viral #trending #share #tag`
    default:
      return baseContent
  }
}
