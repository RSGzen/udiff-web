# UDiff: University Diff

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-3.0-38bdf8) ![License](https://img.shields.io/badge/License-MIT-green)

**Bridging the gap between Academic Curricula and Industry Reality.**

UDiff is an intelligent career dashboard designed to help university students transition into founders and engineers. It analyzes live job market data to visualize the "gap" between what universities teach and what companies actually hire for.

## 🚀 Features

### 1. Market Gap Dashboard
- **Real-time Visualization:** Interactive Bar Charts and Treemaps (built with `recharts`) showing the most in-demand hard skills and technical contexts.
- **Smart Filtering:** Segment data by role (Backend, AI, Security) and seniority (Junior, Mid, Senior).
- **Focus Mode:** Interactive "Dim & Focus" UX patterns to highlight key data points without visual clutter.

![Dashboard Screenshot](/public/screenshots/main_page1.png)
![Dashboard Screenshot](/public/screenshots/main_page2.png)
![Dashboard Screenshot](/public/screenshots/main_page3.png)

### 2. Gamified Career Roadmaps
- **Dynamic Progression:** A "Tech Tree" style roadmap for 15+ career paths.
- **Phase-Locking System:** Users must complete "Foundation" skills before unlocking "Advanced" tiers, enforcing structured learning.
- **Persistent Progress:** Local state management tracks user progress across different career paths.

![Dashboard Screenshot](/public/screenshots/career_path1.png)

### 3. Curriculum Gap Analyzer (Beta)
- **Client-Side Semantic Search:** A fast, privacy-focused keyword matcher that scans user syllabi against market demands.
- **Semantic Expansion:** Utilizes a pre-computed "Brain" (`skill_class.json`) to map university course titles (e.g., "CS101") to industry skills (e.g., "Python"), enabling robust matching without expensive LLM calls.

![Dashboard Screenshot](/public/screenshots/curriculum_check1.png)

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

2. **Install dependencies**
    ```bash
    npm install

3. **Run the development server**
    ```bash
    npm run dev

4. **Open your browser**
    Navigate to http://localhost:3000 to see the website.

## 📂 Project Structure

```bash
src/
├── app/                  # Next.js App Router pages
│   ├── curriculum/       # Curriculum Check feature
│   ├── roadmap/          # Interactive Roadmap feature
│   └── page.tsx          # Main Dashboard
├── components/
│   ├── dashboard/        # Charts & Metric Cards
│   ├── ui/               # Shadcn Reusable Components
│   └── Sidebar.tsx       # Main Navigation
├── data/
│   ├── gap_report.json   # Market Analysis Data
│   ├── roadmaps.json     # Career Path Definitions
│   └── skill_class.json  # Semantic Synonym Dictionary
└── lib/                  # Utilities
```

## 🔮 Future Roadmap

[ ] Live Scraping Pipeline: Automate the gap_report.json updates using Python/Scrapy.

[ ] LLM Integration: Replace the keyword matcher with a local LLM (Ollama) for deeper syllabus understanding.

[ ] User Auth: Save progress to a database (Supabase/Firebase).