import { HeroSection } from "../../components/hero-section"
import { ProcessSection } from "../../components/process-section"
import { UploadSection } from "../../components/upload-section"
import { ResultsSection } from "../../components/result-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="relative overflow-hidden">
        <HeroSection />
        <ProcessSection />
        <UploadSection />
        <ResultsSection />
      </main>
    </div>
  )
}