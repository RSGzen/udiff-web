"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

// Import the MASTER data
import allRoadmaps from "@/data/roadmaps.json"

export default function RoadmapPage() {
  const router = useRouter()
  
  // 1. State for selected Role (Default to Backend)
  const [selectedRoleKey, setSelectedRoleKey] = useState("Backend")
  
  // 2. State for collected skills (We use a simple object: { "Backend": ["Git", "Java"], "AI": ["Python"] })
  const [userProgress, setUserProgress] = useState<Record<string, string[]>>({})

  // Load the data for the current view
  // @ts-ignore
  const currentRoadmap = allRoadmaps[selectedRoleKey] || allRoadmaps["Backend"]
  const currentCollected = new Set(userProgress[selectedRoleKey] || [])

  const toggleSkill = (skillName: string) => {
    const newSet = new Set(currentCollected)
    if (newSet.has(skillName)) {
      newSet.delete(skillName)
    } else {
      newSet.add(skillName)
    }
    
    // Save back to main state
    setUserProgress({
      ...userProgress,
      [selectedRoleKey]: Array.from(newSet)
    })
  }

  // Calculate Metrics
  const totalSkills = currentRoadmap.phases.reduce((acc: any, phase: any) => acc + phase.skills.length, 0)
  const totalCollected = currentCollected.size
  const totalPercentage = Math.round((totalCollected / totalSkills) * 100)

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      
      {/* NAVIGATION HEADER */}
      <div className="max-w-3xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button variant="ghost" className="text-slate-400 pl-0 hover:text-white" onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        {/* ROLE SELECTOR */}
        <div className="flex items-center gap-3">
            <span className="text-slate-500 text-sm font-medium">Career Path:</span>
            <Select value={selectedRoleKey} onValueChange={setSelectedRoleKey}>
                <SelectTrigger className="w-[200px] bg-slate-900 border-slate-700 text-white">
                    <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {Object.keys(allRoadmaps).map((key) => (
                        <SelectItem key={key} value={key}>{key}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      {/* ROADMAP HEADER */}
      <div className="max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          {currentRoadmap.role} Roadmap
        </h1>
        <div className="flex items-center gap-4 mb-2">
          {/* Fixed the indicatorColor error here by removing it */}
          <Progress value={totalPercentage} className="h-4 bg-slate-800" />
          <span className="font-bold text-blue-400 min-w-[4rem]">{totalPercentage}%</span>
        </div>
        <p className="text-slate-400">
          {totalCollected} / {totalSkills} skills acquired. Keep pushing!
        </p>
      </div>

      {/* PHASED TIMELINE */}
      <div className="max-w-3xl mx-auto space-y-8 relative pb-20">
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-800 -z-10"></div>

        {currentRoadmap.phases.map((phase: any, index: number) => {
          const phaseCollectedCount = phase.skills.filter((s: string) => currentCollected.has(s)).length
          const isPhaseComplete = phaseCollectedCount === phase.skills.length
          
          // Unlock Logic: Previous phase must be > 50% done
          const previousPhase = index > 0 ? currentRoadmap.phases[index - 1] : null
          const prevCollected = previousPhase 
            ? previousPhase.skills.filter((s: string) => currentCollected.has(s)).length 
            : 0
          const isLocked = index > 0 && (prevCollected / previousPhase.skills.length) < 0.5

          return (
            <Card key={phase.id} className={`bg-slate-900/80 border-slate-800 relative transition-all duration-500 ${isLocked ? 'opacity-50 grayscale' : ''}`}>
              
              <div className={`absolute -left-9 top-6 h-6 w-6 rounded-full border-4 border-slate-950 flex items-center justify-center transition-colors duration-500 ${
                isPhaseComplete ? 'bg-blue-500' : isLocked ? 'bg-slate-700' : 'bg-slate-200'
              }`}>
                 {isPhaseComplete && <span className="text-slate-950 text-xs font-bold">✓</span>}
              </div>

              <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className={`text-xl ${isLocked ? 'text-slate-500' : 'text-white'}`}>
                        {phase.title}
                        </CardTitle>
                        <CardDescription className="text-slate-400 mt-1">
                        {phase.description}
                        </CardDescription>
                    </div>
                    {isLocked && <Badge variant="outline" className="text-slate-500 border-slate-700">Locked</Badge>}
                     {isPhaseComplete && <Badge className="bg-blue-500 hover:bg-blue-600 border-0">Completed</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.skills.map((skill: string) => (
                    <div 
                      key={skill} 
                      className={`flex items-center space-x-3 p-3 rounded-lg border border-slate-800/50 transition-colors duration-200 ${
                        currentCollected.has(skill) ? 'bg-blue-950/30 text-blue-200 border-blue-900' : 'bg-slate-950/50 text-slate-400'
                      } ${isLocked ? 'pointer-events-none' : 'cursor-pointer hover:bg-slate-800'}`}
                      onClick={() => !isLocked && toggleSkill(skill)}
                    >
                      <Checkbox 
                        id={skill} 
                        checked={currentCollected.has(skill)}
                        className="pointer-events-none data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      />
                      <label htmlFor={skill} className="text-sm font-medium leading-none pointer-events-none select-none">
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </main>
  )
}