"use client"

import { useState } from "react"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { SkillChart } from "@/components/dashboard/SkillChart"
import { ContextTreemap } from "@/components/dashboard/ContextTreemap"
import { Sidebar } from "@/components/Sidebar"
import rawData from "@/data/gap_report.json"
import { Briefcase, DollarSign, PieChart, AlertCircle } from "lucide-react"

const data = rawData as any

export default function Home() {
  // 1. GET CATEGORIES
  const categoryNames = Object.keys(data.categories)
    .filter(k => k !== 'Other')
    .sort()

  // 2. STATE MANAGEMENT
  const [selectedCategory, setSelectedCategory] = useState(categoryNames[0])
  const [selectedLevel, setSelectedLevel] = useState("All") // <--- NEW STATE

  // 3. GET DATA LOGIC
  const catDataRoot = data.categories[selectedCategory]
  
  // LOGIC: Try to find the specific level (e.g. "Junior"). 
  // If user selects "Junior" but JSON only has "All" (legacy data), fallback safely.
  let stats = catDataRoot['All'] ? catDataRoot['All'] : catDataRoot // Default
  
  if (catDataRoot[selectedLevel]) {
    stats = catDataRoot[selectedLevel]
  }

  // 4. CALCULATE METRICS
  const jobCount = stats.job_count || 0
  const minSalary = stats.salary?.avg_min || 0
  const maxSalary = stats.salary?.avg_max || 0
  
  // Market share is relative to the TOTAL jobs in this category
  // e.g. "Junior Backend" share of "All Backend"
  const totalCategoryJobs = catDataRoot['All']?.job_count || catDataRoot.job_count || 1
  const marketShare = ((jobCount / totalCategoryJobs) * 100).toFixed(1)

  // 5. EMPTY STATE CHECK
  // If filtering leads to 0 jobs, we should show a message instead of empty charts
  const hasData = jobCount > 0

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      
      <Sidebar 
        categories={categoryNames}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        // Pass the new props
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
      />

      <div className="pl-64 transition-all duration-300">
        
        {/* Header Bar */}
        <div className="border-b border-slate-800 p-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              {selectedCategory} Engineer
              {/* Show a badge for the current level */}
              <span className="text-sm bg-slate-800 text-blue-400 px-3 py-1 rounded-full border border-slate-700">
                {selectedLevel}
              </span>
            </h2>
            <p className="text-slate-400 mt-2">
              Analysis based on {jobCount} active job postings.
            </p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          
          {/* Row 1: Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard 
              title={`${selectedLevel} Openings`} 
              value={jobCount} 
              subtext="Active jobs scraped"
              icon={Briefcase}
            />
            <MetricCard 
              title="Avg. Base Salary" 
              value={`RM ${minSalary.toLocaleString()} - ${maxSalary.toLocaleString()}`} 
              subtext="Monthly Estimate (MYR)"
              icon={DollarSign}
            />
            <MetricCard 
              title="Share of Role" 
              value={`${marketShare}%`} 
              subtext={`of all ${selectedCategory} jobs`}
              icon={PieChart}
            />
          </div>

          {/* CHECK: Do we have data? */}
          {hasData ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <SkillChart data={stats.top_hard_skills || []} />
              <ContextTreemap data={stats.top_technical_context || []} />
            </div>
          ) : (
             <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center text-slate-400 flex flex-col items-center">
                <AlertCircle className="h-12 w-12 text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-white">No Data Found</h3>
                <p className="max-w-sm mt-2">
                  We couldn't find any {selectedLevel} level jobs for this category in the current dataset. 
                  Try switching to "All" or "Mid".
                </p>
             </div>
          )}

        </div>
      </div>
    </main>
  )
}