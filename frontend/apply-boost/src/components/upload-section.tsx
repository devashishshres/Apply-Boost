"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiService } from "@/lib/api";
import {
    extractCompanyAndRole,
    extractTextFromFile,
    validateFileType,
} from "@/lib/file-utils";
import {
    AlertCircle,
    Briefcase,
    FileText,
    Loader2,
    Sparkles,
    Upload,
    User,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

export function UploadSection() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!validateFileType(file)) {
                setError("Please upload a valid file (PDF, DOC, DOCX, or TXT)");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                // 10MB limit
                setError("File size must be less than 10MB");
                return;
            }
            setResumeFile(file);
            setError(null);
        }
    };

    const handleGenerate = async () => {
        if (!resumeFile || !jobDescription.trim()) {
            setError(
                "Please upload your resume and provide a job description."
            );
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            // Extract text from resume file
            const resumeText = await extractTextFromFile(resumeFile);

            // Extract job description details
            const jdExtraction = await apiService.extractJobDescription(
                jobDescription
            );
            const { company, role } = extractCompanyAndRole(jobDescription);

            // Map resume skills to job requirements
            const skillsMapping = await apiService.mapResume(
                jdExtraction.skills,
                resumeText
            );

            // Generate all application materials in parallel
            const [
                recruiterMessage,
                screeningQuestions,
                coverLetter,
                tailoredResume,
            ] = await Promise.all([
                apiService.generateOutreach({
                    role,
                    company,
                    jdSummary: jdExtraction.summary,
                    matches: skillsMapping.matches,
                    extraContext: additionalInfo,
                }),
                apiService.generateRecruiterQuestions({
                    jdSummary: jdExtraction.summary,
                    skills: jdExtraction.skills,
                }),
                apiService.generateCoverLetter({
                    role,
                    company,
                    jdSummary: jdExtraction.summary,
                    matches: skillsMapping.matches,
                    extraContext: additionalInfo,
                }),
                apiService.tailorResume({
                    jdSummary: jdExtraction.summary,
                    skills: jdExtraction.skills,
                    resumeText,
                    extraContext: additionalInfo,
                }),
            ]);

            // Store results for the results section
            const results = {
                recruiterMessage: recruiterMessage.text,
                screeningQuestions: screeningQuestions.questions,
                coverLetter: coverLetter.text,
                tailoredResume: {
                    summary: tailoredResume.feedback || "No feedback available",
                    bullets: [], // Backend currently returns feedback text, not structured bullets
                },
                skillsMapping,
                jdExtraction,
                company,
                role,
            };

            // Store results in localStorage for the results component to access
            localStorage.setItem("applyBoostResults", JSON.stringify(results));

            // Trigger a custom event to notify the results section
            window.dispatchEvent(
                new CustomEvent("resultsGenerated", { detail: results })
            );

            // Scroll to results section
            setTimeout(() => {
                document
                    .getElementById("results")
                    ?.scrollIntoView({ behavior: "smooth" });
            }, 500);
        } catch (err) {
            console.error("Generation error:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to generate application materials. Please try again."
            );
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <section id="upload-section" className="py-24 px-4 relative">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-card/20 to-transparent"></div>
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>

            <div className="container max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    {/* Left side - Title and description */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Ready to Transform?
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
                                Upload &{" "}
                                <span className="text-primary">Generate</span>
                            </h2>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Three inputs. Four powerful outputs. Your next
                                career move starts here.
                            </p>
                        </div>

                        {/* Process indicators */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-card border border-primary/20 flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        Your Resume
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        PDF or Word format
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-card border border-primary/20 flex items-center justify-center">
                                    <Briefcase className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        Job Description
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Complete posting details
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-card border border-primary/20 flex items-center justify-center">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        Personal Touch
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Optional context
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Upload form */}
                    <div className="lg:col-span-3">
                        <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/10">
                            <CardContent className="p-0 space-y-8">
                                {/* Resume upload */}
                                <div>
                                    <Label
                                        htmlFor="resume-upload"
                                        className="text-lg font-semibold mb-4 block"
                                    >
                                        Upload Your Resume
                                    </Label>
                                    <label
                                        htmlFor="resume-upload"
                                        className="group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary/30 rounded-2xl cursor-pointer bg-background/50 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                                <Upload className="w-8 h-8 text-primary" />
                                            </div>
                                            <p className="text-lg font-medium mb-2 text-muted-foreground/70">
                                                {resumeFile
                                                    ? resumeFile.name
                                                    : "Drop your resume here"}
                                            </p>
                                            <p className="text-sm text-muted-foreground/70">
                                                {resumeFile
                                                    ? "Resume uploaded ✅"
                                                    : "or click to browse • PDF, DOC, DOCX (max 10MB)"}
                                            </p>
                                        </div>
                                        <input
                                            id="resume-upload"
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileUpload}
                                        />
                                    </label>
                                </div>

                                {/* Job description */}
                                <div>
                                    <Label
                                        htmlFor="job-description"
                                        className="text-lg font-semibold mb-4 block"
                                    >
                                        Job Description
                                    </Label>
                                    <Textarea
                                        id="job-description"
                                        placeholder="Paste the complete job posting here... Include requirements, responsibilities, and company info for best results."
                                        className="min-h-[140px] resize-none bg-background/50 border-primary/20 focus:border-primary/50 text-base placeholder:text-muted-foreground/60"
                                        value={jobDescription}
                                        onChange={(e) =>
                                            setJobDescription(e.target.value)
                                        }
                                    />
                                </div>

                                {/* Additional info */}
                                <div>
                                    <Label
                                        htmlFor="additional-info"
                                        className="text-lg font-semibold mb-4 block"
                                    >
                                        Personal Context{" "}
                                        <span className="text-sm font-normal text-muted-foreground">
                                            (Optional)
                                        </span>
                                    </Label>
                                    <Textarea
                                        id="additional-info"
                                        placeholder="Add any specific achievements, career goals, or unique experiences you want highlighted..."
                                        className="min-h-[100px] resize-none bg-background/50 border-primary/20 focus:border-primary/50 text-base placeholder:text-muted-foreground/60"
                                        value={additionalInfo}
                                        onChange={(e) =>
                                            setAdditionalInfo(e.target.value)
                                        }
                                    />
                                </div>

                                {/* Error display */}
                                {error && (
                                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}

                                {/* Generate button */}
                                <Button
                                    onClick={handleGenerate}
                                    disabled={
                                        isGenerating ||
                                        !resumeFile ||
                                        !jobDescription.trim()
                                    }
                                    size="lg"
                                    className="w-full text-lg bg-primary hover:bg-primary/90 glow-effect disabled:opacity-50 cursor-pointer"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                            AI is crafting your materials...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-3 h-6 w-6" />
                                            Generate My Application Materials
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
