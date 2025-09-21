import { Chatbot } from "../../components/chatbot";
import { HeroSection } from "../../components/hero-section";
import { ProcessSection } from "../../components/process-section";
import { ResultsSection } from "../../components/result-section";
import { UploadSection } from "../../components/upload-section";

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <main className="relative overflow-hidden">
                <HeroSection />
                <ProcessSection />
                <UploadSection />
                <ResultsSection />
            </main>
            {/* Floating Chatbot */}
            <Chatbot />
        </div>
    );
}
