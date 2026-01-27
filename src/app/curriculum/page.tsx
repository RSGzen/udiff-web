"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react"

// 1. Import your new "Brain" file
import skillClassData from "@/data/skill_class.json"

// Helper: Normalize text (lowercase, remove special chars) for robust matching
const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s]/g, "")

export default function CurriculumCheckPage() {
  const router = useRouter()

  // --- STATE ---
  // Default to first category in your JSON
  const [selectedRole, setSelectedRole] = useState("General Software Engineering") 
  const [inputText, setInputText] = useState("")
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  
  // Analysis Results
  const [foundSkills, setFoundSkills] = useState<string[]>([])
  const [missingSkills, setMissingSkills] = useState<string[]>([])
  const [score, setScore] = useState(0)

  // --- THE NEW LOGIC ---
  const handleAnalyze = () => {
    if (!inputText.trim()) return

    // 1. Get the Dictionary for the selected Role
    // @ts-ignore
    const roleData = skillClassData.categories[selectedRole]
    
    if (!roleData) {
      console.error("No data found for role:", selectedRole)
      return
    }

    // The Keys are our "Target Skills" (e.g., "Python", "NLP")
    const targetSkills = Object.keys(roleData)

    const userTextClean = normalize(inputText)
    const found: string[] = []
    const missing: string[] = []

    // 2. Iterate through each Target Skill
    targetSkills.forEach((skillName) => {
      let isMatch = false
      
      // Check A: Does the exact skill name appear? (e.g. "Python")
      if (userTextClean.includes(normalize(skillName))) {
        isMatch = true
      } 
      
      // Check B: Do any of the Synonyms/Class Names appear? 
      // (e.g. "Intro to Programming", "Applied Machine Learning")
      if (!isMatch) {
        // @ts-ignore
        const synonyms = roleData[skillName] || []
        // Check if ANY synonym exists in the user text
        const foundSynonym = synonyms.find((syn: string) => userTextClean.includes(normalize(syn)))
        if (foundSynonym) isMatch = true
      }

      // 3. Sort into buckets
      if (isMatch) {
        found.push(skillName)
      } else {
        missing.push(skillName)
      }
    })

    // 4. Update UI
    setFoundSkills(found)
    setMissingSkills(missing)
    setScore(Math.round((found.length / targetSkills.length) * 100))
    setIsAnalyzed(true)
  }

  const handleReset = () => {
    setIsAnalyzed(false)
    setInputText("")
    setFoundSkills([])
    setMissingSkills([])
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      
      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-8">
        <Button variant="ghost" className="text-slate-400 pl-0 hover:text-white mb-4" onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Curriculum Gap Analyzer
        </h1>
        <p className="text-slate-400 mt-2">
          Paste your university syllabus, course list, or resume below. 
          We will check if it matches the market demands for 
          <span className="text-blue-400 font-bold"> {selectedRole}</span>.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: INPUT */}
        <div className="md:col-span-2 space-y-6">

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-3 items-start mb-4">
            <AlertCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <span className="font-bold text-blue-400">Beta Feature:</span> This tool uses keyword matching. 
              It might miss course titles that use unique naming conventions. 
              <br/>
              <span className="text-xs text-slate-500 mt-1 block">
                (Tip: For best results, paste your detailed course syllabus, not just the titles.)
              </span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 block">Target Role</label>
              <Select value={selectedRole} onValueChange={(val) => { setSelectedRole(val); setIsAnalyzed(false); }}>
                <SelectTrigger className="bg-slate-950 border-slate-700 text-white w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white max-h-[300px]">
                   {/* Dynamically load categories from the NEW JSON file */}
                   {Object.keys(skillClassData.categories).sort().map(cat => (
                     <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                   ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end w-full sm:w-auto">
              {!isAnalyzed ? (
                <Button onClick={handleAnalyze} className="bg-blue-600 hover:bg-blue-500 w-full sm:w-auto">
                  Run Analysis <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleReset} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 w-full sm:w-auto">
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Text Area */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-slate-200">Your Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Paste course descriptions here... (e.g. 'CS101: Introduction to Object Oriented Programming using Java...')"
                className="min-h-[400px] bg-slate-950 border-slate-800 text-slate-300 font-mono text-sm"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isAnalyzed}
              />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: RESULTS */}
        <div className="md:col-span-1">
          {isAnalyzed ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
              
              {/* Score Card */}
              <Card className="bg-slate-900 border-slate-800 text-center py-6">
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Readiness Score</div>
                <div className={`text-5xl font-bold ${score > 70 ? 'text-green-400' : score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {score}%
                </div>
                <div className="text-xs text-slate-500 mt-2 px-4">
                  Based on matches against top market skills for this role.
                </div>
              </Card>

              {/* Missing Skills (The Gap) */}
              <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-400 flex items-center gap-2 text-lg">
                    <AlertCircle className="h-5 w-5" /> Missing Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.length > 0 ? missingSkills.map(skill => (
                      <Badge key={skill} variant="outline" className="border-red-900 bg-red-950/30 text-red-200 hover:bg-red-900/50">
                        {skill}
                      </Badge>
                    )) : (
                      <span className="text-slate-500 text-sm">None! You are fully covered.</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Found Skills */}
              <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-400 flex items-center gap-2 text-lg">
                    <CheckCircle2 className="h-5 w-5" /> Covered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {foundSkills.length > 0 ? foundSkills.map(skill => (
                      <Badge key={skill} variant="outline" className="border-green-900 bg-green-950/30 text-green-200">
                        {skill}
                      </Badge>
                    )) : (
                      <span className="text-slate-500 text-sm">No matches found. Try pasting more detailed descriptions.</span>
                    )}
                  </div>
                </CardContent>
              </Card>

            </div>
          ) : (
            // Empty State
            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-500">
              <div>
                <AlertCircle className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p className="text-sm">
                  Waiting for input... <br/>
                  Select a role and run the analysis to see your results here.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}