"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileText,
  Briefcase,
  User,
  Loader2,
  Sparkles,
} from "lucide-react";

export function UploadSection() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleGenerate = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      alert("Please upload your resume and provide a job description.");
      return;
    }

    setIsGenerating(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
      // Scroll to results section
      document
        .getElementById("results")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 3000);
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
                Upload & <span className="text-primary">Generate</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Three inputs. Four powerful outputs. Your next career move
                starts here.
              </p>
            </div>

            {/* Process indicators */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-card border border-primary/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Your Resume</h3>
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
                  <h3 className="font-semibold">Job Description</h3>
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
                  <h3 className="font-semibold">Personal Touch</h3>
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
                      <p className="text-lg font-medium mb-2 text-muted-foreground/60">
                        {resumeFile ? resumeFile.name : "Drop your resume here"}
                      </p>
                      <p className="text-sm text-muted-foreground/60">
                        {resumeFile 
                          ? "Resume uploaded ✅" 
                          : "or click to browse • PDF, DOC, DOCX"
                        }
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
                    onChange={(e) => setJobDescription(e.target.value)}
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
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                  />
                </div>

                {/* Generate button */}
                <Button
                  onClick={handleGenerate}
                  disabled={
                    isGenerating || !resumeFile || !jobDescription.trim()
                  }
                  size="lg"
                  className="w-full text-lg bg-primary hover:bg-primary/90 glow-effect disabled:opacity-50"
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
