# UDiff: University Diff

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-3.0-38bdf8) ![License](https://img.shields.io/badge/License-MIT-green)

**Bridging the gap between Academic Curricula and Industry Reality.**

UDiff is an intelligent career dashboard designed to help university students transition into founders and engineers. It analyzes live job market data to visualize the "gap" between what universities teach and what companies actually hire for.

## 🚀 Features

### 1. Market Gap Dashboard
- **Real-time Visualization:** Interactive Bar Charts and Treemaps (built with `recharts`) showing the most in-demand hard skills and technical contexts.
- **Smart Filtering:** Segment data by role (Backend, AI, Security) and seniority (Junior, Mid, Senior).
- **Focus Mode:** Interactive "Dim & Focus" UX patterns to highlight key data points without visual clutter.

### 2. Gamified Career Roadmaps
- **Dynamic Progression:** A "Tech Tree" style roadmap for 15+ career paths.
- **Phase-Locking System:** Users must complete "Foundation" skills before unlocking "Advanced" tiers, enforcing structured learning.
- **Persistent Progress:** Local state management tracks user progress across different career paths.

### 3. Curriculum Gap Analyzer (Beta)
- **Client-Side Semantic Search:** A fast, privacy-focused keyword matcher that scans user syllabi against market demands.
- **Semantic Expansion:** Utilizes a pre-computed "Brain" (`skill_class.json`) to map university course titles (e.g., "CS101") to industry skills (e.g., "Python"), enabling robust matching without expensive LLM calls.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Visualization:** Recharts
- **Data:** Custom JSON datasets (Scraped & Synthesized)
- **Deployment:** Vercel

## 📦 Getting Started

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/udiff.git](https://github.com/yourusername/udiff.git)
   cd udiff
