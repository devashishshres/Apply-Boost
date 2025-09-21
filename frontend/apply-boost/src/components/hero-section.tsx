import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Target, Zap } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background"></div>
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl float-animation"></div>
            <div
                className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
                style={{ animationDelay: "1s" }}
            ></div>

            <div className="container relative z-10 px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left side - Main content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-card border border-primary/20 text-primary text-sm font-medium glow-effect">
                            <Brain className="w-4 h-4 mr-2" />
                            AI-Powered Career Acceleration
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-balance leading-tight">
                            <span className="text-foreground">Apply</span>
                            <span className="text-primary">Boost</span>
                            <br />
                            <span className="text-muted-foreground text-3xl lg:text-4xl font-normal">
                                Your AI hiring companion
                            </span>
                        </h1>

                        <p className="text-xl text-card-foreground text-balance max-w-lg">
                            Transform any job application into a winning
                            strategy. Upload your resume, paste the job
                            description, and let AI craft your perfect
                            application materials.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 glow-effect"
                            >
                                Start Your Boost
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Right side - Feature cards */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 float-animation">
                                <Zap className="w-8 h-8 text-primary mb-3" />
                                <h3 className="font-semibold mb-2">
                                    Instant Results
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Get all materials in under 30 seconds
                                </p>
                            </div>

                            <div
                                className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 float-animation mt-8"
                                style={{ animationDelay: "0.5s" }}
                            >
                                <Target className="w-8 h-8 text-primary mb-3" />
                                <h3 className="font-semibold mb-2">
                                    Tailored Content
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Perfectly matched to each job
                                </p>
                            </div>

                            <div
                                className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 float-animation col-span-2"
                                style={{ animationDelay: "1s" }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-primary">
                                        AI Processing
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Advanced language models analyze job
                                    requirements and optimize your application
                                    materials for maximum impact.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
